import React, { useRef } from 'react';
import { Plus, Heart, Star, Eye } from 'lucide-react';
import { Product } from '../types';
import { ShareButtons } from './ShareButtons';
import { getProductImage } from '../utils/images';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onAddToCart,
  onToggleWishlist,
  onClick
}) => {
  const imageRef = useRef<HTMLImageElement>(null);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    const cartButton = document.getElementById('cart-button');
    const productImage = imageRef.current;

    if (cartButton && productImage) {
      const startRect = productImage.getBoundingClientRect();
      const endRect = cartButton.getBoundingClientRect();

      // Create clone for animation
      const flyingImage = productImage.cloneNode() as HTMLImageElement;

      // Initial styles (position over the original image)
      flyingImage.style.position = 'fixed';
      flyingImage.style.left = `${startRect.left}px`;
      flyingImage.style.top = `${startRect.top}px`;
      flyingImage.style.width = `${startRect.width}px`;
      flyingImage.style.height = `${startRect.height}px`;
      flyingImage.style.opacity = '0.8';
      flyingImage.style.zIndex = '50';
      flyingImage.style.pointerEvents = 'none';
      flyingImage.style.borderRadius = '12px';
      flyingImage.style.transition = 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
      flyingImage.style.objectFit = 'cover';

      document.body.appendChild(flyingImage);

      // Trigger reflow
      void flyingImage.offsetHeight;

      // End styles (target the center of the cart button)
      const targetX = endRect.left + (endRect.width / 2) - 10;
      const targetY = endRect.top + (endRect.height / 2) - 10;

      flyingImage.style.left = `${targetX}px`;
      flyingImage.style.top = `${targetY}px`;
      flyingImage.style.width = '20px';
      flyingImage.style.height = '20px';
      flyingImage.style.opacity = '0';
      flyingImage.style.transform = 'scale(0.1)';

      flyingImage.addEventListener('transitionend', () => {
        flyingImage.remove();
        onAddToCart(product);
      }, { once: true });
    } else {
      // Fallback if elements not found
      onAddToCart(product);
    }
  };

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full">
      <div
        className="aspect-[3/4] overflow-hidden bg-gray-100 cursor-pointer relative"
        onClick={() => onClick(product)}
      >
        <img
          ref={imageRef}
          src={getProductImage(product.name, product.category, product.image)}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

        {/* Wishlist Button - Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-red-500 transition-all duration-300 z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-sm"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Share Buttons - Top Left */}
        <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75">
          <ShareButtons product={product} size="sm" direction="col" />
        </div>

        {/* Quick View Button - Bottom Center */}
        <div className="absolute bottom-4 inset-x-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick(product);
            }}
            className="w-full py-2.5 bg-white/90 backdrop-blur-md text-gray-900 font-medium text-sm rounded-lg shadow-lg hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95"
          >
            <Eye className="h-4 w-4" />
            Quick View
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{product.category}</p>
          <h3
            className="text-base font-semibold text-gray-900 cursor-pointer hover:text-accent transition-colors"
            onClick={() => onClick(product)}
          >
            {product.name}
          </h3>

          {/* Product Tags */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100 text-[10px] font-medium text-gray-500 capitalize whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
          <span className="text-xs text-gray-400 ml-1">({product.reviews})</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            className="p-2 rounded-full bg-gray-50 text-gray-900 hover:bg-black hover:text-white transition-all duration-300 active:scale-95 shadow-sm"
            aria-label="Add to cart"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};