import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Sparkles, Truck, Users, Check, MapPin, Store } from 'lucide-react';
import { productsAPI, categoriesAPI, regionsAPI, testimonialsAPI, noticesAPI } from '../services/api';
import { mockMealKits } from '../mock';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

export const HomePage = () => {
  const { t } = useTranslation();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [holidayNotice, setHolidayNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, regionsRes, testimonialsRes, noticesRes] = await Promise.all([
          productsAPI.getAll({ limit: 20 }),
          categoriesAPI.getAll(),
          regionsAPI.getAll(),
          testimonialsAPI.getAll(),
          noticesAPI.getActive()
        ]);
        
        setFeaturedProducts(productsRes.products || []);
        setCategories(categoriesRes.categories || []);
        setRegions(regionsRes.regions || []);
        setTestimonials(testimonialsRes.testimonials || []);
        
        // Get first active notice
        if (noticesRes.notices && noticesRes.notices.length > 0) {
          setHolidayNotice(noticesRes.notices[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Storefront Image */}
      <section className="relative min-h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://customer-assets.emergentagent.com/job_ethic-ecom/artifacts/nlvbpsui_Store%20front.jpg"
            alt="AFRO-LATINO Marketplace Store Front - Moncton"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-12">
          {/* Store Badge */}
          <div className="inline-flex items-center space-x-2 bg-amber-500 text-white px-4 py-2 rounded-full mb-6">
            <MapPin className="w-4 h-4" />
            <span className="font-medium text-sm">Visit Our Store in Moncton, NB</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight text-white">
            {t('hero.title1')}<br />
            <span className="text-red-500">{t('hero.title2')}</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-6 text-white/90">
            {t('hero.subtitle')}
          </p>
          
          {/* Local Source Info Box */}
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 mb-8 max-w-md">
            <div className="flex items-start space-x-3">
              <Store className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900">Your Local Source for Authentic Products</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Serving the Greater Moncton community with quality African and Latino groceries, ingredients, and cultural products
                </p>
              </div>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg">
              <Link to="/shop/african">
                {t('hero.shopAfrican')} <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg">
              <Link to="/shop/latino">
                {t('hero.shopLatino')} <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/90 hover:bg-white text-gray-900 px-8 py-6 text-lg">
              <Link to="/shop">
                Browse All Products <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Value Strip */}
      <section className="bg-gradient-to-r from-amber-50 to-green-50 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-around items-center gap-8">
            <div className="flex items-center space-x-3">
              <Check className="w-6 h-6 text-green-600" />
              <span className="font-medium">{t('values.authentic')}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Sparkles className="w-6 h-6 text-amber-600" />
              <span className="font-medium">{t('values.fresh')}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-red-600" />
              <span className="font-medium">{t('values.community')}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Truck className="w-6 h-6 text-green-700" />
              <span className="font-medium">{t('values.delivery')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.slice(0, 8).map(category => (
              <Link
                key={category.category_id || category.id}
                to={`/shop?category=${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                className="group"
              >
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{category.icon}</div>
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.product_count} items</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Region Selector */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Explore by Region
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regions.map(region => (
              <Link
                key={region.region_id || region.id}
                to={`/shop?region=${region.name.toLowerCase().replace(/ /g, '-')}`}
                className="group relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={region.image}
                  alt={region.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{region.name}</h3>
                  <p className="text-sm opacity-90">{region.countries?.join(', ')}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Best Sellers</h2>
            <Button asChild variant="outline">
              <Link to="/shop">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.slice(0, 16).map(product => (
              <Link key={product.product_id || product.id} to={`/product/${product.product_id || product.id}`} className="group">
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="relative h-40 md:h-48 overflow-hidden bg-gray-100">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-semibold">
                      {product.culture}
                    </div>
                    {!product.in_stock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3 md:p-4">
                    <h3 className="font-semibold text-sm md:text-base mb-1 md:mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg md:text-xl font-bold text-amber-600">${product.price || 0}</span>
                      <span className="text-xs md:text-sm text-gray-500">{product.country}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Meal Kits */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-red-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Curated Meal Kits
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {mockMealKits.map(kit => (
              <Link key={kit.id} to={`/product/${kit.id}`} className="group">
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={kit.image}
                      alt={kit.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-amber-600 transition-colors">{kit.name}</h3>
                    <p className="text-gray-600 mb-4">{kit.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-amber-600">${kit.price}</span>
                      <span className="text-sm text-gray-500">Serves {kit.serves}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What Our Community Says
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.length > 0 ? testimonials.map(testimonial => (
              <Card key={testimonial.testimonial_id || testimonial.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <span key={i} className="text-amber-500">★</span>
                    ))}
                  </div>
                  <p className="text-gray-700">{testimonial.text}</p>
                </CardContent>
              </Card>
            )) : (
              // Default testimonials if none in database
              [
                { id: 1, name: 'Amara Johnson', location: 'Moncton, NB', text: "Finally found authentic Nigerian ingredients in Moncton! The Egusi and Jollof rice mix are perfect.", avatar: 'https://images.pexels.com/photos/6305734/pexels-photo-6305734.jpeg', rating: 5 },
                { id: 2, name: 'Carlos Rodriguez', location: 'Moncton, NB', text: "Best place for authentic Mexican and Colombian products. Fast delivery and great quality!", avatar: 'https://images.pexels.com/photos/4965326/pexels-photo-4965326.jpeg', rating: 5 },
                { id: 3, name: 'Fatima Santos', location: 'Moncton, NB', text: "Love discovering new fusion recipes. This marketplace brings my African and Latino heritage together.", avatar: 'https://images.unsplash.com/photo-1578203657036-746e6c4eb3b1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwyfHxkaXZlcnNlJTIwY3Vpc2luZXxlbnwwfHx8fDE3NjUwNTMzNTJ8MA&ixlib=rb-4.1.0&q=85', rating: 5 }
              ].map(testimonial => (
                <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-amber-500">★</span>
                      ))}
                    </div>
                    <p className="text-gray-700">{testimonial.text}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Recipes from Lagos to Lima
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join our community and discover fusion flavors every week
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button type="submit" size="lg" className="bg-white text-amber-600 hover:bg-gray-100">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};
