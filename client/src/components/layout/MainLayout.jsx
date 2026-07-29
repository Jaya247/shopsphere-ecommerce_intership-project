import Navbar from "./Navbar";
import Footer from "./Footer";
import AIChatbot from "../common/AIChatbot";

function MainLayout({ children }) {
  return (
    <>
      <Navbar />

      <main
        className="bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition duration-300"
        style={{
          minHeight: "80vh",
          padding: "30px",
        }}
      >
        {children}
      </main>

      <AIChatbot />

      <Footer />
    </>
  );
}

export default MainLayout;