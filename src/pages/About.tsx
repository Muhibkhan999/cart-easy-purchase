
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X, User, Award, Target, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";

const About = () => {
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
              <Link to="/about" className="text-blue-600 font-semibold">About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</Link>
              <Link to="/services" className="text-gray-700 hover:text-blue-600 transition-colors">Services</Link>
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

      {/* About Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            About Muhib Khan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Welcome to ShopHub! I'm Muhib Khan, the founder and visionary behind this premium e-commerce platform. 
            My passion for technology and exceptional customer experiences drives everything we do here.
          </p>
        </section>

        {/* Personal Story */}
        <section className="mb-16">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-gray-800">My Story</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 leading-relaxed">
              <p className="mb-4">
                I started ShopHub with a simple vision: to create an online shopping experience that combines 
                premium quality products with unmatched customer service. Having worked in the e-commerce industry 
                for over 8 years, I noticed a gap in the market for a platform that truly cares about its customers.
              </p>
              <p className="mb-4">
                My journey began in 2016 when I was a computer science student, fascinated by the potential of 
                digital commerce. I spent countless hours learning about user experience, supply chain management, 
                and the intricacies of online retail. This passion project eventually evolved into ShopHub.
              </p>
              <p>
                Today, ShopHub serves thousands of happy customers worldwide, and I'm proud of the community 
                we've built together. Every product we feature is carefully curated, and every customer interaction 
                is handled with the utmost care and attention.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Quality First</h3>
                <p className="text-gray-600">
                  We never compromise on quality. Every product is carefully selected and tested 
                  to meet our high standards.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <Heart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Customer Care</h3>
                <p className="text-gray-600">
                  Our customers are at the heart of everything we do. Your satisfaction is our 
                  top priority and driving force.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Innovation</h3>
                <p className="text-gray-600">
                  We continuously innovate to bring you the latest products and the best 
                  shopping experience possible.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Let's Connect</h2>
              <p className="mb-6 text-blue-100">
                Have questions or want to learn more about ShopHub? I'd love to hear from you!
              </p>
              <Link to="/contact">
                <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Get in Touch
                </Button>
              </Link>
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

export default About;
