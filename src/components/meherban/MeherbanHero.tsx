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
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=85',
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
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
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
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=85',
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
    }, 7000);
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
      className="relative overflow-hidden bg-gradient-to-br from-[#1C1715] via-[#241E1B] to-[#181311] text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/15 via-transparent to-black/60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[460px] sm:min-h-[520px] lg:min-h-[580px]">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-4 sm:space-y-6 text-center lg:text-left order-2 lg:order-1">
            <div className="inline-block">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#D4C3B3]">
                {slide.tagline}
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight uppercase leading-[1.08] text-white">
              <span className="block">{slide.headlineLine1}</span>
              <span className="block text-neutral-100">{slide.headlineLine2}</span>
            </h1>

            <p className="text-xs sm:text-sm text-neutral-300/90 font-light tracking-wide">
              {slide.subcategories}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <a
                href="#trending"
                onClick={() => setActiveCategory('Clothing')}
                className="inline-flex items-center justify-center px-6 py-3 bg-[#111111] hover:bg-black text-white text-xs font-medium tracking-[0.16em] uppercase rounded-sm border border-neutral-700/80 hover:border-neutral-500 shadow-lg hover:shadow-neutral-900/50 transition-all group"
              >
                <span>{slide.ctaPrimary}</span>
              </a>

              <a
                href="#collections"
                className="inline-flex items-center justify-center px-6 py-3 bg-transparent hover:bg-white/10 text-neutral-200 hover:text-white text-xs font-medium tracking-[0.16em] uppercase rounded-sm border border-neutral-500/60 hover:border-white transition-all"
              >
                <span>{slide.ctaSecondary}</span>
              </a>
            </div>

            {/* Bottom-left Pagination Indicator: 01 —— 02 —— 03 */}
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
                      className={`transition-colors ${
                        isActive ? 'text-white font-bold' : 'text-neutral-500 group-hover:text-neutral-300'
                      }`}
                    >
                      {formattedNum}
                    </span>
                    {index < HERO_SLIDES.length - 1 && (
                      <span className="w-6 h-[1px] bg-neutral-600 block" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Hero Fashion Imagery + Badge + Controls */}
          <div className="lg:col-span-7 relative flex justify-center items-center order-1 lg:order-2">
            <div className="relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[540px] aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-neutral-700/40 group">
              <img
                src={slide.imageUrl}
                alt="MEHERBAN Fashion Editorial"
                className="w-full h-full object-cover object-center transform transition-transform duration-1000 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

              {/* Floating Top-Right Luxury Seal Badge */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-black/40 backdrop-blur-md border border-neutral-600/50 p-2.5 sm:p-3 rounded-lg text-right select-none">
                <div className="text-[7.5px] sm:text-[8.5px] tracking-[0.25em] uppercase font-mono text-neutral-300 leading-tight space-y-0.5">
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
              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-2 z-20">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-neutral-600/60 flex items-center justify-center text-white transition-colors"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-neutral-600/60 flex items-center justify-center text-white transition-colors"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="lg:hidden absolute bottom-5 left-5 flex items-center gap-2 font-mono text-[11px] text-neutral-300">
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
