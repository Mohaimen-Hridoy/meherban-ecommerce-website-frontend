'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { MEHERBAN_CATEGORIES } from '@/lib/meherbanData';
import { useMeherban } from '@/context/MeherbanContext';

export const MeherbanCollections: React.FC = () => {
  const { setActiveCategory } = useMeherban();

  return (
    <section id="collections" className="py-10 sm:py-16 bg-[#FAFAF8] text-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6 sm:mb-10">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-neutral-400 block mb-1">
              SHOP BY COLLECTION
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-neutral-950">
              FIND YOUR STYLE
            </h2>
          </div>

          <a
            href="#trending"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium uppercase tracking-wider text-neutral-600 hover:text-black transition-colors"
          >
            <span>VIEW ALL</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {MEHERBAN_CATEGORIES.map((category) => (
            <div
              key={category.id}
              onClick={() => setActiveCategory(category.name)}
              className="group relative aspect-[3/4] sm:aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 bg-neutral-200"
            >
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity group-hover:opacity-90" />

              <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 text-white z-10 flex flex-col items-start">
                <span className="text-sm sm:text-base lg:text-lg font-bold uppercase tracking-wider text-white">
                  {category.name}
                </span>

                <div className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-neutral-300 group-hover:text-white transition-colors mt-0.5">
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
