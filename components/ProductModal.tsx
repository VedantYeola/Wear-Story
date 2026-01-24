import React, { useEffect, useState } from 'react';
import { X, Check, Heart, Sparkles, Star } from 'lucide-react';
import { Product } from '../types';
import { Button } from './Button';
import { generateProductStyling } from '../services/geminiService';
import { PRODUCTS } from '../constants';
import { ShareButtons } from './ShareButtons';

interface ProductModalProps {
  product: Product | null;
  isWishlisted: boolean;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ 
  product, 
  isWishlisted, 
  isOpen, 
  onClose, 
  onAddToCart,
  onToggleWishlist 
}) => {
  const [stylingSuggestion, setStylingSuggestion] = useState<string>('');
  const [loadingStyling, setLoadingStyling] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      setLoadingStyling(true);
      setStylingSuggestion('');
      
      const fetchStyling = async () => {
        const suggestion = await generateProductStyling(product, PRODUCTS);
        setStylingSuggestion(suggestion);
        setLoadingStyling(false);
      };

      // Add a small delay for smoother UX so it doesn't flash instantly if cached
      const timer = setTimeout(fetchStyling, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/60 transition-opacity" 
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Panel */}
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl opacity-100 scale-100">
          <button 
            className="absolute right-4 top-4 z-10 p-2 rounded-full bg-white/50 hover:bg-white text-gray-500 hover:text-gray-900 transition-colors"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Side */}
            <div className="relative aspect-square md:aspect-auto h-64 md:h-auto bg-gray-100">
              <img 
                src={product.image} 
                alt={product.name} 
                className="h-full w-full object-cover"
              />
            </div>

            {/* Content Side */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <span className="text-sm font-medium text-accent uppercase tracking-widest mb-2">{product.category}</span>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">{product.name}</h2>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 font-medium">{product.rating}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-500 underline decoration-gray-300 underline-offset-2">{product.reviews} Reviews</span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">In Stock</span>
              </div>
              
              <div className="prose prose-sm text-gray-500 mb-6">
                <p>{product.description}</p>
              </div>

              {/* AI Styling Section */}
              <div className="mb-8 p-5 bg-accent/5 rounded-xl border border-accent/10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1 bg-white rounded-full shadow-sm">
                    <Sparkles className="h-3 w-3 text-accent" />
                  </div>
                  <h4 className="font-serif font-bold text-gray-900 text-sm">Lumi's Style Note</h4>
                </div>
                
                {loadingStyling ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-2 bg-gray-200 rounded w-full"></div>
                    <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-2 bg-gray-200 rounded w-4/6"></div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 leading-relaxed italic">
                    "{stylingSuggestion || "Loading style advice..."}"
                  </p>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Highlights</h4>
                  <ul className="space-y-2">
                    {product.tags.map((tag) => (
                      <li key={tag} className="flex items-center text-sm text-gray-600">
                        <Check className="h-4 w-4 text-accent mr-2" />
                        <span className="capitalize">{tag}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-gray-100 space-y-4">
                  <div className="flex gap-4">
                    <Button 
                      onClick={() => {
                        onAddToCart(product);
                        onClose();
                      }}
                      className="flex-1"
                      size="lg"
                    >
                      Add to Bag - ${product.price.toFixed(2)}
                    </Button>
                    <button
                      onClick={() => onToggleWishlist(product)}
                      className={`p-3 rounded-lg border transition-colors ${
                        isWishlisted 
                          ? 'border-red-200 bg-red-50 text-red-500' 
                          : 'border-gray-300 hover:border-gray-400 text-gray-600'
                      }`}
                      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <ShareButtons product={product} showLabel />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};