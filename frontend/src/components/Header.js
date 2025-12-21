import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Search, User, Menu, X } from 'lucide-react';
import { getCartCount } from '../mock';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Header = () => {
  const { t } = useTranslation();
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  const updateCartCount = () => {
    setCartCount(getCartCount());
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="bg-gradient-to-r from-amber-600 to-red-600 text-white py-2">
        <div className="container mx-auto px-4 text-center text-sm">
          ✨ {t('hero.freeDelivery')}
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              <span className="text-amber-600">AFRO</span>
              <span className="text-red-600">-</span>
              <span className="text-green-700">LATINO</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/shop" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">
              {t('nav.shop')}
            </Link>
            <Link to="/shop/african" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">
              {t('nav.african')}
            </Link>
            <Link to="/shop/latino" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">
              {t('nav.latino')}
            </Link>
            <Link to="/recipes" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">
              {t('nav.recipes')}
            </Link>
            <Link to="/deals" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">
              {t('nav.deals')}
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">
              {t('nav.about')}
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden lg:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('common.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-600">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            <LanguageSwitcher />

            <Link to="/account" className="text-gray-700 hover:text-amber-600 transition-colors">
              <User className="w-6 h-6" />
            </Link>

            <Link to="/cart" className="relative text-gray-700 hover:text-amber-600 transition-colors">
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
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link to="/shop" className="text-gray-700 hover:text-amber-600" onClick={() => setMobileMenuOpen(false)}>
                Shop
              </Link>
              <Link to="/shop/african" className="text-gray-700 hover:text-amber-600" onClick={() => setMobileMenuOpen(false)}>
                African
              </Link>
              <Link to="/shop/latino" className="text-gray-700 hover:text-amber-600" onClick={() => setMobileMenuOpen(false)}>
                Latino
              </Link>
              <Link to="/recipes" className="text-gray-700 hover:text-amber-600" onClick={() => setMobileMenuOpen(false)}>
                Recipes
              </Link>
              <Link to="/deals" className="text-gray-700 hover:text-amber-600" onClick={() => setMobileMenuOpen(false)}>
                Deals
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-amber-600" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
              <form onSubmit={handleSearch} className="pt-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Search className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </form>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};