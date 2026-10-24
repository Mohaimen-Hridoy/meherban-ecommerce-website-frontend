'use client';

import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useMeherban } from '@/context/MeherbanContext';

export const MeherbanCartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    shippingFee,
    freeShippingThreshold,
    setIsCheckoutOpen,
  } = useMeherban();

  if (!isCartOpen) return null;

  const neededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-fade-in">
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-neutral-900" />
            <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-neutral-900">
              Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-black rounded-full"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-[#FAF7F2] p-3 px-5 border-b border-neutral-200/60 text-xs">
          <div className="flex items-center justify-between text-neutral-700 font-medium mb-1.5">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-neutral-800" />
              {neededForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-black">৳ {neededForFreeShipping.toLocaleString()}</strong> more for Free Shipping
                </span>
              ) : (
                <span className="text-emerald-700 font-semibold">
                  🎉 Congratulations! You have unlocked Free Shipping
                </span>
              )}
            </span>
            <span className="text-[11px] text-neutral-500">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-neutral-900 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
              <ShoppingBag className="w-12 h-12 stroke-[1] mb-3 text-neutral-300" />
              <p className="font-serif text-base text-neutral-800 font-semibold">
                Your shopping bag is empty
              </p>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                Explore our trending drops and add contemporary luxury essentials to your bag.
              </p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="mt-5 px-6 py-2.5 bg-neutral-900 text-white text-xs uppercase tracking-widest font-medium rounded-sm hover:bg-black"
              >
                Start Exploring
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-3.5 p-3 rounded-xl border border-neutral-100 bg-[#FAFAFA] hover:border-neutral-200 transition-colors"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-lg bg-neutral-200 shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {item.selectedSize} · {item.selectedColor}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-neutral-300 rounded-md bg-white">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2 py-0.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-l-md transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-semibold text-neutral-800">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2 py-0.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-r-md transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs sm:text-sm font-bold text-neutral-950 font-sans">
                      ৳ {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-neutral-100 bg-white space-y-3">
            <div className="space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900">৳ {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-neutral-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 uppercase font-bold text-[11px]">Free</span>
                  ) : (
                    `৳ ${shippingFee}`
                  )}
                </span>
              </div>
              <div className="border-t border-neutral-200 pt-2 flex justify-between text-sm sm:text-base font-bold text-neutral-950">
                <span>Total Amount</span>
                <span>৳ {(subtotal + shippingFee).toLocaleString()}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 bg-neutral-950 hover:bg-black text-white text-xs sm:text-sm uppercase tracking-widest font-semibold rounded-md shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={clearCart}
              className="w-full text-center text-[11px] text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              Clear shopping bag
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
