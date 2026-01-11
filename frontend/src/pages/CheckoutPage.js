import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, getCartTotal, clearCart } from "../mock";
import { ordersAPI, paymentsAPI, settingsAPI } from "../services/api";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import {
  CreditCard,
  Lock,
  Truck,
  MapPin,
  Banknote,
  CheckCircle,
} from "lucide-react";

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [paymentType, setPaymentType] = useState("pay_now"); // pay_now or pay_on_delivery
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [settings, setSettings] = useState(null);
  const [onlinePaymentsEnabled, setOnlinePaymentsEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "Moncton",
    province: "NB",
    postalCode: "",
    deliveryNotes: "",
  });

  useEffect(() => {
    const cartItems = getCart();
    if (cartItems.length === 0) {
      navigate("/cart");
      return;
    }
    setCart(cartItems);
    setSubtotal(getCartTotal());
    fetchSettings();
    fetchPaymentStatus();
  }, [navigate]);

  const fetchSettings = async () => {
    try {
      const data = await settingsAPI.get();
      setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const fetchPaymentStatus = async () => {
    try {
      const data = await settingsAPI.getPaymentStatus();
      setOnlinePaymentsEnabled(data.online_payments_enabled);
      // If online payments are disabled, force pay_on_delivery
      if (!data.online_payments_enabled) {
        setPaymentType("pay_on_delivery");
      }
    } catch (error) {
      console.error("Error fetching payment status:", error);
    }
  };

  const calculateDistance = () => {
    // Mock distance calculation - in real app, would use Google Maps API
    return 8; // km from store
  };

  const calculateDeliveryFee = () => {
    const distance = calculateDistance();
    const threshold = settings?.free_delivery_threshold || 50;
    const baseFee = settings?.delivery_base_fee || 10;
    const perKmFee = settings?.delivery_per_km_fee || 2;

    if (subtotal >= threshold) return 0;
    if (distance <= 5) return baseFee;
    return baseFee + (distance - 5) * perKmFee;
  };

  const deliveryFee = 0;
  const total = subtotal;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.postalCode
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Final stock check
      const hasOutOfStock = cart.some((item) => item.in_stock === false);
      if (hasOutOfStock) {
        toast.error(
          "One or more items in your cart are out of stock. Please remove them and try again."
        );
        setIsSubmitting(false);
        return;
      }

      // Prepare order data
      const orderData = {
        items: cart.map((item) => ({
          product_id: item.id || item.product_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        delivery_info: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          province: formData.province,
          postal_code: formData.postalCode,
          delivery_notes: formData.deliveryNotes,
        },
        payment_method:
          paymentType === "pay_on_delivery" ? "cash" : paymentMethod,
        payment_type: paymentType,
        notes: formData.deliveryNotes,
      };

      // Create order
      const response = await ordersAPI.create(orderData);

      // Clear cart
      clearCart();
      window.dispatchEvent(new Event("cartUpdated"));

      // Handle response based on payment type
      if (paymentType === "pay_on_delivery") {
        toast.success(
          "Order confirmed! Payment will be collected upon delivery."
        );
        navigate(`/order-success?order_id=${response.order_id}&type=delivery`);
      } else if (paymentMethod === "stripe") {
        toast.success("Redirecting to payment...");
        const paymentRes = await paymentsAPI.stripeCheckout(response.order_id);
        window.location.href = paymentRes.url;
      } else {
        toast.success("Order placed! Redirecting to payment...");
        navigate(`/order-success?order_id=${response.order_id}`);
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-amber-600 to-red-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold">Checkout</h1>
          <p className="text-lg mt-2 opacity-90">Complete your order</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Delivery Information */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Truck className="w-6 h-6 text-amber-600" />
                    <h2 className="text-2xl font-bold">Delivery Information</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="E1C 1A1"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="deliveryNotes">
                        Delivery Notes (Optional)
                      </Label>
                      <Input
                        id="deliveryNotes"
                        name="deliveryNotes"
                        value={formData.deliveryNotes}
                        onChange={handleInputChange}
                        placeholder="Any special instructions?"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Type Selection */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <CreditCard className="w-6 h-6 text-amber-600" />
                    <h2 className="text-2xl font-bold">Payment Options</h2>
                  </div>

                  {/* Show message if online payments are disabled */}
                  {!onlinePaymentsEnabled && (
                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center gap-2 text-amber-700">
                        <Banknote className="w-5 h-5" />
                        <p className="font-medium">Pay on Delivery Only</p>
                      </div>
                      <p className="text-sm text-amber-600 mt-1">
                        Online payments are currently disabled. Please pay cash
                        when you receive your order.
                      </p>
                    </div>
                  )}

                  {/* Payment Type Toggle */}
                  <div
                    className={`grid ${
                      onlinePaymentsEnabled
                        ? "md:grid-cols-2"
                        : "md:grid-cols-1"
                    } gap-4 mb-6`}
                  >
                    {/* Pay Now Option - Only show if online payments are enabled */}
                    {onlinePaymentsEnabled && (
                      <div
                        onClick={() => setPaymentType("pay_now")}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          paymentType === "pay_now"
                            ? "border-amber-600 bg-amber-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="paymentType"
                            checked={paymentType === "pay_now"}
                            onChange={() => setPaymentType("pay_now")}
                            className="w-4 h-4 text-amber-600"
                          />
                          <div className="flex-1">
                            <p className="font-semibold flex items-center">
                              <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                              Pay Now
                            </p>
                            <p className="text-sm text-gray-600">
                              Pay securely online
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div
                      onClick={() => setPaymentType("pay_on_delivery")}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentType === "pay_on_delivery"
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="paymentType"
                          checked={paymentType === "pay_on_delivery"}
                          onChange={() => setPaymentType("pay_on_delivery")}
                          className="w-4 h-4 text-green-600"
                        />
                        <div className="flex-1">
                          <p className="font-semibold flex items-center">
                            <Banknote className="w-5 h-5 mr-2 text-green-600" />
                            Pay on Delivery
                          </p>
                          <p className="text-sm text-gray-600">
                            Cash or card at delivery
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Online Payment Methods (shown only when Pay Now is selected AND online payments enabled) */}
                  {paymentType === "pay_now" && onlinePaymentsEnabled && (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 font-medium mb-2">
                        Select Payment Method:
                      </p>
                      <div
                        onClick={() => setPaymentMethod("stripe")}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          paymentMethod === "stripe"
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === "stripe"}
                            onChange={() => setPaymentMethod("stripe")}
                            className="w-4 h-4 text-blue-600"
                          />
                          <div className="flex-1">
                            <p className="font-semibold">
                              Credit/Debit Card (Stripe)
                            </p>
                            <p className="text-sm text-gray-600">
                              Secure payment via Stripe
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <div className="w-10 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                              VISA
                            </div>
                            <div className="w-10 h-6 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                              MC
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        onClick={() => setPaymentMethod("paypal")}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          paymentMethod === "paypal"
                            ? "border-yellow-600 bg-yellow-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === "paypal"}
                            onChange={() => setPaymentMethod("paypal")}
                            className="w-4 h-4 text-yellow-600"
                          />
                          <div className="flex-1">
                            <p className="font-semibold">PayPal</p>
                            <p className="text-sm text-gray-600">
                              Pay with your PayPal account
                            </p>
                          </div>
                          <div className="w-16 h-6 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">
                            PayPal
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pay on Delivery Info */}
                  {paymentType === "pay_on_delivery" && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-semibold text-green-900">
                            Pay When You Receive
                          </p>
                          <p className="text-green-800 mt-1">
                            Your order will be confirmed immediately. Pay with
                            cash or card when your order is delivered.
                          </p>
                          <p className="text-green-700 mt-2 text-xs">
                            * Our delivery person will carry a card machine for
                            your convenience
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-start space-x-3">
                    <Lock className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-600">
                      <p className="font-semibold">Secure Checkout</p>
                      <p>Your payment information is encrypted and secure</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                  {/* Cart Items */}
                  <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={item.id || item.product_id}
                        className="flex space-x-3"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{item.name}</p>
                          <p className="text-xs text-gray-600">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-bold text-amber-600">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-3 border-t">
                      <span>Total</span>
                      <span className="text-amber-600">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Payment Type Badge */}
                  <div
                    className={`mt-4 p-3 rounded-lg text-center ${
                      paymentType === "pay_on_delivery"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    <span className="font-semibold text-sm">
                      {paymentType === "pay_on_delivery"
                        ? "💵 Pay on Delivery"
                        : "💳 Pay Now Online"}
                    </span>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className={`w-full mt-6 text-white ${
                      paymentType === "pay_on_delivery"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-amber-600 hover:bg-amber-700"
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </span>
                    ) : paymentType === "pay_on_delivery" ? (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Confirm Order
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        Proceed to Payment
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-500 mt-4">
                    By completing this order, you agree to our Terms &
                    Conditions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
