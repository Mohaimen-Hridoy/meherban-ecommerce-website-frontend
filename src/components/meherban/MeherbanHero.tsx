'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMeherban } from '@/context/MeherbanContext';

const HERO_SLIDES = [
  {
    id: 1,
    tagline: "MEN'S & WOMEN'S COLLECTION",
    headlineLine1: 'STYLE FOR',
    headlineLine2: 'EVERY YOU',
    subcategories: 'Clothing | Fashion Accessories | Unisex',
    imageUrl:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=85',
    ctaPrimary: 'SHOP NOW →',
    ctaSecondary: 'EXPLORE',
  },
  {
    id: 2,
    tagline: 'AUTUMN / WINTER EDIT',
    headlineLine1: 'TIMELESS',
    headlineLine2: 'MINIMALISM',
    subcategories: 'Heavyweight Knits | Structured Crepe | Eyewear',
    imageUrl:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85',
    ctaPrimary: 'DISCOVER →',
    ctaSecondary: 'LOOKBOOK',
  },
  {
    id: 3,
    tagline: 'STREET LUXE EDIT',
    headlineLine1: 'URBAN',
    headlineLine2: 'REDEFINED',
    subcategories: 'Graphic Hoodies | Leather Bags | Timepieces',
    imageUrl:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=85',
    ctaPrimary: 'SHOP NOW →',
    ctaSecondary: 'DETAILS',
  },
];

export const MeherbanHero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setActiveCategory } = useMeherban();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[#1E1917] text-white"
    >
      {/* Background Ambience Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#171311] via-[#211B18] to-[#1A1513] opacity-95" />

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center min-h-[440px] sm:min-h-[500px] lg:min-h-[560px]">
          
          {/* Left Column: Headline & Action Controls */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-4 sm:space-y-6 text-center lg:text-left order-2 lg:order-1 pt-2 lg:pt-0">
            {/* Tagline / Eyebrow */}
            <div className="inline-block">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.3em] text-[#CDB9A6]">
                {slide.tagline}
              </span>
            </div>

            {/* Massive Serif Title */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[56px] font-bold tracking-tight uppercase leading-[1.05] text-white">
              <span className="block">{slide.headlineLine1}</span>
              <span className="block text-neutral-100">{slide.headlineLine2}</span>
            </h1>

            {/* Sub-categories */}
            <p className="text-xs sm:text-sm text-neutral-300 font-light tracking-wider">
              {slide.subcategories}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <a
                href="#trending"
                onClick={() => setActiveCategory('Clothing')}
                className="inline-flex items-center justify-center px-6 py-3 bg-[#0D0D0D] hover:bg-black text-white text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase rounded-xs border border-neutral-700/80 hover:border-neutral-400 shadow-xl transition-all"
              >
                <span>{slide.ctaPrimary}</span>
              </a>

              <a
                href="#collections"
                className="inline-flex items-center justify-center px-6 py-3 bg-transparent hover:bg-white/10 text-neutral-200 hover:text-white text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase rounded-xs border border-neutral-600/70 hover:border-white transition-all"
              >
                <span>{slide.ctaSecondary}</span>
              </a>
            </div>

            {/* Desktop Bottom-left Pagination: 01 —— 02 —— 03 */}
            <div className="hidden lg:flex items-center gap-3 pt-8 text-xs font-mono tracking-widest text-neutral-400">
              {HERO_SLIDES.map((s, index) => {
                const isActive = currentSlide === index;
                const formattedNum = `0${s.id}`;
                return (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlide(index)}
                    className="flex items-center gap-2 group cursor-pointer focus:outline-none"
                  >
                    <span
                      className={`transition-colors text-[11px] ${
                        isActive ? 'text-white font-bold' : 'text-neutral-500 group-hover:text-neutral-300'
                      }`}
                    >
                      {formattedNum}
                    </span>
                    {index < HERO_SLIDES.length - 1 && (
                      <span className="w-8 h-[1px] bg-neutral-600 block" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Hero Couple Editorial Photography + Badge */}
          <div className="lg:col-span-7 relative flex justify-center items-center order-1 lg:order-2">
            <div className="relative w-full max-w-[400px] sm:max-w-[460px] lg:max-w-[540px] aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-neutral-800/80 bg-neutral-900 group">
              <img
                src={slide.imageUrl}
                alt="MEHERBAN Couple Fashion Editorial"
                className="w-full h-full object-cover object-center transform transition-transform duration-1000 ease-out group-hover:scale-105"
                loading="eager"
              />

              {/* Editorial Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

              {/* Floating Top-Right Luxury Seal Badge (Matches Screenshot) */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-black/45 backdrop-blur-md border border-neutral-600/50 p-2.5 sm:p-3 rounded-lg text-right select-none shadow-md">
                <div className="text-[7.5px] sm:text-[8px] tracking-[0.26em] uppercase font-mono text-neutral-300 leading-tight space-y-0.5">
                  <p>PREMIUM</p>
                  <p>QUALITY</p>
                  <p>MODERN</p>
                  <p>STYLE</p>
                  <p className="font-serif font-bold text-white pt-0.5 tracking-[0.3em]">
                    MEHERBAN
                  </p>
                </div>
              </div>

              {/* Bottom Right Carousel Navigation Arrows */}
              <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 flex items-center gap-2 z-20">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-8 h-8 rounded-full bg-black/55 hover:bg-black/90 backdrop-blur-md border border-neutral-600/70 flex items-center justify-center text-white transition-colors"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-8 h-8 rounded-full bg-black/55 hover:bg-black/90 backdrop-blur-md border border-neutral-600/70 flex items-center justify-center text-white transition-colors"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Slide Indicator Dots (Inside Image Bottom-Left) */}
              <div className="lg:hidden absolute bottom-4 left-4 flex items-center gap-2 font-mono text-[11px] text-neutral-300">
                <span>0{currentSlide + 1}</span>
                <span className="w-4 h-[1px] bg-neutral-400"></span>
                <span className="text-neutral-500">0{HERO_SLIDES.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
