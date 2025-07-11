
import { Link } from "react-router-dom";
import { CheckCircle, Package, Mail, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ShopHub
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-12">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  Order Placed Successfully!
                </h1>
                <p className="text-gray-600 text-lg mb-8">
                  Thank you for your purchase. Your order has been received and is being processed.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                  <Mail className="h-8 w-8 text-blue-600" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800">Email Confirmation</h3>
                    <p className="text-sm text-gray-600">Check your inbox for order details</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                  <Package className="h-8 w-8 text-green-600" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800">Processing</h3>
                    <p className="text-sm text-gray-600">Your order is being prepared</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-gray-800 mb-3">What happens next?</h3>
                <ul className="text-left space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    You'll receive an email confirmation within the next few minutes
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    We'll prepare your order for shipping within 1-2 business days
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    You'll receive tracking information once your order ships
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    Delivery typically takes 3-5 business days
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Home className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Order ID: #ORD-{Date.now().toString().slice(-6)}
                </p>
                <p className="text-sm text-gray-500">
                  Order Date: {new Date().toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
