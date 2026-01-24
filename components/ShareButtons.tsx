import React from 'react';
import { Facebook, Twitter, Share2 } from 'lucide-react';
import { Product } from '../types';

interface ShareButtonsProps {
  product: Product;
  size?: 'sm' | 'md';
  className?: string;
  direction?: 'row' | 'col';
  showLabel?: boolean;
}

const PinterestIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.017 0C5.396 0 0.029 5.367 0.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.487-.695-2.419-2.873-2.419-4.628 0-3.772 2.747-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z"/>
  </svg>
);

export const ShareButtons: React.FC<ShareButtonsProps> = ({ 
  product, 
  size = 'md', 
  className = '',
  direction = 'row',
  showLabel = false
}) => {
  const shareUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '';
  const shareText = encodeURIComponent(`Check out ${product.name} on Lumina Mode!`);
  const shareImage = encodeURIComponent(product.image);

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      color: 'hover:text-[#1877F2] hover:bg-[#1877F2]/10',
      fill: 'currentColor'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`,
      color: 'hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10',
      fill: 'currentColor'
    },
    {
      name: 'Pinterest',
      icon: PinterestIcon,
      url: `https://pinterest.com/pin/create/button/?url=${shareUrl}&media=${shareImage}&description=${shareText}`,
      color: 'hover:text-[#E60023] hover:bg-[#E60023]/10',
      fill: 'currentColor'
    }
  ];

  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  const buttonPadding = size === 'sm' ? 'p-1.5' : 'p-2';

  return (
    <div className={`flex ${direction === 'row' ? 'gap-2 items-center' : 'flex-col gap-2'} ${className}`}>
      {showLabel && <span className="text-sm font-medium text-gray-500 mr-2">Share:</span>}
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`${buttonPadding} rounded-full bg-white/80 backdrop-blur-sm text-gray-600 transition-all duration-300 transform hover:scale-110 shadow-sm border border-gray-100/50 ${social.color}`}
          title={`Share on ${social.name}`}
        >
          <social.icon className={`${iconSize}`} />
        </a>
      ))}
    </div>
  );
};