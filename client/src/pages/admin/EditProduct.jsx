import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "",
    category: "",
    price: "",
    discount: "",
    stock: "",
    rating: "",
    numReviews: "",
    images: [""],
    featured: false,
  });

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const { data } = await API.get(`/products/${id}`);

      setFormData({
        ...data.product,
        images:
          data.product.images?.length > 0
            ? data.product.images
            : [""],
      });
    } catch (error) {
      console.log(error);
      alert("Unable to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;

    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);

      await API.put(`/products/${id}`, {
        ...formData,
        price: Number(formData.price),
        discount: Number(formData.discount),
        stock: Number(formData.stock),
        rating: Number(formData.rating),
        numReviews: Number(formData.numReviews),
      });

      alert("✅ Product Updated Successfully");

      navigate("/admin/products");
    } catch (error) {
      console.log(error);
      alert("❌ Unable to update product");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-3xl mt-20">
        Loading Product...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">

      <h1 className="text-4xl font-bold mb-8">
        Edit Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-8 space-y-6"
      >

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3"
        />

        <textarea
          rows="4"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3"
        />

        <div className="grid md:grid-cols-2 gap-5">

          <select
            name="brand"
            value={formData.brand}
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
            value={formData.category}
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

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <input
            type="number"
            name="discount"
            placeholder="Discount"
            value={formData.discount}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <input
            type="number"
            step="0.1"
            name="rating"
            placeholder="Rating"
            value={formData.rating}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <input
            type="number"
            name="numReviews"
            placeholder="Reviews"
            value={formData.numReviews}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

        </div>

        <h2 className="text-xl font-bold">
          Product Images
        </h2>

        {formData.images.map((img, index) => (

          <div key={index} className="space-y-3">

            <input
              type="text"
              value={img}
              placeholder={`Image ${index + 1}`}
              onChange={(e) =>
                handleImageChange(index, e.target.value)
              }
              className="w-full border rounded-lg p-3"
            />

            {img && (
              <img
                src={img}
                alt="Preview"
                className="w-40 h-40 object-contain border rounded-lg"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            )}

          </div>

        ))}

        <label className="flex items-center gap-3">

          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
          />

          Featured Product

        </label>

        <button
          type="submit"
          disabled={updating}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-bold"
        >
          {updating
            ? "Updating Product..."
            : "Update Product"}
        </button>

      </form>

    </div>
  );
}

export default EditProduct;