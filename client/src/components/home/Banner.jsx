import { Link } from "react-router-dom";

function Banner() {
  return (
    <section className="py-20 px-6 bg-slate-950 relative overflow-hidden">
      
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-indigo-500/5 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Main Banner Card */}
        <div className="relative rounded-3xl overflow-hidden min-h-[380px] flex items-center border border-slate-850 shadow-2xl">
          
          {/* Background image overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/banner_sale_vibes.jpg"
              alt="Promo Sale Vibes"
              className="w-full h-full object-cover"
            />
            {/* Dark wash overlay to make text readable */}
            <div className="absolute inset-0 bg-slate-950/70 lg:bg-gradient-to-r lg:from-slate-950/90 lg:via-slate-950/60 lg:to-transparent"></div>
          </div>

          {/* Banner content */}
          <div className="relative z-10 p-8 md:p-14 max-w-xl space-y-6 text-white text-center lg:text-left">
            <span className="bg-red-500 text-white font-extrabold text-[10px] tracking-widest px-3 py-1 rounded-full uppercase">
              Limited Time Offer
            </span>

            <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
              Mega Shopping Carnival is Live! 🎉
            </h2>

            <p className="text-slate-350 text-sm md:text-base">
              Get up to <span className="font-extrabold text-cyan-400">70% FLAT OFF</span> on all electronics, premium perfumes, fashion accessories, and smart wearables. Use active coupon codes on checkout for additional discounts!
            </p>

            <div className="pt-4 flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link
                to="/products"
                className="bg-white hover:bg-slate-100 text-slate-950 font-bold px-8 py-3.5 rounded-xl transition shadow transform hover:scale-[1.02] text-sm"
              >
                Claim Discount
              </Link>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <span>⚡ Offer ends soon</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Banner;