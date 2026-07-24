const arrivals = [
    {
      id: 1,
      icon: "🎮",
      name: "Gaming Console",
      price: "₹39,999",
      tag: "New",
    },
    {
      id: 2,
      icon: "📷",
      name: "DSLR Camera",
      price: "₹64,999",
      tag: "Hot",
    },
    {
      id: 3,
      icon: "⌨️",
      name: "Mechanical Keyboard",
      price: "₹5,999",
      tag: "Latest",
    },
    {
      id: 4,
      icon: "🖥️",
      name: "Gaming Monitor",
      price: "₹17,999",
      tag: "New",
    },
  ];
  
  function NewArrivals() {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-5">
  
          <h2 className="text-4xl font-bold text-center mb-10">
            New Arrivals
          </h2>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {arrivals.map((item) => (
              <div
                key={item.id}
                className="relative bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
              >
                <span className="absolute top-4 right-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                  {item.tag}
                </span>
  
                <div className="text-7xl text-center">
                  {item.icon}
                </div>
  
                <h3 className="text-xl font-semibold mt-5">
                  {item.name}
                </h3>
  
                <p className="text-cyan-600 font-bold mt-2">
                  {item.price}
                </p>
  
                <button className="w-full mt-5 bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition">
                  Buy Now
                </button>
              </div>
            ))}
          </div>
  
        </div>
      </section>
    );
  }
  
  export default NewArrivals;