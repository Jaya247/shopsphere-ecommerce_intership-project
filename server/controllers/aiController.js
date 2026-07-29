import axios from "axios";
import Product from "../models/Product.js";

// Helper function to extract numbers from text
const extractPriceLimit = (text) => {
  const lowercaseText = text.toLowerCase();
  
  // Look for "under X", "below X", "less than X", "within X", "under rs X"
  const underPatterns = [
    /under\s*(?:rs\.?|₹)?\s*(\d+)/i,
    /below\s*(?:rs\.?|₹)?\s*(\d+)/i,
    /less\s*than\s*(?:rs\.?|₹)?\s*(\d+)/i,
    /within\s*(?:rs\.?|₹)?\s*(\d+)/i,
    /(?:rs\.?|₹)?\s*(\d+)\s*or\s*less/i,
  ];

  for (const pattern of underPatterns) {
    const match = lowercaseText.match(pattern);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
  }
  return null;
};

// Helper function to parse sorting requests
const parseSorting = (text) => {
  const lowercaseText = text.toLowerCase();
  if (
    lowercaseText.includes("top rated") ||
    lowercaseText.includes("best rated") ||
    lowercaseText.includes("high rating") ||
    lowercaseText.includes("best seller") ||
    lowercaseText.includes("popular")
  ) {
    return { rating: -1 };
  }
  if (
    lowercaseText.includes("cheap") ||
    lowercaseText.includes("lowest price") ||
    lowercaseText.includes("low to high")
  ) {
    return { price: 1 };
  }
  if (
    lowercaseText.includes("expensive") ||
    lowercaseText.includes("highest price") ||
    lowercaseText.includes("high to low")
  ) {
    return { price: -1 };
  }
  return null;
};

export const chatAI = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const cleanMsg = message.trim();
    const cleanMsgLower = cleanMsg.toLowerCase();

    // 1. Perform Local Search Logic
    let query = {};
    let sort = {};
    let matchReason = "";

    // Categories available in seeder/common
    const knownCategories = ["electronics", "fashion", "shoes", "mobiles", "laptop", "laptops"];
    let detectedCategory = null;

    for (const cat of knownCategories) {
      if (cleanMsgLower.includes(cat)) {
        detectedCategory = cat === "laptops" ? "Laptop" : cat.charAt(0).toUpperCase() + cat.slice(1);
        break;
      }
    }

    if (detectedCategory) {
      query.category = detectedCategory;
      matchReason += `Category: ${detectedCategory}. `;
    }

    // Check price filter
    const maxPrice = extractPriceLimit(cleanMsgLower);
    if (maxPrice) {
      query.price = { $lte: maxPrice };
      matchReason += `Price limit: Under ₹${maxPrice}. `;
    }

    // Check sorting
    const detectedSort = parseSorting(cleanMsgLower);
    if (detectedSort) {
      sort = detectedSort;
    }

    // Extract other terms for keyword search (excluding stop words)
    const stopWords = ["show", "me", "find", "get", "recommend", "suggest", "search", "for", "under", "below", "less", "than", "a", "an", "the", "some", "any", "please", "buy", "shop"];
    const keywords = cleanMsgLower
      .split(/\s+/)
      .filter((word) => !stopWords.includes(word) && word.length > 2 && isNaN(word));

    if (keywords.length > 0 && !detectedCategory) {
      // Regex match on name, brand, category or description
      const regexConditions = keywords.map((kw) => ({
        $or: [
          { name: { $regex: kw, $options: "i" } },
          { brand: { $regex: kw, $options: "i" } },
          { category: { $regex: kw, $options: "i" } },
          { description: { $regex: kw, $options: "i" } },
        ],
      }));
      query.$and = regexConditions;
      matchReason += `Keywords: ${keywords.join(", ")}. `;
    }

    // Execute local database lookup (limit to 5 recommendations)
    let products = [];
    try {
      products = await Product.find(query).sort(sort).limit(5);
    } catch (dbErr) {
      console.error("Local product lookup failed", dbErr);
    }

    // 2. Dual Mode - Use Gemini API if Key is present, fallback otherwise
    const geminiKey = process.env.GEMINI_API_KEY;
    
    if (geminiKey) {
      try {
        // Compile product details for Gemini context
        const catalogContext = products.map((p) => ({
          id: p._id,
          name: p.name,
          brand: p.brand,
          category: p.category,
          price: `₹${p.price}`,
          rating: `${p.rating} Stars`,
          stock: p.stock > 0 ? "In Stock" : "Out of Stock",
          description: p.description,
        }));

        const systemPrompt = `You are "Spherey", the friendly AI Shopping Assistant for ShopSphere E-Commerce. 
Your goal is to help users find products, navigate categories, and have a great shopping experience.

Context:
- We found these items from our database that match the user's request: ${JSON.stringify(catalogContext)}
- Current category filters: ${detectedCategory || "None"}
- Current price filters: ${maxPrice ? `Under ₹${maxPrice}` : "None"}

Guidelines:
1. Keep your reply concise (max 3-4 sentences), friendly, and structured.
2. Directly answer their query using the matches provided. If no matches were found, explain nicely and suggest categories they can explore (Electronics, Fashion, Shoes, Mobiles, Laptop).
3. Always mention prices in Indian Rupees (e.g., ₹999).
4. Highlight key features (like high rating or stock status).
5. Suggest that they can click on the product cards shown below to view details and buy.`;

        // Format history for Gemini API
        const contents = [];
        if (history && Array.isArray(history)) {
          // Add recent conversation history (max 6 turns to stay fast)
          const recentHistory = history.slice(-6);
          recentHistory.forEach((turn) => {
            contents.push({
              role: turn.role === "user" ? "user" : "model",
              parts: [{ text: turn.content }],
            });
          });
        }
        
        // Add current user message
        contents.push({
          role: "user",
          parts: [{ text: message }],
        });

        // Request Gemini API
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            contents,
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            },
            generationConfig: {
              maxOutputTokens: 350,
              temperature: 0.7,
            }
          }
        );

        const replyText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (replyText) {
          return res.status(200).json({
            success: true,
            reply: replyText,
            products,
          });
        }
      } catch (geminiErr) {
        console.error("Gemini AI API Request failed, falling back to local reply generator.", geminiErr);
      }
    }

    // 3. Fallback Response (Local response builder)
    let fallbackReply = "";
    if (products.length > 0) {
      fallbackReply = `Hello! I searched our catalog and found some great matches for you${
        matchReason ? ` based on your request (${matchReason.trim()})` : ""
      }:\n\n` + 
      products.map((p, i) => `${i+1}. **${p.name}** by ${p.brand} - **₹${p.price.toLocaleString("en-IN")}** (⭐ ${p.rating})`).join("\n") +
      `\n\nYou can click on the cards below to view detail and add them to your cart! Let me know if you need to filter by price, category or sorting.`;
    } else {
      fallbackReply = `Hello! I couldn't find any direct matches for "${message}" in our catalog. 

We have products in these popular categories:
- **Electronics & Mobiles**
- **Laptops**
- **Fashion & Clothing**
- **Shoes & Footwear**

Try typing something like:
* "Show me laptops under 60000"
* "Suggest top rated shoes"
* "Find some electronics"`;
    }

    return res.status(200).json({
      success: true,
      reply: fallbackReply,
      products,
    });

  } catch (error) {
    console.error("AI Chat Assistant error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong in AI Assistant",
      error: error.message,
    });
  }
};

