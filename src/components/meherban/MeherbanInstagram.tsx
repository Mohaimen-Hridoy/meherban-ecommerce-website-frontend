'use client';

import React, { useRef } from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { INSTAGRAM_POSTS } from '@/lib/meherbanData';
import { InstagramIcon } from './SocialIcons';
import { useMeherban } from '@/context/MeherbanContext';

export const MeherbanInstagram: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { instagramPosts } = useMeherban();
  const posts = instagramPosts && instagramPosts.length > 0 ? instagramPosts : INSTAGRAM_POSTS;

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-10 sm:py-14 bg-[#FAFAF8] text-neutral-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-neutral-400 block mb-1">
              FOLLOW US ON INSTAGRAM
            </span>
            <h2 className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-neutral-950">
              Style. Community. MEHERBAN.
            </h2>
          </div>

          <a
            href="https://www.instagram.com/meherban___?dlrf=Z2ZmNHpsZnhoOWRo"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium uppercase tracking-wider text-neutral-600 hover:text-black transition-colors"
          >
            <InstagramIcon className="w-4 h-4 text-neutral-600 group-hover:text-black" />
            <span className="hidden sm:inline">@meherban___</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={scrollRef}
          className="flex gap-2.5 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2"
        >
          {posts.map((item) => (
            <a
              key={item.id}
              href="https://www.instagram.com/meherban___?dlrf=Z2ZmNHpsZnhoOWRo"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex-none w-[115px] sm:w-[140px] md:w-[155px] aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-neutral-200 cursor-pointer shadow-xs"
            >
              <img
                src={item.imageUrl}
                alt="MEHERBAN Instagram Look"
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2 text-center">
                <InstagramIcon className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-medium">{item.likes}</span>
              </div>
            </a>
          ))}

          <button
            type="button"
            onClick={scrollRight}
            className="flex-none self-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-md border border-neutral-200 flex items-center justify-center text-neutral-700 hover:text-black hover:scale-105 transition-all ml-1"
            aria-label="Scroll more photos"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
