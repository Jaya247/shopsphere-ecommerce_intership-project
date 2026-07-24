const categories = [
    {
      id: 1,
      icon: "👕",
      title: "Fashion",
    },
    {
      id: 2,
      icon: "📱",
      title: "Electronics",
    },
    {
      id: 3,
      icon: "🏠",
      title: "Home",
    },
    {
      id: 4,
      icon: "👟",
      title: "Shoes",
    },
  ];
  
  function Categories() {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-4xl font-bold text-center mb-10">
            Shop By Category
          </h2>
  
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((item) => (
              <div
                key={item.id}
                className="bg-gray-100 rounded-xl p-8 text-center cursor-pointer hover:bg-cyan-500 hover:text-white transition duration-300 shadow-md"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
  
                <h3 className="text-xl font-semibold">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  export default Categories;