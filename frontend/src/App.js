import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./context/ThemeContext";
import { AnnouncementBanner } from "./components/AnnouncementBanner";
import { HolidayNotice } from "./components/HolidayNotice";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { ShopPage } from "./pages/ShopPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { RecipesPage } from "./pages/RecipesPage";
import { AboutPage } from "./pages/AboutPage";
import { BlogPage } from "./pages/BlogPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AccountPage } from "./pages/AccountPage";
import { AdminPage } from "./pages/AdminPage";
import { OrderSuccessPage } from "./pages/OrderSuccessPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <div className="flex flex-col min-h-screen">
          <Routes>
            {/* Routes without Header/Footer */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminPage />} />

            {/* Routes with Header/Footer */}
            <Route
              path="/*"
              element={
                <>
                  <AnnouncementBanner />
                  <Header />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/shop" element={<ShopPage />} />
                      <Route path="/shop/african" element={<ShopPage />} />
                      <Route path="/shop/latino" element={<ShopPage />} />
                      <Route
                        path="/product/:id"
                        element={<ProductDetailPage />}
                      />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/recipes" element={<RecipesPage />} />
                      <Route path="/blog" element={<BlogPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/account" element={<AccountPage />} />
                      <Route path="/deals" element={<ShopPage />} />
                      <Route
                        path="/order-success"
                        element={<OrderSuccessPage />}
                      />
                    </Routes>
                  </main>
                  <Footer />
                </>
              }
            />
          </Routes>
          <Toaster />
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
