'use client';

import React from 'react';
import { ShieldCheck, CreditCard, Truck, RefreshCw, Headphones } from 'lucide-react';

export const MeherbanTrustSection: React.FC = () => {
  const trustItems = [
    {
      icon: ShieldCheck,
      title: 'Premium Quality',
      subtitle: 'Trusted products',
    },
    {
      icon: CreditCard,
      title: 'Secure Payment',
      subtitle: '100% safe checkout',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      subtitle: 'On all orders',
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      subtitle: 'Hassle free process',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      subtitle: "We're here to help",
    },
  ];

  return (
    <section className="py-8 sm:py-12 bg-white border-y border-neutral-100 text-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
          {/* Section Left Title */}
          <div className="lg:w-1/6 shrink-0 text-center lg:text-left border-b lg:border-b-0 lg:border-r border-neutral-200 pb-3 lg:pb-0 lg:pr-6">
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400 block mb-0.5">
              ASSURANCE
            </span>
            <h3 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-900">
              WHY SHOP WITH US?
            </h3>
          </div>

          {/* 
            Trust Items:
            - Desktop (lg:): 5 items in a single horizontal row
            - Mobile (default): 2 columns matching the mobile screenshot!
          */}
          <div className="lg:w-5/6 grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-6">
            {trustItems.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-2.5 p-1.5 sm:p-2 rounded-lg hover:bg-neutral-50/80 transition-colors"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
                    <IconComponent className="w-3.5 h-3.5 stroke-[1.6]" />
                  </div>
                  <div>
                    <h4 className="text-[11px] sm:text-[13px] font-semibold text-neutral-900 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-neutral-500 font-light mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
