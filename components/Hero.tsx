import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface HeroProps {
  onShopNow: () => void;
}

const SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    title: "Every Outfit Tells a Story.",
    description: "Fashion is more than just fabric—it's a narrative. Define your chapter with our curated collection of premium essentials.",
    cta: "Shop Collection"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    title: "50% Off on Elegant Dresses.",
    description: "Limited time offer. Discover timeless elegance for your next special occasion at half the price.",
    cta: "View Dresses"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    title: "Coats & Jackets Season.",
    description: "Stay warm in style with our premium outerwear collection. Up to 30% off on selected items.",
    cta: "Shop Outerwear"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    title: "Step Up Your Game.",
    description: "Exclusive deals on premium footwear. Find your perfect pair today with specific discounts.",
    cta: "Shop Footwear"
  }
];

export const Hero: React.FC<HeroProps> = ({ onShopNow }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  return (
    <div className="relative bg-gray-900 overflow-hidden h-[calc(100vh-4rem)] sm:h-[600px] group">
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover opacity-60 scale-105 transition-transform duration-[10s]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
            <div className="max-w-2xl transform transition-all duration-700 translate-y-0 opacity-100 mt-[-2rem] sm:mt-0">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight mb-6 leading-tight drop-shadow-md">
                {slide.title}
              </h1>
              <p className="text-lg sm:text-xl text-gray-100 mb-10 max-w-xl font-light leading-relaxed drop-shadow">
                {slide.description}
              </p>
              <div className="flex gap-4">
                <Button onClick={onShopNow} size="lg" className="bg-white !text-black hover:bg-gray-100 border-none font-bold shadow-lg w-full sm:w-auto">
                  {slide.cta} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons and Dots Removed for cleaner look */}
    </div>
  );
};
