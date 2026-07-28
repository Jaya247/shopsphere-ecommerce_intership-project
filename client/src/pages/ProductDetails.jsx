import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import API from "../api/axios";

import ProductImageGallery from "../components/product/ProductImageGallery";
import ProductInfo from "../components/product/ProductInfo";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("Product ID:", id);

        const { data } = await API.get(`/products/${id}`);

        console.log("API Response:", data);

        setProduct(data.product);
      } catch (error) {
        console.error("API Error:", error);

        if (error.response) {
          console.log("Status:", error.response.status);
          console.log("Response:", error.response.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center text-3xl mt-20">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center text-3xl mt-20">
        Product Not Found 😢
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid md:grid-cols-2 gap-10">

        <ProductImageGallery product={product} />

        <ProductInfo product={product} />

      </div>
    </div>
  );
}

export default ProductDetails;