'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { MEHERBAN_CATEGORIES } from '@/lib/meherbanData';
import { useMeherban } from '@/context/MeherbanContext';

export const MeherbanCollections: React.FC = () => {
  const { setActiveCategory, categories } = useMeherban();
  const displayCategories = categories && categories.length > 0 ? categories : MEHERBAN_CATEGORIES;

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
    const el = document.getElementById('trending');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="collections" className="py-10 sm:py-16 bg-[#FAF9F6] text-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-neutral-400 block mb-1">
              SHOP BY COLLECTION
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-neutral-950">
              FIND YOUR STYLE
            </h2>
          </div>

          <a
            href="#trending"
            onClick={() => setActiveCategory('All')}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium uppercase tracking-wider text-neutral-600 hover:text-black transition-colors"
          >
            <span>VIEW ALL</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* 
          Collection Cards Grid:
          - Desktop: 4 columns side by side
          - Mobile: EXACT 2x2 grid (grid-cols-2) matching the mobile screenshot!
        */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {displayCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className="group relative aspect-[3/4] sm:aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300 bg-neutral-200"
            >
              {/* Image */}
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />

              {/* Editorial Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity group-hover:opacity-95" />

              {/* Bottom Card Content Badge */}
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white z-10 flex flex-col items-start select-none">
                <span className="text-sm sm:text-base font-bold uppercase tracking-wider text-white drop-shadow-xs">
                  {category.name}
                </span>

                <div className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-neutral-300 group-hover:text-white transition-colors mt-0.5 font-light">
                  <span>Shop Now</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
