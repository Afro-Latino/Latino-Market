import React, { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { productsAPI, categoriesAPI, regionsAPI } from '../services/api';
import { addToCart } from '../mock';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { toast } from 'sonner';
import { ShoppingCart, Filter } from 'lucide-react';

export const ShopPage = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    culture: '',
    category: '',
    region: '',
    search: ''
  });

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesRes, regionsRes] = await Promise.all([
          categoriesAPI.getAll(),
          regionsAPI.getAll()
        ]);
        setCategories(categoriesRes.categories || []);
        setRegions(regionsRes.regions || []);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Get filters from URL
        const culture = location.pathname.includes('african') ? 'African' : 
                       location.pathname.includes('latino') ? 'Latino' : '';
        const category = searchParams.get('category') || '';
        const region = searchParams.get('region') || '';
        const search = searchParams.get('search') || '';

        setSelectedFilters({ culture, category, region, search });

        // Build API params
        const params = {};
        if (culture) params.culture = culture;
        if (category) params.category = category.replace(/-/g, ' ');
        if (region) params.region = region.replace(/-/g, ' ');
        if (search) params.search = search;

        const response = await productsAPI.getAll(params);
        setFilteredProducts(response.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location, searchParams]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success(`${product.name} ${t('cart.itemRemoved').replace('removed from', 'added to')}`);
  };

  const getPageTitle = () => {
    if (selectedFilters.culture) return `Shop ${selectedFilters.culture}`;
    if (selectedFilters.category) return selectedFilters.category.replace(/-/g, ' ');
    if (selectedFilters.region) return selectedFilters.region.replace(/-/g, ' ');
    if (selectedFilters.search) return `Search results for "${selectedFilters.search}"`;
    return 'All Products';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`bg-gradient-to-r ${theme.gradient} text-white py-12`}>
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{getPageTitle()}</h1>
          <p className="text-lg opacity-90">{filteredProducts.length} products available</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Filter className="w-5 h-5" />
                  <h3 className="font-semibold text-lg">Filters</h3>
                </div>

                {/* Culture Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Culture</h4>
                  <div className="space-y-2">
                    <Link to="/shop" className="block text-sm hover:text-amber-600">All</Link>
                    <Link to="/shop/african" className="block text-sm hover:text-amber-600">African</Link>
                    <Link to="/shop/latino" className="block text-sm hover:text-amber-600">Latino</Link>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Categories</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {categories.map(cat => (
                      <Link
                        key={cat.category_id}
                        to={`/shop?category=${cat.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                        className="block text-sm hover:text-amber-600"
                      >
                        {cat.name} ({cat.product_count})
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Region Filter */}
                <div>
                  <h4 className="font-semibold mb-3">Regions</h4>
                  <div className="space-y-2">
                    {regions.map(region => (
                      <Link
                        key={region.region_id}
                        to={`/shop?region=${region.name.toLowerCase().replace(/ /g, '-')}`}
                        className="block text-sm hover:text-amber-600"
                      >
                        {region.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <Button asChild className="mt-4">
                  <Link to="/shop">View All Products</Link>
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <Card key={product.id} className="group hover:shadow-xl transition-all duration-300">
                    <Link to={`/product/${product.id}`}>
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-semibold">
                          {product.culture}
                        </div>
                      </div>
                    </Link>
                    <CardContent className="p-4">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-semibold mb-2 group-hover:text-amber-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-amber-600">${product.price}</span>
                        <span className="text-xs text-gray-500">{product.country}</span>
                      </div>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-amber-600 hover:bg-amber-700"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};