'use client';

import React, { useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShoppingBag,
  Heart,
  Eye,
} from 'lucide-react';
import { MEHERBAN_PRODUCTS } from '@/lib/meherbanData';
import { useMeherban } from '@/context/MeherbanContext';
import { MeherbanProduct } from '@/types/meherban';

export const MeherbanTrending: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { addToCart, toggleWishlist, isWishlisted, openQuickView } = useMeherban();

  const [selectedColors, setSelectedColors] = useState<{ [productId: string]: string }>({});

  const handleColorClick = (
    e: React.MouseEvent,
    productId: string,
    colorName: string
  ) => {
    e.stopPropagation();
    setSelectedColors((prev) => ({ ...prev, [productId]: colorName }));
  };

  const handleAddToCartClick = (e: React.MouseEvent, product: MeherbanProduct) => {
    e.stopPropagation();
    const chosenColor = selectedColors[product.id] || product.colorSwatches[0]?.name;
    addToCart(product, product.sizes[0], chosenColor, 1);
  };

  const handleWishlistClick = (e: React.MouseEvent, product: MeherbanProduct) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section id="trending" className="py-12 sm:py-16 bg-white text-neutral-900 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-neutral-400 block mb-1">
              FEATURED PRODUCTS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-neutral-950">
              TRENDING NOW
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#trending"
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium uppercase tracking-wider text-neutral-600 hover:text-black transition-colors"
            >
              <span>VIEW ALL</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </a>

            <div className="hidden sm:flex items-center gap-1.5 ml-3">
              <button
                type="button"
                onClick={scrollLeft}
                className="w-8 h-8 rounded-full border border-neutral-200 hover:border-black flex items-center justify-center text-neutral-600 hover:text-black transition-colors"
                aria-label="Previous Products"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={scrollRight}
                className="w-8 h-8 rounded-full border border-neutral-200 hover:border-black flex items-center justify-center text-neutral-600 hover:text-black transition-colors"
                aria-label="Next Products"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 pt-1 snap-x snap-mandatory"
        >
          {MEHERBAN_PRODUCTS.map((product) => {
            const isSaved = isWishlisted(product.id);
            const activeColor =
              selectedColors[product.id] || product.colorSwatches[0]?.name;

            return (
              <div
                key={product.id}
                onClick={() => openQuickView(product)}
                className="group relative flex-none w-[165px] sm:w-[200px] lg:w-[220px] snap-start flex flex-col justify-between cursor-pointer transition-all duration-300"
              >
                <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#F3F2EE] border border-neutral-200/50 p-2 sm:p-3 flex items-center justify-center transition-all duration-300 group-hover:shadow-md">
                  {product.badge && (
                    <span className="absolute top-2 left-2 z-10 px-1.5 py-0.5 bg-black text-white text-[9px] font-semibold tracking-wider uppercase rounded-xs">
                      {product.badge}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={(e) => handleWishlistClick(e, product)}
                    className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-neutral-800 flex items-center justify-center shadow-xs transition-colors"
                    aria-label="Save to Wishlist"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isSaved ? 'fill-red-500 text-red-500' : 'text-neutral-700'
                      }`}
                    />
                  </button>

                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-contain object-center transform transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  <div className="hidden lg:flex absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center">
                    <span className="inline-flex items-center gap-1 bg-white/95 text-neutral-900 text-[11px] font-medium px-3 py-1.5 rounded-full shadow-md">
                      <Eye className="w-3.5 h-3.5" />
                      Quick View
                    </span>
                  </div>
                </div>

                <div className="pt-3 pb-1 flex flex-col space-y-1">
                  <h3 className="text-xs sm:text-sm font-medium text-neutral-900 tracking-tight line-clamp-1 group-hover:text-black">
                    {product.title}
                  </h3>

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-neutral-950 font-sans">
                      ৳ {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
                        ৳ {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      {product.colorSwatches.map((swatch) => {
                        const isColorActive = activeColor === swatch.name;
                        return (
                          <button
                            key={swatch.name}
                            type="button"
                            onClick={(e) => handleColorClick(e, product.id, swatch.name)}
                            title={swatch.name}
                            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border transition-all ${
                              isColorActive
                                ? 'ring-1.5 ring-neutral-950 ring-offset-1 scale-110'
                                : 'border-neutral-300 hover:scale-105'
                            }`}
                            style={{ backgroundColor: swatch.hex }}
                          />
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleAddToCartClick(e, product)}
                      className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-950 text-neutral-700 hover:text-white transition-all flex items-center justify-center shadow-xs"
                      aria-label="Add to cart"
                      title="Add to cart"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 stroke-[1.8]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
