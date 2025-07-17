import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Star, Plus, Minus, Heart, Share2, MessageCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { toast } from "@/hooks/use-toast";
import { mockProducts } from "@/data/mockProducts";
import { supabase } from "@/integrations/supabase/client";
import ProductComments from "@/components/ProductComments";
import ChatSystem from "@/components/ChatSystem";
import DataVisualization from "@/components/DataVisualization";
import moment from "moment";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [user, setUser] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const foundProduct = mockProducts.find(p => p.id === parseInt(id || "0"));
    if (foundProduct) {
      setProduct(foundProduct);
      // Set page title for SEO
      document.title = `${foundProduct.name} - ShopHub`;
      // Set meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', foundProduct.description);
      }
    }
    
    // Check user authentication
    checkUser();
  }, [id]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      toast({
        title: "Added to cart!",
        description: `${quantity} ${product.name}(s) added to your cart.`,
      });
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to make a purchase",
        variant: "destructive",
      });
      return;
    }

    setPaymentLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          product_id: product.id,
          quantity: quantity,
          amount: product.price * quantity,
          product_name: product.name,
        },
      });

      if (error) throw error;

      if (data.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initiate payment",
        variant: "destructive",
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <Link to="/">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  // Sample data for visualization
  const salesTrendData = [
    { name: 'Jan', value: 65 },
    { name: 'Feb', value: 59 },
    { name: 'Mar', value: 80 },
    { name: 'Apr', value: 81 },
    { name: 'May', value: 56 },
    { name: 'Jun', value: 55 },
  ];

  const ratingDistribution = [
    { name: '5 Stars', value: 120 },
    { name: '4 Stars', value: 80 },
    { name: '3 Stars', value: 30 },
    { name: '2 Stars', value: 15 },
    { name: '1 Star', value: 5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ShopHub
            </Link>
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 text-white">
                      {discountPercentage}% OFF
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
              <Badge variant="outline" className="mb-4">
                {product.category}
              </Badge>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-blue-600">
                ${product.price}
              </span>
              <span className="text-xl text-gray-500 line-through">
                ${product.originalPrice}
              </span>
              <Badge className="bg-green-100 text-green-800">
                Save ${(product.originalPrice - product.price).toFixed(2)}
              </Badge>
            </div>

            <p className="text-gray-700 text-lg mb-6">{product.description}</p>

            {/* Quantity and Add to Cart */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-lg font-semibold">Quantity:</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-semibold text-lg min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= 10}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-4 mb-4">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    onClick={handleBuyNow}
                    disabled={paymentLoading}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {paymentLoading ? "Processing..." : "Buy Now"}
                  </Button>
                  {user && (
                    <Button 
                      variant="outline"
                      onClick={() => setShowChat(!showChat)}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat with Seller
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Product Details Tabs */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex space-x-4 mb-6 border-b">
                  <Button
                    variant={activeTab === "description" ? "default" : "ghost"}
                    onClick={() => setActiveTab("description")}
                    className="pb-2"
                  >
                    Description
                  </Button>
                  <Button
                    variant={activeTab === "features" ? "default" : "ghost"}
                    onClick={() => setActiveTab("features")}
                    className="pb-2"
                  >
                    Features
                  </Button>
                  <Button
                    variant={activeTab === "specifications" ? "default" : "ghost"}
                    onClick={() => setActiveTab("specifications")}
                    className="pb-2"
                  >
                    Specifications
                  </Button>
                  <Button
                    variant={activeTab === "analytics" ? "default" : "ghost"}
                    onClick={() => setActiveTab("analytics")}
                    className="pb-2"
                  >
                    Analytics
                  </Button>
                </div>

                {activeTab === "description" && (
                  <div>
                    <p className="text-gray-700">{product.description}</p>
                  </div>
                )}

                {activeTab === "features" && product.features && (
                  <ul className="space-y-2">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === "specifications" && product.specifications && (
                  <div className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span className="font-medium text-gray-700">{key}:</span>
                        <span className="text-gray-600">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "analytics" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <DataVisualization
                        title="Sales Trend (Last 6 Months)"
                        data={salesTrendData}
                        type="line"
                        colors={['#3B82F6']}
                      />
                      <DataVisualization
                        title="Rating Distribution"
                        data={ratingDistribution}
                        type="pie"
                        colors={['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#6B7280']}
                      />
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Product Stats</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Total Sales:</span>
                          <div className="font-bold text-lg">1,247</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Views:</span>
                          <div className="font-bold text-lg">15,892</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Added to Cart:</span>
                          <div className="font-bold text-lg">3,456</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Conversion Rate:</span>
                          <div className="font-bold text-lg">7.8%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <ProductComments 
            productId={id || ""} 
            userId={user?.id}
          />
        </div>

        {/* Chat System */}
        <ChatSystem
          currentUserId={user?.id}
          sellerId="mock-seller-id" // In a real app, this would come from the product
          productId={id}
          isVisible={showChat}
          onToggle={() => setShowChat(!showChat)}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
