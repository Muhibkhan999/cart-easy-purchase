
import { Link } from "react-router-dom";
import { ShoppingCart, User, Truck, Shield, Headphones, RefreshCw, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";

const Services = () => {
  const { cartItems } = useCart();
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ShopHub
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
              <Link to="/products" className="text-gray-700 hover:text-blue-600 transition-colors">Products</Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors">About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</Link>
              <Link to="/services" className="text-blue-600 font-semibold">Services</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link to="/cart" className="relative">
                <Button variant="outline" size="sm">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemsCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                      {cartItemsCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Services Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At ShopHub, we're committed to providing exceptional services that go beyond just selling products. 
            We're here to support you every step of your shopping journey.
          </p>
        </section>

        {/* Main Services Grid */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-6 text-center">
                <Truck className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Fast Shipping</h3>
                <p className="text-gray-600 mb-4">
                  Free shipping on orders over $50. Express delivery available for urgent orders.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Standard: 3-5 business days</li>
                  <li>• Express: 1-2 business days</li>
                  <li>• Overnight available</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-6 text-center">
                <Shield className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Secure Shopping</h3>
                <p className="text-gray-600 mb-4">
                  Your data and payments are protected with industry-leading security measures.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• SSL encryption</li>
                  <li>• PCI DSS compliant</li>
                  <li>• Fraud protection</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-6 text-center">
                <Headphones className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-800">24/7 Support</h3>
                <p className="text-gray-600 mb-4">
                  Get help whenever you need it with our dedicated customer support team.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Live chat support</li>
                  <li>• Email assistance</li>
                  <li>• Phone support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-6 text-center">
                <RefreshCw className="h-16 w-16 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Easy Returns</h3>
                <p className="text-gray-600 mb-4">
                  Not satisfied? Return any item within 30 days for a full refund or exchange.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• 30-day return policy</li>
                  <li>• Free return shipping</li>
                  <li>• Quick processing</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-6 text-center">
                <Award className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Quality Guarantee</h3>
                <p className="text-gray-600 mb-4">
                  Every product is carefully inspected and comes with our quality guarantee.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Quality inspection</li>
                  <li>• Authenticity verified</li>
                  <li>• Warranty support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-6 text-center">
                <Clock className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Personal Shopping</h3>
                <p className="text-gray-600 mb-4">
                  Need help finding the perfect product? Our personal shopping service is here to help.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Product recommendations</li>
                  <li>• Custom solutions</li>
                  <li>• Expert advice</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Additional Services */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Additional Services</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Corporate Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Special pricing and services for businesses and bulk orders.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Volume discounts</li>
                  <li>• Custom invoicing</li>
                  <li>• Dedicated account manager</li>
                  <li>• Priority support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Gift Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Make your gifts extra special with our gift wrapping and delivery services.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Professional gift wrapping</li>
                  <li>• Custom gift messages</li>
                  <li>• Direct shipping to recipient</li>
                  <li>• Gift receipt included</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Experience Our Services?</h2>
              <p className="mb-6 text-blue-100">
                Join thousands of satisfied customers who trust ShopHub for their shopping needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products">
                  <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Start Shopping
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ShopHub
            </h3>
          </div>
          <p className="text-gray-400 mb-4">
            Founded by Muhib Khan - Your trusted destination for premium products
          </p>
          <div className="flex justify-center space-x-6">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
            <Link to="/products" className="text-gray-400 hover:text-white transition-colors">Products</Link>
            <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8">
            <p className="text-gray-400">&copy; 2024 ShopHub by Muhib Khan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Services;
