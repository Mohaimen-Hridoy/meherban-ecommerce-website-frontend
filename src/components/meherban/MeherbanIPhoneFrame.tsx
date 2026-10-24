'use client';

import React from 'react';
import { Wifi, Battery } from 'lucide-react';

interface MeherbanIPhoneFrameProps {
  children: React.ReactNode;
}

export const MeherbanIPhoneFrame: React.FC<MeherbanIPhoneFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="relative w-full max-w-[390px] h-[844px] bg-white rounded-[50px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-[10px] border-neutral-800 overflow-hidden flex flex-col">
        {/* Top iOS Status Bar (9:41, Dynamic Island, Wifi, Battery) */}
        <div className="bg-black text-white px-7 pt-3 pb-2 flex items-center justify-between text-xs z-50 select-none shrink-0">
          <span className="font-semibold tracking-tight text-[13px]">9:41</span>
          
          <div className="w-24 h-4 bg-neutral-900 rounded-full flex items-center justify-center" />

          <div className="flex items-center gap-1.5 text-neutral-300">
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 h-1 bg-white rounded-xs"></span>
              <span className="w-0.5 h-1.5 bg-white rounded-xs"></span>
              <span className="w-0.5 h-2 bg-white rounded-xs"></span>
              <span className="w-0.5 h-2.5 bg-white rounded-xs"></span>
            </div>
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
          {children}
        </div>

        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-neutral-400/80 rounded-full z-50 pointer-events-none" />
      </div>
    </div>
  );
};
