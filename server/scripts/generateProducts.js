import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";

dotenv.config();

await connectDB();

const brands = {
  Mobiles: ["Apple", "Samsung", "OnePlus", "Google", "Xiaomi"],
  Laptops: ["Dell", "HP", "Lenovo", "Asus", "Apple"],
  Watches: ["Titan", "Casio", "Noise", "Fire-Boltt", "Fastrack"],
  Shoes: ["Nike", "Adidas", "Puma", "Reebok", "Skechers"],
  Clothing: ["Levis", "Zara", "H&M", "Allen Solly", "Nike"],
};

const imageMap = {
  Mobiles:
    "https://dummyjson.com/image/600x600/008080/ffffff?text=Mobile",
  Laptops:
    "https://dummyjson.com/image/600x600/0d6efd/ffffff?text=Laptop",
  Watches:
    "https://dummyjson.com/image/600x600/6f42c1/ffffff?text=Watch",
  Shoes:
    "https://dummyjson.com/image/600x600/f97316/ffffff?text=Shoes",
  Clothing:
    "https://dummyjson.com/image/600x600/198754/ffffff?text=Clothing",
};

const categories = Object.keys(brands);

const products = [];

for (const category of categories) {
  for (let i = 1; i <= 100; i++) {
    const brand =
      brands[category][
        Math.floor(Math.random() * brands[category].length)
      ];

    products.push({
      name: `${brand} ${category} ${i}`,
      brand,
      description: `Premium ${brand} ${category} with high quality build and excellent performance.`,
      category,
      price: Math.floor(Math.random() * 90000) + 1000,
      discount: Math.floor(Math.random() * 50),
      stock: Math.floor(Math.random() * 100) + 1,
      rating: Number((Math.random() * 2 + 3).toFixed(1)),
      numReviews: Math.floor(Math.random() * 5000),
      featured: Math.random() > 0.7,
      images: [
        imageMap[category],
        imageMap[category],
        imageMap[category],
        imageMap[category],
      ],
    });
  }
}

try {
  await Product.deleteMany();
  await Product.insertMany(products);

  console.log(`✅ ${products.length} Products Generated`);
  process.exit();
} catch (err) {
  console.error(err);
  process.exit(1);
}