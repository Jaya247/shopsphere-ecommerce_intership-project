import { useState } from "react";

function ProductImageGallery({ product }) {
  const images = [
    product.image,
    product.image,
    product.image,
    product.image,
  ];

  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="flex gap-5">
      <div className="flex flex-col gap-3">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(img)}
            className="w-20 h-20 border rounded-lg flex items-center justify-center text-4xl"
          >
            {img}
          </button>
        ))}
      </div>

      <div className="flex-1 h-[500px] bg-gray-100 rounded-xl flex items-center justify-center text-[180px]">
        {selectedImage}
      </div>
    </div>
  );
}

export default ProductImageGallery;