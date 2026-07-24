function Hero() {
    return (
      <section className="h-[90vh] bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold">
            Welcome to ShopSphere 🚀
          </h1>
  
          <p className="mt-4 text-xl text-gray-300">
            Your One Stop Shopping Destination
          </p>
  
          <button className="mt-8 px-8 py-3 bg-cyan-500 rounded-lg hover:bg-cyan-600 transition">
            Shop Now
          </button>
        </div>
      </section>
    );
  }
  
  export default Hero;