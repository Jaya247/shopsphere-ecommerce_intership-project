import { useEffect, useState } from "react";
import API from "../../api/axios";

function ProductFilter({ category, setCategory }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get("/products/categories");
        setCategories(data.categories);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="flex justify-center">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border border-gray-300 rounded-lg px-5 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
      >
        <option value="All">All Categories</option>

        {categories.map((item) => (
          <option
            key={item._id}
            value={item._id}
          >
            {item._id} ({item.count})
          </option>
        ))}
      </select>
    </div>
  );
}

export default ProductFilter;