import React from 'react';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { Button } from './Button';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemove: (id: number) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemove,
  onAddToCart
}) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-serif font-bold text-gray-900">Your Wishlist</h2>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">❤️</span>
                </div>
                <p className="text-gray-500">Your wishlist is empty.</p>
                <Button variant="outline" onClick={onClose}>Continue Shopping</Button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm font-bold text-gray-900 mt-1">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                       <Button 
                         variant="primary" 
                         size="sm" 
                         className="flex-1 text-xs"
                         onClick={() => {
                           onAddToCart(item);
                           onRemove(item.id);
                         }}
                       >
                         <ShoppingBag className="h-3 w-3 mr-1" /> Add to Cart
                       </Button>
                       <button 
                          onClick={() => onRemove(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 border border-gray-200 rounded-lg transition-colors"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};