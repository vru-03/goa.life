/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Region, Category, Spot, SpotReview, ItineraryItem, BudgetLevel } from './types';
import { GOA_SPOTS } from './data/spots';
import { LOCAL_GUIDES } from './data/guides';
import { INITIAL_REVIEWS } from './data/reviews';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PhrasesOfDay } from './components/PhrasesOfDay';
import { SpotCard } from './components/SpotCard';
import { SpotModal } from './components/SpotModal';
import { InteractiveMap } from './components/InteractiveMap';
import { LocalGuides } from './components/LocalGuides';
import { AddReviewModal } from './components/AddReviewModal';
import { TripPlanner } from './components/TripPlanner';
import { AIItinerary } from './components/AIItinerary';
import { SunsetTideGuide } from './components/SunsetTideGuide';
import { FoodGlossaryModal } from './components/FoodGlossaryModal';
import { TravelLogisticsModal } from './components/TravelLogisticsModal';
import { SavedDrawer } from './components/SavedDrawer';
import { Footer } from './components/Footer';
import { MusicPlayer } from './components/MusicPlayer';

const STORAGE_KEY_SAVED = 'goa_life_saved_v1';
const STORAGE_KEY_REVIEWS = 'goa_life_reviews_v1';
const STORAGE_KEY_PLANNER = 'goa_life_planner_v1';

