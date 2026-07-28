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
      <section className="py-16 bg-white">
        <h2 className="text-4xl font-bold text-center">
          Loading New Arrivals...
        </h2>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-5">

        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-bold">
            New Arrivals
          </h2>

          <Link
            to="/products"
            className="text-cyan-600 font-semibold hover:underline"
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
              <div className="relative bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 overflow-hidden">

                <span className="absolute top-4 right-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full z-10">
                  NEW
                </span>

                <div className="h-56 bg-gray-100 flex items-center justify-center">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="h-full w-full object-contain p-4"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x300?text=No+Image";
                    }}
                  />
                </div>

                <div className="p-5">

                  <p className="text-sm text-cyan-600 font-semibold">
                    {product.category}
                  </p>

                  <h3 className="text-lg font-bold mt-2 line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="flex items-center mt-2">
                    ⭐
                    <span className="ml-2">
                      {product.rating}
                    </span>
                  </div>

                  <p className="text-2xl font-bold text-cyan-600 mt-3">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </p>

                  <button className="w-full mt-5 bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition">
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