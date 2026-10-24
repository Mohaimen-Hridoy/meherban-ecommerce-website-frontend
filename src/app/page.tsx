'use client';

import React from 'react';
import { MeherbanProvider, useMeherban } from '@/context/MeherbanContext';
import { MeherbanTopBanner } from '@/components/meherban/MeherbanTopBanner';
import { MeherbanHeader } from '@/components/meherban/MeherbanHeader';
import { MeherbanHero } from '@/components/meherban/MeherbanHero';
import { MeherbanCollections } from '@/components/meherban/MeherbanCollections';
import { MeherbanTrending } from '@/components/meherban/MeherbanTrending';
import { MeherbanPromoBanners } from '@/components/meherban/MeherbanPromoBanners';
import { MeherbanTrustSection } from '@/components/meherban/MeherbanTrustSection';
import { MeherbanInstagram } from '@/components/meherban/MeherbanInstagram';
import { MeherbanFooter } from '@/components/meherban/MeherbanFooter';
import { MeherbanMobileBottomNav } from '@/components/meherban/MeherbanMobileBottomNav';
import { MeherbanCartDrawer } from '@/components/meherban/MeherbanCartDrawer';
import { MeherbanWishlistDrawer } from '@/components/meherban/MeherbanWishlistDrawer';
import { MeherbanQuickViewModal } from '@/components/meherban/MeherbanQuickViewModal';
import { MeherbanSearchModal } from '@/components/meherban/MeherbanSearchModal';
import { MeherbanCheckoutModal } from '@/components/meherban/MeherbanCheckoutModal';
import { MeherbanDeviceSwitcher } from '@/components/meherban/MeherbanDeviceSwitcher';
import { MeherbanIPhoneFrame } from '@/components/meherban/MeherbanIPhoneFrame';

function StorefrontContent() {
  const { deviceView } = useMeherban();

  const MainStoreBody = (
    <div className="flex flex-col min-h-screen bg-[#FAFAF8]">
      <MeherbanTopBanner />
      <MeherbanHeader />
      <main className="flex-1">
        <MeherbanHero />
        <MeherbanCollections />
        <MeherbanTrending />
        <MeherbanPromoBanners />
        <MeherbanTrustSection />
        <MeherbanInstagram />
      </main>
      <MeherbanFooter />
      <MeherbanMobileBottomNav />

      {/* Global Modals & Drawers */}
      <MeherbanCartDrawer />
      <MeherbanWishlistDrawer />
      <MeherbanQuickViewModal />
      <MeherbanSearchModal />
      <MeherbanCheckoutModal />
    </div>
  );

  return (
    <>
      <MeherbanDeviceSwitcher />

      {deviceView === 'split' ? (
        /* Side-by-Side Dual Mockup View (Matches user's screenshot exactly!) */
        <div className="min-h-screen bg-[#0D0D0E] p-4 lg:p-8 flex items-start justify-center gap-6 xl:gap-10 overflow-x-auto">
          {/* Desktop Preview Frame */}
          <div className="w-[840px] xl:w-[940px] shrink-0 bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-700/50">
            <div className="bg-[#18181B] px-4 py-2.5 border-b border-neutral-800 flex items-center justify-between select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              </div>
              <span className="text-[11px] font-mono text-neutral-400 tracking-wider">
                meherban.com · Desktop View
              </span>
              <div className="w-10" />
            </div>
            <div className="h-[840px] overflow-y-auto no-scrollbar">
              {MainStoreBody}
            </div>
          </div>

          {/* iPhone Mobile Preview Frame */}
          <div className="shrink-0">
            <MeherbanIPhoneFrame>{MainStoreBody}</MeherbanIPhoneFrame>
          </div>
        </div>
      ) : deviceView === 'mobile' ? (
        <MeherbanIPhoneFrame>{MainStoreBody}</MeherbanIPhoneFrame>
      ) : (
        MainStoreBody
      )}
    </>
  );
}

export default function Home() {
  return (
    <MeherbanProvider>
      <StorefrontContent />
    </MeherbanProvider>
  );
}