export default function App() {
  // Navigation & Filtering
  const [currentRegion, setCurrentRegion] = useState<Region>('all');
  const [activeTab, setActiveTab] = useState<'explore' | 'ai-itinerary' | 'sunset-tide' | 'map' | 'guides' | 'planner'>('explore');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyHiddenGems, setOnlyHiddenGems] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<BudgetLevel | 'all'>('all');
  const [cardViewMode, setCardViewMode] = useState<'standard' | 'nomad'>('standard');

  // Modals & Drawers
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [addReviewTargetSpot, setAddReviewTargetSpot] = useState<Spot | null>(null);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [glossaryInitialTerm, setGlossaryInitialTerm] = useState<string | null>(null);
  const [isLogisticsOpen, setIsLogisticsOpen] = useState(false);

  // Saved Spots
  const [savedSpotIds, setSavedSpotIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SAVED);
      return stored ? JSON.parse(stored) : ['gunpowder-assagao', 'palolem-beach'];
    } catch {
      return ['gunpowder-assagao', 'palolem-beach'];
    }
  });

  // Reviews (displayed inside individual spot modals)
  const [reviews, setReviews] = useState<SpotReview[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REVIEWS);
      return stored ? JSON.parse(stored) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Planner
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PLANNER);
      if (stored) return JSON.parse(stored);
    } catch {}
    
    const gunpowder = GOA_SPOTS.find((s) => s.id === 'gunpowder-assagao')!;
    const palolem = GOA_SPOTS.find((s) => s.id === 'palolem-beach')!;
    const fontainhas = GOA_SPOTS.find((s) => s.id === 'fontainhas-latin-quarter')!;

    return [
      { id: 'itin-1', day: 1, timeSlot: 'Morning', spot: gunpowder },
      { id: 'itin-2', day: 2, timeSlot: 'Morning', spot: palolem },
      { id: 'itin-3', day: 2, timeSlot: 'Afternoon', spot: fontainhas },
    ];
  });

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedSpotIds));
    } catch {}
  }, [savedSpotIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
    } catch {}
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PLANNER, JSON.stringify(itinerary));
    } catch {}
  }, [itinerary]);

  const handleToggleSave = (spotId: string) => {
    if (savedSpotIds.includes(spotId)) {
      setSavedSpotIds(savedSpotIds.filter((id) => id !== spotId));
    } else {
      setSavedSpotIds([...savedSpotIds, spotId]);
    }
  };

  const handleOpenAddReview = (spot?: Spot) => {
    setAddReviewTargetSpot(spot || null);
    setIsAddReviewOpen(true);
  };

  const handleSubmitReview = (newReview: SpotReview) => {
    setReviews([newReview, ...reviews]);
  };

  const handleAddToItinerary = (spot: Spot, day: number = 1, slot: ItineraryItem['timeSlot'] = 'Morning') => {
    const newItem: ItineraryItem = {
      id: `itin-${Date.now()}`,
      day,
      timeSlot: slot,
      spot
    };
    setItinerary([...itinerary, newItem]);
  };

  const handleImportAIItinerary = (newItems: ItineraryItem[]) => {
    setItinerary(newItems);
  };

  const handleRemoveFromItinerary = (id: string) => {
    setItinerary(itinerary.filter((i) => i.id !== id));
  };

  const handleSelectSpotById = (spotId: string) => {
    const found = GOA_SPOTS.find((s) => s.id === spotId);
    if (found) setSelectedSpot(found);
  };

  const handleOpenGlossaryForTerm = (termId?: string) => {
    setGlossaryInitialTerm(termId || null);
    setIsGlossaryOpen(true);
  };

  // Filter spots
  const filteredSpots = GOA_SPOTS.filter((spot) => {
    const matchesRegion = currentRegion === 'all' || spot.region === currentRegion;
    const matchesCategory = selectedCategory === 'all' || spot.category === selectedCategory;
    const matchesHiddenGems = !onlyHiddenGems || Boolean(spot.hiddenGem);
    const matchesBudget = selectedBudget === 'all' || (
      selectedBudget === 'pocket-friendly' ? (spot.priceTier === '$' || spot.priceTier === '₹') :
      selectedBudget === 'balanced' ? (spot.priceTier === '$$' || spot.priceTier === '₹₹') :
      (spot.priceTier === '$$$' || spot.priceTier === '$$$$' || spot.priceTier === '₹₹₹' || spot.priceTier === '₹₹₹₹')
    );

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      spot.name.toLowerCase().includes(query) ||
      spot.area.toLowerCase().includes(query) ||
      spot.description.toLowerCase().includes(query);
    return matchesRegion && matchesCategory && matchesHiddenGems && matchesBudget && matchesSearch;
  });

  const savedSpotsList = GOA_SPOTS.filter((s) => savedSpotIds.includes(s.id));

  return (
    <div className="min-h-screen flex flex-col bg-white text-stone-900 selection:bg-stone-900 selection:text-white">
      {/* Navbar */}
      <Navbar
        currentRegion={currentRegion}
        onSelectRegion={(reg) => {
          setCurrentRegion(reg);
          if (activeTab !== 'explore' && activeTab !== 'map' && activeTab !== 'sunset-tide') setActiveTab('explore');
        }}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        savedCount={savedSpotIds.length}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onOpenGlossary={() => handleOpenGlossaryForTerm()}
        onOpenLogistics={() => setIsLogisticsOpen(true)}
      />

      {/* Main View */}
      <main className="flex-1">
        {activeTab === 'explore' && (
          <div>
            {/* Minimalist Hero */}
            <Hero
              currentRegion={currentRegion}
              onSelectRegion={setCurrentRegion}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onlyHiddenGems={onlyHiddenGems}
              onToggleHiddenGems={() => setOnlyHiddenGems(!onlyHiddenGems)}
              selectedBudget={selectedBudget}
              onSelectBudget={setSelectedBudget}
              cardViewMode={cardViewMode}
              onToggleCardViewMode={() => setCardViewMode(cardViewMode === 'standard' ? 'nomad' : 'standard')}
              onOpenSunset={() => setActiveTab('sunset-tide')}
              onOpenGlossary={() => handleOpenGlossaryForTerm()}
              onOpenLogistics={() => setIsLogisticsOpen(true)}
            />

            {/* Phrases of the Day Component */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
              <PhrasesOfDay onOpenGlossary={() => handleOpenGlossaryForTerm()} />
            </div>

            {/* Spots Directory Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-stone-200/60 pb-3 gap-3">
                <div className="flex items-baseline gap-3">
                  <h2 className="text-xl sm:text-2xl font-normal text-stone-900 font-serif-title">
                    {currentRegion === 'north'
                      ? 'North Goa Curated Spots'
                      : currentRegion === 'south'
                      ? 'South Goa Curated Spots'
                      : 'All Curated Goa Spots'}
                  </h2>
                  <span className="text-xs text-stone-400 font-medium">
                    {filteredSpots.length} locations
                  </span>
                </div>

                {/* Grid View Mode Switcher */}
                <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200/80 text-xs self-start sm:self-auto">
                  <button
                    onClick={() => setCardViewMode('standard')}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                      cardViewMode === 'standard'
                        ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    🌴 Curated Vibe
                  </button>
                  <button
                    onClick={() => setCardViewMode('nomad')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                      cardViewMode === 'nomad'
                        ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <span>💻 Digital Nomad</span>
                  </button>
                </div>
              </div>

              {cardViewMode === 'nomad' && (
                <div className="bg-indigo-50/60 border border-indigo-200/60 rounded-xl px-4 py-2.5 text-xs text-indigo-950 flex items-center justify-between flex-wrap gap-2">
                  <span>⚡ <strong>Digital Nomad Mode Active:</strong> Showing real Wi-Fi speed benchmarks (Mbps), seating comfort ergonomics, power outlet density &amp; noise levels.</span>
                  <span className="text-[11px] text-indigo-700 font-medium">High Speed Fiber Verified</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredSpots.map((spot) => (
                  <SpotCard
                    key={spot.id}
                    spot={spot}
                    onSelectSpot={setSelectedSpot}
                    isSaved={savedSpotIds.includes(spot.id)}
                    onToggleSave={handleToggleSave}
                    viewMode={cardViewMode}
                  />
                ))}
              </div>

              {filteredSpots.length === 0 && (
                <div className="py-20 text-center text-stone-400 space-y-2">
                  <p className="text-sm">No spots found matching your search</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setCurrentRegion('all');
                    }}
                    className="text-xs text-stone-900 font-semibold underline"
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'ai-itinerary' && (
          <AIItinerary
            spots={GOA_SPOTS}
            onSelectSpot={setSelectedSpot}
            onImportToPlanner={(items) => {
              handleImportAIItinerary(items);
              setActiveTab('planner');
            }}
          />
        )}

        {activeTab === 'sunset-tide' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SunsetTideGuide
              spots={GOA_SPOTS}
              currentRegion={currentRegion}
              onSelectSpot={setSelectedSpot}
              onSelectRegion={setCurrentRegion}
            />
          </div>
        )}

        {activeTab === 'map' && (
          <InteractiveMap
            spots={GOA_SPOTS}
            currentRegion={currentRegion}
            onSelectRegion={setCurrentRegion}
            onSelectSpot={setSelectedSpot}
          />
        )}

        {activeTab === 'guides' && (
          <LocalGuides
            guides={LOCAL_GUIDES}
            spots={GOA_SPOTS}
            onSelectSpotById={handleSelectSpotById}
          />
        )}

        {activeTab === 'planner' && (
          <TripPlanner
            spots={GOA_SPOTS}
            itinerary={itinerary}
            onAddToItinerary={handleAddToItinerary}
            onRemoveFromItinerary={handleRemoveFromItinerary}
            onSelectSpot={setSelectedSpot}
          />
        )}
      </main>

      {/* Spot Modal */}
      {selectedSpot && (
        <SpotModal
          spot={selectedSpot}
          onClose={() => setSelectedSpot(null)}
          isSaved={savedSpotIds.includes(selectedSpot.id)}
          onToggleSave={handleToggleSave}
          reviews={reviews}
          onOpenAddReview={handleOpenAddReview}
          onAddToPlanner={(s) => handleAddToItinerary(s)}
        />
      )}

      {/* Add Review Modal */}
      {isAddReviewOpen && (
        <AddReviewModal
          spots={GOA_SPOTS}
          selectedSpot={addReviewTargetSpot}
          onClose={() => {
            setIsAddReviewOpen(false);
            setAddReviewTargetSpot(null);
          }}
          onSubmitReview={handleSubmitReview}
        />
      )}

      {/* Konkani Food & Culture Glossary Modal */}
      <FoodGlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => {
          setIsGlossaryOpen(false);
          setGlossaryInitialTerm(null);
        }}
        onSelectSpot={setSelectedSpot}
        allSpots={GOA_SPOTS}
        initialTermId={glossaryInitialTerm}
      />

      {/* Travel & Rental Survival Logistics Modal */}
      <TravelLogisticsModal
        isOpen={isLogisticsOpen}
        onClose={() => setIsLogisticsOpen(false)}
      />

      {/* Saved Drawer */}
      <SavedDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedSpots={savedSpotsList}
        onRemoveSaved={handleToggleSave}
        onSelectSpot={setSelectedSpot}
        onAddToPlanner={(s) => handleAddToItinerary(s)}
      />

      {/* Minimal Footer */}
      <Footer
        onSelectRegion={(reg) => {
          setCurrentRegion(reg);
          setActiveTab('explore');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Ambient Goa Vibe Music Player */}
      <MusicPlayer />
    </div>
  );
}
