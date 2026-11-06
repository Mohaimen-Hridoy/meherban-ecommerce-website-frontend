'use client';

import React from 'react';
import { Home, ShoppingBag, Heart, User, LayoutGrid } from 'lucide-react';
import { useMeherban } from '@/context/MeherbanContext';

export const MeherbanMobileBottomNav: React.FC = () => {
  const {
    cartCount,
    wishlistCount,
    setIsCartOpen,
    setIsWishlistOpen,
    setActiveCategory,
    deviceView,
    authRole,
  } = useMeherban();

  const isSimulatedMobile = deviceView === 'mobile' || deviceView === 'split';

  return (
    <nav
      className={`bg-white/95 backdrop-blur-md border-t border-neutral-200/90 px-2 py-2 shadow-lg z-40 transition-all ${
        isSimulatedMobile
          ? 'sticky bottom-0 w-full'
          : 'fixed bottom-0 left-0 right-0 sm:hidden'
      }`}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <a
          href="#hero"
          onClick={() => setActiveCategory('Home')}
          className="flex flex-col items-center justify-center py-0.5 px-2 text-neutral-900 group"
        >
          <Home className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] font-bold tracking-tight mt-0.5">Home</span>
        </a>

        {/* Collections / Categories */}
        <a
          href="#collections"
          className="flex flex-col items-center justify-center py-0.5 px-2 text-neutral-500 hover:text-neutral-900 group"
        >
          <LayoutGrid className="w-5 h-5 stroke-[1.6]" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Shop</span>
        </a>

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => setIsWishlistOpen(true)}
          className="relative flex flex-col items-center justify-center py-0.5 px-2 text-neutral-500 hover:text-neutral-900 group"
        >
          <Heart className="w-5 h-5 stroke-[1.6]" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 right-2 w-3.5 h-3.5 bg-neutral-900 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Saved</span>
        </button>

        {/* Cart */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center py-0.5 px-2 text-neutral-500 hover:text-neutral-900 group"
        >
          <ShoppingBag className="w-5 h-5 stroke-[1.6]" />
          {cartCount > 0 && (
            <span className="absolute -top-1 right-2 w-3.5 h-3.5 bg-neutral-900 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Cart</span>
        </button>

        {/* Discreet Login / Account Tab */}
        <a
          href={authRole === 'SELLER' ? '/seller' : authRole === 'ADMIN' ? '/admin' : '/login'}
          className="relative flex flex-col items-center justify-center py-0.5 px-2 text-neutral-500 hover:text-neutral-900 group"
          title="Login / অ্যাকাউন্ট"
        >
          <User className="w-5 h-5 stroke-[1.6]" />
          {authRole && (
            <span className="absolute top-0.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full" />
          )}
          <span className="text-[10px] font-medium tracking-tight mt-0.5">
            {authRole ? (authRole === 'SELLER' ? 'Seller' : 'Admin') : 'Login'}
          </span>
        </a>
      </div>
    </nav>
  );
};
