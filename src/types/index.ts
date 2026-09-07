export type Region = 'all' | 'north' | 'south';

export type DietaryPreference = 'any' | 'veg'; // 'veg' = Vegetarian only; 'any' = Non-Veg & Veg (Flexi)

export type BudgetLevel = 'pocket-friendly' | 'balanced' | 'elevated-luxury'; // Levels of budget without fixed amounts

export type Category = 
  | 'all'
  | 'beach'
  | 'cafe'
  | 'dining'
  | 'nightlife'
  | 'heritage'
  | 'nature'
  | 'wellness'
  | 'stay';

export type PriceTier = '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹' | '$' | '$$' | '$$$' | '$$$$';

export interface SpotReview {
  id: string;
  author: string;
  avatar?: string;
  travelerType: 'Solo Traveler' | 'Couple' | 'Friends Group' | 'Family' | 'Digital Nomad' | 'Local Goan';
  rating: number;
  date: string;
  title: string;
  comment: string;
  insiderTip?: string;
  helpfulCount: number;
  tags?: string[];
  spotId: string;
  spotName: string;
  region: 'north' | 'south';
}

export interface NomadMetrics {
  wifiSpeedMbps: number;
  wifiRating: 'Blazing Fiber (100+ Mbps)' | 'Fast & Stable (50-100 Mbps)' | 'Decent (20-50 Mbps)' | 'Mobile Hotspot / Spotty';
  seatingComfort: 'Ergonomic & Cushioned' | 'Spacious Work Desks' | 'Casual Cafe Tables' | 'Breezy Bamboo Lounges';
  powerOutlets: 'Abundant at most tables' | 'Moderate / Wall seats' | 'Limited / Ask staff' | 'No outlets';
  noiseLevel: 'Silent / Deep Focus' | 'Lively Cafe Buzz' | 'Upbeat Ambient Beats' | 'Beach Waves & Breeze';
  nomadScore: number; // e.g. 9.4 / 10
  bestTimeForWork: string; // e.g. "8:30 AM – 1:00 PM"
  backupPower?: boolean;
  communityVibe?: string;
}

export interface KonkaniPhrase {
  id: string;
  phrase: string;
  devanagari?: string;
  phonetic: string;
  meaning: string;
  context: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | 'all-day';
  category: 'greetings' | 'food' | 'susegad' | 'travel-bargaining' | 'beach-nature';
  culturalNote?: string;
}

export interface Spot {
  id: string;
  name: string;
  tagline: string;
  region: 'north' | 'south';
  area: string; // e.g. Assagao, Palolem, Anjuna, Fontainhas, Mandrem, Benaulim
  category: Category;
  rating: number;
  reviewCount: number;
  priceTier: PriceTier;
  budgetLevel?: BudgetLevel;
  budgetStyle?: BudgetLevel;
  budgetNotes?: string;
  dietaryType?: 'veg' | 'both' | 'flexi' | 'non-veg'; // 'veg' = dedicated pure veg; 'both'/'flexi' = rich veg + non-veg menus
  dietaryNotes?: string;
  vegMustTry?: string[];
  nomadMetrics?: NomadMetrics;
  heroImage: string;
  galleryImages: string[];
  description: string;
  longDescription: string;
  mustTry: string[];
  vibe: string[];
  bestTime: string;
  crowdLevel?: 'Low' | 'Moderate' | 'High' | 'Sunset Rush';
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  openingHours: string;
  contact?: string;
  instagram?: string;
  scooterAccess: string;
  featured?: boolean;
  hiddenGem?: boolean;
}

export interface GuideItineraryStop {
  time: string;
  title: string;
  spotId?: string;
  description: string;
  tip: string;
  image?: string;
}

export interface LocalGuide {
  id: string;
  title: string;
  subtitle: string;
  region: 'north' | 'south' | 'both';
  duration: string; // e.g. "48 Hours", "1 Day", "3 Days"
  category: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  heroImage: string;
  readTime: string;
  overview: string;
  highlights: string[];
  itinerary: GuideItineraryStop[];
}

export interface ItineraryItem {
  id: string;
  day: number;
  timeSlot: 'Morning' | 'Afternoon' | 'Sunset / Golden Hour' | 'Night';
  spot: Spot;
  customNotes?: string;
}
