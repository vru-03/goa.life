import React, { useState } from 'react';
import { Region } from '../types';
import { Heart, Menu, X, Sparkles, Sunset, Utensils, Compass } from 'lucide-react';

interface NavbarProps {
  currentRegion: Region;
  onSelectRegion: (region: Region) => void;
  activeTab: 'explore' | 'ai-itinerary' | 'sunset-tide' | 'map' | 'guides' | 'planner';
  onSelectTab: (tab: 'explore' | 'ai-itinerary' | 'sunset-tide' | 'map' | 'guides' | 'planner') => void;
  savedCount: number;
  onOpenSaved: () => void;
  onOpenGlossary?: () => void;
  onOpenLogistics?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRegion,
  onSelectRegion,
  activeTab,
  onSelectTab,
  savedCount,
  onOpenSaved,
  onOpenGlossary,
  onOpenLogistics
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTab = (tab: 'explore' | 'ai-itinerary' | 'sunset-tide' | 'map' | 'guides' | 'planner') => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => handleTab('explore')}
            className="flex items-center gap-2 text-left group shrink-0"
          >
            <span className="font-extrabold text-2xl tracking-tight text-stone-900 font-serif-title">
              goa<span className="text-orange-600 font-sans font-normal">.life</span>
            </span>
          </button>

          {/* Region Pill */}
          <div className="hidden lg:flex items-center bg-stone-100 p-0.5 rounded-full border border-stone-200 text-xs font-medium">
            <button
              onClick={() => onSelectRegion('all')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                currentRegion === 'all'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onSelectRegion('north')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                currentRegion === 'north'
                  ? 'bg-stone-900 text-white shadow-xs font-semibold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              North Goa
            </button>
            <button
              onClick={() => onSelectRegion('south')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                currentRegion === 'south'
                  ? 'bg-stone-900 text-white shadow-xs font-semibold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              South Goa
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-stone-600">
            <button
              onClick={() => handleTab('explore')}
              className={`transition-colors hover:text-stone-900 ${
                activeTab === 'explore' ? 'text-stone-950 font-semibold border-b-2 border-stone-900 pb-0.5' : ''
              }`}
            >
              Discover
            </button>

            <button
              onClick={() => handleTab('ai-itinerary')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'ai-itinerary'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Itinerary</span>
            </button>

            <button
              onClick={() => handleTab('sunset-tide')}
              className={`flex items-center gap-1 transition-colors hover:text-stone-900 ${
                activeTab === 'sunset-tide' ? 'text-stone-950 font-semibold border-b-2 border-stone-900 pb-0.5' : ''
              }`}
            >
              <Sunset className="w-3.5 h-3.5 text-amber-500" />
              <span>Sunset &amp; Tides</span>
            </button>

            <button
              onClick={() => handleTab('map')}
              className={`transition-colors hover:text-stone-900 ${
                activeTab === 'map' ? 'text-stone-950 font-semibold border-b-2 border-stone-900 pb-0.5' : ''
              }`}
            >
              Map
            </button>

            <button
              onClick={() => handleTab('guides')}
              className={`transition-colors hover:text-stone-900 ${
                activeTab === 'guides' ? 'text-stone-950 font-semibold border-b-2 border-stone-900 pb-0.5' : ''
              }`}
            >
              Guides
            </button>

            <button
              onClick={() => handleTab('planner')}
              className={`transition-colors hover:text-stone-900 ${
                activeTab === 'planner' ? 'text-stone-950 font-semibold border-b-2 border-stone-900 pb-0.5' : ''
              }`}
            >
              Planner
            </button>
          </nav>

          {/* Right Actions: Quick Tools & Saved */}
          <div className="flex items-center gap-2">
            
            {/* Konkani Food Glossary Trigger */}
            {onOpenGlossary && (
              <button
                onClick={onOpenGlossary}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                title="Konkani Food & Culture Dictionary"
              >
                <Utensils className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden lg:inline">Food Glossary</span>
              </button>
            )}

            {/* Travel Logistics Trigger */}
            {onOpenLogistics && (
              <button
                onClick={onOpenLogistics}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                title="Scooter Rentals, Police Checkpoints & Packing"
              >
                <Compass className="w-3.5 h-3.5 text-orange-600" />
                <span className="hidden lg:inline">Survival Guide</span>
              </button>
            )}

            {/* Saved Spots Heart */}
            <button
              onClick={onOpenSaved}
              className="p-2 rounded-full text-stone-600 hover:text-rose-600 hover:bg-stone-50 transition-all relative"
              title="Saved Spots"
            >
              <Heart className={`w-4 h-4 ${savedCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {savedCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-100 space-y-3 animate-in fade-in">
            {/* Mobile Region Switch */}
            <div className="flex bg-stone-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => onSelectRegion('all')}
                className={`flex-1 py-1.5 rounded-lg text-center font-medium ${
                  currentRegion === 'all' ? 'bg-white shadow-xs text-stone-900 font-bold' : 'text-stone-500'
                }`}
              >
                All
              </button>
              <button
                onClick={() => onSelectRegion('north')}
                className={`flex-1 py-1.5 rounded-lg text-center font-medium ${
                  currentRegion === 'north' ? 'bg-stone-900 text-white font-bold' : 'text-stone-500'
                }`}
              >
                North Goa
              </button>
              <button
                onClick={() => onSelectRegion('south')}
                className={`flex-1 py-1.5 rounded-lg text-center font-medium ${
                  currentRegion === 'south' ? 'bg-stone-900 text-white font-bold' : 'text-stone-500'
                }`}
              >
                South Goa
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <button
                onClick={() => handleTab('explore')}
                className={`p-2.5 rounded-xl text-left ${activeTab === 'explore' ? 'bg-stone-900 text-white' : 'bg-stone-50 text-stone-700'}`}
              >
                Discover
              </button>
              <button
                onClick={() => handleTab('ai-itinerary')}
                className={`p-2.5 rounded-xl text-left font-bold ${activeTab === 'ai-itinerary' ? 'bg-orange-600 text-white' : 'bg-orange-50 text-orange-800'}`}
              >
                ✨ AI Itinerary
              </button>
              <button
                onClick={() => handleTab('sunset-tide')}
                className={`p-2.5 rounded-xl text-left font-semibold ${activeTab === 'sunset-tide' ? 'bg-stone-900 text-white' : 'bg-stone-50 text-stone-700'}`}
              >
                🌅 Sunset &amp; Tides
              </button>
              <button
                onClick={() => handleTab('map')}
                className={`p-2.5 rounded-xl text-left ${activeTab === 'map' ? 'bg-stone-900 text-white' : 'bg-stone-50 text-stone-700'}`}
              >
                Interactive Map
              </button>
              <button
                onClick={() => handleTab('guides')}
                className={`p-2.5 rounded-xl text-left ${activeTab === 'guides' ? 'bg-stone-900 text-white' : 'bg-stone-50 text-stone-700'}`}
              >
                Local Guides
              </button>
              <button
                onClick={() => handleTab('planner')}
                className={`p-2.5 rounded-xl text-left ${activeTab === 'planner' ? 'bg-stone-900 text-white' : 'bg-stone-50 text-stone-700'}`}
              >
                Trip Planner
              </button>
            </div>

            {/* Mobile quick actions for food glossary & survival guide */}
            <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
              {onOpenGlossary && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenGlossary();
                  }}
                  className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold flex items-center gap-1.5"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Food Glossary</span>
                </button>
              )}

              {onOpenLogistics && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogistics();
                  }}
                  className="p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 font-bold flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Survival Guide</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
