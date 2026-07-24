import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import NewArrivals from "../components/home/NewArrivals";
import BestSeller from "../components/home/BestSeller";
import Banner from "../components/home/Banner";
import ProductGrid from "../components/product/ProductGrid";

function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <NewArrivals />
      <BestSeller />
      <Banner />
      <ProductGrid />
    </>
  );
}

export default Home;