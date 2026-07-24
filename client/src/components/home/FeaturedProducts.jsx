const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: "₹2,499",
      image: "🎧",
    },
    {
      id: 2,
      name: "Smart Watch",
      price: "₹3,999",
      image: "⌚",
    },
    {
      id: 3,
      name: "Running Shoes",
      price: "₹2,999",
      image: "👟",
    },
    {
      id: 4,
      name: "Laptop",
      price: "₹54,999",
      image: "💻",
    },
  ];
  
  function FeaturedProducts() {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-4xl font-bold text-center mb-10">
            Featured Products
          </h2>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
              >
                <div className="text-7xl text-center">
                  {product.image}
                </div>
  
                <h3 className="text-xl font-semibold mt-5">
                  {product.name}
                </h3>
  
                <p className="text-cyan-600 font-bold mt-2">
                  {product.price}
                </p>
  
                <button className="w-full mt-5 bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  export default FeaturedProducts;