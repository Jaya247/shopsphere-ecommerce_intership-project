import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
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

  const [category, setCategory] = useState("");

  const [sort, setSort] = useState("");

  const keyword =
    searchParams.get("search") || "";

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

    alert("Added To Cart");
  };

  const addWishlistHandler = (product) => {
    dispatch(addToWishlist(product));

    alert("Added To Wishlist");
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-3xl">
        Loading Products...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <h1 className="text-4xl font-bold mb-8">
        All Products
      </h1>

      <div className="flex flex-wrap gap-4 mb-8">

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="border p-3 rounded-lg"
        >
          <option value="">
            All Categories
          </option>

          <option value="Electronics">
            Electronics
          </option>

          <option value="Fashion">
            Fashion
          </option>

          <option value="Shoes">
            Shoes
          </option>

          <option value="Mobiles">
            Mobiles
          </option>

          <option value="Laptop">
            Laptop
          </option>

        </select>

        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
          className="border p-3 rounded-lg"
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

        <div className="text-center w-full py-20">

          <h2 className="text-3xl font-bold">
            No Products Found 😔
          </h2>

          <p className="text-gray-500 mt-3">
            Try searching with another keyword.
          </p>

        </div>

      ) : (

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

          {products.map((product) => (

            <div
              key={product._id}
              className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
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

              <div className="p-5">

                <h2 className="text-xl font-bold line-clamp-1">
                  {product.name}
                </h2>

                <p className="text-gray-500 mt-2">
                  {product.brand}
                </p>

                <div className="flex justify-between items-center mt-4">

                  <span className="text-2xl font-bold text-cyan-600">
                    ₹
                    {Number(product.price).toLocaleString(
                      "en-IN"
                    )}
                  </span>

                  <span className="text-yellow-500 font-semibold">
                    ⭐ {product.rating}
                  </span>

                </div>

                <div className="flex gap-3 mt-5">

                  <button
                    onClick={() =>
                      addCartHandler(product)
                    }
                    className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-semibold"
                  >
                    Add To Cart
                  </button>

                  <button
                    onClick={() =>
                      addWishlistHandler(product)
                    }
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold"
                  >
                    Wishlist
                  </button>

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
          className={`px-5 py-2 rounded-lg ${
            page === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-slate-900 text-white hover:bg-slate-800"
          }`}
        >
          Previous
        </button>

        <span className="font-bold text-lg">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className={`px-5 py-2 rounded-lg ${
            page === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-slate-900 text-white hover:bg-slate-800"
          }`}
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default Products;