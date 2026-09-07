import React, { useState } from 'react';
import { Spot, Region, Category, ItineraryItem, BudgetLevel } from '../types';
import { 
  Sparkles, 
  Compass, 
  Camera, 
  Wine, 
  Landmark, 
  Palmtree, 
  Coffee, 
  HeartHandshake, 
  Waves, 
  Utensils, 
  Bike, 
  Car, 
  CarTaxiFront, 
  Footprints, 
  Check, 
  Share2, 
  Copy,
  Plus, 
  RotateCcw,
  Info,
  Printer,
  X,
  Edit3,
  RefreshCw,
  Trash2,
  Navigation,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Users,
  Heart,
  User,
  Smile,
  Zap,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { OfflineDayPassModal } from './OfflineDayPassModal';

interface AIItineraryProps {
  spots: Spot[];
  onSelectSpot: (spot: Spot) => void;
  onImportToPlanner: (items: ItineraryItem[]) => void;
}

export type TravelPace = 'susegad' | 'balanced' | 'energetic';
export type TravelCompanion = 'solo' | 'couple' | 'friends' | 'family';
export type TransportMode = 'scooter' | 'own_car' | 'taxi' | 'walk';

export interface ItineraryStop {
  id: string;
  stopNumber: number;
  spot: Spot;
  activityTitle: string;
  activityDescription: string;
  whatToOrderOrDo: string;
  insiderTip: string;
  approxCost: string;
  transitToNext?: {
    durationMins: number;
    distanceKm: number;
    routeNote: string;
  };
}

export interface GeneratedDay {
  dayNumber: number;
  title: string;
  theme: string;
  territory: string;
  dayHighlights: string[];
  estBudget: string;
  totalDistanceKm: number;
  stops: ItineraryStop[];
  customNotes?: string;
}

interface InterestOption {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  description: string;
}

const INTERESTS: InterestOption[] = [
  { id: 'cafes', label: 'Artisanal Bakeries & Cafes', icon: Coffee, description: 'Sourdough, pour-overs & lush garden breakfast spots' },
  { id: 'beaches', label: 'Secret Beaches & Coves', icon: Palmtree, description: 'Secluded white sands, gentle swimming & pine groves' },
  { id: 'heritage', label: 'Portuguese Heritage & Forts', icon: Landmark, description: '18th-century mansions, Fontainhas lanes & sea ramparts' },
  { id: 'sunset', label: 'Clifftop Sundowners & Bars', icon: Wine, description: 'Mezcal cocktails, clifftop decks & golden hour vistas' },
  { id: 'dining', label: 'Authentic Goan & Global Dining', icon: Utensils, description: 'Iconic local thalis, chef-driven villas & fresh coastal fare' },
  { id: 'nightlife', label: 'Craft Taverns & Speakeasies', icon: Wine, description: 'Village taverns, kokum feni cocktails & live jazz' },
  { id: 'adventure', label: 'Backwaters & Kayaking', icon: Waves, description: 'Mangrove safaris, river ferries & island trails' },
  { id: 'wellness', label: 'Susegad Yoga & Nature', icon: HeartHandshake, description: 'Jungle retreats, sound healing & peaceful sanctuaries' },
  { id: 'scenic', label: 'Scenic Coastal Drives', icon: Camera, description: 'Palm canopy drives, river bridges & scenic viewpoints' },
];

const TRANSPORT_MODES: { id: TransportMode; label: string; icon: React.FC<{ className?: string }>; desc: string; proTip: string }[] = [
  {
    id: 'scooter',
    label: 'Rent Scooter / Bike',
    icon: Bike,
    desc: 'Breezy village lanes, easy beach parking & coastal freedom',
    proTip: 'Carry your original license. Always wear helmets on major highways (NH66). Rental: ₹350–₹550/day.'
  },
  {
    id: 'own_car',
    label: 'Self-Drive Car',
    icon: Car,
    desc: 'Air-conditioned comfort, ideal for luggage and mid-range hops',
    proTip: 'Village lanes in Fontainhas and Assagao are narrow; utilize church/main road parking lots.'
  },
  {
    id: 'taxi',
    label: 'Private Taxi / Cab',
    icon: CarTaxiFront,
    desc: 'Chauffeur-driven with zero navigation or parking worries',
    proTip: 'Pre-book full-day hire packages or use GoaMiles / local taxi stands.'
  },
  {
    id: 'walk',
    label: 'Walk & Stay Local',
    icon: Footprints,
    desc: 'Deep immersive exploring inside walkable heritage village clusters',
    proTip: 'Perfect when staying centrally in Fontainhas Panaji or Assagao / Anjuna village hubs.'
  }
];

export const AIItinerary: React.FC<AIItineraryProps> = ({
  spots,
  onSelectSpot,
  onImportToPlanner
}) => {
  // Quiz & Generator Mode State
  const [quizStep, setQuizStep] = useState<number>(1);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(true);

  // Trip Parameters
  const [daysCount, setDaysCount] = useState<number>(3);
  const [territoryChoice, setTerritoryChoice] = useState<'all' | 'north' | 'south'>('all');
  const [travelPace, setTravelPace] = useState<TravelPace>('balanced');
  const [companion, setCompanion] = useState<TravelCompanion>('couple');
  const [transportMode, setTransportMode] = useState<TransportMode>('scooter');
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel>('balanced');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'cafes',
    'beaches',
    'sunset',
    'dining'
  ]);

  // Generation & Results
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<GeneratedDay[] | null>(null);
  const [activeDayView, setActiveDayView] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [imported, setImported] = useState<boolean>(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState<boolean>(false);
  const [offlineDayForModal, setOfflineDayForModal] = useState<GeneratedDay | null>(null);

  // Modals for editing
  const [swapTarget, setSwapTarget] = useState<{ dayIndex: number; stopIndex: number } | null>(null);
  const [addStopDayIndex, setAddStopDayIndex] = useState<number | null>(null);

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== id));
      }
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  // Smart Itinerary Generation Engine
  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const northSpots = spots.filter((s) => s.region === 'north');
      const southSpots = spots.filter((s) => s.region === 'south');

      const getPool = (region: 'north' | 'south') => {
        return region === 'north' ? [...northSpots] : [...southSpots];
      };

      const days: GeneratedDay[] = [];

      for (let day = 1; day <= daysCount; day++) {
        let dayRegion: 'north' | 'south' = 'north';
        if (territoryChoice === 'north') {
          dayRegion = 'north';
        } else if (territoryChoice === 'south') {
          dayRegion = 'south';
        } else {
          dayRegion = day <= Math.ceil(daysCount / 2) ? 'north' : 'south';
        }

        const pool = getPool(dayRegion);

        const cafes = pool.filter((s) => s.category === 'cafe');
        const beaches = pool.filter((s) => s.category === 'beach');
        const dining = pool.filter((s) => s.category === 'dining');
        const heritage = pool.filter((s) => s.category === 'heritage');
        const nightlife = pool.filter((s) => s.category === 'nightlife');
        const nature = pool.filter((s) => s.category === 'nature' || s.category === 'wellness');

        const dayStops: ItineraryStop[] = [];

        if (travelPace === 'susegad') {
          // 3 relaxed stops without rigid clock timestamps
          const stop1 = cafes[day % cafes.length] || pool[0];
          const stop2 = dining[day % dining.length] || pool[1];
          const stop3 = (nightlife.concat(beaches))[day % (nightlife.length + beaches.length)] || pool[2];

          dayStops.push({
            id: `day-${day}-stop-1`,
            stopNumber: 1,
            spot: stop1,
            activityTitle: 'Slow Morning Breakfast & Sourdough Ritual',
            activityDescription: `Start the day unhurried at ${stop1.name}. Sip freshly brewed artisanal coffee and enjoy oven-fresh bakes amidst lush garden surroundings.`,
            whatToOrderOrDo: stop1.mustTry[0] ? `Signature: ${stop1.mustTry.slice(0, 2).join(', ')}` : 'Signature pour-over coffee & breakfast platter',
            insiderTip: stop1.bestTime ? `Best enjoyed around ${stop1.bestTime}.` : 'Arrive early to snag a breezy shaded garden seat.',
            approxCost: stop1.priceTier === '$' ? '₹300 – ₹500' : '₹500 – ₹900',
            transitToNext: {
              durationMins: 14,
              distanceKm: 4.8,
              routeNote: `Scenic ${transportMode === 'scooter' ? 'scooter cruise' : 'drive'} through village palm groves`
            }
          });

          dayStops.push({
            id: `day-${day}-stop-2`,
            stopNumber: 2,
            spot: stop2,
            activityTitle: 'Leisurely Heritage Lunch & Susegad Siesta',
            activityDescription: `Unwind over an unhurried Goan feast at ${stop2.name}. Soak in the courtyard charm and savor authentic regional recipes.`,
            whatToOrderOrDo: stop2.mustTry[0] ? `Must Try: ${stop2.mustTry.slice(0, 2).join(', ')}` : 'Chef specialties with warm poee bread',
            insiderTip: 'Embrace true susegad — savor the food and breeze without watching the clock.',
            approxCost: stop2.priceTier === '$$$' ? '₹1,500 – ₹2,500' : '₹600 – ₹1,200',
            transitToNext: {
              durationMins: 18,
              distanceKm: 6.2,
              routeNote: `Coastal route past Portuguese mansions and backwaters`
            }
          });

          dayStops.push({
            id: `day-${day}-stop-3`,
            stopNumber: 3,
            spot: stop3,
            activityTitle: 'Golden Hour Sundowner & Seaside Relaxation',
            activityDescription: `Catch the spectacular Arabian Sea sunset at ${stop3.name} with refreshing drinks and soothing coastal vibes.`,
            whatToOrderOrDo: stop3.mustTry[0] ? `Recommended: ${stop3.mustTry.slice(0, 2).join(', ')}` : 'Craft kokum cocktails & sunset tapas',
            insiderTip: 'Sunset in Goa is magic — settle into your deck seats before golden hour fades.',
            approxCost: stop3.priceTier === '$$$' ? '₹1,200 – ₹2,000' : '₹500 – ₹900'
          });
        } else if (travelPace === 'balanced') {
          // 4-5 well-paced stops
          const stop1 = cafes[day % cafes.length] || pool[0];
          const stop2 = (beaches.concat(heritage))[day % (beaches.length + heritage.length)] || pool[1];
          const stop3 = dining[day % dining.length] || pool[2];
          const stop4 = (nightlife.concat(nature))[day % (nightlife.length + nature.length)] || pool[3];
          const stop5 = (dining.concat(nightlife))[(day + 2) % (dining.length + nightlife.length)] || pool[4];

          dayStops.push({
            id: `day-${day}-stop-1`,
            stopNumber: 1,
            spot: stop1,
            activityTitle: 'Artisanal Morning Breakfast & Speciality Coffee',
            activityDescription: `Fuel up at ${stop1.name}. Enjoy fresh pastries, avocado tartines, and tropical fruit bowls in a serene open-air courtyard.`,
            whatToOrderOrDo: stop1.mustTry[0] ? `Order: ${stop1.mustTry.slice(0, 2).join(', ')}` : 'Specialty pour-overs & fresh bakes',
            insiderTip: 'Morning hours offer the calmest ambiance and pleasant coastal breezes.',
            approxCost: '₹350 – ₹600',
            transitToNext: {
              durationMins: 12,
              distanceKm: 3.8,
              routeNote: `Short ${transportMode === 'scooter' ? 'breezy ride' : 'drive'} to the coastline`
            }
          });

          dayStops.push({
            id: `day-${day}-stop-2`,
            stopNumber: 2,
            spot: stop2,
            activityTitle: 'Coastal Exploration & Scenic Landmark Trail',
            activityDescription: `Explore ${stop2.name}. Discover scenic photo spots, historical ramparts, or enjoy an uncrowded beach stroll.`,
            whatToOrderOrDo: stop2.mustTry[0] ? `Highlights: ${stop2.mustTry.slice(0, 2).join(', ')}` : 'Explore historical architecture and sandy coves',
            insiderTip: 'Carry sunglasses, sunscreen, and a refillable water bottle.',
            approxCost: stop2.priceTier === '$' ? 'Free – ₹200' : '₹300 – ₹600',
            transitToNext: {
              durationMins: 15,
              distanceKm: 5.4,
              routeNote: `Drive through charming village lanes`
            }
          });

          dayStops.push({
            id: `day-${day}-stop-3`,
            stopNumber: 3,
            spot: stop3,
            activityTitle: 'Authentic Goan Culinary Lunch',
            activityDescription: `Indulge in a curated lunch feast at ${stop3.name}, celebrating coastal spices and regional culinary traditions.`,
            whatToOrderOrDo: stop3.mustTry[0] ? `Must Try: ${stop3.mustTry.slice(0, 2).join(', ')}` : 'Fresh coastal catch or vegetable caldin with warm poee',
            insiderTip: 'Pair your lunch with refreshing Sol Kadi or chilled coconut water.',
            approxCost: stop3.priceTier === '$$$' ? '₹1,200 – ₹2,000' : '₹600 – ₹1,100',
            transitToNext: {
              durationMins: 16,
              distanceKm: 6.0,
              routeNote: `Head toward the sunset coastline`
            }
          });

          dayStops.push({
            id: `day-${day}-stop-4`,
            stopNumber: 4,
            spot: stop4,
            activityTitle: 'Panoramic Sunset & Clifftop Sundowner',
            activityDescription: `Arrive at ${stop4.name} to witness skies turn shades of fiery amber and magenta over the ocean.`,
            whatToOrderOrDo: stop4.mustTry[0] ? `Sunset picks: ${stop4.mustTry.slice(0, 2).join(', ')}` : 'Craft kokum feni cocktails and sunset mezze',
            insiderTip: 'Arrive early for the best front-row panoramic seats.',
            approxCost: '₹600 – ₹1,200',
            transitToNext: {
              durationMins: 12,
              distanceKm: 4.1,
              routeNote: `Short evening hop to dinner`
            }
          });

          dayStops.push({
            id: `day-${day}-stop-5`,
            stopNumber: 5,
            spot: stop5,
            activityTitle: 'Candlelit Courtyard Dinner & Nightcap',
            activityDescription: `Wrap up your evening at ${stop5.name} with intimate ambiance, warm candlelight, and artisanal cocktails.`,
            whatToOrderOrDo: stop5.mustTry[0] ? `Dinner favorites: ${stop5.mustTry.slice(0, 2).join(', ')}` : 'Chef signature dinner & artisanal dessert',
            insiderTip: 'Reservations are recommended on weekend evenings.',
            approxCost: stop5.priceTier === '$$$' ? '₹1,400 – ₹2,400' : '₹700 – ₹1,300'
          });
        } else {
          // Action-Packed: 5-6 stops without rigid clock timestamps
          const s1 = (nature.concat(cafes))[day % (nature.length + cafes.length)] || pool[0];
          const s2 = cafes[(day + 1) % cafes.length] || pool[1];
          const s3 = heritage[day % heritage.length] || pool[2];
          const s4 = dining[day % dining.length] || pool[3];
          const s5 = (nightlife.concat(beaches))[day % (nightlife.length + beaches.length)] || pool[4];
          const s6 = nightlife[(day + 2) % nightlife.length] || pool[5] || pool[0];

          dayStops.push({
            id: `day-${day}-stop-1`,
            stopNumber: 1,
            spot: s1,
            activityTitle: 'Sunrise Beach Stroll & Morning Paddle',
            activityDescription: `Catch the fresh morning light at ${s1.name} with shoreline walks or gentle paddle trails.`,
            whatToOrderOrDo: s1.mustTry[0] ? `Experience: ${s1.mustTry[0]}` : 'Sunrise walk and crisp coastal breeze',
            insiderTip: 'Early morning is the most tranquil time across the coast.',
            approxCost: 'Free – ₹300',
            transitToNext: { durationMins: 10, distanceKm: 3.2, routeNote: 'Quick hop to breakfast' }
          });

          dayStops.push({
            id: `day-${day}-stop-2`,
            stopNumber: 2,
            spot: s2,
            activityTitle: 'Specialty Coffee & French Bakery Breakfast',
            activityDescription: `Hearty breakfast at ${s2.name} with freshly baked croissants and iced pour-overs.`,
            whatToOrderOrDo: s2.mustTry[0] ? `Signature: ${s2.mustTry.slice(0, 2).join(', ')}` : 'Almond croissants & flat whites',
            insiderTip: 'Check out the blackboard specials for seasonal bakes.',
            approxCost: '₹350 – ₹600',
            transitToNext: { durationMins: 15, distanceKm: 5.5, routeNote: 'Scenic heritage drive' }
          });

          dayStops.push({
            id: `day-${day}-stop-3`,
            stopNumber: 3,
            spot: s3,
            activityTitle: 'Historic Fort & Portuguese Cultural Trail',
            activityDescription: `Immerse in Goa’s heritage at ${s3.name}. Walk centuries-old ramparts and admire sweeping viewpoints.`,
            whatToOrderOrDo: s3.mustTry[0] ? `Must See: ${s3.mustTry.slice(0, 2).join(', ')}` : 'Fortress ramparts & river views',
            insiderTip: 'Wear comfortable walking shoes for cobblestones.',
            approxCost: '₹100 – ₹300',
            transitToNext: { durationMins: 14, distanceKm: 4.8, routeNote: 'Head to lunch restaurant' }
          });

          dayStops.push({
            id: `day-${day}-stop-4`,
            stopNumber: 4,
            spot: s4,
            activityTitle: 'Feast of Coastal & Global Specialties',
            activityDescription: `Enjoy a vibrant lunch at ${s4.name} with authentic spices, fresh local ingredients, and chilled beverages.`,
            whatToOrderOrDo: s4.mustTry[0] ? `Dish picks: ${s4.mustTry.slice(0, 2).join(', ')}` : 'Signature coastal curry and poee',
            insiderTip: 'Pair with freshly squeezed tropical juices or Sol Kadi.',
            approxCost: '₹700 – ₹1,400',
            transitToNext: { durationMins: 20, distanceKm: 7.2, routeNote: 'Ride towards sunset cliff' }
          });

          dayStops.push({
            id: `day-${day}-stop-5`,
            stopNumber: 5,
            spot: s5,
            activityTitle: 'Golden Hour Clifftop Beats & Sundowner',
            activityDescription: `Celebrate the sunset at ${s5.name} with botanical infusions, ambient tunes, and open ocean horizons.`,
            whatToOrderOrDo: s5.mustTry[0] ? `Sunset must: ${s5.mustTry.slice(0, 2).join(', ')}` : 'Sunset mezcal cocktails & tapas',
            insiderTip: 'Arrive 45 minutes before sundown for the best spots.',
            approxCost: '₹800 – ₹1,500',
            transitToNext: { durationMins: 15, distanceKm: 5.0, routeNote: 'Head to night tavern' }
          });

          dayStops.push({
            id: `day-${day}-stop-6`,
            stopNumber: 6,
            spot: s6,
            activityTitle: 'Nightlife, Craft Cocktails & Live Vibe',
            activityDescription: `End the night at ${s6.name} with craft cocktails, courtyard laughter, and vibrant Goan nightlife.`,
            whatToOrderOrDo: s6.mustTry[0] ? `Night picks: ${s6.mustTry.slice(0, 2).join(', ')}` : 'Craft infusions and night tapas',
            insiderTip: 'Atmosphere peaks between 9:30 PM and 11:00 PM.',
            approxCost: '₹900 – ₹1,800'
          });
        }

        const dayTitles = [
          { title: 'Palm Tree Canopies, Heritage Villas & Sunset Clifftops', theme: 'Boutique Assagao, Anjuna clifftops & artisan bakeries' },
          { title: 'Bohemian Surf Sandbanks, River Ferries & Sweet Water Lagoons', theme: 'Ashwem surf breaks, Mandrem bamboo bridges & Arambol coves' },
          { title: 'Portuguese Latin Quarters, 16th-Century Bastions & Speakeasies', theme: 'Fontainhas cobblestones, Reis Magos fortress & vintage taverns' },
          { title: 'Pristine South Turtle Sands, Casuarina Groves & Fisherman Harbors', theme: 'Palolem crescent bay, Galgibaga turtle sanctuary & river dining' },
          { title: 'Heritage Indo-Portuguese Mansions & Spice Plantation Backwaters', theme: 'Loutolim ancestral houses, Divar Island & authentic Saraswat thalis' },
          { title: 'Hidden Sea Caves, Keri Pine Forest & Clifftop Taverns', theme: 'Tiracol river estuary, northern frontier sands & acoustic jams' },
          { title: 'Jungle Cascades, Wellness Shalas & Candlelit Courtyards', theme: 'Hinterland waterfalls, yoga sanctuary & chef-driven tasting menus' }
        ];

        const titleObj = dayTitles[(day - 1) % dayTitles.length];
        const totalDist = dayStops.reduce((sum, s) => sum + (s.transitToNext?.distanceKm || 0), 0);

        days.push({
          dayNumber: day,
          title: `Day ${day}: ${titleObj.title}`,
          theme: titleObj.theme,
          territory: dayRegion === 'north' ? 'North Goa Coastal Circuit' : 'South Goa Coastal Circuit',
          dayHighlights: [
            `${dayStops.length} curated stops in natural flow`,
            `${Math.round(totalDist)} km total transit`,
            `${dayStops[0]?.spot.area || 'Goa'} → ${dayStops[dayStops.length - 1]?.spot.area || 'Goa'}`
          ],
          estBudget: budgetLevel === 'pocket-friendly' ? '₹800 – ₹1,400' : budgetLevel === 'elevated-luxury' ? '₹3,500 – ₹5,500' : '₹1,600 – ₹2,800',
          totalDistanceKm: Math.round(totalDist),
          stops: dayStops
        });
      }

      setGeneratedItinerary(days);
      setIsGenerating(false);
      setActiveDayView(1);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {
        // Confetti fallback
      }
    }, 600);
  };

  // Spot Swap Logic
  const handleSwapSpot = (newSpot: Spot) => {
    if (!swapTarget || !generatedItinerary) return;
    const { dayIndex, stopIndex } = swapTarget;

    const updated = [...generatedItinerary];
    const currentStop = updated[dayIndex].stops[stopIndex];
    if (currentStop) {
      currentStop.spot = newSpot;
      currentStop.activityDescription = `Experience ${newSpot.name} (${newSpot.area}). Enjoy ${newSpot.tagline}.`;
      currentStop.whatToOrderOrDo = newSpot.mustTry[0] ? `Signature: ${newSpot.mustTry.slice(0, 2).join(', ')}` : 'Curated seasonal experience';
      currentStop.insiderTip = `Best time: ${newSpot.bestTime}. Address: ${newSpot.address}.`;
    }

    setGeneratedItinerary(updated);
    setSwapTarget(null);
  };

  // Add Custom Stop Logic
  const handleAddCustomSpot = (newSpot: Spot) => {
    if (addStopDayIndex === null || !generatedItinerary) return;

    const updated = [...generatedItinerary];
    const targetDay = updated[addStopDayIndex];

    if (targetDay) {
      const newStop: ItineraryStop = {
        id: `custom-stop-${Date.now()}`,
        stopNumber: targetDay.stops.length + 1,
        spot: newSpot,
        activityTitle: `Explore ${newSpot.name}`,
        activityDescription: `${newSpot.name} in ${newSpot.area}. ${newSpot.description}`,
        whatToOrderOrDo: newSpot.mustTry[0] ? `Must Try: ${newSpot.mustTry.join(', ')}` : newSpot.tagline,
        insiderTip: `Best time: ${newSpot.bestTime}`,
        approxCost: newSpot.priceTier === '$' ? '₹250 – ₹450' : '₹600 – ₹1,200'
      };

      targetDay.stops.push(newStop);
    }

    setGeneratedItinerary(updated);
    setAddStopDayIndex(null);
  };

  // Remove Stop Logic
  const handleRemoveStop = (dayIndex: number, stopIndex: number) => {
    if (!generatedItinerary) return;
    const updated = [...generatedItinerary];
    updated[dayIndex].stops.splice(stopIndex, 1);
    // re-number stops
    updated[dayIndex].stops.forEach((s, idx) => {
      s.stopNumber = idx + 1;
    });
    setGeneratedItinerary(updated);
  };

  // Update Notes
  const handleUpdateNotes = (dayIndex: number, notes: string) => {
    if (!generatedItinerary) return;
    const updated = [...generatedItinerary];
    updated[dayIndex].customNotes = notes;
    setGeneratedItinerary(updated);
  };

  // Import to Planner
  const handleImport = () => {
    if (!generatedItinerary) return;

    const items: ItineraryItem[] = [];
    generatedItinerary.forEach((day) => {
      day.stops.forEach((stop, index) => {
        const slot: ItineraryItem['timeSlot'] = 
          index === 0 ? 'Morning' :
          index === 1 ? 'Afternoon' :
          index === 2 ? 'Sunset / Golden Hour' : 'Night';

        items.push({
          id: `${day.dayNumber}-${stop.id}-${Math.random()}`,
          day: day.dayNumber,
          timeSlot: slot,
          spot: stop.spot,
          customNotes: `Stop ${stop.stopNumber}: ${stop.activityTitle}. ${stop.whatToOrderOrDo}`
        });
      });
    });

    onImportToPlanner(items);
    setImported(true);
    setTimeout(() => setImported(false), 3000);
  };

  // Copy shareable summary
  const handleCopyText = () => {
    if (!generatedItinerary) return;

    let text = `🌴 My Curated Goa Trip Plan (${daysCount} Days)\n`;
    text += `Pace: ${travelPace.toUpperCase()} • Transit: ${transportMode.toUpperCase()}\n\n`;

    generatedItinerary.forEach((day) => {
      text += `━━━━━━━━━━━━━━━━━━━━━\n`;
      text += `📅 ${day.title}\n`;
      text += `Territory: ${day.territory} | Est. Spend: ${day.estBudget}/day\n\n`;

      day.stops.forEach((s) => {
        text += `📍 Stop ${s.stopNumber}: ${s.spot.name} (${s.spot.area})\n`;
        text += `   • ${s.activityTitle}\n`;
        text += `   • ${s.whatToOrderOrDo}\n`;
        if (s.transitToNext) {
          text += `   🛵 Next Stop Transit: ${s.transitToNext.durationMins} mins (${s.transitToNext.distanceKm} km) — ${s.transitToNext.routeNote}\n`;
        }
        text += `\n`;
      });

      if (day.customNotes) {
        text += `📝 Notes: ${day.customNotes}\n\n`;
      }
    });

    text += `Generated on goa.life — Clean Insider Guide to North & South Goa`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShareAll = () => {
    if (!generatedItinerary) return;

    let text = `🌴 *MY GOA TRIP PLAN (${daysCount} DAYS)*\n`;
    text += `Pace: ${travelPace.toUpperCase()} • Transit: ${transportMode.toUpperCase()}\n\n`;

    generatedItinerary.forEach((day) => {
      text += `━━━━━━━━━━━━━━━━━━━━━\n`;
      text += `📅 *${day.title}*\n`;
      text += `🗺️ ${day.territory} | Est. ${day.estBudget}\n\n`;

      day.stops.forEach((s) => {
        text += `📍 *Stop ${s.stopNumber}: ${s.spot.name}* (${s.spot.area})\n`;
        text += `✨ ${s.activityTitle}\n`;
        text += `🍽️ Must order: ${s.whatToOrderOrDo}\n`;
        if (s.transitToNext) {
          text += `🛵 Transit: ~${s.transitToNext.durationMins}m (${s.transitToNext.distanceKm}km) — ${s.transitToNext.routeNote}\n`;
        }
        text += `\n`;
      });
    });

    text += `_Pocket Guide curated on goa.life — Clean Insider Guide_`;
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleOpenOfflinePass = (day?: GeneratedDay) => {
    if (!generatedItinerary || generatedItinerary.length === 0) return;
    const target = day || generatedItinerary.find((d) => d.dayNumber === activeDayView) || generatedItinerary[0];
    setOfflineDayForModal(target);
    setIsOfflineModalOpen(true);
  };

  const currentTransport = TRANSPORT_MODES.find((t) => t.id === transportMode) || TRANSPORT_MODES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Editorial Header */}
      <div className="border-b border-stone-200/60 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/60 text-orange-800 text-xs font-semibold tracking-wide mb-3">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Smart Travel Curator</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-normal text-stone-900 font-serif-title tracking-tight">
              Personalized Day-by-Day Goa Itinerary
            </h1>
            <p className="text-stone-500 text-sm mt-1 max-w-2xl">
              Authentic flowing day routes with real transit times, scenic connectors, curated dish orders, and local secrets.
            </p>
          </div>

          {generatedItinerary ? (
            <button
              onClick={() => {
                setGeneratedItinerary(null);
                setQuizStep(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-medium text-stone-700 flex items-center gap-1.5 self-start md:self-end transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz &amp; Customize</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl text-xs font-medium border border-stone-200/60 self-start md:self-end">
              <button
                onClick={() => setIsQuizMode(true)}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  isQuizMode ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Interactive Quiz
              </button>
              <button
                onClick={() => setIsQuizMode(false)}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  !isQuizMode ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Quick Studio
              </button>
            </div>
          )}
        </div>
      </div>

      {/* QUIZ FLOW (Step-by-Step Interactive Travel Quiz) */}
      {!generatedItinerary && isQuizMode && (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-10 shadow-xs space-y-8 animate-in fade-in duration-300">
          
          {/* Progress Bar & Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
              <span className="flex items-center gap-1.5 text-stone-900">
                <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[11px] font-bold">
                  {quizStep}
                </span>
                <span>Step {quizStep} of 4</span>
              </span>
              <span>{Math.round((quizStep / 4) * 100)}% Completed</span>
            </div>

            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-600 transition-all duration-300 rounded-full"
                style={{ width: `${(quizStep / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Trip Scope & Territory Focus */}
          {quizStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-normal text-stone-900 font-serif-title">
                  How long are you staying, and which part of Goa calls you?
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Choose your duration and coastal territory preference.
                </p>
              </div>

              {/* Days Count Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Duration: <span className="text-orange-600 font-bold">{daysCount} {daysCount === 1 ? 'Day' : 'Days'}</span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <button
                      key={num}
                      onClick={() => setDaysCount(num)}
                      className={`py-3.5 rounded-2xl text-sm font-bold transition-all ${
                        daysCount === num
                          ? 'bg-stone-900 text-white shadow-xs scale-102'
                          : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200/80'
                      }`}
                    >
                      {num} {num === 1 ? 'Day' : 'Days'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Territory Cards */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Region Preference
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'all' as const, title: 'Complete Goa (North & South)', desc: 'Balanced circuit of vibrant village vibes and tranquil southern beaches' },
                    { id: 'north' as const, title: 'North Goa Coastal', desc: 'Boutique Assagao cafes, Anjuna sunset cliffs, Fontainhas heritage & nightlife' },
                    { id: 'south' as const, title: 'South Goa Susegad', desc: 'Pristine Palolem sands, Galgibaga turtle coves, casuarina groves & Portuguese estates' }
                  ].map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setTerritoryChoice(t.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        territoryChoice === t.id
                          ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                          : 'border-stone-200 hover:border-stone-400 bg-stone-50/60 text-stone-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <h4 className="text-sm font-bold">{t.title}</h4>
                          {territoryChoice === t.id && <Check className="w-4 h-4 text-orange-400" />}
                        </div>
                        <p className={`text-xs leading-relaxed ${territoryChoice === t.id ? 'text-stone-300' : 'text-stone-500'}`}>
                          {t.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Traveling With & Budget Style */}
          {quizStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-normal text-stone-900 font-serif-title">
                  Who is traveling with you, and what is your spending style?
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  We tailor ambiance, seating, and venue recommendations accordingly.
                </p>
              </div>

              {/* Companion Options */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Travel Companions
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'solo' as TravelCompanion, label: 'Solo Wanderer', icon: User, desc: 'Quiet corners, cozy cafes & easy social spots' },
                    { id: 'couple' as TravelCompanion, label: 'Romantic Couple', icon: Heart, desc: 'Candlelit dining, private coves & golden sunsets' },
                    { id: 'friends' as TravelCompanion, label: 'Friends Squad', icon: Users, desc: 'Lively taverns, beach decks & sharing platters' },
                    { id: 'family' as TravelCompanion, label: 'Family Trip', icon: Smile, desc: 'Spacious seating, gentle waters & relaxed meals' }
                  ].map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setCompanion(c.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        companion === c.id
                          ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                          : 'border-stone-200 hover:border-stone-400 bg-stone-50/60 text-stone-800'
                      }`}
                    >
                      <c.icon className={`w-5 h-5 mb-2 ${companion === c.id ? 'text-orange-400' : 'text-stone-600'}`} />
                      <h4 className="text-xs font-bold mb-1">{c.label}</h4>
                      <p className={`text-[11px] leading-snug ${companion === c.id ? 'text-stone-300' : 'text-stone-500'}`}>
                        {c.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget Style */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Budget Style
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'pocket-friendly' as BudgetLevel, label: 'Pocket-Friendly', icon: '🎒', desc: 'Authentic local thalis, wild secret beaches & cheap cafe bakes' },
                    { id: 'balanced' as BudgetLevel, label: 'Balanced Explorer', icon: '☕', desc: 'Curated mix of heritage villas, seaside cocktail lounges & bistros' },
                    { id: 'elevated-luxury' as BudgetLevel, label: 'Elevated Luxury', icon: '✨', desc: 'Chef-driven tasting menus, private boat charters & boutique fine dining' }
                  ].map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setBudgetLevel(b.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        budgetLevel === b.id
                          ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                          : 'border-stone-200 hover:border-stone-400 bg-stone-50/60 text-stone-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-base">{b.icon}</span>
                        {budgetLevel === b.id && <Check className="w-4 h-4 text-orange-400" />}
                      </div>
                      <h4 className="text-xs font-bold mb-1">{b.label}</h4>
                      <p className={`text-[11px] leading-snug ${budgetLevel === b.id ? 'text-stone-300' : 'text-stone-500'}`}>
                        {b.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Daily Pacing & Getting Around */}
          {quizStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-normal text-stone-900 font-serif-title">
                  What is your ideal daily pace and mode of transport?
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  We use your transit mode to generate realistic driving and scooter routes.
                </p>
              </div>

              {/* Pacing */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Daily Rhythm
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'susegad' as TravelPace, label: 'Susegad & Relaxed', desc: '3 leisurely stops. Plenty of hammock time, pool dips & unhurried meals' },
                    { id: 'balanced' as TravelPace, label: 'Balanced Explorer', desc: '4–5 stops. Morning coffee, coastal stroll, local lunch, sunset vista & dinner' },
                    { id: 'energetic' as TravelPace, label: 'Action-Packed', desc: '5–6 stops. Sunrise paddle trails, heritage forts, sunset sundowners & nightlife' }
                  ].map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setTravelPace(p.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        travelPace === p.id
                          ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                          : 'border-stone-200 hover:border-stone-400 bg-stone-50/60 text-stone-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-bold">{p.label}</h4>
                        {travelPace === p.id && <Check className="w-4 h-4 text-orange-400" />}
                      </div>
                      <p className={`text-[11px] leading-snug ${travelPace === p.id ? 'text-stone-300' : 'text-stone-500'}`}>
                        {p.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transport Mode */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Getting Around
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {TRANSPORT_MODES.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setTransportMode(t.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        transportMode === t.id
                          ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                          : 'border-stone-200 hover:border-stone-400 bg-stone-50/60 text-stone-800'
                      }`}
                    >
                      <t.icon className={`w-4 h-4 mb-1.5 ${transportMode === t.id ? 'text-orange-400' : 'text-stone-600'}`} />
                      <h4 className="text-xs font-bold mb-0.5">{t.label}</h4>
                      <p className={`text-[10.5px] leading-tight ${transportMode === t.id ? 'text-stone-300' : 'text-stone-500'}`}>
                        {t.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Experiences & Passions */}
          {quizStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-normal text-stone-900 font-serif-title">
                    Select the experiences you are most excited about
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    Pick 2 or more highlights to feature across your itinerary.
                  </p>
                </div>
                <span className="text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
                  {selectedInterests.length} Selected
                </span>
              </div>

              {/* Interest Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {INTERESTS.map((int) => {
                  const isSelected = selectedInterests.includes(int.id);
                  const Icon = int.icon;
                  return (
                    <div
                      key={int.id}
                      onClick={() => toggleInterest(int.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-amber-700 bg-amber-50/60 text-stone-900 shadow-2xs'
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50/40 text-stone-600'
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${isSelected ? 'bg-amber-100 text-amber-900' : 'bg-stone-200/70 text-stone-500'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold truncate">{int.label}</p>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-800 ml-1 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-stone-500 leading-snug mt-0.5">{int.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quiz Navigation Buttons */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            {quizStep > 1 ? (
              <button
                onClick={() => setQuizStep(quizStep - 1)}
                className="px-5 py-2.5 rounded-2xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : (
              <div />
            )}

            {quizStep < 4 ? (
              <button
                onClick={() => setQuizStep(quizStep + 1)}
                className="px-6 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-8 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all group"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Curating Your Day-by-Day Route...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Generate My {daysCount}-Day Itinerary</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* QUICK STUDIO MODE (Single-Page Form for power users) */}
      {!generatedItinerary && !isQuizMode && (
        <div className="space-y-8 bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
          {/* Section 1: Trip Scope & Territory */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400">
              1. Trip Scope &amp; Territory
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Days Count */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-800 flex items-center justify-between">
                  <span>Trip Duration</span>
                  <span className="text-orange-600 font-bold">{daysCount} {daysCount === 1 ? 'Day' : 'Days'}</span>
                </label>
                <div className="grid grid-cols-7 gap-1 bg-stone-100 p-1 rounded-2xl">
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <button
                      key={num}
                      onClick={() => setDaysCount(num)}
                      className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                        daysCount === num
                          ? 'bg-stone-900 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {num}d
                    </button>
                  ))}
                </div>
              </div>

              {/* Territory Choice */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-800">
                  Region Focus
                </label>
                <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-2xl text-xs">
                  <button
                    onClick={() => setTerritoryChoice('all')}
                    className={`py-2 rounded-xl font-semibold transition-all ${
                      territoryChoice === 'all'
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setTerritoryChoice('north')}
                    className={`py-2 rounded-xl font-semibold transition-all ${
                      territoryChoice === 'north'
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    North
                  </button>
                  <button
                    onClick={() => setTerritoryChoice('south')}
                    className={`py-2 rounded-xl font-semibold transition-all ${
                      territoryChoice === 'south'
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    South
                  </button>
                </div>
              </div>

              {/* Travel Companion */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-800">
                  Traveling With
                </label>
                <div className="grid grid-cols-4 gap-1 bg-stone-100 p-1 rounded-2xl text-xs">
                  {[
                    { id: 'solo' as TravelCompanion, label: 'Solo', icon: User },
                    { id: 'couple' as TravelCompanion, label: 'Couple', icon: Heart },
                    { id: 'friends' as TravelCompanion, label: 'Friends', icon: Users },
                    { id: 'family' as TravelCompanion, label: 'Family', icon: Smile }
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCompanion(c.id)}
                      className={`py-2 px-1 rounded-xl font-semibold flex flex-col items-center gap-0.5 transition-all text-[11px] ${
                        companion === c.id
                          ? 'bg-stone-900 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <c.icon className="w-3 h-3" />
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Pacing, Transport, Budget */}
          <div className="space-y-4 pt-2 border-t border-stone-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400">
              2. Pacing, Transport &amp; Budget
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Pacing */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-800">
                  Daily Rhythm
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'susegad' as TravelPace, label: 'Susegad & Relaxed', desc: '3 leisurely stops + downtime' },
                    { id: 'balanced' as TravelPace, label: 'Balanced Explorer', desc: '4–5 stops with scenic sunset & dinner' },
                    { id: 'energetic' as TravelPace, label: 'Action-Packed', desc: '5–6 stops from morning to night' }
                  ].map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setTravelPace(p.id)}
                      className={`p-2.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        travelPace === p.id
                          ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                          : 'border-stone-200 hover:border-stone-400 bg-stone-50/60 text-stone-800'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold">{p.label}</p>
                        <p className={`text-[10.5px] ${travelPace === p.id ? 'text-stone-300' : 'text-stone-500'}`}>{p.desc}</p>
                      </div>
                      {travelPace === p.id && <Check className="w-4 h-4 text-orange-400 shrink-0 ml-2" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Transport Mode */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-800">
                  Transport Mode
                </label>
                <div className="space-y-2">
                  {TRANSPORT_MODES.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setTransportMode(t.id)}
                      className={`p-2.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        transportMode === t.id
                          ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                          : 'border-stone-200 hover:border-stone-400 bg-stone-50/60 text-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <t.icon className={`w-4 h-4 shrink-0 ${transportMode === t.id ? 'text-orange-400' : 'text-stone-500'}`} />
                        <div>
                          <p className="text-xs font-bold">{t.label}</p>
                          <p className={`text-[10px] truncate max-w-[170px] ${transportMode === t.id ? 'text-stone-300' : 'text-stone-500'}`}>{t.desc}</p>
                        </div>
                      </div>
                      {transportMode === t.id && <Check className="w-4 h-4 text-orange-400 shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget Style */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-800">
                  Budget Style
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'pocket-friendly' as BudgetLevel, label: '🎒 Pocket-Friendly', desc: 'Local thalis, beach shacks, affordable cafes' },
                    { id: 'balanced' as BudgetLevel, label: '☕ Balanced Explorer', desc: 'Mix of heritage dining & seaside bistros' },
                    { id: 'elevated-luxury' as BudgetLevel, label: '✨ Elevated Luxury', desc: 'Chef tasting menus & fine cocktail lounges' }
                  ].map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setBudgetLevel(b.id)}
                      className={`p-2.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        budgetLevel === b.id
                          ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                          : 'border-stone-200 hover:border-stone-400 bg-stone-50/60 text-stone-800'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold">{b.label}</p>
                        <p className={`text-[10.5px] ${budgetLevel === b.id ? 'text-stone-300' : 'text-stone-500'}`}>{b.desc}</p>
                      </div>
                      {budgetLevel === b.id && <Check className="w-4 h-4 text-orange-400 shrink-0 ml-2" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Passions */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400">
                3. Experiences &amp; Vibes You Love
              </h3>
              <span className="text-xs text-stone-400 font-medium">
                {selectedInterests.length} selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {INTERESTS.map((int) => {
                const isSelected = selectedInterests.includes(int.id);
                const Icon = int.icon;
                return (
                  <div
                    key={int.id}
                    onClick={() => toggleInterest(int.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'border-amber-700 bg-amber-50/60 text-stone-900 shadow-2xs'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/40 text-stone-600'
                    }`}
                  >
                    <div className={`p-1.5 rounded-xl shrink-0 mt-0.5 ${isSelected ? 'bg-amber-100 text-amber-900' : 'bg-stone-200/70 text-stone-500'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{int.label}</p>
                      <p className="text-[11px] text-stone-500 leading-snug">{int.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <div className="text-xs text-stone-500 flex items-center gap-2">
              <Info className="w-4 h-4 text-orange-600 shrink-0" />
              <span>Calculates real travel times and optimal route sequencing.</span>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-8 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all group"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-orange-400" />
                  <span>Curating Your Itinerary...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
                  <span>Generate {daysCount}-Day Itinerary</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* GENERATED ITINERARY VIEW */}
      {generatedItinerary && (
        <div className="space-y-6">
          
          {/* Action Toolbar */}
          <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-stone-900 bg-stone-100 px-3 py-1.5 rounded-xl">
                {daysCount} Days • {territoryChoice === 'all' ? 'All Goa' : `${territoryChoice} Goa`}
              </span>
              <span className="text-xs font-medium text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl capitalize">
                {travelPace} Pace ({currentTransport.label})
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <button
                onClick={handleImport}
                className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium flex items-center gap-1.5 transition-all"
              >
                {imported ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5" />}
                <span>{imported ? 'Saved' : 'Save to Planner'}</span>
              </button>

              <button
                onClick={() => handleOpenOfflinePass()}
                className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium flex items-center gap-1.5 transition-all"
                title="Pocket card format"
              >
                <span>Offline Pass</span>
              </button>

              <button
                onClick={handleWhatsAppShareAll}
                className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium flex items-center gap-1.5 transition-all"
                title="Share via WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5 text-stone-600" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleCopyText}
                className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-600" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={() => setIsPdfModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium flex items-center gap-1.5 transition-all"
              >
                <Printer className="w-3.5 h-3.5 text-stone-600" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Day Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {generatedItinerary.map((day) => (
              <button
                key={day.dayNumber}
                onClick={() => setActiveDayView(day.dayNumber)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeDayView === day.dayNumber
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
                }`}
              >
                <span>Day {day.dayNumber}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeDayView === day.dayNumber ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-500'}`}>
                  {day.stops.length} stops
                </span>
              </button>
            ))}
          </div>

          {/* Active Day Route Card */}
          {generatedItinerary.map((day, dayIndex) => {
            if (day.dayNumber !== activeDayView) return null;

            return (
              <div key={day.dayNumber} className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
                
                {/* Day Header Banner */}
                <div className="border-b border-stone-100 pb-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-lg">
                          {day.territory}
                        </span>
                        <span className="text-xs text-stone-400">•</span>
                        <span className="text-xs text-stone-500 font-medium">{day.theme}</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif-title">
                        {day.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-3 bg-stone-50 border border-stone-200/60 px-3.5 py-2 rounded-2xl text-xs shrink-0">
                        <div>
                          <span className="text-stone-400 block text-[10px] uppercase font-semibold">Est. Day Spend</span>
                          <span className="font-bold text-stone-800">{day.estBudget}</span>
                        </div>
                        <div className="w-px h-6 bg-stone-200" />
                        <div>
                          <span className="text-stone-400 block text-[10px] uppercase font-semibold">Total Transit</span>
                          <span className="font-bold text-stone-800">~{day.totalDistanceKm} km</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenOfflinePass(day)}
                        className="px-3 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
                        title="Open Offline Pocket Card"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                        <span>Day Pass</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Flowing Stop Sequence (No rigid timestamps, clean Stop # badges and travel connectors) */}
                <div className="space-y-6">
                  {day.stops.map((stop, stopIndex) => (
                    <div key={stop.id} className="space-y-4">
                      
                      {/* Stop Card */}
                      <div className="p-4 sm:p-5 rounded-2xl border border-stone-200/80 bg-stone-50/40 hover:bg-stone-50/90 transition-all space-y-4">
                        
                        {/* Header: Stop Number, Spot Name, Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 pb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-bold shadow-2xs">
                              {stop.stopNumber}
                            </span>
                            <h3 className="text-sm sm:text-base font-bold text-stone-900">
                              Stop {stop.stopNumber}: {stop.activityTitle}
                            </h3>
                          </div>

                          <div className="flex items-center gap-1.5 self-start sm:self-auto">
                            <button
                              onClick={() => onSelectSpot(stop.spot)}
                              className="px-2.5 py-1 rounded-lg bg-white hover:bg-stone-100 text-stone-700 text-[11px] font-semibold border border-stone-200 transition-all"
                            >
                              View Spot Details
                            </button>

                            <button
                              onClick={() => setSwapTarget({ dayIndex, stopIndex })}
                              className="px-2.5 py-1 rounded-lg bg-white hover:bg-stone-100 text-stone-700 text-[11px] font-semibold border border-stone-200 flex items-center gap-1 transition-all"
                              title="Replace this spot with another"
                            >
                              <Edit3 className="w-3 h-3 text-stone-500" />
                              <span>Swap</span>
                            </button>

                            {day.stops.length > 2 && (
                              <button
                                onClick={() => handleRemoveStop(dayIndex, stopIndex)}
                                className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-white transition-all"
                                title="Remove stop"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Stop Body: Photo & Description */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                          <div 
                            onClick={() => onSelectSpot(stop.spot)}
                            className="relative rounded-xl overflow-hidden cursor-pointer group shrink-0 h-32 sm:h-28"
                          >
                            <img
                              src={stop.spot.heroImage}
                              alt={stop.spot.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white">
                              <span className="text-xs font-bold truncate">{stop.spot.name}</span>
                              <span className="text-[10px] bg-black/40 backdrop-blur-xs px-1.5 py-0.5 rounded capitalize">
                                {stop.spot.area}
                              </span>
                            </div>
                          </div>

                          <div className="sm:col-span-2 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-stone-800">
                                {stop.spot.name}
                              </span>
                              {stop.spot.dietaryType === 'veg' && (
                                <span className="text-[9.5px] font-semibold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                                  🌱 Veg Only
                                </span>
                              )}
                              <span className="text-xs text-stone-400">•</span>
                              <span className="text-xs text-stone-500 font-medium capitalize">
                                {stop.spot.category}
                              </span>
                              <span className="text-xs text-stone-400">•</span>
                              <span className="text-xs text-stone-500 font-medium">
                                Approx Spend: <strong className="text-stone-800">{stop.approxCost}</strong>
                              </span>
                            </div>

                            <p className="text-xs text-stone-600 leading-relaxed">
                              {stop.activityDescription}
                            </p>

                            {/* What to Order / Do & Tip Callouts */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                              <div className="p-2 rounded-xl bg-orange-50/70 border border-orange-100 text-[11px] text-orange-950">
                                <span className="font-bold block text-orange-900">✨ What to Order / Do:</span>
                                <span>{stop.whatToOrderOrDo}</span>
                              </div>
                              <div className="p-2 rounded-xl bg-stone-100/80 border border-stone-200/60 text-[11px] text-stone-700">
                                <span className="font-bold block text-stone-800">💡 Local Secret:</span>
                                <span>{stop.insiderTip}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Travel Connector to Next Stop */}
                      {stop.transitToNext && stopIndex < day.stops.length - 1 && (
                        <div className="flex items-center gap-3 px-4 py-1.5 bg-amber-50/60 border border-amber-200/50 rounded-xl text-xs text-amber-950">
                          <div className="flex items-center gap-1.5 font-semibold shrink-0 text-amber-900">
                            <Navigation className="w-3.5 h-3.5 text-amber-700" />
                            <span>Transit: ~{stop.transitToNext.durationMins} mins ({stop.transitToNext.distanceKm} km)</span>
                          </div>
                          <div className="w-px h-3.5 bg-amber-300 shrink-0" />
                          <p className="text-[11px] text-amber-800 truncate">
                            {stop.transitToNext.routeNote}
                          </p>
                        </div>
                      )}

                    </div>
                  ))}
                </div>

                {/* Day Footer Actions: Add Custom Stop & Day Notes */}
                <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <button
                    onClick={() => setAddStopDayIndex(dayIndex)}
                    className="px-3.5 py-2 rounded-xl border border-dashed border-stone-300 hover:border-stone-500 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Custom Stop to Day {day.dayNumber}</span>
                  </button>

                  <div className="flex-1 max-w-md">
                    <input
                      type="text"
                      placeholder="Add personal notes or hotel details for this day..."
                      value={day.customNotes || ''}
                      onChange={(e) => handleUpdateNotes(dayIndex, e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:bg-white focus:border-stone-400 transition-all placeholder:text-stone-400"
                    />
                  </div>
                </div>

              </div>
            );
          })}

        </div>
      )}

      {/* MODAL: Swap Spot Picker */}
      {swapTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[85vh] flex flex-col shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Swap Stop with Alternative Venue
                </h3>
                <p className="text-xs text-stone-500">
                  Select any curated spot to replace the current stop.
                </p>
              </div>
              <button
                onClick={() => setSwapTarget(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {spots.map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleSwapSpot(s)}
                  className="p-3 rounded-2xl border border-stone-200 hover:border-stone-400 hover:bg-stone-50 cursor-pointer flex items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={s.heroImage}
                      alt={s.name}
                      className="w-10 h-10 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-stone-900 truncate">{s.name}</p>
                        {s.dietaryType === 'veg' && (
                          <span className="text-[9px] font-semibold bg-emerald-50 text-emerald-700 px-1 py-0.2 rounded border border-emerald-200">
                            🌱 Veg Only
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 truncate">
                        {s.area} • {s.region === 'north' ? 'North' : 'South'} • <span className="capitalize">{s.category}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-orange-600 shrink-0">Select →</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add Custom Stop Picker */}
      {addStopDayIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[85vh] flex flex-col shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Add Spot to Day {addStopDayIndex + 1}
                </h3>
                <p className="text-xs text-stone-500">
                  Choose a venue to insert into this day's sequence.
                </p>
              </div>
              <button
                onClick={() => setAddStopDayIndex(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {spots.map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleAddCustomSpot(s)}
                  className="p-3 rounded-2xl border border-stone-200 hover:border-stone-400 hover:bg-stone-50 cursor-pointer flex items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={s.heroImage}
                      alt={s.name}
                      className="w-10 h-10 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-stone-900 truncate">{s.name}</p>
                        {s.dietaryType === 'veg' && (
                          <span className="text-[9px] font-semibold bg-emerald-50 text-emerald-700 px-1 py-0.2 rounded border border-emerald-200">
                            🌱 Veg Only
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 truncate">
                        {s.area} • {s.region === 'north' ? 'North' : 'South'} • <span className="capitalize">{s.category}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 shrink-0">+ Add →</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Printable Guide Modal */}
      {isPdfModalOpen && generatedItinerary && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Printable Trip Itinerary
                </h3>
                <p className="text-xs text-stone-500">
                  {daysCount} Days in Goa ({transportMode.toUpperCase()} • {travelPace.toUpperCase()})
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => setIsPdfModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-6 text-stone-800 font-sans text-xs">
              {generatedItinerary.map((day) => (
                <div key={day.dayNumber} className="border border-stone-200 rounded-2xl p-4 space-y-3">
                  <div className="border-b border-stone-200 pb-2">
                    <h4 className="font-bold text-sm text-stone-900">{day.title}</h4>
                    <p className="text-[11px] text-stone-500">{day.territory} • Total Transit: ~{day.totalDistanceKm} km • Est. Budget: {day.estBudget}</p>
                  </div>

                  <div className="space-y-3">
                    {day.stops.map((stop) => (
                      <div key={stop.id} className="space-y-1">
                        <p className="font-bold text-stone-900">
                          Stop {stop.stopNumber}: {stop.spot.name} ({stop.spot.area})
                        </p>
                        <p className="text-stone-600">{stop.activityTitle} — {stop.activityDescription}</p>
                        <p className="text-orange-900 text-[11px] font-medium">{stop.whatToOrderOrDo}</p>
                        {stop.transitToNext && (
                          <p className="text-stone-400 text-[10.5px]">
                            → Transit to next stop: ~{stop.transitToNext.durationMins} mins ({stop.transitToNext.distanceKm} km)
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {day.customNotes && (
                    <div className="p-2 bg-stone-50 rounded-xl text-stone-600 text-[11px]">
                      <strong>Notes:</strong> {day.customNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Offline Day Pass Modal */}
      {isOfflineModalOpen && offlineDayForModal && (
        <OfflineDayPassModal
          isOpen={isOfflineModalOpen}
          onClose={() => setIsOfflineModalOpen(false)}
          day={offlineDayForModal}
          totalDays={generatedItinerary?.length || daysCount}
        />
      )}

    </div>
  );
};
