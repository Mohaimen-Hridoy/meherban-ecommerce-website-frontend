'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, ShoppingBag } from 'lucide-react';
import { useMeherban } from '@/context/MeherbanContext';

export const MeherbanSearchModal: React.FC = () => {
  const { products, isSearchOpen, setIsSearchOpen, openQuickView, addToCart } = useMeherban();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'ALL' ||
      product.categoryName.toUpperCase() === selectedCategory.toUpperCase();
    const q = query.toLowerCase().trim();
    const matchesQuery =
      q === '' ||
      product.title.toLowerCase().includes(q) ||
      product.subtitle.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q) ||
      product.categoryName.toLowerCase().includes(q);

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 animate-fade-in border border-neutral-200">
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product name, category, or style (e.g. Hoodie, Watch, Linen)..."
            className="w-full text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 outline-none bg-transparent"
          />
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-black rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 sm:px-5 bg-neutral-50/80 border-b border-neutral-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {['ALL', 'MEN', 'WOMEN', 'UNISEX', 'ACCESSORIES'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white text-neutral-600 hover:bg-neutral-200/70 border border-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5 space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-10 text-neutral-400">
              <Search className="w-8 h-8 stroke-[1.2] mx-auto mb-2 text-neutral-300" />
              <p className="text-sm font-medium text-neutral-700">No matching products found</p>
              <p className="text-xs text-neutral-400 mt-0.5">
                Try searching for &quot;Oversized&quot;, &quot;Hoodie&quot;, &quot;Pants&quot;, or &quot;Watch&quot;
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  setIsSearchOpen(false);
                  openQuickView(product);
                }}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF7F2] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-14 h-14 object-cover rounded-lg bg-neutral-200 shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900 group-hover:text-black">
                      {product.title}
                    </h4>
                    <p className="text-xs text-neutral-500 font-light">
                      {product.categoryName} · {product.subtitle}
                    </p>
                    <span className="text-xs font-bold text-neutral-950 font-sans mt-0.5 inline-block">
                      ৳ {product.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, product.sizes[0], product.colorSwatches[0]?.name, 1);
                    }}
                    className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors"
                    title="Add to cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
