'use client';

import React from 'react';
import { useMeherban } from '@/context/MeherbanContext';

export const MeherbanPromoBanners: React.FC = () => {
  const { setActiveCategory } = useMeherban();

  const promos = [
    {
      id: 'men-promo',
      category: 'Men',
      title: "MEN'S COLLECTION",
      subtitle: 'Classic meets modern.',
      cta: 'SHOP NOW →',
      bgClass: 'bg-[#1F1A18] text-white',
      imageUrl:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=85',
    },
    {
      id: 'women-promo',
      category: 'Women',
      title: "WOMEN'S COLLECTION",
      subtitle: 'Elegance in every detail.',
      cta: 'SHOP NOW →',
      bgClass: 'bg-[#9C7F6E] text-white',
      imageUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85',
    },
    {
      id: 'accessories-promo',
      category: 'Accessories',
      title: 'ACCESSORIES',
      subtitle: 'Complete your look.',
      cta: 'SHOP NOW →',
      bgClass: 'bg-[#241E1C] text-white',
      imageUrl:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85',
    },
  ];

  return (
    <section className="py-6 sm:py-12 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {promos.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveCategory(item.category)}
              className={`relative overflow-hidden rounded-xl sm:rounded-2xl cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 ${item.bgClass} flex items-center min-h-[160px] sm:min-h-[180px] group`}
            >
              {/* Image Container */}
              <div className="w-5/12 h-full absolute left-0 top-0 bottom-0 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-current" />
              </div>

              {/* Text Info */}
              <div className="ml-auto w-7/12 p-4 sm:p-5 flex flex-col justify-center items-start z-10 pl-2">
                <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.16em] leading-tight font-serif">
                  {item.title}
                </span>

                <p className="text-[11px] text-neutral-200 font-light mt-0.5 mb-2.5">
                  {item.subtitle}
                </p>

                <span className="inline-flex items-center text-[10px] font-semibold tracking-widest uppercase border-b border-white/60 pb-0.5 group-hover:border-white transition-all">
                  {item.cta}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
