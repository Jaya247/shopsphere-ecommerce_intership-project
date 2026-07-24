function ProductSort({ sort, setSort }) {
    return (
      <div className="flex justify-center mt-6">
        <div className="flex items-center gap-3">
          <label className="text-lg font-medium">
            Sort By:
          </label>
  
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Default</option>
            <option value="low">💰 Price: Low → High</option>
            <option value="high">💸 Price: High → Low</option>
            <option value="rating">⭐ Highest Rating</option>
          </select>
        </div>
      </div>
    );
  }
  
  export default ProductSort;