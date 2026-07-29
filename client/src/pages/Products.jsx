import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import API from "../api/axios";

import { addToCart } from "../redux/slices/cartSlice";
import { addToWishlist } from "../redux/slices/wishlistSlice";

function Products() {
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const urlCategory = searchParams.get("category") || "";
  const [category, setCategory] = useState(urlCategory);

  const [sort, setSort] = useState("");

  const keyword =
    searchParams.get("search") || "";

  useEffect(() => {
    setCategory(urlCategory);
    setPage(1);
  }, [urlCategory]);

  useEffect(() => {
    fetchProducts();
  }, [page, category, sort, keyword]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const { data } = await API.get(
        `/products?page=${page}&search=${keyword}&category=${category}&sort=${sort}`
      );

      setProducts(data.products);

      setTotalPages(data.totalPages);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const addCartHandler = (product) => {
    dispatch(
      addToCart({
        ...product,
        quantity: 1,
      })
    );

    toast.success(`${product.name} added to cart! 🛒`);
  };

  const addWishlistHandler = (product) => {
    dispatch(addToWishlist(product));

    toast.success(`${product.name} added to wishlist! ❤️`);
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-3xl font-semibold dark:text-white transition animate-pulse">
        Loading Products...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-[80vh] transition duration-300">

      <h1 className="text-4xl font-extrabold mb-8 text-slate-800 dark:text-white">
        All Products
      </h1>

      <div className="flex flex-wrap gap-4 mb-8">

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-lg outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition cursor-pointer"
        >
          <option value="">
            All Categories
          </option>

          <option value="Laptops">
            Laptops
          </option>

          <option value="Mobiles">
            Mobiles
          </option>

          <option value="Watches">
            Watches
          </option>

          <option value="Shoes">
            Shoes
          </option>

          <option value="Clothing">
            Clothing
          </option>

        </select>

        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
          className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-lg outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition cursor-pointer"
        >
          <option value="">
            Sort By
          </option>

          <option value="low">
            Price Low to High
          </option>

          <option value="high">
            Price High to Low
          </option>

          <option value="rating">
            Top Rated
          </option>

        </select>

      </div>
      
      {products.length === 0 ? (

        <div className="text-center w-full py-20 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm p-6">

          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">
            No Products Found 😔
          </h2>

          <p className="text-slate-500 dark:text-slate-400 mt-3">
            Try searching with another keyword or changing filters.
          </p>

        </div>

      ) : (

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

          {products.map((product) => (

            <div
              key={product._id}
              className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow hover:shadow-xl hover:-translate-y-1 transition duration-300 overflow-hidden flex flex-col justify-between"
            >

              <Link to={`/products/${product._id}`}>

                <img
                  src={
                    product.images?.[0] ||
                    product.image ||
                    "https://placehold.co/400x400?text=No+Image"
                  }
                  alt={product.name}
                  className="w-full h-64 object-contain bg-white p-4"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/400x400?text=No+Image";
                  }}
                />

              </Link>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                    {product.name}
                  </h2>

                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                    {product.brand}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mt-4">

                    <span className="text-xl font-extrabold text-cyan-600 dark:text-cyan-400">
                      ₹
                      {Number(product.price).toLocaleString(
                        "en-IN"
                      )}
                    </span>

                    <span className="text-yellow-500 font-bold flex items-center gap-1">
                      ⭐ <span>{product.rating}</span>
                    </span>

                  </div>

                  <div className="flex gap-3 mt-5">

                    <button
                      onClick={() =>
                        addCartHandler(product)
                      }
                      className="flex-1 bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white py-2.5 rounded-lg font-bold cursor-pointer transition text-sm"
                    >
                      Add To Cart
                    </button>

                    <button
                      onClick={() =>
                        addWishlistHandler(product)
                      }
                      className="flex-1 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 text-white py-2.5 rounded-lg font-bold cursor-pointer transition text-sm"
                    >
                      Wishlist
                    </button>

                  </div>
                </div>

              </div>

            </div>

          ))}

        </div>

      )}
      
      <div className="flex justify-center items-center gap-3 mt-12">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className={`px-5 py-2.5 rounded-lg font-bold transition cursor-pointer ${
            page === 1
              ? "bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
              : "bg-slate-900 dark:bg-cyan-500 text-white hover:bg-slate-800 dark:hover:bg-cyan-600"
          }`}
        >
          Previous
        </button>

        <span className="font-bold text-lg text-slate-800 dark:text-slate-200">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className={`px-5 py-2.5 rounded-lg font-bold transition cursor-pointer ${
            page === totalPages
              ? "bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
              : "bg-slate-900 dark:bg-cyan-500 text-white hover:bg-slate-800 dark:hover:bg-cyan-600"
          }`}
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default Products;