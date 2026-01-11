import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { productsAPI } from "../services/api";
import { addToCart } from "../mock";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { toast } from "sonner";
import {
  ShoppingCart,
  Minus,
  Plus,
  Star,
  Package,
  Truck,
  CheckCircle,
} from "lucide-react";

export const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await productsAPI.getById(id);
        setProduct(productData);

        // Fetch related products
        const relatedRes = await productsAPI.getAll({
          category: productData.category,
          limit: 4,
        });
        setRelatedProducts(
          relatedRes.products.filter((p) => p.product_id !== id)
        );
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Button asChild>
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.in_stock === false) {
      toast.error(`${product.name} is currently out of stock`);
      return;
    }
    addToCart(product, quantity);
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(`${quantity} x ${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-amber-600">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-amber-600">
            Shop
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="relative rounded-xl overflow-hidden shadow-lg mb-4">
              <img
                src={product.image}
                alt={product.name}
                className={`w-full h-96 object-cover ${
                  product.in_stock === false ? "grayscale opacity-60" : ""
                }`}
              />
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold">
                {product.culture}
              </div>
              {product.in_stock === false && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-red-600 text-white px-6 py-2 rounded-full text-xl font-bold shadow-2xl">
                    OUT OF STOCK
                  </span>
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-amber-600"
                >
                  <img
                    src={product.image}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                  <span className="font-medium">{product.country}</span>
                  <span>•</span>
                  <span>{product.region}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-amber-600">
                  ${product.price}
                </div>
                <div
                  className={`text-sm font-semibold mt-1 ${
                    product.in_stock !== false
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {product.in_stock !== false ? (
                    <span className="flex items-center justify-end">
                      <CheckCircle className="w-4 h-4 mr-1" /> In Stock
                    </span>
                  ) : (
                    <span className="flex items-center justify-end">
                      <Package className="w-4 h-4 mr-1" /> Out of Stock
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-amber-500 text-amber-500"
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">(24 reviews)</span>
            </div>

            <p className="text-gray-700 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div
              className={`mb-8 ${
                product.in_stock === false
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
            >
              <label className="block text-sm font-semibold mb-3">
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={product.in_stock === false}
                    className="p-3 hover:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    disabled={product.in_stock === false}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-16 text-center border-x py-2 focus:outline-none disabled:bg-gray-50"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={product.in_stock === false}
                    className="p-3 hover:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  disabled={product.in_stock === false}
                  size="lg"
                  className={`flex-1 text-white ${
                    product.in_stock === false
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-amber-600 hover:bg-amber-700"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.in_stock === false ? "Out of Stock" : "Add to Cart"}
                </Button>
              </div>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-b">
              <div className="text-center">
                <Package className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <p className="text-sm font-medium">Authentic Import</p>
              </div>
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <p className="text-sm font-medium">Fast Delivery</p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <p className="text-sm font-medium">Quality Guaranteed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Card className="mb-16">
          <CardContent className="p-6">
            <Tabs defaultValue="description">
              <TabsList className="mb-6">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                <TabsTrigger value="storage">Storage</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="text-gray-700">
                <h3 className="font-semibold text-lg mb-3">Cultural Story</h3>
                <p className="leading-relaxed mb-4">{product.description}</p>
                <p>
                  This authentic product brings the rich flavors of{" "}
                  {product.country} directly to your kitchen. Perfect for
                  traditional recipes and modern fusion dishes alike.
                </p>
              </TabsContent>
              <TabsContent value="ingredients" className="text-gray-700">
                <h3 className="font-semibold text-lg mb-3">Ingredients</h3>
                <p>
                  100% natural ingredients sourced from {product.region}. No
                  artificial preservatives or colors.
                </p>
              </TabsContent>
              <TabsContent value="storage" className="text-gray-700">
                <h3 className="font-semibold text-lg mb-3">
                  Storage Instructions
                </h3>
                <p>
                  Store in a cool, dry place away from direct sunlight.
                  Refrigerate after opening for maximum freshness.
                </p>
              </TabsContent>
              <TabsContent value="reviews" className="text-gray-700">
                <h3 className="font-semibold text-lg mb-6">Customer Reviews</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border-b pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold">Customer {i}</div>
                        <div className="flex">
                          {[...Array(5)].map((_, j) => (
                            <Star
                              key={j}
                              className="w-4 h-4 fill-amber-500 text-amber-500"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm">
                        Excellent product! Authentic taste and great quality.
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8">You May Also Like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.product_id}
                  to={`/product/${relatedProduct.product_id}`}
                >
                  <Card className="hover:shadow-xl transition-all duration-300">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className={`w-full h-full object-cover hover:scale-110 transition-transform duration-500 ${
                          relatedProduct.in_stock === false
                            ? "grayscale opacity-60"
                            : ""
                        }`}
                      />
                      {relatedProduct.in_stock === false && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-1">
                        {relatedProduct.name}
                      </h3>
                      <div className="text-xl font-bold text-amber-600">
                        ${relatedProduct.price}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
