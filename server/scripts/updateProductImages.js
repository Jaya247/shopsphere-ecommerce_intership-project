import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";

dotenv.config();

const brandImages = {
  laptop_apple: [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80"
  ],
  laptop_dell: [
    "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1588702547919-26089e690eca?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1496181130204-7552cc1524e2?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
  ],
  laptop_hp: [
    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1484788980811-44772d7c1772?auto=format&fit=crop&w=600&q=80"
  ],
  laptop_lenovo: [
    "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
  ],
  laptop_asus: [
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1504707748692-419802cf939d?auto=format&fit=crop&w=600&q=80"
  ],
  laptop_generic: [
    "https://images.unsplash.com/photo-1496181130204-7552cc1524e2?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
  ],

  mobile_apple: [
    "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1565849906662-75d68b234320?auto=format&fit=crop&w=600&q=80"
  ],
  mobile_samsung: [
    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1567581935884-3349727552db?auto=format&fit=crop&w=600&q=80"
  ],
  mobile_oneplus: [
    "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1584006682522-dc17d6c0d9cb?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1598327106026-d9521da673d1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1557180295-76eee20ae8aa?auto=format&fit=crop&w=600&q=80"
  ],
  mobile_xiaomi: [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1558885561-56c2a4e2b318?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&w=600&q=80"
  ],
  mobile_google: [
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1557180295-76eee20ae8aa?auto=format&fit=crop&w=600&q=80"
  ],
  mobile_generic: [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1557180295-76eee20ae8aa?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
  ],

  clothing: [
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80"
  ],
  shoes: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80"
  ],
  watches: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80"
  ]
};

const runMigration = async () => {
  try {
    await connectDB();
    console.log("Starting product image migration based on name & category...");

    const products = await Product.find({});
    let updatedCount = 0;

    for (const product of products) {
      const nameLower = product.name.toLowerCase();
      const category = product.category.trim();
      let selectedImages = [];

      if (category === "Laptops") {
        if (nameLower.includes("apple") || nameLower.includes("macbook")) {
          selectedImages = brandImages.laptop_apple;
        } else if (nameLower.includes("dell")) {
          selectedImages = brandImages.laptop_dell;
        } else if (nameLower.includes("hp")) {
          selectedImages = brandImages.laptop_hp;
        } else if (nameLower.includes("lenovo")) {
          selectedImages = brandImages.laptop_lenovo;
        } else if (nameLower.includes("asus")) {
          selectedImages = brandImages.laptop_asus;
        } else {
          selectedImages = brandImages.laptop_generic;
        }
      } else if (category === "Mobiles") {
        if (nameLower.includes("apple") || nameLower.includes("iphone")) {
          selectedImages = brandImages.mobile_apple;
        } else if (nameLower.includes("samsung") || nameLower.includes("galaxy")) {
          selectedImages = brandImages.mobile_samsung;
        } else if (nameLower.includes("oneplus")) {
          selectedImages = brandImages.mobile_oneplus;
        } else if (nameLower.includes("xiaomi") || nameLower.includes("redmi")) {
          selectedImages = brandImages.mobile_xiaomi;
        } else if (nameLower.includes("google") || nameLower.includes("pixel")) {
          selectedImages = brandImages.mobile_google;
        } else {
          selectedImages = brandImages.mobile_generic;
        }
      } else if (category === "Clothing") {
        selectedImages = brandImages.clothing;
      } else if (category === "Shoes") {
        selectedImages = brandImages.shoes;
      } else if (category === "Watches") {
        selectedImages = brandImages.watches;
      } else {
        // Fallback placeholder images if custom category
        selectedImages = [
          `https://placehold.co/600x600/0d6efd/ffffff?text=${encodeURIComponent(product.category)}`
        ];
      }

      if (selectedImages && selectedImages.length > 0) {
        product.images = selectedImages;
        await product.save();
        updatedCount++;
      }
    }

    console.log(`🎉 Migration successfully updated images for ${updatedCount} products!`);
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
};

runMigration();
