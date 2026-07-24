import { FaSearch } from "react-icons/fa";

function ProductSearch({ search, setSearch }) {
  return (
    <div className="max-w-7xl mx-auto px-5 py-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />

        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
      </div>
    </div>
  );
}

export default ProductSearch;