import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

function AddProduct() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    brand: "Samsung",
    description: "",
    category: "Mobiles",
    price: "",
    discount: 0,
    stock: "",
    rating: 5,
    numReviews: 0,
    image: "",
    featured: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/products", {
        name: product.name,
        brand: product.brand,
        description: product.description,
        category: product.category,
        price: Number(product.price),
        discount: Number(product.discount),
        stock: Number(product.stock),
        rating: Number(product.rating),
        numReviews: Number(product.numReviews),
        featured: product.featured,
        images: [product.image],
      });

      alert("✅ Product Added Successfully");

      setProduct({
        name: "",
        brand: "Samsung",
        description: "",
        category: "Mobiles",
        price: "",
        discount: 0,
        stock: "",
        rating: 5,
        numReviews: 0,
        image: "",
        featured: false,
      });

      navigate("/admin/products");
    } catch (error) {
      console.log(error);
      alert("❌ Unable to Add Product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">

      <h1 className="text-4xl font-bold mb-8">
        Add New Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-8 space-y-6"
      >

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3"
        />

        <div className="grid md:grid-cols-2 gap-5">

          <select
            name="brand"
            value={product.brand}
            onChange={handleChange}
            className="border rounded-lg p-3"
          >
            <option>Samsung</option>
            <option>Apple</option>
            <option>OnePlus</option>
            <option>Realme</option>
            <option>Xiaomi</option>
            <option>Nike</option>
            <option>Adidas</option>
            <option>Levis</option>
            <option>Zara</option>
            <option>H&M</option>
          </select>

          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="border rounded-lg p-3"
          >
            <option>Mobiles</option>
            <option>Laptops</option>
            <option>Electronics</option>
            <option>Clothing</option>
            <option>Shoes</option>
            <option>Watches</option>
          </select>

        </div>

        <textarea
          rows="4"
          name="description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />

        <div className="grid md:grid-cols-2 gap-5">

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={product.price}
            onChange={handleChange}
            required
            className="border rounded-lg p-3"
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={product.stock}
            onChange={handleChange}
            required
            className="border rounded-lg p-3"
          />

          <input
            type="number"
            name="discount"
            placeholder="Discount"
            value={product.discount}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <input
            type="number"
            step="0.1"
            name="rating"
            placeholder="Rating"
            value={product.rating}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <input
            type="number"
            name="numReviews"
            placeholder="Number of Reviews"
            value={product.numReviews}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

        </div>

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={product.image}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3"
        />

        {product.image && (
          <img
            src={product.image}
            alt="Preview"
            className="w-40 h-40 object-contain border rounded-lg"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        )}

        <label className="flex items-center gap-3">

          <input
            type="checkbox"
            name="featured"
            checked={product.featured}
            onChange={handleChange}
          />

          Featured Product

        </label>

        <button
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl text-lg font-bold"
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>

      </form>

    </div>
  );
}

export default AddProduct;