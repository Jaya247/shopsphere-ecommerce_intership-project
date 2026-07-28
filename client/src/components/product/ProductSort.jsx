function ProductSort({ sort, setSort }) {
  return (
    <div className="flex justify-center">
      <div className="flex items-center gap-3">

        <label className="font-semibold">
          Sort By
        </label>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">Newest</option>

          <option value="low">
            💰 Price: Low → High
          </option>

          <option value="high">
            💸 Price: High → Low
          </option>

          <option value="rating">
            ⭐ Highest Rating
          </option>

        </select>

      </div>
    </div>
  );
}

export default ProductSort;