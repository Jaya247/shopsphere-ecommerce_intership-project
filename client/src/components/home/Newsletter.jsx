function Newsletter() {
    return (
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto text-center px-5">
  
          <h2 className="text-4xl font-bold">
            Subscribe to our Newsletter 📩
          </h2>
  
          <p className="mt-4 text-gray-300">
            Get the latest offers, discounts and new arrivals directly in your inbox.
          </p>
  
          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-5 py-3 rounded-lg bg-white text-black placeholder-gray-500 w-full md:w-96 outline-none"
            />
  
            <button className="bg-cyan-500 px-8 py-3 rounded-lg hover:bg-cyan-600 transition">
              Subscribe
            </button>
          </div>
  
        </div>
      </section>
    );
  }
  
  export default Newsletter;