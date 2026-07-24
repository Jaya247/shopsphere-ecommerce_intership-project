function ProductFilter({ category, setCategory }) {
    return (
      <div className="flex justify-center mb-8">
  
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-5 py-3"
        >
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Gaming">Gaming</option>
          <option value="Camera">Camera</option>
          <option value="Accessories">Accessories</option>
        </select>
  
      </div>
    );
  }
  
  export default ProductFilter;