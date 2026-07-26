import ProductCard from "./ProductCard";

function ProductGrid({ products = [] }) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-5">
        <h2 className="text-4xl font-bold text-center mb-10">
          All Products
        </h2>

        {products.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            No Products Found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductGrid;