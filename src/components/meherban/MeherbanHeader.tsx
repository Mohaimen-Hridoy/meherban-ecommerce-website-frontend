'use client';

import React, { useState } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Phone,
  ShieldCheck,
  Store,
} from 'lucide-react';
import { useMeherban } from '@/context/MeherbanContext';

export const MeherbanHeader: React.FC = () => {
  const {
    cartCount,
    wishlistCount,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    activeCategory,
    setActiveCategory,
    authRole,
  } = useMeherban();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const navLinks = [
    { label: 'Home', href: '#hero', category: 'Home' },
    { label: 'Men', href: '#collections', category: 'Men' },
    { label: 'Women', href: '#collections', category: 'Women' },
    { label: 'Unisex', href: '#collections', category: 'Unisex' },
    { label: 'Clothing', href: '#trending', category: 'Clothing' },
    { label: 'Accessories', href: '#collections', category: 'Accessories' },
  ];

  const handleNavClick = (category: string) => {
    setActiveCategory(category);
    setIsMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 transition-all shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Hamburger Button (shown on mobile/tablet) */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-1.5 -ml-1.5 text-neutral-800 hover:text-black focus:outline-none"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6 stroke-[1.5]" />
              </button>
            </div>

            {/* Brand Logo: MEHERBAN / WEAR YOUR STORY */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left cursor-pointer select-none">
              <a href="#" className="flex flex-col items-center">
                <span className="font-serif text-[20px] sm:text-[25px] tracking-[0.24em] font-semibold text-neutral-950 uppercase leading-none">
                  MEHERBAN
                </span>
                <span className="text-[8px] sm:text-[8.5px] tracking-[0.32em] text-neutral-500 uppercase font-medium mt-1">
                  WEAR YOUR STORY
                </span>
              </a>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive = activeCategory === link.category;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => handleNavClick(link.category)}
                    className={`relative text-[13.5px] font-medium tracking-wide transition-colors py-1 ${
                      isActive
                        ? 'text-neutral-950 font-semibold'
                        : 'text-neutral-600 hover:text-neutral-950'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-950 rounded-full" />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Desktop Search Bar */}
              <div className="hidden md:flex items-center">
                <form
                  onSubmit={handleSearchSubmit}
                  className="relative flex items-center"
                >
                  <Search className="absolute left-3.5 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onFocus={() => setIsSearchOpen(true)}
                    placeholder="Search products..."
                    className="w-44 lg:w-56 pl-9 pr-3 py-1.5 text-xs bg-neutral-100/80 hover:bg-neutral-100 border border-transparent focus:border-neutral-300 focus:bg-white rounded-full transition-all outline-none text-neutral-800 placeholder:text-neutral-400"
                  />
                </form>
              </div>

              {/* Mobile Search Icon */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden p-1.5 text-neutral-800 hover:text-black transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 stroke-[1.6]" />
              </button>

              {/* Wishlist Heart Icon with Count Badge */}
              <button
                type="button"
                onClick={() => setIsWishlistOpen(true)}
                className="relative p-1.5 text-neutral-800 hover:text-black transition-colors rounded-full hover:bg-neutral-100/70"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[1.6]" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-neutral-900 text-white text-[8px] font-semibold rounded-full flex items-center justify-center animate-fade-in">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Shopping Bag Icon with Count Badge */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-1.5 text-neutral-800 hover:text-black transition-colors rounded-full hover:bg-neutral-100/70"
                aria-label="Shopping Cart"
                title="Cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.6]" />
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-neutral-900 text-white text-[8px] font-semibold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-fade-in">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-serif text-lg tracking-[0.2em] font-semibold text-neutral-950">
                  MEHERBAN
                </span>
                <span className="text-[8px] tracking-[0.25em] text-neutral-500 uppercase">
                  WEAR YOUR STORY
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-neutral-500 hover:text-black rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold mb-3">
                Collections & Categories
              </p>
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => handleNavClick(link.category)}
                  className={`flex items-center justify-between py-3 px-3 rounded-lg text-sm transition-colors ${
                    activeCategory === link.category
                      ? 'bg-neutral-900 text-white font-medium'
                      : 'text-neutral-800 hover:bg-neutral-100'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </a>
              ))}

              <div className="pt-6 mt-6 border-t border-neutral-100 space-y-2.5">
                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-neutral-200/60">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-neutral-900">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Special Season Offer
                  </span>
                  <p className="text-xs text-neutral-600 mt-1">
                    Enjoy 10% discount on all new streetwear arrivals with code:
                    <span className="font-semibold text-black ml-1">MEHERBAN10</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs text-neutral-600 pt-2">
                  <Phone className="w-4 h-4 text-neutral-400" />
                  <span>Support: +880 1700-000000</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
              <span>Currency: BDT (৳)</span>
              <span>English / বাংলা</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
