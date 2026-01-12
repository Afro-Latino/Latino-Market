import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ShoppingCart,
  Search,
  User,
  Menu,
  X,
  Phone,
  Globe,
} from "lucide-react";
import { getCartCount } from "../mock";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { settingsAPI, noticesAPI } from "../services/api";

export const Header = () => {
  const { t } = useTranslation();
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const [holidayNotice, setHolidayNotice] = useState(null);
  const [showHolidayBanner, setShowHolidayBanner] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    updateCartCount();
    fetchSettings();
    fetchHolidayNotice();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await settingsAPI.get();
      setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const fetchHolidayNotice = async () => {
    try {
      const data = await noticesAPI.getActive();
      if (data.notices && data.notices.length > 0) {
        setHolidayNotice(data.notices[0]);
      }
    } catch (error) {
      console.error("Error fetching holiday notice:", error);
    }
  };

  const updateCartCount = () => {
    setCartCount(getCartCount());
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const phoneNumber = settings?.phone_number || "(506) 830-0999";
  const freeDeliveryThreshold = settings?.free_delivery_threshold || 50;

  return (
    <header className="sticky top-0 z-50">
      {/* Holiday Notice Banner (Dark Gray) */}
      {holidayNotice && showHolidayBanner && (
        <div className="bg-gray-800 text-white py-2 px-4">
          <div className="container mx-auto flex items-center justify-center relative">
            <span className="text-sm">🔔 : {holidayNotice.message}</span>
            <button
              onClick={() => setShowHolidayBanner(false)}
              className="absolute right-0 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Bar (Orange/Red Gradient) */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-2">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span className="text-sm font-medium">{phoneNumber}</span>
          </div>
          <div className="text-center text-sm flex-1">
            <span className="hidden sm:inline">
              ✨ Two continents. One marketplace. Free delivery on orders over $
              {freeDeliveryThreshold}!
            </span>
          </div>
          <div className="w-32"></div>
        </div>
      </div>

      {/* Main Header (White) */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src="https://customer-assets.emergentagent.com/job_culticommerce/artifacts/x3503la8_afro-latino%20logo.png"
                alt="Afro-Latino Marketplace"
                className="h-14 w-auto"
              />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/shop"
                className="text-gray-700 hover:text-amber-600 transition-colors font-medium"
              >
                Shop
              </Link>
              <Link
                to="/shop/african"
                className="text-gray-700 hover:text-amber-600 transition-colors font-medium"
              >
                African
              </Link>
              <Link
                to="/shop/latino"
                className="text-gray-700 hover:text-amber-600 transition-colors font-medium"
              >
                Latino
              </Link>
              <Link
                to="/recipes"
                className="text-gray-700 hover:text-amber-600 transition-colors font-medium"
              >
                Recipes
              </Link>
              <Link
                to="/deals"
                className="text-gray-700 hover:text-amber-600 transition-colors font-medium"
              >
                Deals
              </Link>
              <Link
                to="/blog"
                className="text-gray-700 hover:text-amber-600 transition-colors font-medium"
              >
                Blog
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-amber-600 transition-colors font-medium"
              >
                About
              </Link>
            </nav>

            {/* Right side - Search, Language, User, Cart */}
            <div className="flex items-center space-x-4">
              <form
                onSubmit={handleSearch}
                className="hidden lg:flex items-center"
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for ingredients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-600"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>

              <LanguageSwitcher />

              <Link
                to="/account"
                className="text-gray-700 hover:text-amber-600 transition-colors"
              >
                <User className="w-6 h-6" />
              </Link>

              <Link
                to="/cart"
                className="relative text-gray-700 hover:text-amber-600 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-700"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col space-y-4">
                <Link
                  to="/shop"
                  className="text-gray-700 hover:text-amber-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link
                  to="/shop/african"
                  className="text-gray-700 hover:text-amber-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  African
                </Link>
                <Link
                  to="/shop/latino"
                  className="text-gray-700 hover:text-amber-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Latino
                </Link>
                <Link
                  to="/recipes"
                  className="text-gray-700 hover:text-amber-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Recipes
                </Link>
                <Link
                  to="/deals"
                  className="text-gray-700 hover:text-amber-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Deals
                </Link>
                <Link
                  to="/blog"
                  className="text-gray-700 hover:text-amber-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-amber-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <form onSubmit={handleSearch} className="pt-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for ingredients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <Search className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </form>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
