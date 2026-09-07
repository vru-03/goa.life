import React from 'react';
import { Region } from '../types';

interface FooterProps {
  onSelectRegion: (region: Region) => void;
  onSelectTab: (tab: 'explore' | 'ai-itinerary' | 'map' | 'guides' | 'planner') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectRegion,
  onSelectTab
}) => {
  return (
    <footer className="bg-white border-t border-stone-200/80 py-8 mt-12 text-xs text-stone-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-lg text-stone-900 font-serif-title">
            goa<span className="text-orange-600 font-sans font-normal">.life</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-stone-600">
          <button onClick={() => { onSelectRegion('north'); onSelectTab('explore'); }} className="hover:text-stone-950">
            North Goa
          </button>
          <button onClick={() => { onSelectRegion('south'); onSelectTab('explore'); }} className="hover:text-stone-950">
            South Goa
          </button>
          <button onClick={() => onSelectTab('ai-itinerary')} className="hover:text-orange-600 font-semibold">
            ✨ AI Itinerary
          </button>
          <button onClick={() => onSelectTab('map')} className="hover:text-stone-950">
            Map
          </button>
          <button onClick={() => onSelectTab('guides')} className="hover:text-stone-950">
            Guides
          </button>
          <button onClick={() => onSelectTab('planner')} className="hover:text-stone-950">
            Planner
          </button>
        </div>
      </div>
    </footer>
  );
};
