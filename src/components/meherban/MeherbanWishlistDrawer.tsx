'use client';

import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useMeherban } from '@/context/MeherbanContext';

export const MeherbanWishlistDrawer: React.FC = () => {
  const {
    products,
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    addToCart,
    openQuickView,
  } = useMeherban();

  if (!isWishlistOpen) return null;

  const handleMoveToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      addToCart(product, product.sizes[0], product.colorSwatches[0]?.name, 1);
      toggleWishlist(product);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-fade-in">
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-neutral-900">
              Wishlist ({wishlist.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsWishlistOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-black rounded-full"
            aria-label="Close wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
              <Heart className="w-12 h-12 stroke-[1] mb-3 text-neutral-300" />
              <p className="font-serif text-base text-neutral-800 font-semibold">
                Your wishlist is empty
              </p>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                Save your favorite luxury fashion pieces by clicking the heart icon on any product.
              </p>
            </div>
          ) : (
            wishlist.map((item) => {
              const fullProduct = products.find((p) => p.id === item.productId);
              return (
                <div
                  key={item.productId}
                  className="flex gap-3.5 p-3 rounded-xl border border-neutral-100 bg-[#FAFAFA] hover:border-neutral-200 transition-colors items-center"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-18 h-18 object-cover rounded-lg bg-neutral-200 shrink-0 cursor-pointer"
                    onClick={() => fullProduct && openQuickView(fullProduct)}
                  />

                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-xs sm:text-sm font-semibold text-neutral-900 line-clamp-1 cursor-pointer hover:underline"
                      onClick={() => fullProduct && openQuickView(fullProduct)}
                    >
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-neutral-400">{item.categoryName}</p>
                    <p className="text-xs sm:text-sm font-bold text-neutral-950 font-sans mt-1">
                      ৳ {item.price.toLocaleString()}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => handleMoveToCart(item.productId)}
                        className="px-3 py-1 bg-neutral-900 hover:bg-black text-white text-[11px] font-medium rounded-sm flex items-center gap-1 transition-colors"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        Move to Bag
                      </button>

                      <button
                        type="button"
                        onClick={() => fullProduct && toggleWishlist(fullProduct)}
                        className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
