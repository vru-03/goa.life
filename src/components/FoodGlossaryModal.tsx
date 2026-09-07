import React, { useState } from 'react';
import { KONKANI_GLOSSARY, GlossaryTerm } from '../data/glossary';
import { Spot } from '../types';
import { 
  Utensils, 
  Search, 
  Volume2, 
  X, 
  Sparkles, 
  Coffee, 
  Wine, 
  HeartHandshake, 
  MapPin, 
  Check, 
  ExternalLink,
  Flame
} from 'lucide-react';

interface FoodGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSpot?: (spot: Spot) => void;
  allSpots?: Spot[];
  initialTermId?: string | null;
}

export const FoodGlossaryModal: React.FC<FoodGlossaryModalProps> = ({
  isOpen,
  onClose,
  onSelectSpot,
  allSpots = [],
  initialTermId = null
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'food' | 'drink' | 'bread' | 'culture'>('all');
  const [search, setSearch] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(() => {
    if (initialTermId) {
      return KONKANI_GLOSSARY.find((g) => g.id === initialTermId) || KONKANI_GLOSSARY[0];
    }
    return KONKANI_GLOSSARY[0];
  });
  const [onlyVeg, setOnlyVeg] = useState(false);

  if (!isOpen) return null;

  const filteredTerms = KONKANI_GLOSSARY.filter((term) => {
    const matchesCat = activeCategory === 'all' || term.category === activeCategory;
    const matchesVeg = !onlyVeg || term.isVegetarian;
    const matchesSearch =
      search.trim() === '' ||
      term.name.toLowerCase().includes(search.toLowerCase()) ||
      term.description.toLowerCase().includes(search.toLowerCase()) ||
      term.ingredients.some((ing) => ing.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesVeg && matchesSearch;
  });

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleViewSpot = (spotId?: string) => {
    if (!spotId || !onSelectSpot) return;
    const spot = allSpots.find((s) => s.id === spotId);
    if (spot) {
      onClose();
      onSelectSpot(spot);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-stone-200 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-normal text-stone-900 font-serif-title">
                  Konkani Culinary &amp; Culture Guide
                </h2>
                <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                  Local Flavors
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Authentic dishes, pronunciations, sourdough poee, sol kadi, feni &amp; dining etiquette.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Bar */}
        <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search Poee, Sol Kadi, Cafreal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-stone-100 border border-stone-200 focus:outline-none focus:bg-white focus:border-stone-400 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto scrollbar-none">
            {[
              { id: 'all' as const, label: 'All' },
              { id: 'food' as const, label: 'Curries & Dishes' },
              { id: 'drink' as const, label: 'Drinks & Feni' },
              { id: 'bread' as const, label: 'Breads & Poee' },
              { id: 'culture' as const, label: 'Philosophy' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 rounded-xl text-xs whitespace-nowrap font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}

            <button
              onClick={() => setOnlyVeg(!onlyVeg)}
              className={`px-2.5 py-1 rounded-xl text-xs whitespace-nowrap font-semibold border transition-all ${
                onlyVeg
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-stone-50 border-stone-200 text-stone-500 hover:border-stone-300'
              }`}
            >
              🌱 Veg Only
            </button>
          </div>
        </div>

        {/* Main Content split */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          
          {/* Terms List (Left column) */}
          <div className="md:col-span-5 border-r border-stone-100 overflow-y-auto max-h-[50vh] md:max-h-full p-3 space-y-1.5 bg-stone-50/50">
            {filteredTerms.map((term) => {
              const isSelected = selectedTerm?.id === term.id;
              return (
                <button
                  key={term.id}
                  onClick={() => setSelectedTerm(term)}
                  className={`w-full text-left p-3 rounded-2xl transition-all border flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-white border-amber-500/80 shadow-xs'
                      : 'bg-white/60 border-stone-200/70 hover:bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-stone-900 truncate">
                        {term.name}
                      </span>
                      {term.isVegetarian && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Vegetarian" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 truncate mt-0.5">
                      {term.tagline}
                    </p>
                  </div>

                  <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded shrink-0">
                    /{term.pronunciation}/
                  </span>
                </button>
              );
            })}

            {filteredTerms.length === 0 && (
              <div className="p-8 text-center text-xs text-stone-400">
                No culinary terms found matching &quot;{search}&quot;.
              </div>
            )}
          </div>

          {/* Detailed Term View (Right column) */}
          <div className="md:col-span-7 p-6 overflow-y-auto max-h-[55vh] md:max-h-full space-y-5 bg-white">
            {selectedTerm ? (
              <>
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-2xl font-normal text-stone-900 font-serif-title">
                        {selectedTerm.name}
                      </h3>
                      <button
                        onClick={() => handleSpeak(selectedTerm.name)}
                        className="p-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors"
                        title="Listen to pronunciation"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {selectedTerm.isVegetarian ? (
                        <span className="text-[10.5px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full">
                          🌱 100% Vegetarian
                        </span>
                      ) : (
                        <span className="text-[10.5px] font-medium bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full">
                          Coastal / Meat
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span className="font-mono bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-medium">
                      Phonetic: /{selectedTerm.pronunciation}/
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      <span>{selectedTerm.spiceLevel}</span>
                    </span>
                  </div>
                </div>

                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed border-y border-stone-100 py-3 font-normal">
                  {selectedTerm.description}
                </p>

                {/* Key Ingredients */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Traditional Ingredients &amp; Aromatics
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTerm.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-xl text-xs bg-stone-50 border border-stone-200 text-stone-700 font-medium"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Where to try in Goa */}
                {selectedTerm.mustTrySpotRecommendation && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-2">
                    <div className="flex items-center gap-1.5 text-amber-900 text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      <span>Where to Taste the Best in Goa</span>
                    </div>
                    <p className="text-xs text-amber-950 font-medium">
                      {selectedTerm.mustTrySpotRecommendation}
                    </p>

                    {selectedTerm.mustTrySpotId && (
                      <button
                        onClick={() => handleViewSpot(selectedTerm.mustTrySpotId)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:text-amber-950 underline pt-1"
                      >
                        <span>View Curated Spot Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-xs text-stone-400">
                Select a dish or term to learn more.
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-stone-50 border-t border-stone-100 text-center text-[11px] text-stone-400">
          Pro Tip: Ask Goan restaurant staff for &quot;Fresh Poee&quot; instead of sliced bread with your curries.
        </div>
      </div>
    </div>
  );
};