// ======================================
// Generate Outfit Recommendation
// ======================================
export const generateOutfit = async (req, res) => {
  try {
    const { shirtColor, shirtStyle, shirtImage } = req.body;
    
    if (!shirtColor || !shirtStyle) {
      return res.status(400).json({
        success: false,
        message: "Shirt color and style are required fields",
      });
    }

    const color = shirtColor.toLowerCase().trim();
    const style = shirtStyle.toLowerCase().trim();

    // Default static combinations database
    const combos = {
      white: {
        comboName: "Urban Minimalist",
        jeans: {
          name: "Charcoal Grey Slim-Fit Jeans",
          description: "Grey denim creates a clean, low-contrast transition from the white top. A slim-fit gives it a modern silhouette."
        },
        shoes: {
          name: "Minimalist Full-Grain White Leather Sneakers",
          description: "Matching the shirt color with footwear bookends the outfit perfectly, giving a clean, intentional look."
        },
        watch: {
          name: "Matte Black Chronograph Watch with Leather Strap",
          description: "Adds a masculine, functional edge that breaks the white-grey monochrome scheme."
        },
        sunglasses: {
          name: "Classic Acetate Tortoiseshell Wayfarers",
          description: "Tortoiseshell frames add warmth and rich texture to the neutral outfit tones."
        },
        stylingTip: "Roll up the sleeves of your white shirt slightly above the forearm and keep the shirt untucked for a relaxed, sharp dapper look."
      },
      black: {
        comboName: "Midnight Dapper",
        jeans: {
          name: "Light Wash Distressed Denim Jeans",
          description: "Contrast is key! Light wash denim breaks the heavy black color, adding a stylish casual wear vibe."
        },
        shoes: {
          name: "Vintage Chelsea Tan Suede Boots",
          description: "Suede Chelsea boots in tan provide a gorgeous color pop that instantly dresses up light denim."
        },
        watch: {
          name: "Silver Case Watch with Brown Leather Strap",
          description: "Complements the tan boots and adds a heritage dressy feeling to the wrist."
        },
        sunglasses: {
          name: "Hexagonal Black Metal Frame Sunglasses",
          description: "Adds a sleek, rockstar edge that matches the black shirt's aesthetic."
        },
        stylingTip: "Wear a silver pendant chain or simple watch to add light reflections and depth to the dark shirt styling."
      },
      blue: {
        comboName: "Nautical Breeze",
        jeans: {
          name: "Off-White or Cream Cotton Chinos/Jeans",
          description: "Blue and cream is a timeless combo! Off-white pants give a sophisticated yacht-chic summer vibe."
        },
        shoes: {
          name: "Rich Mahogany Brown Leather Loafers",
          description: "Mahogany slip-on loafers elevate the nautical aesthetic and complete the preppy smart-casual look."
        },
        watch: {
          name: "Classic Gold Steel Watch with Navy Blue Dial",
          description: "Gold casing with blue dial accents coordinates directly with the blue shirt shade."
        },
        sunglasses: {
          name: "Classic Aviators with Gold Frames and Dark Green Lenses",
          description: "Completes the luxury aviation aesthetic that complements naval colors."
        },
        stylingTip: "If using a denim blue shirt, pair with black jeans and white sneakers for a rugged, stylish double-denim aesthetic."
      },
      green: {
        comboName: "Earth & Forest",
        jeans: {
          name: "Jet Black Tapered Denim Jeans",
          description: "Black denim absorbs light and allows the olive or forest green tones of the shirt to stand out as the hero piece."
        },
        shoes: {
          name: "Off-White Canvas High-Top Sneakers",
          description: "Canvas high-tops ground the outfit, adding a youthful, skater-chic street vibe."
        },
        watch: {
          name: "Military Field Watch with Olive NATO Canvas Strap",
          description: "Emphasizes the rugged, outdoor aesthetic of military and forest green tones."
        },
        sunglasses: {
          name: "Round Matte Black Acetate Sunglasses",
          description: "Round black frames soften the angles of the face and match the dark tapered jeans."
        },
        stylingTip: "Perfect for outdoor gatherings. Keep buttons relaxed and wear a white t-shirt underneath as an open layering jacket option."
      }
    };

    // Fallback/Default combo if color not found in db
    const defaultCombo = {
      comboName: "Casual Classic",
      jeans: {
        name: "Classic Indigo Selvedge Denim Jeans",
        description: "A dark indigo jean is a universal matching standard that anchors any color shirt safely."
      },
      shoes: {
        name: "Clean White Leather Tennis Sneakers",
        description: "White sneakers are clean, versatile, and add a fresh pop to dark indigo denim."
      },
      watch: {
        name: "Minimalist Silver Mesh Strap Quartz Watch",
        description: "Mesh straps look clean, modern, and do not compete with the color profile of the outfit."
      },
      sunglasses: {
        name: "Classic Black Square Wayfarer Sunglasses",
        description: "A timeless, universally matching frame shape that protects eyes and adds instant style."
      },
      stylingTip: "Keep the outfit accessories simple. Let the shirt's color stand out and ensure the fit of your jeans is tailored to your height."
    };

    // Find match or use default
    let recommendation = combos[color] || defaultCombo;

    // Check if we can hit Gemini for dynamic styling AI
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const systemInstructionText = `You are "ShopSphere Fashion Stylist AI", an elite personal wardrobe assistant. 
User selected a shirt:
- Color: ${shirtColor}
- Style: ${shirtStyle}

Recommend the perfect outfit combo containing exactly:
1. Jeans: Best matching color and fit.
2. Shoes: Footwear category and tone.
3. Watch: Watch type matching the vibe.
4. Sunglasses: Eye accessory frame.
5. Styling Tip: Quick dapper tip.

Format your response strictly as a JSON object containing keys:
{
  "comboName": "Name of combination",
  "jeans": { "name": "...", "description": "..." },
  "shoes": { "name": "...", "description": "..." },
  "watch": { "name": "...", "description": "..." },
  "sunglasses": { "name": "...", "description": "..." },
  "stylingTip": "..."
}`;

        const contents = [{ role: "user", parts: [{ text: "Suggest the perfect outfit combination." }] }];
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            contents,
            systemInstruction: { parts: [{ text: systemInstructionText }] },
            generationConfig: {
              maxOutputTokens: 500,
              temperature: 0.7,
              responseMimeType: "application/json"
            }
          }
        );

        const replyText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (replyText) {
          recommendation = JSON.parse(replyText);
        }
      } catch (geminiErr) {
        console.error("Gemini Outfit AI request failed, using local dapper db.", geminiErr);
      }
    }

    res.status(200).json({
      success: true,
      shirt: { color: shirtColor, style: shirtStyle, image: shirtImage },
      recommendation,
    });

  } catch (error) {
    console.error("Outfit Generator error:", error);
    res.status(500).json({
      success: false,
      message: "Stylist AI failed to generate combo.",
      error: error.message,
    });
  }
};
