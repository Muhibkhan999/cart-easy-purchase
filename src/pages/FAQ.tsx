
import { Link } from "react-router-dom";
import { ShoppingCart, User, ChevronDown, Search, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";

const FAQ = () => {
  const { cartItems } = useCart();
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const [searchTerm, setSearchTerm] = useState("");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      category: "Orders & Shipping",
      questions: [
        {
          question: "How long does shipping take?",
          answer: "Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days. We also offer overnight shipping for urgent orders."
        },
        {
          question: "Do you offer free shipping?",
          answer: "Yes! We offer free standard shipping on all orders over $50. For orders under $50, shipping costs $5.99."
        },
        {
          question: "Can I track my order?",
          answer: "Absolutely! Once your order ships, you'll receive a tracking number via email. You can use this to track your package on our website or the carrier's website."
        },
        {
          question: "Can I change or cancel my order?",
          answer: "You can cancel or modify your order within 1 hour of placing it. After that, we may have already started processing it. Contact us immediately if you need to make changes."
        }
      ]
    },
    {
      category: "Returns & Exchanges",
      questions: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy for most items. Products must be in original condition with tags attached. Some exceptions apply for personalized or hygiene-related items."
        },
        {
          question: "How do I return an item?",
          answer: "You can initiate a return through your account dashboard or by contacting our customer service. We'll provide you with a prepaid return label for your convenience."
        },
        {
          question: "When will I receive my refund?",
          answer: "Refunds are processed within 3-5 business days after we receive your returned item. The refund will appear on your original payment method within 5-10 business days."
        }
      ]
    },
    {
      category: "Products & Quality",
      questions: [
        {
          question: "Are your products authentic?",
          answer: "Yes, all our products are 100% authentic. We work directly with manufacturers and authorized distributors to ensure product authenticity."
        },
        {
          question: "Do you offer warranties?",
          answer: "Many of our products come with manufacturer warranties. Additionally, we offer our own quality guarantee on all items. Warranty details are listed on each product page."
        },
        {
          question: "How do you ensure product quality?",
          answer: "Every product goes through our quality inspection process before shipping. We also carefully vet all our suppliers and regularly audit our inventory."
        }
      ]
    },
    {
      category: "Account & Payment",
      questions: [
        {
          question: "Do I need an account to make a purchase?",
          answer: "While you can checkout as a guest, creating an account allows you to track orders, save favorites, and enjoy faster checkout for future purchases."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and Shop Pay."
        },
        {
          question: "Is my payment information secure?",
          answer: "Yes, we use industry-standard SSL encryption and are PCI DSS compliant. Your payment information is never stored on our servers."
        }
      ]
    }
  ];

  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

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

      {/* FAQ Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Find answers to common questions about ShopHub. Can't find what you're looking for? 
            <Link to="/contact" className="text-blue-600 hover:underline ml-1">Contact us directly</Link>.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search FAQs..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </section>

        {/* FAQ Categories */}
        <section>
          {filteredFAQs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <HelpCircle className="h-6 w-6 mr-3 text-blue-600" />
                {category.category}
              </h2>
              
              <div className="space-y-4">
                {category.questions.map((faq, faqIndex) => {
                  const globalIndex = categoryIndex * 100 + faqIndex;
                  return (
                    <Card key={faqIndex} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardContent className="p-0">
                        <button
                          className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                          onClick={() => setOpenFAQ(openFAQ === globalIndex ? null : globalIndex)}
                        >
                          <h3 className="text-lg font-semibold text-gray-800 pr-4">
                            {faq.question}
                          </h3>
                          <ChevronDown 
                            className={`h-5 w-5 text-gray-500 transform transition-transform ${
                              openFAQ === globalIndex ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        
                        {openFAQ === globalIndex && (
                          <div className="px-6 pb-6 border-t border-gray-100">
                            <p className="text-gray-600 leading-relaxed pt-4">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* Still Need Help */}
        <section className="text-center mt-16">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
              <p className="mb-6 text-blue-100">
                Our customer support team is here to help you with any questions or concerns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Contact Support
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Live Chat
                </Button>
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

export default FAQ;
