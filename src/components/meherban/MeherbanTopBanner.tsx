'use client';

import React from 'react';

export const MeherbanTopBanner: React.FC = () => {
  return (
    <div className="bg-[#0A0A0A] text-white text-[11px] sm:text-[12px] font-normal py-2 px-3 tracking-wide border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4 text-center">
        {/* Desktop View Content */}
        <div className="hidden sm:flex items-center gap-3">
          <span className="flex items-center gap-1.5 opacity-90">
            <span>🚚</span> Free Shipping On All Orders Over ৳ 1999
          </span>
          <span className="text-neutral-500">|</span>
          <span className="flex items-center gap-1.5 opacity-90">
            <span>✨</span> 10% OFF - New Arrivals
          </span>
          <span className="text-neutral-500">|</span>
          <a
            href="#collections"
            className="flex items-center gap-1 text-neutral-300 hover:text-white transition-colors underline decoration-neutral-600 underline-offset-2"
          >
            <span>🏷️</span> Shop Now &rarr;
          </a>
        </div>

        {/* Mobile View Content (Exact match to mobile screenshot) */}
        <div className="flex sm:hidden items-center justify-center gap-1.5 text-[11px] font-medium truncate">
          <span>🚚 Free Shipping Over ৳ 1999</span>
          <span className="text-neutral-500">|</span>
          <span>✨ 10% OFF - New Arrivals &rarr;</span>
        </div>
      </div>
    </div>
  );
};
