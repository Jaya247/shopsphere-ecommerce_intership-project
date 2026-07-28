import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);

        setProduct(data.product);

        if (data.product.images?.length) {
          setSelectedImage(data.product.images[0]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-20 text-2xl">
        Loading Product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-2xl">
        Product Not Found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      <div className="grid md:grid-cols-2 gap-10">

        {/* Images */}
        <div>

          <div className="bg-white rounded-xl shadow p-5">

            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-[450px] object-contain"
            />

          </div>

          <div className="flex gap-3 mt-5">

            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt=""
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 rounded-lg border cursor-pointer object-cover ${
                  selectedImage === img
                    ? "border-cyan-500"
                    : "border-gray-300"
                }`}
              />
            ))}

          </div>

        </div>

        {/* Details */}

        <div>

          <h1 className="text-4xl font-bold">
            {product.name}
          </h1>

          <p className="mt-3 text-gray-500">
            Brand :
            <span className="font-semibold ml-2">
              {product.brand}
            </span>
          </p>

          <p className="mt-2 text-gray-500">
            Category :
            <span className="font-semibold ml-2">
              {product.category}
            </span>
          </p>

          <div className="flex items-center mt-4 text-lg">

            ⭐ {product.rating}

            <span className="ml-3 text-gray-500">
              ({product.numReviews} Reviews)
            </span>

          </div>

          <h2 className="text-4xl font-bold text-cyan-600 mt-6">

            ₹{Number(product.price).toLocaleString("en-IN")}

          </h2>

          <p className="text-red-500 mt-2">

            {product.discount}% OFF

          </p>

          <p className="mt-6 leading-8 text-gray-600">

            {product.description}

          </p>

          <p className="mt-6">

            Stock :

            <span
              className={`font-bold ml-2 ${
                product.stock > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {product.stock > 0
                ? `${product.stock} Available`
                : "Out Of Stock"}
            </span>

          </p>

          <div className="mt-8 flex items-center gap-5">

            <span>Qty</span>

            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
              className="w-20 border rounded-lg p-2"
            />

          </div>

          <div className="flex gap-5 mt-10">

            <button className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-4 rounded-xl font-semibold">

              🛒 Add To Cart

            </button>

            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold">

              Buy Now

            </button>

          </div>

          <button className="mt-5 w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl">

            ❤️ Add To Wishlist

          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;