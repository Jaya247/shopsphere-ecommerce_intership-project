import { useEffect, useState } from "react";
import API from "../api/axios";

import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import NewArrivals from "../components/home/NewArrivals";
import BestSeller from "../components/home/BestSeller";
import Banner from "../components/home/Banner";
import ProductGrid from "../components/product/ProductGrid";

function Home() {
  const [products, setProducts] = useState([]);

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

  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <NewArrivals />
      <BestSeller />
      <Banner />

      <ProductGrid products={products} />
    </>
  );
}

export default Home;