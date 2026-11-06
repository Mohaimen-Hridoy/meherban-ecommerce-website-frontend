'use client';

import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Heart, Check, Truck, ShieldCheck, Zap } from 'lucide-react';
import { useMeherban } from '@/context/MeherbanContext';

export const MeherbanQuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    closeQuickView,
    addToCart,
    directBuyNow,
    toggleWishlist,
    isWishlisted,
  } = useMeherban();

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedColor(quickViewProduct.colorSwatches[0]?.name || '');
      setSelectedSize(quickViewProduct.sizes[0] || 'Standard');
      setQuantity(1);
      setActiveImageIdx(0);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const isSaved = isWishlisted(quickViewProduct.id);

  const activeColorSwatch = quickViewProduct.colorSwatches.find(
    (c) => c.name.toLowerCase() === selectedColor.toLowerCase()
  );

  const isColorAvailable =
    activeColorSwatch
      ? activeColorSwatch.inStock !== false &&
        (activeColorSwatch.stockQuantity === undefined || activeColorSwatch.stockQuantity > 0)
      : true;

  const isAvailable =
    quickViewProduct.inStock &&
    (quickViewProduct.stockQuantity === undefined || quickViewProduct.stockQuantity > 0) &&
    isColorAvailable;

  const handleAdd = () => {
    if (!isAvailable) return;
    addToCart(quickViewProduct, selectedSize, selectedColor, quantity);
    closeQuickView();
  };

  const handleBuyNow = () => {
    if (!isAvailable) return;
    directBuyNow(quickViewProduct, selectedSize, selectedColor, quantity);
    closeQuickView();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={closeQuickView}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 animate-fade-in border border-neutral-200/80">
        <button
          type="button"
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-black flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          <div className="bg-[#F6F5F2] p-6 flex flex-col justify-between">
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-white shadow-xs p-3 flex items-center justify-center">
              <img
                src={quickViewProduct.images[activeImageIdx] || quickViewProduct.images[0]}
                alt={quickViewProduct.title}
                className={`w-full h-full object-contain ${!isAvailable ? 'grayscale-30' : ''}`}
              />
            </div>

            {quickViewProduct.images.length > 1 && (
              <div className="flex gap-2 justify-center mt-4">
                {quickViewProduct.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIdx(i)}
                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImageIdx === i
                        ? 'border-neutral-900 scale-105'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center justify-center gap-4 text-[11px] text-neutral-500 pt-4">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-700" /> 100% Authentic
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-neutral-700" /> Express Dispatch
              </span>
            </div>
          </div>

          <div className="p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  {quickViewProduct.categoryName}
                </span>

                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-semibold text-neutral-800">
                    {quickViewProduct.rating}
                  </span>
                  <span className="text-neutral-400">
                    ({quickViewProduct.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-950 uppercase">
                  {quickViewProduct.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">{quickViewProduct.subtitle}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-bold text-neutral-950 font-sans">
                  ৳ {quickViewProduct.price.toLocaleString()}
                </span>
                {quickViewProduct.originalPrice > quickViewProduct.price && (
                  <span className="text-xs text-neutral-400 line-through">
                    ৳ {quickViewProduct.originalPrice.toLocaleString()}
                  </span>
                )}
                {isAvailable ? (
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold text-[10px] rounded-xs uppercase">
                    In Stock ({quickViewProduct.stockQuantity ?? 20} available)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-rose-50 text-rose-600 font-bold text-[10px] rounded-xs uppercase">
                    Unavailable / স্টক শেষ
                  </span>
                )}
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                {quickViewProduct.description}
              </p>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-neutral-900">
                    Color: <span className="font-normal text-neutral-600">{selectedColor}</span>
                    {activeColorSwatch && activeColorSwatch.inStock === false && (
                      <span className="ml-2 text-rose-600 font-bold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[10px]">
                        স্টক শেষ (Unavailable)
                      </span>
                    )}
                    {activeColorSwatch &&
                      activeColorSwatch.inStock !== false &&
                      activeColorSwatch.stockQuantity !== undefined &&
                      activeColorSwatch.stockQuantity <= 5 &&
                      activeColorSwatch.stockQuantity > 0 && (
                        <span className="ml-2 text-amber-600 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[10px]">
                          মাত্র {activeColorSwatch.stockQuantity}টি বাকি!
                        </span>
                      )}
                  </label>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {quickViewProduct.colorSwatches.map((swatch) => {
                    const swatchOut =
                      swatch.inStock === false ||
                      (swatch.stockQuantity !== undefined && swatch.stockQuantity <= 0);
                    const isSelected = selectedColor === swatch.name;
                    return (
                      <button
                        key={swatch.name}
                        type="button"
                        onClick={() => setSelectedColor(swatch.name)}
                        className={`relative w-7 h-7 rounded-full border transition-all flex items-center justify-center ${
                          isSelected
                            ? 'ring-2 ring-neutral-900 ring-offset-2 scale-110'
                            : 'border-neutral-300 hover:scale-105'
                        } ${swatchOut ? 'opacity-60' : ''}`}
                        style={{ backgroundColor: swatch.hex }}
                        title={`${swatch.name}${swatchOut ? ' (স্টক শেষ)' : ''}`}
                      >
                        {isSelected && !swatchOut && (
                          <Check className="w-3.5 h-3.5 text-white drop-shadow-md stroke-[3]" />
                        )}
                        {swatchOut && (
                          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="w-full h-0.5 bg-rose-600 rotate-45 transform" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {quickViewProduct.sizes.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-900 mb-2">
                    Size: <span className="font-normal text-neutral-600">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
                          selectedSize === sz
                            ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isAvailable && (
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-xs font-semibold text-neutral-900">Quantity:</span>
                  <div className="flex items-center border border-neutral-300 rounded-md">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-2.5 py-1 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-l-md transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold text-neutral-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((q) =>
                          quickViewProduct.stockQuantity ? Math.min(quickViewProduct.stockQuantity, q + 1) : q + 1
                        )
                      }
                      className="px-2.5 py-1 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-r-md transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 flex flex-col gap-2">
              {isAvailable ? (
                <>
                  <div className="flex items-center gap-2">
                    {/* Primary Direct Order Button for Ad Clickers */}
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="flex-1 py-3 bg-neutral-950 hover:bg-black text-white text-xs uppercase tracking-wider font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
                    >
                      <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span>সরাসরি অর্ডার করুন · ৳ {(quickViewProduct.price * quantity).toLocaleString()}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleWishlist(quickViewProduct)}
                      className={`p-3 rounded-lg border transition-colors ${
                        isSaved
                          ? 'border-red-300 bg-red-50 text-red-600'
                          : 'border-neutral-200 text-neutral-700 hover:border-black'
                      }`}
                      title="Save to Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdd}
                    className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs uppercase tracking-wider font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>কার্ট এ যোগ করুন</span>
                  </button>
                </>
              ) : (
                <div className="p-3 bg-neutral-100 text-neutral-600 rounded-lg text-center text-xs font-medium">
                  {!isColorAvailable ? (
                    <span>
                      দুঃখিত, <strong>&quot;{selectedColor}&quot;</strong> কালারটি বর্তমানে শেষ হয়ে গেছে (Unavailable)। অনুগ্রহ করে অন্য কোনো কালার বেছে নিন।
                    </span>
                  ) : (
                    <span>এই পণ্যটি বর্তমানে শেষ হয়ে গেছে (Out of Stock)। নতুন স্টক আসলে জানানো হবে।</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
