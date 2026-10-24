'use client';

import React from 'react';
import { Home, LayoutGrid, Heart, ShoppingBag, User } from 'lucide-react';
import { useMeherban } from '@/context/MeherbanContext';

export const MeherbanMobileBottomNav: React.FC = () => {
  const {
    cartCount,
    wishlistCount,
    setIsCartOpen,
    setIsWishlistOpen,
    setActiveCategory,
  } = useMeherban();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/80 px-2 py-1.5 sm:hidden shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <a
          href="#hero"
          onClick={() => setActiveCategory('Home')}
          className="flex flex-col items-center justify-center py-1 px-2 text-neutral-900 group"
        >
          <Home className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Home</span>
        </a>

        <a
          href="#collections"
          onClick={() => setActiveCategory('All')}
          className="flex flex-col items-center justify-center py-1 px-2 text-neutral-500 hover:text-neutral-900 group"
        >
          <LayoutGrid className="w-5 h-5 stroke-[1.6]" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Categories</span>
        </a>

        <button
          type="button"
          onClick={() => setIsWishlistOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 px-2 text-neutral-500 hover:text-neutral-900 group"
        >
          <Heart className="w-5 h-5 stroke-[1.6]" />
          {wishlistCount > 0 && (
            <span className="absolute top-0 right-2 w-3.5 h-3.5 bg-neutral-900 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Wishlist</span>
        </button>

        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 px-2 text-neutral-500 hover:text-neutral-900 group"
        >
          <ShoppingBag className="w-5 h-5 stroke-[1.6]" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-2 w-3.5 h-3.5 bg-neutral-900 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Cart</span>
        </button>

        <button
          type="button"
          onClick={() => alert('MEHERBAN Account: Member VIP privileges active')}
          className="flex flex-col items-center justify-center py-1 px-2 text-neutral-500 hover:text-neutral-900 group"
        >
          <User className="w-5 h-5 stroke-[1.6]" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Account</span>
        </button>
      </div>
    </nav>
  );
};
