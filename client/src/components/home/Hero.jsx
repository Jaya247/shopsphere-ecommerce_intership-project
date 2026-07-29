import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-slate-950 text-white overflow-hidden py-16 px-6">
      
      {/* Background radial glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Side text & CTA */}
        <div className="space-y-6 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 text-xs text-cyan-400 font-semibold tracking-wider uppercase mb-2">
            🔥 Mid-Season Sale is Live
          </div>

          <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight text-white">
            Elevate Your Style, <br />
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Own the Vibe.
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto lg:mx-0">
            Explore curated collections designed to match your unique personality. Get flat discounts, premium items, and lightning-fast delivery!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <Link
              to="/products"
              className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-455 hover:to-indigo-455 text-slate-950 font-extrabold px-8 py-4 rounded-2xl transition shadow-lg shadow-cyan-500/20 text-center transform hover:scale-[1.02]"
            >
              Shop Collection
            </Link>
            <a
              href="#featured"
              className="border border-slate-850 hover:bg-slate-900 text-white font-bold px-8 py-4 rounded-2xl transition text-center"
            >
              Learn More
            </a>
          </div>

          {/* Social Proof */}
          <div className="pt-8 border-t border-slate-900 flex flex-wrap gap-8 justify-center lg:justify-start text-xs text-slate-500 font-semibold">
            <div>
              <p className="text-xl font-bold text-white mb-0.5">50k+</p>
              <p>Happy Customers</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white mb-0.5">100%</p>
              <p>Authentic Brands</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white mb-0.5">4.8★</p>
              <p>Google Rating</p>
            </div>
          </div>

        </div>

        {/* Right Side Image Mockup */}
        <div className="relative flex justify-center">
          
          {/* Main image container */}
          <div className="relative w-full max-w-lg aspect-[4/3] rounded-3xl overflow-hidden border border-slate-850 shadow-2xl shadow-cyan-500/5 group">
            
            <img
              src="/images/hero_shopping_vibes.jpg"
              alt="Premium E-commerce Shopping Vibes"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Interactive Glass Card Overlay */}
            <div className="absolute bottom-5 left-5 right-5 bg-slate-950/80 backdrop-blur-md border border-slate-850 p-4 rounded-2xl shadow-xl flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Featured Look</p>
                <p className="text-sm font-bold text-white">Classic Chic Autumn Trenchcoat</p>
              </div>
              <span className="bg-cyan-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded-lg">
                NEW
              </span>
            </div>

          </div>

          {/* Decorative glowing backdrops */}
          <div className="absolute top-10 right-10 w-24 h-24 bg-cyan-500/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl"></div>

        </div>

      </div>

    </section>
  );
}

export default Hero;