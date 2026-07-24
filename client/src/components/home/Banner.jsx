function Banner() {
    return (
      <section className="py-20 bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-5 text-center">
  
          <h2 className="text-5xl font-bold">
            Big Sale is Live 🎉
          </h2>
  
          <p className="text-xl mt-5">
            Up to <span className="font-bold">70% OFF</span> on Electronics,
            Fashion, Shoes & More.
          </p>
  
          <button className="mt-8 bg-white text-cyan-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Shop Now
          </button>
  
        </div>
      </section>
    );
  }
  
  export default Banner;