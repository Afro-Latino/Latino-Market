import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  CheckCircle,
  ShoppingBag,
  ArrowRight,
  Package,
  Mail,
  Truck,
} from "lucide-react";
import { Button } from "../components/ui/button";

export const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const type = searchParams.get("type");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-4 animate-in zoom-in duration-500">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Order Placed Successfully!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for your purchase. Your order has been received and is
            being processed.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div className="flex items-center">
                <Package className="h-5 w-5 text-amber-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  Order ID
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                #{orderId || "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-amber-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  Confirmation
                </span>
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                Email Sent
              </span>
            </div>

            {type === "delivery" && (
              <div className="flex items-start text-green-700 text-sm bg-green-50 p-4 rounded-xl">
                <Truck className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <p>
                  <strong>Pay on Delivery:</strong> Our delivery person will
                  collect payment when your order arrives. Please have cash or
                  card ready.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col space-y-4">
          <Link to="/shop" className="w-full">
            <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-6 text-lg font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Continue Shopping
            </Button>
          </Link>

          {/* <Link to="/account" className="w-full">
            <Button
              variant="outline"
              className="w-full border-2 border-gray-200 hover:bg-gray-50 py-6 text-lg font-semibold rounded-xl transition-all duration-200"
            >
              View My Orders
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link> */}
        </div>

        <div className="mt-8 text-center pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Need help? Contact us at{" "}
            <a
              href="mailto:support@afrolatino.ca"
              className="font-semibold text-amber-600 hover:underline"
            >
              support@afrolatino.ca
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
