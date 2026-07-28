import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

const categoryIcons = {
  Mobiles: "📱",
  Laptops: "💻",
  Watches: "⌚",
  Shoes: "👟",
  Clothing: "👕",
};

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get("/products/categories");
        setCategories(data.categories);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="text-center text-2xl font-semibold">
          Loading Categories...
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-5">

        <h2 className="text-4xl font-bold text-center mb-10">
          Shop By Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/products?category=${category._id}`}
            >
              <div className="bg-gray-100 rounded-xl p-8 text-center cursor-pointer hover:bg-cyan-500 hover:text-white transition duration-300 shadow-md">

                <div className="text-5xl mb-4">
                  {categoryIcons[category._id] || "🛍️"}
                </div>

                <h3 className="text-xl font-bold">
                  {category._id}
                </h3>

                <p className="mt-2 text-sm">
                  {category.count} Products
                </p>

              </div>
            </Link>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Categories;