import React from 'react';
import { Region, Category, BudgetLevel } from '../types';
import { Search, Sparkles, Sunset, Utensils, Compass, Laptop, LayoutGrid } from 'lucide-react';
import { WeatherWidget } from './WeatherWidget';

interface HeroProps {
  currentRegion: Region;
  onSelectRegion: (region: Region) => void;
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onlyHiddenGems?: boolean;
  onToggleHiddenGems?: () => void;
  selectedBudget?: BudgetLevel | 'all';
  onSelectBudget?: (b: BudgetLevel | 'all') => void;
  cardViewMode?: 'standard' | 'nomad';
  onToggleCardViewMode?: () => void;
  onOpenSunset?: () => void;
  onOpenGlossary?: () => void;
  onOpenLogistics?: () => void;
}

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'all', label: 'All Curated' },
  { id: 'dining', label: 'Culinary & Dining' },
  { id: 'cafe', label: 'Bakeries & Cafes' },
  { id: 'beach', label: 'Beaches & Surf' },
  { id: 'nightlife', label: 'Cocktail Bars' },
  { id: 'heritage', label: 'Heritage & Forts' },
  { id: 'wellness', label: 'Yoga & Retreats' },
  { id: 'nature', label: 'Waterfalls & Lagoons' },
];

const BUDGET_OPTIONS: { id: BudgetLevel | 'all'; label: string }[] = [
  { id: 'all', label: 'All Budgets' },
  { id: 'pocket-friendly', label: '🎒 Pocket-Friendly' },
  { id: 'balanced', label: '☕ Balanced' },
  { id: 'elevated-luxury', label: '✨ Elevated Luxury' }
];

export const Hero: React.FC<HeroProps> = ({
  currentRegion,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onlyHiddenGems = false,
  onToggleHiddenGems,
  selectedBudget = 'all',
  onSelectBudget,
  cardViewMode = 'standard',
  onToggleCardViewMode,
  onOpenSunset,
  onOpenGlossary,
  onOpenLogistics
}) => {
  return (
    <section className="border-b border-stone-200/60 bg-gradient-to-b from-stone-50/50 to-white pt-8 pb-7 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        
        {/* Editorial Headline with Weather Pill */}
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-stone-900 font-serif-title tracking-tight leading-snug">
                Discover the quiet and vibrant sides of Goa.
              </h1>
            </div>
            <p className="text-stone-500 text-xs sm:text-sm font-normal tracking-wide leading-relaxed">
              An insider directory of beach coves, heritage Portuguese mansions, bakeries &amp; sunsets across North and South Goa.
            </p>
          </div>

          {/* Weather Widget */}
          <div className="shrink-0 self-start md:self-end">
            <WeatherWidget currentRegion={currentRegion} />
          </div>
        </div>

        {/* Quick Tool Banners */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5 text-xs">
          {onOpenSunset && (
            <button
              onClick={onOpenSunset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-200/80 text-orange-900 font-semibold hover:bg-orange-100/60 transition-all shrink-0"
            >
              <Sunset className="w-3.5 h-3.5 text-orange-600" />
              <span>🌅 Sunset &amp; Tide Live Clock</span>
            </button>
          )}

          {onOpenGlossary && (
            <button
              onClick={onOpenGlossary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50/80 border border-amber-200/80 text-amber-900 font-semibold hover:bg-amber-100/60 transition-all shrink-0"
            >
              <Utensils className="w-3.5 h-3.5 text-amber-700" />
              <span>🍲 Konkani Food Glossary (Poee, Sol Kadi)</span>
            </button>
          )}

          {onOpenLogistics && (
            <button
              onClick={onOpenLogistics}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-stone-800 font-semibold hover:bg-stone-200 transition-all shrink-0"
            >
              <Compass className="w-3.5 h-3.5 text-stone-600" />
              <span>🛵 Scooter &amp; Police Survival Guide</span>
            </button>
          )}
        </div>

        {/* Clean Search Input & Filter Controls */}
        <div className="pt-1 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search spots, areas, food, wi-fi..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-stone-100/80 border border-stone-200 focus:outline-none focus:bg-white focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-all placeholder:text-stone-400 tracking-wide"
            />
          </div>

          {/* Quick Filter Modifiers: View Mode, Hidden Gems, Budget Level */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5 text-xs">
            {onToggleCardViewMode && (
              <button
                onClick={onToggleCardViewMode}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-all ${
                  cardViewMode === 'nomad'
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100/80 border border-indigo-200/80'
                }`}
                title="Toggle Digital Nomad view (Wi-Fi speed, seating comfort & power outlets)"
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>{cardViewMode === 'nomad' ? '💻 Nomad Specs: ON' : '💻 Digital Nomad View'}</span>
              </button>
            )}

            {onToggleHiddenGems && (
              <button
                onClick={onToggleHiddenGems}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-all ${
                  onlyHiddenGems
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100/80 border border-amber-200/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hidden Gems</span>
              </button>
            )}

            {onSelectBudget && (
              <div className="flex items-center bg-stone-100/90 p-0.5 rounded-full border border-stone-200/70 text-xs">
                {BUDGET_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => onSelectBudget(opt.id)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                      selectedBudget === opt.id
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 text-xs border-t border-stone-100 pt-3">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-all ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100/70 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900 border border-stone-200/50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
