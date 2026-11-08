'use client';

import React, { useRef, useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Heart,
  Eye,
  Zap,
  LayoutGrid,
  Columns3,
  PackageOpen,
  Sparkles,
} from 'lucide-react';
import { useMeherban } from '@/context/MeherbanContext';
import { MeherbanProduct } from '@/types/meherban';
import { getSubcategoriesForCategory, inferSubcategory } from '@/lib/meherbanSubcategories';

export const MeherbanTrending: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const {
    products,
    categories,
    addToCart,
    directBuyNow,
    toggleWishlist,
    isWishlisted,
    openQuickView,
    activeCategory,
    setActiveCategory,
    activeSubcategory,
    setActiveSubcategory,
  } = useMeherban();

  const [selectedColors, setSelectedColors] = useState<{ [productId: string]: string }>({});
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');

  // Dynamic Category Extraction: merge predefined categories + categories from products (case-insensitive deduplication)
  const categoryList = useMemo(() => {
    const map = new Map<string, string>();
    map.set('all', 'All');

    // Standard fashion categories first in clean order
    ['Men', 'Women', 'Unisex', 'Accessories', 'Clothing'].forEach((c) => {
      map.set(c.toLowerCase(), c);
    });

    categories.forEach((c) => {
      if (c.name && c.name !== 'Home' && c.name.toLowerCase() !== 'all') {
        const lower = c.name.trim().toLowerCase();
        if (!map.has(lower)) {
          map.set(lower, c.name.trim());
        }
      }
    });

    products.forEach((p) => {
      if (p.categoryName && p.categoryName !== 'Home' && p.categoryName.toLowerCase() !== 'all') {
        const lower = p.categoryName.trim().toLowerCase();
        if (!map.has(lower)) {
          map.set(lower, p.categoryName.trim());
        }
      }
    });

    return Array.from(map.values());
  }, [categories, products]);

  // Product count for each category
  const getCategoryCount = (catName: string) => {
    if (!catName || catName === 'All' || catName === 'Home') return products.length;
    return products.filter(
      (p) => p.categoryName && p.categoryName.trim().toLowerCase() === catName.trim().toLowerCase()
    ).length;
  };

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

  // Dynamic Subcategory Extraction for currently selected category
  const subcategoryList = useMemo(() => {
    return getSubcategoriesForCategory(activeCategory, products);
  }, [activeCategory, products]);

  // Filter products according to activeCategory & activeSubcategory
  const displayedProducts = useMemo(() => {
    let list = products;
    if (activeCategory && activeCategory !== 'Home' && activeCategory.toLowerCase() !== 'all') {
      list = list.filter(
        (p) => p.categoryName && p.categoryName.trim().toLowerCase() === activeCategory.trim().toLowerCase()
      );
    }
    if (activeSubcategory && activeSubcategory.toLowerCase() !== 'all') {
      list = list.filter((p) => {
        const sub = inferSubcategory(p);
        return sub.trim().toLowerCase() === activeSubcategory.trim().toLowerCase();
      });
    }
    return list;
  }, [products, activeCategory, activeSubcategory]);

  return (
    <section id="trending" className="py-10 sm:py-16 bg-white text-neutral-900 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-neutral-400">
                {activeCategory && activeCategory !== 'Home' && activeCategory !== 'All'
                  ? `${activeCategory} COLLECTION`
                  : 'FEATURED APPAREL & ACCESSORIES'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-neutral-950">
              {activeCategory && activeCategory !== 'Home' && activeCategory !== 'All'
                ? (activeSubcategory && activeSubcategory !== 'All' ? `${activeCategory} • ${activeSubcategory}` : `${activeCategory} PRODUCTS`)
                : (activeSubcategory && activeSubcategory !== 'All' ? activeSubcategory : 'TRENDING NOW')}
            </h2>
          </div>

          {/* Controls: Item Count & Layout Toggle */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <span className="text-xs text-neutral-500 font-medium bg-neutral-100 px-2.5 py-1 rounded-full">
              {displayedProducts.length} টি পণ্য পাওয়া গেছে
            </span>

            {/* View Mode Toggle: Grid vs Carousel */}
            <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                  viewMode === 'grid'
                    ? 'bg-white text-black shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
                title="গ্রিড ভিউ (সব পণ্য একনজরে দেখুন)"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden md:inline text-[11px]">Grid</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('carousel')}
                className={`p-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                  viewMode === 'carousel'
                    ? 'bg-white text-black shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
                title="স্লাইডার ভিউ"
              >
                <Columns3 className="w-4 h-4" />
                <span className="hidden md:inline text-[11px]">Slider</span>
              </button>
            </div>

            {/* Carousel navigation arrows (only visible in carousel mode) */}
            {viewMode === 'carousel' && (
              <div className="flex items-center gap-1.5 ml-1">
                <button
                  type="button"
                  onClick={scrollLeft}
                  className="w-8 h-8 rounded-full border border-neutral-300 hover:border-black flex items-center justify-center text-neutral-600 hover:text-black transition-colors"
                  aria-label="Previous Products"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={scrollRight}
                  className="w-8 h-8 rounded-full border border-neutral-300 hover:border-black flex items-center justify-center text-neutral-600 hover:text-black transition-colors"
                  aria-label="Next Products"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Category Filter Pills (Unlimited Categories Support) */}
        <div className="mb-4 overflow-x-auto no-scrollbar pb-1">
          <div className="flex items-center gap-2 min-w-max">
            {categoryList.map((catName) => {
              const isCatActive =
                (catName === 'All' && (!activeCategory || activeCategory === 'Home' || activeCategory.toLowerCase() === 'all')) ||
                (activeCategory && activeCategory.trim().toLowerCase() === catName.trim().toLowerCase());
              const count = getCategoryCount(catName);

              return (
                <button
                  key={catName}
                  type="button"
                  onClick={() => setActiveCategory(catName)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
                    isCatActive
                      ? 'bg-neutral-950 text-white shadow-sm ring-1 ring-neutral-950'
                      : 'bg-neutral-100/80 hover:bg-neutral-200/90 text-neutral-700 hover:text-neutral-950'
                  }`}
                >
                  <span>{catName === 'All' ? 'সকল কালেকশন' : catName}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isCatActive
                        ? 'bg-white/20 text-white'
                        : 'bg-neutral-200/80 text-neutral-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Subcategory Filter Pills (Panjabi, Shirts, Kurti, Saree, Watches, etc.) */}
        {subcategoryList.length > 1 && (
          <div className="mb-8 overflow-x-auto no-scrollbar pb-2 pt-2 border-t border-neutral-100/80 flex items-center gap-2">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest shrink-0 mr-1 flex items-center gap-1 select-none">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>ধরন:</span>
            </span>
            <div className="flex items-center gap-1.5 min-w-max">
              {subcategoryList.map((sub) => {
                const isSubActive =
                  (sub.name === 'All' && (!activeSubcategory || activeSubcategory.toLowerCase() === 'all')) ||
                  (activeSubcategory && activeSubcategory.trim().toLowerCase() === sub.name.trim().toLowerCase());

                return (
                  <button
                    key={sub.name}
                    type="button"
                    onClick={() => setActiveSubcategory(sub.name)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer select-none ${
                      isSubActive
                        ? 'bg-amber-600 text-white font-semibold shadow-xs ring-1 ring-amber-600'
                        : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 hover:text-neutral-950 border border-neutral-200/80'
                    }`}
                  >
                    <span>{sub.nameBn ? `${sub.nameBn}` : sub.name}</span>
                    <span
                      className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSubActive ? 'bg-white/25 text-white font-bold' : 'bg-neutral-200/70 text-neutral-600'
                      }`}
                    >
                      {sub.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State when Category has 0 Products */}
        {displayedProducts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-neutral-50 rounded-2xl border border-neutral-200/60 my-6">
            <PackageOpen className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-800">
              এই ক্যাটাগরিতে এখনো কোনো পণ্য যুক্ত করা হয়নি
            </h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              দয়া করে অন্য কোনো ক্যাটাগরি বেছে নিন অথবা সকল পণ্য দেখতে নিচের বাটনে ক্লিক করুন।
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory('All')}
              className="mt-4 px-4 py-2 bg-neutral-950 hover:bg-black text-white text-xs font-semibold rounded-lg shadow-sm transition-all inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>সকল পণ্য দেখুন</span>
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Multi-column Grid View: Unlimited Products Displayed Elegantly */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5 lg:gap-6">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSaved={isWishlisted(product.id)}
                selectedColors={selectedColors}
                handleColorClick={handleColorClick}
                handleAddToCartClick={handleAddToCartClick}
                handleBuyNowClick={handleBuyNowClick}
                handleWishlistClick={handleWishlistClick}
                openQuickView={openQuickView}
              />
            ))}
          </div>
        ) : (
          /* Carousel View: Horizontal Snap Track */
          <div
            ref={scrollContainerRef}
            className="flex gap-3 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-4 pt-1 snap-x snap-mandatory"
          >
            {displayedProducts.map((product) => (
              <div
                key={product.id}
                className="flex-none w-[170px] sm:w-[210px] lg:w-[230px] snap-start"
              >
                <ProductCard
                  product={product}
                  isSaved={isWishlisted(product.id)}
                  selectedColors={selectedColors}
                  handleColorClick={handleColorClick}
                  handleAddToCartClick={handleAddToCartClick}
                  handleBuyNowClick={handleBuyNowClick}
                  handleWishlistClick={handleWishlistClick}
                  openQuickView={openQuickView}
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

/* Reusable Product Card Component supporting 15 exact brand colors & stock state */
interface ProductCardProps {
  product: MeherbanProduct;
  isSaved: boolean;
  selectedColors: { [productId: string]: string };
  handleColorClick: (e: React.MouseEvent, productId: string, colorName: string) => void;
  handleAddToCartClick: (e: React.MouseEvent, product: MeherbanProduct) => void;
  handleBuyNowClick: (e: React.MouseEvent, product: MeherbanProduct) => void;
  handleWishlistClick: (e: React.MouseEvent, product: MeherbanProduct) => void;
  openQuickView: (product: MeherbanProduct) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSaved,
  selectedColors,
  handleColorClick,
  handleAddToCartClick,
  handleBuyNowClick,
  handleWishlistClick,
  openQuickView,
}) => {
  const activeColor = selectedColors[product.id] || product.colorSwatches[0]?.name;
  const activeSwatch = product.colorSwatches.find((c) => c.name === activeColor);
  const subcategory = inferSubcategory(product);
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
      onClick={() => openQuickView(product)}
      className={`group relative flex flex-col justify-between cursor-pointer transition-all duration-300 bg-white rounded-xl sm:rounded-2xl border border-neutral-100 hover:border-neutral-300 p-2 sm:p-2.5 hover:shadow-lg ${
        !isAvailable ? 'opacity-85' : ''
      }`}
    >
      {/* Product Image Box */}
      <div className="relative aspect-square w-full rounded-lg sm:rounded-xl overflow-hidden bg-[#F3F1EC] border border-neutral-200/50 p-2 sm:p-3 flex items-center justify-center transition-all duration-300">
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start max-w-[80%]">
          {product.badge && isAvailable && (
            <span className="px-1.5 py-0.5 bg-black text-white text-[8px] sm:text-[9px] font-semibold tracking-wider uppercase rounded-xs">
              {product.badge}
            </span>
          )}

          {!isAvailable && (
            <span className="px-1.5 sm:px-2 py-0.5 bg-rose-600 text-white text-[8px] sm:text-[9px] font-bold tracking-wider uppercase rounded-xs shadow-xs">
              স্টক শেষ / Unavailable
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
      <div className="pt-2 pb-1 flex flex-col space-y-1">
        <div className="flex items-center justify-between text-[10px] text-neutral-400 uppercase font-semibold">
          <span className="truncate">
            {product.categoryName}
            {subcategory && subcategory !== 'General' && subcategory.toLowerCase() !== product.categoryName.toLowerCase() ? ` • ${subcategory}` : ''}
          </span>
          {activeSwatch && (
            <span className="text-[9px] text-neutral-500 lowercase capitalize">
              {activeSwatch.name}
            </span>
          )}
        </div>

        <h3 className="text-[12px] sm:text-[13px] font-medium text-neutral-900 tracking-tight line-clamp-1 group-hover:text-black">
          {product.title}
        </h3>

        {/* Price in Bangladeshi Taka ৳ */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-[13px] sm:text-[14px] font-bold text-neutral-950 font-sans">
            ৳ {product.price.toLocaleString()}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-[10px] text-neutral-400 line-through">
              ৳ {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* 15 Brand Colors Palette Swatches */}
        <div className="flex items-center gap-1 sm:gap-1.5 py-1 flex-wrap">
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
                className={`relative w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border transition-all ${
                  isColorActive
                    ? 'ring-1.5 ring-neutral-950 ring-offset-1 scale-110 shadow-xs'
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

        {/* Action Buttons: 1-Click Order & Add to Bag */}
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
};
