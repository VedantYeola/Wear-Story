import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, Sparkles, Heart } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { CartItem } from '../types';
import { Logo } from './Logo';

interface NavbarProps {
  cartItems: CartItem[];
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAi: () => void;
  onGoHome: () => void;
  onSignInClick?: () => void;
  enableAuth?: boolean;
  onNavigate?: (view: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartItems,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAi,
  onGoHome,
  onSignInClick,
  enableAuth = false,
  onNavigate
}) => {
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const brandName = "Wear-Story.";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (currentIndex < brandName.length) {
      const timeout = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 80);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  const navLinks = [
    { name: 'Home', action: onGoHome },
    { name: 'Collections', action: () => { /* Needs prop */ } }, // Placeholder, handled in App.tsx wrapper if needed, or simple redirect? 
    // Actually, simplifying: better to just have the menu toggle and maybe expose onNavigate in props later.
    // For now, I'll stick to 'Home' and maybe 'About' if I can hack it, but for robust design I need to update App.tsx to pass onNavigate.
    // Let's assume onNavigate is passed in updated props below.
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={onGoHome}
              className="flex items-center gap-2 group"
            >
              <div className="bg-black text-white p-1.5 rounded-lg group-hover:bg-accent transition-colors">
                <Logo className="h-5 w-5" />
              </div>
              <span className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
                {brandName.split('').map((char, index) => {
                  if (char === '-') {
                    return (
                      <span
                        key={index}
                        className="text-accent inline-block mx-1"
                        style={{
                          opacity: index < currentIndex ? 1 : 0,
                          transition: 'opacity 0.2s ease',
                          fontSize: '0.7em',
                          transform: index < currentIndex ? 'translateY(-0.15em) rotate(-10deg)' : undefined,
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
                          opacity: index < currentIndex ? 1 : 0,
                          transition: 'opacity 0.2s ease',
                          width: '0.15em',
                          height: '0.15em',
                          marginLeft: '0.1em',
                          marginRight: '0.1em'
                        }}
                      ></span>
                    );
                  } else {
                    return (
                      <span
                        key={index}
                        className="inline-block"
                        style={{
                          opacity: index < currentIndex ? 1 : 0,
                          transition: 'opacity 0.2s ease'
                        }}
                      >
                        {char}
                      </span>
                    );
                  }
                })}
              </span>
            </button>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-6">
            <button
              onClick={onOpenAi}
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20"
            >
              <Sparkles className="h-4 w-4" />
              Ask Stylist
            </button>

            <button
              onClick={onOpenAi}
              className="sm:hidden p-2 text-accent hover:bg-accent/10 rounded-full"
              aria-label="AI Stylist"
            >
              <Sparkles className="h-5 w-5" />
            </button>

            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Open wishlist"
            >
              <Heart className="h-6 w-6" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full min-w-[1rem]">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              id="cart-button"
              onClick={onOpenCart}
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-black rounded-full min-w-[1.25rem]">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Clerk Authentication UI - Only render if Auth is enabled */}
            {enableAuth && (
              <div className="flex items-center ml-2">
                <SignedOut>
                  <button
                    onClick={onSignInClick}
                    className="text-sm font-medium bg-black text-white hover:bg-gray-800 transition-colors rounded-full px-5 py-2 shadow-sm"
                  >
                    Sign In
                  </button>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>
            )}

            <button
              className="sm:hidden p-2 text-gray-600 hover:text-black z-50 relative"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <div className="h-6 w-6 flex items-center justify-center">✕</div> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 bg-white z-40 sm:hidden animate-in slide-in-from-top-5 duration-200 border-t border-gray-100 flex flex-col p-6 space-y-6">
          <div className="space-y-4">
            <button onClick={() => { if (onNavigate) onNavigate('store'); setIsMenuOpen(false); }} className="w-full text-left text-2xl font-serif font-bold text-gray-900 py-2 border-b border-gray-100">Home</button>
            <button onClick={() => { if (onNavigate) onNavigate('collections'); setIsMenuOpen(false); }} className="w-full text-left text-2xl font-serif font-bold text-gray-900 py-2 border-b border-gray-100">Collections</button>
            <button onClick={() => { if (onNavigate) onNavigate('about'); setIsMenuOpen(false); }} className="w-full text-left text-2xl font-serif font-bold text-gray-900 py-2 border-b border-gray-100">About</button>
            <button onClick={() => { if (onNavigate) onNavigate('contact'); setIsMenuOpen(false); }} className="w-full text-left text-2xl font-serif font-bold text-gray-900 py-2 border-b border-gray-100">Contact</button>
            <button onClick={() => { onOpenAi(); setIsMenuOpen(false); }} className="w-full text-left text-2xl font-serif font-bold text-accent py-2 border-b border-gray-100 flex items-center gap-2"><Sparkles className="h-5 w-5" /> AI Stylist</button>
            {/* These below would ideally effectively navigate. For now, we simulate 'Home' as the main nav. 
                Full navigation requires App.tsx refactor to pass specific handlers. 
                I will add visual placeholders that close the menu for now to 'simulate' response. 
            */}
          </div>

          <div className="mt-auto">
            <p className="text-gray-400 text-sm mb-4">Wear Your Story.</p>
            <div className="flex gap-4">
              {/* Social placeholders */}
              <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};