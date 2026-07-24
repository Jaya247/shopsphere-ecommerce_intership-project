import { useState } from "react";

function QuantitySelector() {
  const [quantity, setQuantity] = useState(1);

  const increase = () => {
    setQuantity(quantity + 1);
  };

  const decrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-3">
        Quantity
      </h3>

      <div className="flex items-center w-fit border rounded-lg overflow-hidden shadow-sm">

        <button
          onClick={decrease}
          className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-2xl font-bold transition"
        >
          −
        </button>

        <div className="px-8 py-3 text-xl font-semibold">
          {quantity}
        </div>

        <button
          onClick={increase}
          className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-2xl font-bold transition"
        >
          +
        </button>

      </div>
    </div>
  );
}

export default QuantitySelector;