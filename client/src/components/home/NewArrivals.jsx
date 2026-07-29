import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const { data } = await API.get("/products/new");
        setProducts(data.products);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white dark:bg-slate-950 transition duration-300">
        <h2 className="text-4xl font-extrabold text-center text-slate-800 dark:text-white animate-pulse">
          Loading New Arrivals...
        </h2>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white dark:bg-slate-950 transition duration-300">
      <div className="max-w-7xl mx-auto px-5">

        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-extrabold text-slate-800 dark:text-white">
            New Arrivals
          </h2>

          <Link
            to="/products"
            className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {products.map((product) => (
            <Link
              key={product._id}
              to={`/products/${product._id}`}
            >
              <div className="relative bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 overflow-hidden h-full flex flex-col justify-between">

                <span className="absolute top-4 right-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full z-10 font-bold">
                  NEW
                </span>

                <div>
                  <div className="h-56 bg-gray-50 dark:bg-slate-850 flex items-center justify-center">
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="h-full w-full object-contain p-4"
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/300x300?text=No+Image";
                      }}
                    />
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
                      {product.category}
                    </p>

                    <h3 className="text-lg font-bold mt-2 text-slate-900 dark:text-white line-clamp-2 leading-snug">
                      {product.name}
                    </h3>

                    <div className="flex items-center mt-2 text-sm text-yellow-500 font-semibold">
                      ⭐ <span className="ml-1 text-slate-800 dark:text-slate-200">{product.rating}</span>
                    </div>

                    <p className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-3">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button className="w-full mt-5 bg-slate-900 dark:bg-cyan-600 hover:bg-slate-800 dark:hover:bg-cyan-500 text-white py-2 rounded-lg font-semibold transition cursor-pointer">
                    Buy Now
                  </button>
                </div>

              </div>
            </Link>
          ))}

        </div>

      </div>
    </section>
  );
}

export default NewArrivals;