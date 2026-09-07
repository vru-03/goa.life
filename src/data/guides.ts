import { LocalGuide } from '../types';

export const LOCAL_GUIDES: LocalGuide[] = [
  {
    id: 'north-goa-48-hours',
    title: 'The 48-Hour North Goa Sunsets, Foodie & Bohemian Trail',
    subtitle: 'From morning sourdough in Assagao to cliffside sundowners and electric beach nights.',
    region: 'north',
    duration: '2 Days / 48 Hours',
    category: 'Food, Nightlife & Vibes',
    author: {
      name: 'Rohan & Tara',
      role: 'Goa Food Chroniclers & Assagao Locals',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    readTime: '6 min read',
    overview: 'North Goa has evolved far beyond its generic party reputation into a vibrant creative hub of artisanal bakeries, design boutiques, tranquil northern sandbanks, and world-class culinary experiments in vintage Goan-Portuguese villas.',
    highlights: [
      'Artisanal breakfast among paddy fields in Anjuna/Assagao',
      'Quiet dip and surf lesson at uncrowded Ashwem beach',
      'Golden hour clifftop drinks with ocean breeze at Titlie',
      'Late evening Goan coastal feast at Gunpowder under fairy lights'
    ],
    itinerary: [
      {
        time: 'Day 1 • 09:00 AM',
        title: 'Morning Fuel at Baba Au Rhum',
        spotId: 'baba-au-rhum-anjuna',
        description: 'Start in the shade of bamboo groves with freshly baked almond croissants and iced Vietnamese brews overlooking the Anjuna fields.',
        tip: 'Arrive before 10 AM to get the prime outdoor tables overlooking the palms.'
      },
      {
        time: 'Day 1 • 12:30 PM',
        title: 'Boutique Shopping & Villa Stroll in Assagao',
        spotId: 'mojigao-assagao',
        description: 'Wander down Badem and Saunto Vaddo in Assagao, checking out concept stores and wellness centers.',
        tip: 'Rent a classic Vespa or Activa scooter for easy parking in tight village lanes.'
      },
      {
        time: 'Day 1 • 05:00 PM',
        title: 'Sunset Clifftop Sundowner at Titlie Vagator',
        spotId: 'titlie-vagator',
        description: 'Sip smoky Mezcal Palomas as the sun dips below Ozran beach while DJs play melodic sunset sets.',
        tip: 'Book 3 days ahead for sunset tier seating.'
      },
      {
        time: 'Day 1 • 08:30 PM',
        title: 'Dinner at Gunpowder Courtyard',
        spotId: 'gunpowder-assagao',
        description: 'Savor Kerala beef pepper fry and flaky parottas under ambient colonial heritage lighting.',
        tip: 'Save room for their homemade Mango Panna Cotta and Kokum Margarita.'
      },
      {
        time: 'Day 2 • 08:00 AM',
        title: 'Surf, Swim & Sunbed Lounging at Ashwem',
        spotId: 'ashwem-beach',
        description: 'Head north across the Chapora river bridge to pristine Ashwem beach for calm tides and palm shade.',
        tip: 'Shack sunbeds are complimentary if you order fresh coconut water or breakfast snacks.'
      },
      {
        time: 'Day 2 • 05:30 PM',
        title: 'Chapora Fort Clifftop Panoramas',
        spotId: 'chapora-fort',
        description: 'Climb the laterite path to the iconic Portuguese ramparts for 360-degree views of the sea meeting the river estuary.',
        tip: 'Wear good footwear as the red laterite stone path can be slightly slippery.'
      }
    ]
  },
  {
    id: 'south-goa-susegad-retreat',
    title: 'The Susegad South Goa 3-Day Digital Detox & White Sand Escape',
    subtitle: 'Kayaking secluded lagoons, slow thalis in Betalbatim, and peaceful dolphin bays.',
    region: 'south',
    duration: '3 Days',
    category: 'Peace, Nature & Heritage',
    author: {
      name: 'Maria Fernandes',
      role: 'South Goa Heritage Architect & Storyteller',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
    },
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    readTime: '7 min read',
    overview: 'South Goa is where you discover true Goan ‘Susegad’—a tranquil, contented lifestyle of slow mornings, endless stretches of unhurried white sand beaches, fragrant spice forests, and heartfelt culinary heritage.',
    highlights: [
      'Sunrise glass-water kayaking in Palolem crescent bay',
      'Wild cliffside sunset gazing at ancient Cabo de Rama Fort',
      'Seafood pilgrimage to Martin’s Corner for butter garlic crab',
      'Private emerald freshwater lagoon swimming at Cola Beach'
    ],
    itinerary: [
      {
        time: 'Day 1 • 07:00 AM',
        title: 'Sunrise Kayaking & Dolphin Spotting in Palolem',
        spotId: 'palolem-beach',
        description: 'Rent a kayak at first light when the water is like a mirror, paddling past Monkey Rock towards secret cove beaches.',
        tip: 'Early morning (6:30-8:00 AM) is the only time to see playful river dolphins close to shore.'
      },
      {
        time: 'Day 1 • 01:00 PM',
        title: 'Seafood Feast & Live Music at Martin’s Corner',
        spotId: 'martins-corner-betalbatim',
        description: 'Tuck into Mrs. Pereira’s legendary butter garlic king crab, pork sorpotel, and hot sannas with live acoustic melodies.',
        tip: 'Ask the waiter for the catch of the day on display ice trays.'
      },
      {
        time: 'Day 2 • 10:00 AM',
        title: 'Secret Lagoon Dip at Cola Beach',
        spotId: 'cola-beach-lagoon',
        description: 'Trek down the palm ridge to discover where a crystal river lagoon flows parallel to breaking ocean surf.',
        tip: 'Pack swimming goggles and rent a small wooden boat to explore the mangrove bank.'
      },
      {
        time: 'Day 2 • 04:30 PM',
        title: 'Dramatic Cliff Sunsets at Cabo de Rama Fort',
        spotId: 'cabo-de-rama-cliff',
        description: 'Perched 150 feet above the crashing sea, explore the centuries-old white church and fortress bastions.',
        tip: 'Head to the western corner bastion for the best panoramic photograph.'
      },
      {
        time: 'Day 3 • 07:30 PM',
        title: 'Modern Goan Degustation at Cavatina',
        spotId: 'cavatina-by-avinash-martins',
        description: 'End your South Goa journey with Chef Avinash Martins’ seven-course celebration of forgotten indigenous Goan ingredients.',
        tip: 'Pair the meal with their artisanal curated Goan cashew feni cocktail flight.'
      }
    ]
  },
  {
    id: 'panjim-fontainhas-heritage-walk',
    title: 'The Fontainhas Latin Quarter & Old Panjim Heritage Walk',
    subtitle: 'Portuguese azulejo tiles, ancient bakeries, feni taverns, and vibrant cobblestone alleys.',
    region: 'south',
    duration: '1 Full Day',
    category: 'Culture & Architecture',
    author: {
      name: 'Clinton D’Souza',
      role: 'Panaji Walking Tour Host & Historian',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    heroImage: 'https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?auto=format&fit=crop&w=1200&q=80',
    readTime: '5 min read',
    overview: 'Asia’s only surviving authentic Latin Quarter. Stroll through narrow cobblestone lanes flanked by 18th-century yellow, maroon, and blue Portuguese mansions with terracotta tiled roofs and wrought-iron balconies.',
    highlights: [
      'Freshly baked pastéis de nata at Confeitaria 31 De Janeiro (since 1930)',
      'Marveling at the Our Lady of Immaculate Conception white zigzag staircases',
      'Artisanal hand-painted Azulejo tile souvenirs',
      'Evening Tambde Rosa cocktails at legendary Joseph Bar'
    ],
    itinerary: [
      {
        time: '08:30 AM',
        title: 'Pastéis de Nata & Coffee at Confeitaria 31 De Janeiro',
        spotId: 'fontainhas-latin-quarter',
        description: 'Start with woodfire oven baked warm custard tarts and traditional bolo sans rival in Goa’s oldest bakery.',
        tip: 'Ask for warm pastéis sprinkled with fresh cinnamon.'
      },
      {
        time: '10:30 AM',
        title: 'Cobblestone Street Photography in Mala & Fontainhas',
        spotId: 'fontainhas-latin-quarter',
        description: 'Capture the vivid ochre, terracotta, and indigo facades with traditional rooster weather-vanes.',
        tip: 'Please be respectful of residential privacy while taking street portraits.'
      },
      {
        time: '06:30 PM',
        title: 'Local Craft Feni & Pork Cutlet Bread at Joseph Bar',
        spotId: 'joseph-bar-fontainhas',
        description: 'Stand outside this cozy vintage tavern sharing stories with locals over kokum feni cocktails and cold craft beer.',
        tip: 'Try the "Tambde Rosa" – Joseph Bar’s iconic feni cocktail served in chilled copper mugs.'
      }
    ]
  },
  {
    id: 'goa-waterfalls-and-wild-nature',
    title: 'Secret Waterfalls, Western Ghats & Backwater Kayaking',
    subtitle: 'Escape the coastline to dive into misty waterfalls, spice groves, and tranquil river trails.',
    region: 'both',
    duration: '2 Days',
    category: 'Adventure & Eco-Tourism',
    author: {
      name: 'Pooja Naik',
      role: 'Wilderness Naturalist & Trek Leader',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    },
    heroImage: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
    readTime: '6 min read',
    overview: 'Goa’s hinterland is a lush biodiversity hotspot. The Western Ghats shelter magnificent waterfalls, organic spice farms, emerald backwaters, and pristine freshwater pools.',
    highlights: [
      'Jeep safari across riverbeds to majestic Dudhsagar Waterfalls',
      'Organic spice farm tour with banana-leaf claypot lunch',
      'Peaceful backwater birdwatching & mangrove kayaking',
      'Freshwater natural spring dips'
    ],
    itinerary: [
      {
        time: 'Day 1 • 07:30 AM',
        title: '4x4 Forest Safari to Dudhsagar Falls',
        spotId: 'dudhsagar-waterfalls',
        description: 'Ride through Bhagwan Mahavir Wildlife Sanctuary crossing forested rivers to the base of the mighty 1,000ft waterfall.',
        tip: 'Pre-book the government forest jeep pass online or arrive at Kulem counter by 7:30 AM.'
      },
      {
        time: 'Day 1 • 01:30 PM',
        title: 'Spice Trail & Goan Feast at Sahakari Farm',
        spotId: 'sahakari-spice-farm',
        description: 'Walk through vanilla and nutmeg plantations followed by an authentic traditional Saraswat buffet.',
        tip: 'Try the fresh lemongrass tea and natural cashew feni tasting.'
      }
    ]
  }
];
