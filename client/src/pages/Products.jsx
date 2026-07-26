import { useEffect, useState } from "react";

import API from "../api/axios";

import ProductSearch from "../components/product/ProductSearch";
import ProductFilter from "../components/product/ProductFilter";
import ProductSort from "../components/product/ProductSort";
import ProductGrid from "../components/product/ProductGrid";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");

  // Fetch Products from Backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get("/products");
        setProducts(data.products);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, []);

  // Filter Products
  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      category === "All" || product.category === category;

    return matchSearch && matchCategory;
  });

  // Sort Products
  let sortedProducts = [...filteredProducts];

  if (sort === "low") {
    sortedProducts.sort((a, b) => a.price - b.price);
  }

  if (sort === "high") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  if (sort === "rating") {
    sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Search */}
      <ProductSearch
        search={search}
        setSearch={setSearch}
      />

      {/* Filter + Sort */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-5 mt-6">
        <ProductFilter
          category={category}
          setCategory={setCategory}
        />

        <ProductSort
          sort={sort}
          setSort={setSort}
        />
      </div>

      {/* Products */}
      <ProductGrid products={sortedProducts} />
    </div>
  );
}

export default Products;