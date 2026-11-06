'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { useMeherban } from '@/context/MeherbanContext';
import { InstagramIcon, FacebookIcon, YoutubeIcon, TikTokIcon } from './SocialIcons';

export const MeherbanFooter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { addToast } = useMeherban();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    addToast('Welcome to the MEHERBAN inner circle!');
    setEmail('');
  };

  return (
    <footer className="bg-[#0B0B0C] text-neutral-400 text-xs border-t border-neutral-900 pb-20 sm:pb-12 pt-12 sm:pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-neutral-800/60">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col">
              <span className="font-serif text-2xl tracking-[0.25em] font-semibold text-white uppercase leading-none">
                MEHERBAN
              </span>
              <span className="text-[9px] tracking-[0.32em] text-neutral-400 uppercase font-medium mt-1">
                WEAR YOUR STORY
              </span>
            </div>

            <p className="text-neutral-400 text-xs sm:text-sm font-light max-w-sm leading-relaxed">
              Curated contemporary fashion celebrating individuality, structured silhouettes, and uncompromised craftsmanship. Made for the modern generation.
            </p>

            <div className="pt-2 text-[11px] text-neutral-500">
              <p>© 2025 MEHERBAN. All rights reserved.</p>
              <p className="mt-0.5">Designed with precision for Dhaka & global citizens.</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest font-mono">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {['Home', 'Men', 'Women', 'Unisex', 'Clothing', 'Accessories'].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#collections"
                      className="hover:text-white transition-colors block text-neutral-400 text-xs"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest font-mono">
              Support & Contact
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="tel:01778607894"
                  className="hover:text-white transition-colors block text-neutral-300 font-medium text-xs"
                >
                  📞 Helpline: 01778607894
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/8801778607894"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors block text-emerald-500 font-medium text-xs"
                >
                  💬 WhatsApp: 01778607894
                </a>
              </li>
              {[
                'About Us',
                'Shipping Policy',
                'Return Policy',
                'Size Guide',
                'FAQs',
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#support"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`${item} — MEHERBAN Care Concierge: 01778607894`);
                    }}
                    className="hover:text-white transition-colors block text-neutral-400 text-xs"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest font-mono">
              Stay Connected
            </h4>
            <p className="text-xs text-neutral-400 font-light">
              Join our newsletter for exclusive private drops, early access & editorial stories.
            </p>

            <form onSubmit={handleSubscribe} className="relative mt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full bg-neutral-900/90 text-white placeholder:text-neutral-500 text-xs rounded-full pl-4 pr-11 py-2.5 border border-neutral-800 focus:border-neutral-500 outline-none transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 w-8 rounded-full bg-neutral-100 hover:bg-white text-black flex items-center justify-center transition-colors"
                aria-label="Subscribe"
              >
                {subscribed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 pt-3 text-neutral-400">
              <a
                href="https://www.instagram.com/meherban___?dlrf=Z2ZmNHpsZnhoOWRo"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram (@meherban___)"
                title="Instagram: @meherban___"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/MeherbanBrand"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook (MeherbanBrand)"
                title="Facebook: MeherbanBrand"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.tiktok.com/@meherban__"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 hover:text-white flex items-center justify-center transition-colors"
                aria-label="TikTok (@meherban__)"
                title="TikTok: @meherban__"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
          <div>
            <span>© 2025 MEHERBAN. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400 tracking-wider uppercase font-mono text-[10px]">
            <span>Fashion</span>
            <span>/</span>
            <span>Style</span>
            <span>/</span>
            <span>For Everyone</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
