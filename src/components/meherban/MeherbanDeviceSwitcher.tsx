'use client';

import React from 'react';
import { Monitor, Smartphone, Maximize2 } from 'lucide-react';
import { useMeherban } from '@/context/MeherbanContext';

export const MeherbanDeviceSwitcher: React.FC = () => {
  const { deviceView, setDeviceView } = useMeherban();

  return (
    <div className="fixed top-24 right-4 z-40 hidden md:flex items-center gap-1 bg-black/85 backdrop-blur-md p-1.5 rounded-full shadow-2xl border border-neutral-700/80 text-white select-none">
      <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 pl-2 pr-1 font-semibold">
        View:
      </span>

      <button
        type="button"
        onClick={() => setDeviceView('responsive')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
          deviceView === 'responsive'
            ? 'bg-white text-black shadow-sm font-semibold'
            : 'text-neutral-300 hover:text-white'
        }`}
        title="Responsive Browser View"
      >
        <Maximize2 className="w-3.5 h-3.5" />
        <span>Full Web</span>
      </button>

      <button
        type="button"
        onClick={() => setDeviceView('mobile')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
          deviceView === 'mobile'
            ? 'bg-white text-black shadow-sm font-semibold'
            : 'text-neutral-300 hover:text-white'
        }`}
        title="iPhone Mockup Frame (Matches User Screenshot)"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span>iPhone View</span>
      </button>

      <button
        type="button"
        onClick={() => setDeviceView('desktop')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
          deviceView === 'desktop'
            ? 'bg-white text-black shadow-sm font-semibold'
            : 'text-neutral-300 hover:text-white'
        }`}
        title="Standard Desktop View"
      >
        <Monitor className="w-3.5 h-3.5" />
        <span>Desktop</span>
      </button>
    </div>
  );
};
