import { Spot, NomadMetrics } from '../types';

export const getSpotNomadMetrics = (spot: Spot): NomadMetrics => {
  if (spot.nomadMetrics) {
    return spot.nomadMetrics;
  }

  // Smart heuristic based on category & vibes for complete coverage
  const isCafe = spot.category === 'cafe';
  const isDining = spot.category === 'dining';
  const isBeach = spot.category === 'beach';
  const isHeritage = spot.category === 'heritage';
  const vibes = (spot.vibe || []).join(' ').toLowerCase();

  if (isCafe || vibes.includes('nomad') || vibes.includes('coffee') || vibes.includes('bakery')) {
    if (spot.id.includes('baba-au-rhum') || spot.id.includes('caravela') || spot.id.includes('prana')) {
      return {
        wifiSpeedMbps: 120,
        wifiRating: 'Blazing Fiber (100+ Mbps)',
        seatingComfort: 'Ergonomic & Cushioned',
        powerOutlets: 'Abundant at most tables',
        noiseLevel: 'Lively Cafe Buzz',
        nomadScore: 9.4,
        bestTimeForWork: '8:30 AM – 1:00 PM',
        backupPower: true,
        communityVibe: 'Active remote workers & digital creators'
      };
    }

    return {
      wifiSpeedMbps: 75,
      wifiRating: 'Fast & Stable (50-100 Mbps)',
      seatingComfort: 'Spacious Work Desks',
      powerOutlets: 'Moderate / Wall seats',
      noiseLevel: 'Lively Cafe Buzz',
      nomadScore: 8.8,
      bestTimeForWork: '9:00 AM – 12:30 PM',
      backupPower: true,
      communityVibe: 'Laptop-friendly chill ambiance'
    };
  }

  if (isHeritage || spot.category === 'wellness') {
    return {
      wifiSpeedMbps: 60,
      wifiRating: 'Fast & Stable (50-100 Mbps)',
      seatingComfort: 'Breezy Bamboo Lounges',
      powerOutlets: 'Moderate / Wall seats',
      noiseLevel: 'Silent / Deep Focus',
      nomadScore: 8.5,
      bestTimeForWork: '10:00 AM – 3:00 PM',
      backupPower: true,
      communityVibe: 'Peaceful deep work & journaling'
    };
  }

  if (isBeach || spot.category === 'nature') {
    return {
      wifiSpeedMbps: 25,
      wifiRating: 'Mobile Hotspot / Spotty',
      seatingComfort: 'Breezy Bamboo Lounges',
      powerOutlets: 'Limited / Ask staff',
      noiseLevel: 'Beach Waves & Breeze',
      nomadScore: 7.2,
      bestTimeForWork: 'Early Morning or Sunset Co-working',
      backupPower: false,
      communityVibe: 'Open-air creative ideation'
    };
  }

  if (isDining || spot.category === 'nightlife') {
    return {
      wifiSpeedMbps: 50,
      wifiRating: 'Decent (20-50 Mbps)',
      seatingComfort: 'Casual Cafe Tables',
      powerOutlets: 'Limited / Ask staff',
      noiseLevel: 'Upbeat Ambient Beats',
      nomadScore: 7.6,
      bestTimeForWork: 'Lunch to Late Afternoon (12 PM – 4 PM)',
      backupPower: true,
      communityVibe: 'Casual meetings & casual email checks'
    };
  }

  return {
    wifiSpeedMbps: 40,
    wifiRating: 'Decent (20-50 Mbps)',
    seatingComfort: 'Casual Cafe Tables',
    powerOutlets: 'Limited / Ask staff',
    noiseLevel: 'Lively Cafe Buzz',
    nomadScore: 7.5,
    bestTimeForWork: '11:00 AM – 3:00 PM',
    backupPower: false,
    communityVibe: 'General visitor friendly'
  };
};
