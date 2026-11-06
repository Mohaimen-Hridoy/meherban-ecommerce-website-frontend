'use client';

import React, { useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShoppingBag,
  Heart,
  Eye,
  Zap,
} from 'lucide-react';
import { useMeherban } from '@/context/MeherbanContext';
import { MeherbanProduct } from '@/types/meherban';

export const MeherbanTrending: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const {
    products,
    addToCart,
    directBuyNow,
    toggleWishlist,
    isWishlisted,
    openQuickView,
    activeCategory,
  } = useMeherban();

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
    const swatch = product.colorSwatches.find((c) => c.name === chosenColor);
    if (!product.inStock || (swatch && swatch.inStock === false)) return;
    addToCart(product, product.sizes[0], chosenColor, 1);
  };

  const handleBuyNowClick = (e: React.MouseEvent, product: MeherbanProduct) => {
    e.stopPropagation();
    const chosenColor = selectedColors[product.id] || product.colorSwatches[0]?.name;
    const swatch = product.colorSwatches.find((c) => c.name === chosenColor);
    if (!product.inStock || (swatch && swatch.inStock === false)) return;
    directBuyNow(product, product.sizes[0], chosenColor, 1);
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

  // Filter products according to activeCategory if selected, else show trending & featured
  const displayedProducts = products.filter((p) => {
    if (activeCategory === 'Home' || activeCategory === 'All') return true;
    return p.categoryName.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <section id="trending" className="py-10 sm:py-16 bg-white text-neutral-900 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-neutral-400 block mb-1">
              {activeCategory !== 'Home' ? `${activeCategory} COLLECTION` : 'FEATURED APPAREL & ACCESSORIES'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-neutral-950">
              {activeCategory !== 'Home' ? `${activeCategory} PICKS` : 'TRENDING NOW'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-500 font-medium">
              {displayedProducts.length} items
            </span>

            {/* Desktop Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-1.5 ml-2">
              <button
                type="button"
                onClick={scrollLeft}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-neutral-300 hover:border-black flex items-center justify-center text-neutral-600 hover:text-black transition-colors"
                aria-label="Previous Products"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={scrollRight}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-neutral-300 hover:border-black flex items-center justify-center text-neutral-600 hover:text-black transition-colors"
                aria-label="Next Products"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 
          Horizontal Scrollable Row of Product Cards
        */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-4 pt-1 snap-x snap-mandatory"
        >
          {displayedProducts.map((product) => {
            const isSaved = isWishlisted(product.id);
            const activeColor =
              selectedColors[product.id] || product.colorSwatches[0]?.name;
            const activeSwatch = product.colorSwatches.find((c) => c.name === activeColor);
            const isSwatchAvailable = activeSwatch
              ? activeSwatch.inStock !== false &&
                (activeSwatch.stockQuantity === undefined || activeSwatch.stockQuantity > 0)
              : true;
            const isAvailable =
              product.inStock &&
              (product.stockQuantity === undefined || product.stockQuantity > 0) &&
              isSwatchAvailable;

            return (
              <div
                key={product.id}
                onClick={() => openQuickView(product)}
                className={`group relative flex-none w-[165px] sm:w-[205px] lg:w-[225px] snap-start flex flex-col justify-between cursor-pointer transition-all duration-300 ${
                  !isAvailable ? 'opacity-85' : ''
                }`}
              >
                {/* Product Image Box */}
                <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#F3F1EC] border border-neutral-200/50 p-2 sm:p-3 flex items-center justify-center transition-all duration-300 group-hover:shadow-md">
                  {/* Badges */}
                  <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
                    {product.badge && isAvailable && (
                      <span className="px-1.5 py-0.5 bg-black text-white text-[8px] sm:text-[9px] font-semibold tracking-wider uppercase rounded-xs">
                        {product.badge}
                      </span>
                    )}

                    {!isAvailable && (
                      <span className="px-2 py-0.5 bg-rose-600 text-white text-[9px] font-bold tracking-wider uppercase rounded-xs shadow-xs">
                        স্টক আউট / Unavailable
                      </span>
                    )}
                  </div>

                  {/* Wishlist Heart Icon Button */}
                  <button
                    type="button"
                    onClick={(e) => handleWishlistClick(e, product)}
                    className="absolute top-2 right-2 z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/85 hover:bg-white text-neutral-800 flex items-center justify-center shadow-xs transition-colors"
                    aria-label="Save to Wishlist"
                  >
                    <Heart
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                        isSaved ? 'fill-red-500 text-red-500' : 'text-neutral-700'
                      }`}
                    />
                  </button>

                  {/* Product Image */}
                  <img
                    src={product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'}
                    alt={product.title}
                    className={`w-full h-full object-contain object-center transform transition-transform duration-500 group-hover:scale-105 ${
                      !isAvailable ? 'grayscale-30 contrast-90' : ''
                    }`}
                    loading="lazy"
                  />

                  {/* Quick View Hover overlay */}
                  <div className="hidden lg:flex absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center">
                    <span className="inline-flex items-center gap-1 bg-white/95 text-neutral-900 text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-md">
                      <Eye className="w-3 h-3" />
                      Quick View
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="pt-2.5 pb-1 flex flex-col space-y-1">
                  <h3 className="text-[12px] sm:text-[13px] font-medium text-neutral-900 tracking-tight line-clamp-1 group-hover:text-black">
                    {product.title}
                  </h3>

                  {/* Price in Bangladeshi Taka ৳ */}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[12px] sm:text-[13px] font-bold text-neutral-950 font-sans">
                      ৳ {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-[10px] text-neutral-400 line-through">
                        ৳ {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Swatches */}
                  <div className="flex items-center gap-1 sm:gap-1.5 py-0.5">
                    {product.colorSwatches.map((swatch) => {
                      const isColorActive = activeColor === swatch.name;
                      const swatchOut =
                        swatch.inStock === false ||
                        (swatch.stockQuantity !== undefined && swatch.stockQuantity <= 0);
                      return (
                        <button
                          key={swatch.name}
                          type="button"
                          onClick={(e) => handleColorClick(e, product.id, swatch.name)}
                          title={`${swatch.name}${swatchOut ? ' (স্টক শেষ)' : ''}`}
                          className={`relative w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border transition-all ${
                            isColorActive
                              ? 'ring-1.5 ring-neutral-950 ring-offset-1 scale-110'
                              : 'border-neutral-300 hover:scale-105'
                          } ${swatchOut ? 'opacity-50' : ''}`}
                          style={{ backgroundColor: swatch.hex }}
                        >
                          {swatchOut && (
                            <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <span className="w-full h-[1px] bg-rose-600 rotate-45 transform" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Action Buttons: 1-Click Order & Add to Bag (Optimized for Meta/Instagram Ads) */}
                  <div className="pt-1 flex items-center gap-1.5">
                    {isAvailable ? (
                      <>
                        <button
                          type="button"
                          onClick={(e) => handleBuyNowClick(e, product)}
                          className="flex-1 py-1.5 px-2 bg-neutral-950 hover:bg-black text-white text-[10px] font-semibold rounded-md transition-all flex items-center justify-center gap-1 shadow-xs active:scale-95"
                          title="1-Click Direct Order"
                        >
                          <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span>অর্ডার করুন</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleAddToCartClick(e, product)}
                          className="w-7 h-7 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-all flex items-center justify-center shadow-xs shrink-0"
                          aria-label="Add to cart"
                          title="Add to cart"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 stroke-[1.8]" />
                        </button>
                      </>
                    ) : (
                      <div className="w-full py-1.5 bg-neutral-100 text-neutral-400 text-[10px] font-medium rounded-md text-center select-none">
                        স্টক শেষ / Unavailable
                      </div>
                    )}
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
