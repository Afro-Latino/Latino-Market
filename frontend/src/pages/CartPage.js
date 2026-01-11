import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getCart,
  removeFromCart,
  updateCartQuantity,
  getCartTotal,
  clearCart,
} from "../mock";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { toast } from "sonner";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";

export const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, []);

  const loadCart = () => {
    setCart(getCart());
    setTotal(getCartTotal());
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
    loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Item removed from cart");
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartQuantity(productId, newQuantity);
    loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleClearCart = () => {
    clearCart();
    loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Cart cleared");
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    const hasOutOfStock = cart.some((item) => item.in_stock === false);
    if (hasOutOfStock) {
      toast.error(
        "Please remove out of stock items from your cart before checking out"
      );
      return;
    }
    navigate("/checkout");
  };

  const hasOutOfStockItems = cart.some((item) => item.in_stock === false);

  const deliveryFee = 0;
  const finalTotal = total;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-300" />
          <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Discover our amazing products from Africa and Latin America
          </p>
          <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
            <Link to="/shop">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-amber-600 to-red-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold">Shopping Cart</h1>
          <p className="text-lg mt-2 opacity-90">
            {cart.length} items in your cart
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Cart Items</h2>
                  <Button
                    onClick={handleClearCart}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    Clear Cart
                  </Button>
                </div>

                <div className="space-y-6">
                  {cart.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex gap-4 pb-6 border-b last:border-0"
                    >
                      <Link
                        to={`/product/${item.product_id}`}
                        className="flex-shrink-0"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </Link>
                      <div className="flex-1">
                        <Link to={`/product/${item.product_id}`}>
                          <h3 className="font-semibold text-lg mb-1 hover:text-amber-600">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.country} • {item.culture}
                        </p>
                        {item.in_stock === false && (
                          <div className="bg-red-50 text-red-600 px-3 py-1 rounded text-xs font-bold mb-2 flex items-center">
                            <Package className="w-3 h-3 mr-1" /> OUT OF STOCK -
                            Please remove to proceed
                          </div>
                        )}
                        <div className="flex items-center space-x-4">
                          <div
                            className={`flex items-center border rounded-lg ${
                              item.in_stock === false
                                ? "opacity-50 pointer-events-none bg-gray-50"
                                : ""
                            }`}
                          >
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product_id,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.in_stock === false}
                              className="p-2 hover:bg-gray-100 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 border-x font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product_id,
                                  item.quantity + 1
                                )
                              }
                              disabled={item.in_stock === false}
                              className="p-2 hover:bg-gray-100 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div
                            className={`text-xl font-bold ${
                              item.in_stock === false
                                ? "text-gray-400"
                                : "text-amber-600"
                            }`}
                          >
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemove(item.product_id)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  {hasOutOfStockItems && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded text-red-600 text-sm font-medium animate-pulse">
                      Some items in your cart are out of stock. Please remove
                      them to continue.
                    </div>
                  )}
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-amber-600">
                        ${finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  size="lg"
                  disabled={hasOutOfStockItems}
                  className={`w-full text-white mb-4 ${
                    hasOutOfStockItems
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-amber-600 hover:bg-amber-700"
                  }`}
                >
                  {hasOutOfStockItems
                    ? "Remove Out of Stock Items"
                    : "Proceed to Checkout"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link to="/shop">Continue Shopping</Link>
                </Button>

                <div className="mt-6 text-sm text-gray-600 space-y-2">
                  <p>✓ Secure checkout</p>
                  <p>✓ Easy returns within 30 days</p>
                  <p>✓ Authentic products guaranteed</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
