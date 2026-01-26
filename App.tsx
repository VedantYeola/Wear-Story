import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from './services/supabase';
import { generateStylistResponse, matchCategoryWithAI } from './services/geminiService';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AiStylist } from './components/AiStylist';
import { Hero } from './components/Hero';
import { ProductModal } from './components/ProductModal';
import { PRODUCTS } from './constants';
import { Product, CartItem } from './types';
import { Filter, ChevronDown, SlidersHorizontal, Search, Sparkles } from 'lucide-react';
import { CheckoutModal } from './components/CheckoutModal';
import { Logo } from './components/Logo';

import { AdminPanel } from './components/AdminPanel';

import { ClerkProvider, useUser } from '@clerk/clerk-react';
import { logUserAction } from './services/loggingService';

import { BrandLoginPage } from './components/BrandLoginPage';

// Main Store Logic - Decoupled from Auth Provider
function Store({ user, isAuthEnabled = false }: { user: any, isAuthEnabled?: boolean }) {
  // Default to Login Page if Auth is enabled and user is not logged in
  const [currentView, setCurrentView] = useState<'store' | 'brand_login' | 'about' | 'collections' | 'contact' | 'privacy'>(
    (isAuthEnabled && !user) ? 'brand_login' : 'store'
  );
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  // Sort and Filter State
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // ... (keep useEffects the same) ...
  // Load cart and wishlist from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('weare-story-cart');
    const savedWishlist = localStorage.getItem('weare-story-wishlist');

    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) { console.error("Failed to parse cart", e); }
    }

    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (e) { console.error("Failed to parse wishlist", e); }
    }
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('weare-story-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('weare-story-wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Fetch products from Supabase & Subscribe to Realtime changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: true }); // Ensure stable order

        if (error) {
          console.warn('Supabase fetch error:', error.message);
        } else if (data) {
          setProducts(data as Product[]);
        }
      } catch (err) {
        console.error('Unexpected error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchProducts();

    // Subscribe to changes
    const subscription = supabase
      .channel('public:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        console.log('Realtime update received!');
        fetchProducts();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ... (keep useMemos the same) ...
  // Derive categories from products
  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(products.map(p => p.category)))];
  }, [products]);

  // Filter and Sort Products
  const displayedProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [activeCategory, sortBy, searchQuery, products]);

  // ... (keep handlers the same) ...
  const addToCart = (product: Product) => {
    logUserAction('ADD_TO_CART', { productId: product.id, name: product.name, price: product.price }, user);
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const toggleWishlist = (product: Product) => {
    setWishlistItems(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        logUserAction('REMOVE_FROM_WISHLIST', { productId: product.id }, user);
        return prev.filter(item => item.id !== product.id);
      }
      logUserAction('ADD_TO_WISHLIST', { productId: product.id }, user);
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id: number) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  const isWishlisted = (id: number) => wishlistItems.some(item => item.id === id);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleProductClick = (product: Product) => {
    logUserAction('VIEW_PRODUCT', { productId: product.id, name: product.name }, user);
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const handleCheckout = () => {
    logUserAction('INITIATE_CHECKOUT', { amount: cartTotal, itemsCount: cartItems.length }, user);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const onPaymentSuccess = (paymentDetails?: any) => {
    logUserAction('PURCHASE_SUCCESS', {
      amount: cartTotal,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      transactionId: paymentDetails?.transactionId || null
    }, user);
    setCartItems([]);
  };

  const scrollToProducts = () => {
    const element = document.getElementById('products-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // Effect to switch back to store if user logs in while on login page
  useEffect(() => {
    if (user && currentView === 'brand_login') {
      setCurrentView('store');
    }
  }, [user]);

  if (isAdminOpen) {
    return <AdminPanel onBack={() => setIsAdminOpen(false)} />;
  }

  if (currentView === 'brand_login') {
    return <BrandLoginPage onBack={() => setCurrentView('store')} />;
  }

  // About Page
  if (currentView === 'about') {
    return (
      <div className="min-h-screen bg-white">
        <Navbar cartItems={cartItems} wishlistCount={wishlistItems.length} onOpenCart={() => setIsCartOpen(true)} onOpenWishlist={() => setIsWishlistOpen(true)} onOpenAi={() => setIsAiOpen(!isAiOpen)} onGoHome={() => setCurrentView('store')} onSignInClick={() => setCurrentView('brand_login')} enableAuth={isAuthEnabled} onNavigate={setCurrentView} />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-serif font-bold mb-8">
            About {' '}
            <span className="inline-block">
              {'Wear-Story.'.split('').map((char, index) => {
                if (char === '-') {
                  return (
                    <span
                      key={index}
                      className="text-accent inline-block mx-1"
                      style={{
                        fontSize: '0.7em',
                        transform: 'translateY(-0.15em) rotate(-10deg)',
                        fontFamily: 'serif'
                      }}
                    >
                      ~
                    </span>
                  );
                } else if (char === '.') {
                  return (
                    <span
                      key={index}
                      className="inline-flex items-center justify-center bg-accent rounded-full"
                      style={{
                        width: '0.15em',
                        height: '0.15em',
                        marginLeft: '0.1em',
                        marginRight: '0.1em'
                      }}
                    ></span>
                  );
                } else {
                  return <span key={index}>{char}</span>;
                }
              })}
            </span>
          </h1>
          <div className="prose prose-lg">
            <p className="text-gray-600 leading-relaxed mb-6">
              Wear~Story is more than just a fashion brand—it's a celebration of individuality and self-expression. Founded with the belief that every person has a unique story to tell, we curate timeless pieces that empower you to wear your narrative with confidence.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our collections blend classic elegance with contemporary design, ensuring that each garment not only looks exceptional but feels extraordinary. From sustainable sourcing to meticulous craftsmanship, we're committed to quality that lasts.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Join us in redefining fashion—one story at a time.
            </p>
          </div>
          <button onClick={() => setCurrentView('store')} className="mt-8 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  // Collections Page
  if (currentView === 'collections') {
    return (
      <div className="min-h-screen bg-white">
        <Navbar cartItems={cartItems} wishlistCount={wishlistItems.length} onOpenCart={() => setIsCartOpen(true)} onOpenWishlist={() => setIsWishlistOpen(true)} onOpenAi={() => setIsAiOpen(!isAiOpen)} onGoHome={() => setCurrentView('store')} onSignInClick={() => setCurrentView('brand_login')} enableAuth={isAuthEnabled} onNavigate={setCurrentView} />
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-serif font-bold mb-12 text-center">Our Collections</h1>
          <div className="grid md:grid-cols-2 gap-8">
            {categories.filter(c => c !== 'All').map(category => (
              <div key={category} className="group cursor-pointer" onClick={() => { setActiveCategory(category); setCurrentView('store'); }}>
                <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-4">
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-2">{category}</h3>
                <p className="text-gray-600">Explore our {category.toLowerCase()} collection</p>
              </div>
            ))}
          </div>
          <button onClick={() => setCurrentView('store')} className="mt-12 mx-auto block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  // Contact Page
  if (currentView === 'contact') {
    return (
      <div className="min-h-screen bg-white">
        <Navbar cartItems={cartItems} wishlistCount={wishlistItems.length} onOpenCart={() => setIsCartOpen(true)} onOpenWishlist={() => setIsWishlistOpen(true)} onOpenAi={() => setIsAiOpen(!isAiOpen)} onGoHome={() => setCurrentView('store')} onSignInClick={() => setCurrentView('brand_login')} enableAuth={isAuthEnabled} onNavigate={setCurrentView} />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-serif font-bold mb-8">Contact Us</h1>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
              <div className="space-y-4 text-gray-600">
                <p><strong>Email:</strong> hello@wearstory.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Address:</strong> 123 Fashion Ave, New York, NY 10001</p>
                <p><strong>Hours:</strong> Mon-Fri 9AM-6PM EST</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Send a Message</h3>
              <form className="space-y-4">
                <input type="text" placeholder="Your Name" className="w-full px-4 py-2 border rounded-lg" />
                <input type="email" placeholder="Your Email" className="w-full px-4 py-2 border rounded-lg" />
                <textarea placeholder="Your Message" rows={4} className="w-full px-4 py-2 border rounded-lg"></textarea>
                <button type="submit" className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                  Send Message
                </button>
              </form>
            </div>
          </div>
          <button onClick={() => setCurrentView('store')} className="mt-8 px-6 py-3 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors">
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  // Privacy Page
  if (currentView === 'privacy') {
    return (
      <div className="min-h-screen bg-white">
        <Navbar cartItems={cartItems} wishlistCount={wishlistItems.length} onOpenCart={() => setIsCartOpen(true)} onOpenWishlist={() => setIsWishlistOpen(true)} onOpenAi={() => setIsAiOpen(!isAiOpen)} onGoHome={() => setCurrentView('store')} onSignInClick={() => setCurrentView('brand_login')} enableAuth={isAuthEnabled} onNavigate={setCurrentView} />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-serif font-bold mb-8">Privacy Policies</h1>
          <div className="prose prose-lg space-y-6 text-gray-600">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
              <p>Wear-Story collects information you provide directly to us, including name, email address, and payment information when you make a purchase.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
              <p>Wear-Story uses the information we collect to process your orders, communicate with you, and improve our services.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
              <p>Wear-Story implements appropriate security measures to protect your personal information. Payment details are processed securely and we never store full credit card information.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal information. Contact Wear-Story at privacy@wearstory.com for any requests.</p>
            </section>
          </div>
          <button onClick={() => setCurrentView('store')} className="mt-8 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        cartItems={cartItems}
        wishlistCount={wishlistItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAi={() => setIsAiOpen(!isAiOpen)}
        onGoHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onSignInClick={() => setCurrentView('brand_login')}
        enableAuth={isAuthEnabled}
        onNavigate={setCurrentView}
      />

      <main>
        <Hero onShopNow={scrollToProducts} />

        <section id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Curated Collection</h2>
            <p className="text-gray-500 leading-relaxed">
              Explore our latest arrivals, designed to elevate your everyday style with timeless elegance and premium quality.
            </p>
          </div>

          {/* Sticky Filter & Sort Bar */}
          <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md shadow-sm border border-gray-100 rounded-xl px-4 py-3 mb-10 transition-all">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">

              {/* Search Bar */}
              <div className="relative w-full md:w-96 order-1 md:order-none">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.currentTarget.blur();
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black focus:border-black transition-colors"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>

              {/* Category Filter Dropdown */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors w-full sm:w-auto cursor-pointer group">
                  <Filter className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Category:</span>
                  <div className="relative flex-1 sm:flex-none">
                    <select
                      value={activeCategory}
                      onChange={(e) => setActiveCategory(e.target.value)}
                      className="w-full sm:w-auto appearance-none bg-transparent border-none text-sm font-semibold text-gray-900 focus:ring-0 cursor-pointer pr-8 py-0 pl-1"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Result Count (Mobile) */}
                <span className="text-xs text-gray-400 sm:hidden whitespace-nowrap">
                  {displayedProducts.length} items
                </span>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                <span className="text-sm text-gray-500 hidden sm:block">
                  {displayedProducts.length} Products Found
                </span>
                <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors w-full sm:w-auto cursor-pointer group">
                  <SlidersHorizontal className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort:</span>
                  <div className="relative flex-1 sm:flex-none">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full sm:w-auto appearance-none bg-transparent border-none text-sm font-semibold text-gray-900 focus:ring-0 cursor-pointer pr-8 py-0 pl-1"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 xl:gap-x-8 min-h-[400px]">
            {displayedProducts.length > 0 ? (
              displayedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={isWishlisted(product.id)}
                  onAddToCart={addToCart}
                  onToggleWishlist={toggleWishlist}
                  onClick={handleProductClick}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center text-center py-20 text-gray-500">
                <p className="text-lg font-medium text-gray-900 mb-2">No products found</p>
                <p className="text-sm text-gray-500 mb-6">Try changing the category or filter options.</p>
                <button
                  onClick={() => setActiveCategory('All')}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  View all products
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Brand Values / Footer Pre-roll */}
        <section className="bg-gray-50 py-16 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Sustainable Sourcing</h3>
                <p className="text-gray-500 text-sm">We ensure all our materials are ethically sourced and environmentally friendly.</p>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Express Shipping</h3>
                <p className="text-gray-500 text-sm">Free next-day delivery on all orders over $200. Worldwide shipping available.</p>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Personal Styling</h3>
                <p className="text-gray-500 text-sm">Use our AI stylist 'Lumi' to find the perfect look for any occasion.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Overlays */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        totalAmount={cartTotal}
        onPaymentSuccess={onPaymentSuccess}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlistItems}
        onRemove={removeFromWishlist}
        onAddToCart={addToCart}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={selectedProduct}
        isWishlisted={selectedProduct ? isWishlisted(selectedProduct.id) : false}
        onAddToCart={addToCart}
        onToggleWishlist={toggleWishlist}
      />

      <AiStylist
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        products={products}
      />

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-white/10 p-1.5 rounded-lg">
                  <Logo className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-serif font-bold">
                  {'Wear-Story.'.split('').map((char, index) => {
                    if (char === '-') {
                      return (
                        <span
                          key={index}
                          className="text-accent inline-block mx-1"
                          style={{
                            fontSize: '0.7em',
                            transform: 'translateY(-0.15em) rotate(-10deg)',
                            fontFamily: 'serif'
                          }}
                        >
                          ~
                        </span>
                      );
                    } else if (char === '.') {
                      return (
                        <span
                          key={index}
                          className="inline-flex items-center justify-center bg-accent rounded-full"
                          style={{
                            width: '0.15em',
                            height: '0.15em',
                            marginLeft: '0.1em',
                            marginRight: '0.1em'
                          }}
                        ></span>
                      );
                    } else {
                      return <span key={index}>{char}</span>;
                    }
                  })}
                </span>
              </div>
              <p className="text-gray-400 text-sm">Wear Your Story.</p>
            </div>
            <div className="flex gap-8 text-sm text-gray-400">
              <button onClick={() => setCurrentView('about')} className="hover:text-white transition-colors">About</button>
              <button onClick={() => setCurrentView('collections')} className="hover:text-white transition-colors">Collections</button>
              <button onClick={() => setCurrentView('contact')} className="hover:text-white transition-colors">Contact</button>
              <button onClick={() => setCurrentView('privacy')} className="hover:text-white transition-colors">Privacy</button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-xs text-gray-500 flex flex-col items-center gap-2">
            <p>&copy; 2024 Wear-Story Inc. All rights reserved.</p>
            <button onClick={() => setIsAdminOpen(true)} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 mt-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold">Admin Panel</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Wrapper component to extract user context safely
function ClerkStoreWrapper() {
  const { user } = useUser();
  // We can assume auth is enabled since we are wrapped in ClerkProvider in index.tsx
  return <Store user={user} isAuthEnabled={true} />;
}

export default ClerkStoreWrapper;