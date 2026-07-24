const bestSellers = [
    {
      id: 1,
      icon: "📱",
      name: "iPhone 16 Pro",
      price: "₹1,19,999",
      rating: "⭐⭐⭐⭐⭐",
    },
    {
      id: 2,
      icon: "🎧",
      name: "AirPods Pro",
      price: "₹24,999",
      rating: "⭐⭐⭐⭐⭐",
    },
    {
      id: 3,
      icon: "⌚",
      name: "Apple Watch",
      price: "₹44,999",
      rating: "⭐⭐⭐⭐☆",
    },
    {
      id: 4,
      icon: "💻",
      name: "MacBook Air M4",
      price: "₹1,09,999",
      rating: "⭐⭐⭐⭐⭐",
    },
  ];
  
  function BestSeller() {
    return (
      <section className="py-16 bg-slate-100">
        <div className="max-w-7xl mx-auto px-5">
  
          <h2 className="text-4xl font-bold text-center mb-10">
            🔥 Best Sellers
          </h2>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  
            {bestSellers.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md p-6 hover:scale-105 hover:shadow-xl transition duration-300"
              >
                <div className="text-7xl text-center">
                  {item.icon}
                </div>
  
                <h3 className="text-xl font-semibold mt-5">
                  {item.name}
                </h3>
  
                <p className="text-yellow-500 mt-2">
                  {item.rating}
                </p>
  
                <p className="text-cyan-600 font-bold mt-2">
                  {item.price}
                </p>
  
                <button className="w-full mt-5 bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition">
                  Buy Now
                </button>
              </div>
            ))}
  
          </div>
        </div>
      </section>
    );
  }
  
  export default BestSeller;