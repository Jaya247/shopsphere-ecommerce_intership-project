import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
  try {
    setLoading(true);

    const { data } = await API.get("/products?limit=500");

    setProducts(data.products);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchProducts();
}, []);

const deleteProduct = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmDelete) return;

  try {
    await API.delete(`/products/${id}`);

    alert("✅ Product Deleted Successfully");

    fetchProducts();
  } catch (error) {
    console.log(error);
    alert("Unable to delete product");
  }
};

  if (loading) {
    return (
      <div className="text-center text-3xl mt-20">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold">
          Manage Products
        </h1>

        <Link
          to="/admin/add-product"
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg"
        >
          + Add Product
        </Link>

      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">

        <table className="w-full">

          <thead className="bg-slate-900 text-white">

            <tr>

              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-center">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {products.map((product) => (

              <tr
                key={product._id}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-4">

                  <img
                   src={
                  product.images?.[0] ||
                 "https://via.placeholder.com/80?text=No+Image"
                 }
                   alt={product.name}
                 className="w-16 h-16 object-contain rounded"
                  onError={(e) => {
                   e.target.src =
                 "https://via.placeholder.com/80?text=No+Image";
                  }}
                />

                </td>

                <td className="p-4">
                  {product.name}
                </td>

                <td className="p-4">
                  ₹
                  {Number(product.price).toLocaleString(
                    "en-IN"
                  )}
                </td>

                <td className="p-4">
                  {product.stock}
                </td>

                <td className="p-4">
                  {product.category}
                </td>

                <td className="p-4 text-center">

                  <Link
                    to={`/admin/edit-product/${product._id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() =>
                      deleteProduct(product._id)
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Products;