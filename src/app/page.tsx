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
      {deviceView === 'mobile' ? (
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
