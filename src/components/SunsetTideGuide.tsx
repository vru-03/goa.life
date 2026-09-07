import React, { useState, useEffect } from 'react';
import { Spot, Region } from '../types';
import { Sunset, ShieldCheck, MapPin, Compass } from 'lucide-react';

interface SunsetTideGuideProps {
  spots: Spot[];
  currentRegion: Region;
  onSelectSpot: (spot: Spot) => void;
  onSelectRegion: (region: Region) => void;
}

interface SunsetSpotConfig {
  spotId: string;
  name: string;
  area: string;
  region: 'north' | 'south';
  vibe: string;
  goldenHourWindow: string;
  swimmingSafety: 'Safe & Gentle' | 'Shallow Sandbar' | 'Scenic (No Swim)';
  bestPairing: string;
}

const SUNSET_LOCATIONS: SunsetSpotConfig[] = [
  {
    spotId: 'chapora-fort',
    name: 'Chapora Fort Ramparts',
    area: 'Chapora',
    region: 'north',
    vibe: 'Panoramic ocean view over Chapora river mouth',
    goldenHourWindow: '5:15 PM – 6:40 PM',
    swimmingSafety: 'Scenic (No Swim)',
    bestPairing: 'Fresh coconut water at hill base'
  },
  {
    spotId: 'antares-vagator',
    name: 'Antares & Ozran Clifftops',
    area: 'Small Vagator',
    region: 'north',
    vibe: 'Terraced amphitheater over black rocks & sundowner cocktails',
    goldenHourWindow: '5:30 PM – 6:45 PM',
    swimmingSafety: 'Scenic (No Swim)',
    bestPairing: 'Botanical passion fruit spritz'
  },
  {
    spotId: 'morjim-beach',
    name: 'Morjim & Mandrem Sands',
    area: 'Morjim',
    region: 'north',
    vibe: 'Wide open sands, low crowds and calm reflection pools',
    goldenHourWindow: '5:00 PM – 6:40 PM',
    swimmingSafety: 'Safe & Gentle',
    bestPairing: 'Iced pour-over or watermelon juice'
  },
  {
    spotId: 'cabo-de-rama-fort',
    name: 'Cabo de Rama High Cliffs',
    area: 'Cabo de Rama',
    region: 'south',
    vibe: 'Untouched wild cliff dropping sheer into turquoise sea',
    goldenHourWindow: '5:10 PM – 6:40 PM',
    swimmingSafety: 'Scenic (No Swim)',
    bestPairing: 'Spiced kokum cooler'
  },
  {
    spotId: 'palolem-beach',
    name: 'Palolem Crescent Bay',
    area: 'Palolem',
    region: 'south',
    vibe: 'Sheltered cove with fishing catamarans and pink horizons',
    goldenHourWindow: '5:20 PM – 6:45 PM',
    swimmingSafety: 'Safe & Gentle',
    bestPairing: 'Chilled King’s beer & calamari'
  },
  {
    spotId: 'cola-beach',
    name: 'Cola Beach Lagoon',
    area: 'Cola, Canacona',
    region: 'south',
    vibe: 'Freshwater stream meeting ocean bordered by jungle',
    goldenHourWindow: '5:00 PM – 6:35 PM',
    swimmingSafety: 'Shallow Sandbar',
    bestPairing: 'Sol Kadi & coconut bakes'
  }
];

export const SunsetTideGuide: React.FC<SunsetTideGuideProps> = ({
  spots,
  currentRegion,
  onSelectSpot,
  onSelectRegion
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [filterRegion, setFilterRegion] = useState<Region>(currentRegion);

  useEffect(() => {
    setFilterRegion(currentRegion);
  }, [currentRegion]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getSunsetCountdown = () => {
    const target = new Date();
    target.setHours(18, 42, 0, 0);
    let diffMs = target.getTime() - currentTime.getTime();
    if (diffMs < 0) {
      target.setDate(target.getDate() + 1);
      diffMs = target.getTime() - currentTime.getTime();
    }
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, mins };
  };

  const { hours, mins } = getSunsetCountdown();

  const filteredLocations = SUNSET_LOCATIONS.filter(
    (loc) => filterRegion === 'all' || loc.region === filterRegion
  );

  const handleSpotClick = (loc: SunsetSpotConfig) => {
    const found = spots.find(
      (s) => s.id === loc.spotId || s.name.toLowerCase().includes(loc.name.toLowerCase().split(' ')[0])
    );
    if (found) {
      onSelectSpot(found);
    } else {
      const fallback = spots.find((s) => s.area.toLowerCase().includes(loc.area.toLowerCase()));
      if (fallback) onSelectSpot(fallback);
    }
  };

  return (
    <div className="space-y-6">
      {/* Clean, Non-Glitzy Header with Solar Clock */}
      <div className="border border-stone-200/80 rounded-2xl bg-stone-50/60 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-stone-500 text-xs">
            <Sunset className="w-3.5 h-3.5 text-orange-600" />
            <span>Goa Coastal Solar Tracking</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-normal font-serif-title text-stone-900">
            Sunset &amp; Coastal Tides
          </h2>
          <p className="text-stone-500 text-xs max-w-lg">
            High tide ~6:30 PM • Low tide ~12:15 PM • Golden hour window 5:15 PM – 6:40 PM.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white px-4 py-2.5 rounded-xl border border-stone-200/70 shrink-0">
          <div>
            <span className="text-[10px] text-stone-400 font-medium block uppercase">Sunset</span>
            <span className="text-sm font-semibold text-stone-900">6:42 PM</span>
          </div>
          <div className="w-px h-6 bg-stone-100" />
          <div>
            <span className="text-[10px] text-stone-400 font-medium block uppercase">In</span>
            <span className="text-sm font-semibold text-orange-600">{hours}h {mins}m</span>
          </div>
        </div>
      </div>

      {/* Region Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200/60 pb-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterRegion('all')}
            className={`px-3 py-1 rounded-full transition-all ${
              filterRegion === 'all' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600 hover:text-stone-900 bg-stone-100'
            }`}
          >
            All Sunset Spots
          </button>
          <button
            onClick={() => setFilterRegion('north')}
            className={`px-3 py-1 rounded-full transition-all ${
              filterRegion === 'north' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600 hover:text-stone-900 bg-stone-100'
            }`}
          >
            North Goa
          </button>
          <button
            onClick={() => setFilterRegion('south')}
            className={`px-3 py-1 rounded-full transition-all ${
              filterRegion === 'south' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600 hover:text-stone-900 bg-stone-100'
            }`}
          >
            South Goa
          </button>
        </div>
        <span className="text-stone-400">{filteredLocations.length} viewpoints</span>
      </div>

      {/* Clean Grid of Sunset Spots */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLocations.map((loc) => (
          <div
            key={loc.spotId}
            onClick={() => handleSpotClick(loc)}
            className="group p-4 rounded-xl border border-stone-200/70 bg-white hover:border-stone-400 transition-all cursor-pointer flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span className="font-medium text-stone-600">{loc.area}</span>
                <span className="text-[11px] text-orange-600 font-mono">{loc.goldenHourWindow}</span>
              </div>
              <h3 className="font-medium text-sm text-stone-900 group-hover:text-orange-600 transition-colors">
                {loc.name}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {loc.vibe}
              </p>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
              <span className="text-stone-500 truncate max-w-[170px]">
                🍸 {loc.bestPairing}
              </span>
              <span className={`px-2 py-0.5 rounded-md font-medium text-[10px] ${
                loc.swimmingSafety === 'Safe & Gentle'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-stone-100 text-stone-600'
              }`}>
                {loc.swimmingSafety}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
