import { useState } from "react";

function ProductImageGallery({ product }) {
  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["https://placehold.co/500?text=No+Image"];

  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="flex gap-5">
      <div className="flex flex-col gap-3">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(img)}
            className={`w-20 h-20 border rounded-xl overflow-hidden cursor-pointer transition ${
              selectedImage === img ? "border-cyan-500 shadow-sm" : "border-gray-250 dark:border-slate-800"
            }`}
          >
            <img
              src={img}
              alt={`Product ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/150?text=No+Image";
              }}
            />
          </button>
        ))}
      </div>

      <div className="flex-1 h-[500px] bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-xl flex items-center justify-center overflow-hidden transition">
        <img
          src={selectedImage}
          alt={product.name}
          className="max-h-full max-w-full object-contain p-6"
          onError={(e) => {
            e.target.src =
              "https://placehold.co/500?text=No+Image";
          }}
        />
      </div>
    </div>
  );
}

export default ProductImageGallery;