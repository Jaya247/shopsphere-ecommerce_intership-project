import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  FaTshirt,
  FaMagic,
  FaRedo,
  FaShoppingBag,
  FaGlasses,
  FaClock,
  FaCheck,
  FaQuestionCircle,
} from "react-icons/fa";
import { addToCart } from "../redux/slices/cartSlice";
import API from "../api/axios";

// Static popular shirt references for quick select
const presetShirts = [
  {
    color: "White",
    style: "Casual Linen",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80",
  },
  {
    color: "Black",
    style: "Formal Oxford",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
  },
  {
    color: "Blue",
    style: "Denim Shirt",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=400&q=80",
  },
  {
    color: "Green",
    style: "Flannel Checked",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=400&q=80",
  },
];

function OutfitGenerator() {
  const dispatch = useDispatch();

  // User input states
  const [shirtColor, setShirtColor] = useState("White");
  const [shirtStyle, setShirtStyle] = useState("Casual Linen");
  const [customImage, setCustomImage] = useState("");
  
  // Loading & Step states
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");

  // Result state
  const [outfit, setOutfit] = useState(null);

  const selectPreset = (preset) => {
    setShirtColor(preset.color);
    setShirtStyle(preset.style);
    setCustomImage(preset.image);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setOutfit(null);

      // Simulated cool styling steps
      const steps = [
        "Analyzing base shirt color tones...",
        "Identifying fabric style fit parameters...",
        "Searching catalog for matching denim washes...",
        "Selecting optimal accessories and shoes...",
        "Constructing expert dapper styling advice...",
      ];

      for (let i = 0; i < steps.length; i++) {
        setLoadingStep(steps[i]);
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      const { data } = await API.post("/ai/outfit", {
        shirtColor,
        shirtStyle,
        shirtImage: customImage || "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80",
      });

      if (data.success) {
        setOutfit(data.recommendation);
        toast.success("✨ Perfect Combo Generated!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate outfit combo");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComboToCart = () => {
    if (!outfit) return;

    // Dispatch items to Redux Cart
    const items = [
      { _id: `ai_jeans_${Date.now()}`, name: outfit.jeans.name, price: 1499, image: "https://placehold.co/150?text=Jeans", quantity: 1 },
      { _id: `ai_shoes_${Date.now()}`, name: outfit.shoes.name, price: 1999, image: "https://placehold.co/150?text=Shoes", quantity: 1 },
      { _id: `ai_watch_${Date.now()}`, name: outfit.watch.name, price: 2499, image: "https://placehold.co/150?text=Watch", quantity: 1 },
      { _id: `ai_shades_${Date.now()}`, name: outfit.sunglasses.name, price: 999, image: "https://placehold.co/150?text=Sunglasses", quantity: 1 },
    ];

    items.forEach((item) => {
      dispatch(addToCart(item));
    });

    toast.success("🛒 Combo accessories added to cart!");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen text-slate-800 dark:text-slate-200 transition duration-300">
      
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <span className="bg-cyan-500/10 text-cyan-400 font-extrabold text-xs tracking-wider px-3.5 py-1.5 rounded-full uppercase border border-cyan-500/25">
          👗 ShopSphere Stylist AI
        </span>
        <h1 className="text-4xl md:text-5xl font-black mt-4 text-slate-850 dark:text-white bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
          AI Outfit Generator
        </h1>
        <p className="text-slate-400 mt-2.5 text-sm font-semibold">
          Select or upload your shirt features and let our Fashion Stylist AI recommend the perfect pants, footwear, and accessories combo!
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Shirt Input Configurator */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow-lg p-6 h-fit space-y-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <FaTshirt className="text-cyan-500" /> Shirt Details
          </h2>

          {/* Quick presets */}
          <div>
            <p className="text-xs text-slate-450 dark:text-slate-500 font-bold mb-3 uppercase tracking-wider">Quick Preset Selection</p>
            <div className="grid grid-cols-4 gap-2">
              {presetShirts.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => selectPreset(preset)}
                  className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800 hover:border-cyan-500 transition shadow group cursor-pointer"
                  title={`${preset.color} ${preset.style}`}
                >
                  <img src={preset.image} alt={preset.color} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  <div className="absolute inset-0 bg-slate-950/40 flex items-end p-1.5 justify-center">
                    <span className="text-[9px] text-white font-bold">{preset.color}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-650 dark:text-slate-350 mb-1">Shirt Color</label>
              <input
                required
                type="text"
                value={shirtColor}
                onChange={(e) => setShirtColor(e.target.value)}
                placeholder="e.g. Navy Blue / Pink / White"
                className="w-full border border-gray-250 dark:border-slate-800 bg-gray-50 dark:bg-slate-850 rounded-xl p-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-650 dark:text-slate-350 mb-1">Shirt Style</label>
              <select
                value={shirtStyle}
                onChange={(e) => setShirtStyle(e.target.value)}
                className="w-full border border-gray-250 dark:border-slate-800 bg-gray-50 dark:bg-slate-855 rounded-xl p-2.5 text-sm"
              >
                <option value="Casual Linen">Casual Linen</option>
                <option value="Formal Oxford">Formal Oxford</option>
                <option value="Denim Shirt">Denim Shirt</option>
                <option value="Flannel Checked">Flannel Checked</option>
                <option value="Graphic Tee">Graphic Tee</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-650 dark:text-slate-350 mb-1">Shirt Image URL (Optional)</label>
              <input
                type="text"
                value={customImage}
                onChange={(e) => setCustomImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full border border-gray-250 dark:border-slate-800 bg-gray-50 dark:bg-slate-850 rounded-xl p-2.5 text-sm font-medium"
              />
            </div>

            {customImage && (
              <div className="pt-2">
                <p className="text-[10px] text-slate-400 font-bold mb-1.5 uppercase">Selected Image Preview</p>
                <img src={customImage} alt="Shirt Preview" className="w-full max-h-32 object-contain border dark:border-slate-800 rounded-xl bg-gray-50 dark:bg-slate-850 p-2" />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-455 hover:to-indigo-455 text-slate-950 font-black py-3 rounded-xl transition shadow cursor-pointer text-center text-sm flex items-center justify-center gap-1.5"
            >
              <FaMagic /> {loading ? "Styling Outfit..." : "Generate Combo"}
            </button>
          </form>
        </div>

        {/* Right Column: AI Outputs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Loading status */}
          {loading && (
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow p-8 min-h-[350px] flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-6"></div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white animate-pulse">Outfit AI Engine Running</h3>
              <p className="text-cyan-500 dark:text-cyan-400 mt-2 text-sm font-semibold">{loadingStep}</p>
            </div>
          )}

          {/* Prompt state */}
          {!loading && !outfit && (
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow p-8 min-h-[350px] flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-slate-900 border dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                <FaQuestionCircle size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Waiting for Input</h3>
              <p className="text-slate-450 dark:text-slate-500 text-sm max-w-sm">
                Define your shirt parameters on the left configurator panel and click generate to launch the styling analysis.
              </p>
            </div>
          )}

          {/* Outfit Result Display */}
          {!loading && outfit && (
            <div className="space-y-6">
              
              {/* Header Combo Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-850 shadow-md flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-black">AI Recommended Combo</span>
                  <h3 className="text-2xl font-black text-white mt-1">{outfit.comboName || "Stylist Choice"}</h3>
                </div>
                <button
                  onClick={handleAddComboToCart}
                  className="bg-cyan-500 hover:bg-cyan-455 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow shadow-cyan-500/10 cursor-pointer"
                >
                  <FaShoppingBag /> Add Accessories to Cart
                </button>
              </div>

              {/* Combo Recommendation Grids */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Jeans Card */}
                <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow p-5 space-y-2">
                  <span className="bg-blue-500/10 text-blue-500 font-extrabold text-[10px] tracking-wider px-2 py-1 rounded-md uppercase">👖 Matching Jeans</span>
                  <h4 className="font-bold text-slate-800 dark:text-white text-base mt-2">{outfit.jeans.name}</h4>
                  <p className="text-xs text-slate-450 dark:text-slate-400 leading-relaxed font-semibold">{outfit.jeans.description}</p>
                </div>

                {/* Shoes Card */}
                <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow p-5 space-y-2">
                  <span className="bg-orange-500/10 text-orange-500 font-extrabold text-[10px] tracking-wider px-2 py-1 rounded-md uppercase">👟 Recommended Footwear</span>
                  <h4 className="font-bold text-slate-800 dark:text-white text-base mt-2">{outfit.shoes.name}</h4>
                  <p className="text-xs text-slate-455 dark:text-slate-400 leading-relaxed font-semibold">{outfit.shoes.description}</p>
                </div>

                {/* Watch Card */}
                <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow p-5 space-y-2">
                  <span className="bg-purple-500/10 text-purple-400 font-extrabold text-[10px] tracking-wider px-2 py-1 rounded-md uppercase">⌚ Wristwatch Vibe</span>
                  <h4 className="font-bold text-slate-800 dark:text-white text-base mt-2">{outfit.watch.name}</h4>
                  <p className="text-xs text-slate-455 dark:text-slate-400 leading-relaxed font-semibold">{outfit.watch.description}</p>
                </div>

                {/* Sunglasses Card */}
                <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow p-5 space-y-2">
                  <span className="bg-cyan-500/10 text-cyan-400 font-extrabold text-[10px] tracking-wider px-2 py-1 rounded-md uppercase">🕶️ Eyewear Accent</span>
                  <h4 className="font-bold text-slate-800 dark:text-white text-base mt-2">{outfit.sunglasses.name}</h4>
                  <p className="text-xs text-slate-455 dark:text-slate-400 leading-relaxed font-semibold">{outfit.sunglasses.description}</p>
                </div>

              </div>

              {/* Styling expert tip block */}
              <div className="bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900/50 rounded-2xl p-6 space-y-2">
                <h4 className="font-black text-cyan-600 dark:text-cyan-400 text-sm flex items-center gap-1.5 uppercase tracking-wider">
                  💡 Stylist Editorial Advice
                </h4>
                <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-semibold">
                  {outfit.stylingTip}
                </p>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default OutfitGenerator;
