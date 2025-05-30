import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Home from "./pages/home";
import Login from "./pages/login";
import Product from "./pages/product";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Cart from "./components/cart";
import CartPage from "./pages/cartPage";
import UserEdit from "./pages/UserEdit";
import CheckoutPage from "./pages/checkout";
import CheckoutHistory from "./pages/checkoutHistory";
import EditProduct from "./pages/EditProduct";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./custom.css"; // Importing custom CSS
import "./fade-page.css"; // Import CSS for page transition effects

function AppRoutes() {
  const location = useLocation();
  const pageRef = React.useRef(null);

  return (
    <TransitionGroup component={null}>
      <CSSTransition
        key={location.pathname}
        classNames="fade-page"
        timeout={350}
        nodeRef={pageRef}
      >
        <div ref={pageRef} className="page-transition-wrapper">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/products" element={<Product />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={<Dashboard cartComponent={Cart} />}
            />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/user/edit/:userId" element={<UserEdit />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout-history" element={<CheckoutHistory />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
          </Routes>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
}

function App() {
  React.useEffect(() => {
    // Set judul sesuai halaman aktif
    const handleTitle = () => {
      const path = window.location.pathname;
      let title = "MyStore";
      if (path === "/") title = "Beranda | MyStore";
      else if (path === "/login") title = "Login | MyStore";
      else if (path === "/register") title = "Register | MyStore";
      else if (path === "/products") title = "Produk | MyStore";
      else if (path === "/dashboard") title = "Dashboard | MyStore";
      else if (path === "/cart") title = "Keranjang | MyStore";
      document.title = title;
    };
    handleTitle();
    window.addEventListener("popstate", handleTitle);
    // Tambahkan event listener untuk react-router navigation
    const observer = new MutationObserver(handleTitle);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.removeEventListener("popstate", handleTitle);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;
