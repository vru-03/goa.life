import React from 'react';
import { Spot } from '../types';
import { Heart, Star, Sparkles, Sun, Sunset, Moon, SunMedium, Clock, Wifi, Zap, Armchair, BatteryCharging, Headphones } from 'lucide-react';
import { getSpotNomadMetrics } from '../utils/nomadUtils';

interface SpotCardProps {
  spot: Spot;
  onSelectSpot: (spot: Spot) => void;
  isSaved: boolean;
  onToggleSave: (spotId: string) => void;
  viewMode?: 'standard' | 'nomad';
}

const getCompactBestTime = (bestTimeStr: string) => {
  const lower = (bestTimeStr || '').toLowerCase();
  if (lower.includes('sunset') || lower.includes('golden hour')) {
    return { label: 'Sunset', Icon: Sunset };
  }
  if (lower.includes('morning') || lower.includes('breakfast') || lower.includes('dawn') || lower.includes('sunrise')) {
    return { label: 'Morning', Icon: Sun };
  }
  if (lower.includes('night') || lower.includes('dinner') || lower.includes('evening') || lower.includes('late')) {
    return { label: 'Night', Icon: Moon };
  }
  if (lower.includes('afternoon') || lower.includes('lunch')) {
    return { label: 'Afternoon', Icon: SunMedium };
  }
  return { label: 'Daylight', Icon: Clock };
};

const getBudgetLabel = (tier: string) => {
  if (tier === '$' || tier === '₹') return 'Pocket-Friendly';
  if (tier === '$$' || tier === '₹₹') return 'Balanced';
  if (tier === '$$$' || tier === '₹₹₹') return 'Boutique';
  return 'Elevated Luxury';
};

const getWifiBadgeColor = (mbps: number) => {
  if (mbps >= 100) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (mbps >= 50) return 'text-cyan-700 bg-cyan-50 border-cyan-200';
  if (mbps >= 25) return 'text-amber-700 bg-amber-50 border-amber-200';
  return 'text-stone-600 bg-stone-100 border-stone-200';
};

export const SpotCard: React.FC<SpotCardProps> = ({
  spot,
  onSelectSpot,
  isSaved,
  onToggleSave,
  viewMode = 'standard'
}) => {
  const bestTimeInfo = getCompactBestTime(spot.bestTime);
  const BestTimeIcon = bestTimeInfo.Icon;
  const isPureVeg = spot.dietaryType === 'veg';
  const nomad = getSpotNomadMetrics(spot);
  const isNomadView = viewMode === 'nomad';

  return (
    <div 
      onClick={() => onSelectSpot(spot)}
      className="group cursor-pointer flex flex-col space-y-3 p-3 rounded-2xl bg-white/70 hover:bg-white border border-stone-200/70 hover:border-stone-300 shadow-2xs hover:shadow-md hover:scale-[1.018] hover:-translate-y-1 transition-all duration-300 ease-out"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-100">
        <img
          src={spot.heroImage}
          alt={spot.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-white/90 text-stone-900 backdrop-blur-xs shadow-xs">
              {spot.region === 'north' ? 'North' : 'South'}
            </span>
            {spot.hiddenGem && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/90 text-white backdrop-blur-xs shadow-xs">
                <Sparkles className="w-2.5 h-2.5" />
                Gem
              </span>
            )}
            {isNomadView && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600/95 text-white backdrop-blur-xs shadow-xs">
                <Zap className="w-2.5 h-2.5" />
                {nomad.nomadScore}/10 Nomad
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(spot.id);
            }}
            aria-label="Save"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/90 text-stone-700 hover:text-rose-500 backdrop-blur-xs transition-all pointer-events-auto shadow-xs shrink-0"
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Bottom Badges */}
        {isNomadView ? (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
            <div className="bg-stone-900/85 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5 shadow-xs">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>{nomad.wifiSpeedMbps} Mbps Fiber</span>
            </div>
            <div className="bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px] font-medium text-white flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{spot.rating}</span>
            </div>
          </div>
        ) : (
          <>
            <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10.5px] font-medium text-white/90 flex items-center gap-1">
              <BestTimeIcon className="w-3 h-3 text-amber-300" />
              <span>{bestTimeInfo.label}</span>
            </div>

            <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px] font-medium text-white flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{spot.rating}</span>
            </div>
          </>
        )}
      </div>

      {/* Text Info */}
      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="font-serif-title font-normal text-stone-900 text-base tracking-tight leading-snug group-hover:text-amber-800 transition-colors line-clamp-1 truncate">
              {spot.name}
            </h3>
            {isPureVeg && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0">
                🌱 Veg
              </span>
            )}
          </div>
          <span className="text-[11px] text-stone-500 font-medium tracking-wide shrink-0">
            {getBudgetLabel(spot.priceTier)}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11.5px] tracking-wide text-stone-500 font-medium">
          <span>{spot.area} • {spot.category.charAt(0).toUpperCase() + spot.category.slice(1)}</span>
        </div>

        {/* Digital Nomad Specs Mode vs Standard Description */}
        {isNomadView ? (
          <div className="pt-1 space-y-1.5">
            {/* Wi-Fi & Seating Badges */}
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-md border font-medium truncate ${getWifiBadgeColor(nomad.wifiSpeedMbps)}`}>
                <Wifi className="w-3 h-3 shrink-0" />
                <span className="truncate">{nomad.wifiSpeedMbps} Mbps</span>
              </div>

              <div className="flex items-center gap-1 px-2 py-1 rounded-md border border-stone-200 bg-stone-50 text-stone-700 font-medium truncate">
                <Armchair className="w-3 h-3 text-stone-500 shrink-0" />
                <span className="truncate">{nomad.seatingComfort.split(' ')[0]} Seating</span>
              </div>
            </div>

            {/* Outlets & Noise Level */}
            <div className="flex items-center justify-between text-[10.5px] text-stone-500 pt-0.5">
              <span className="flex items-center gap-1">
                <BatteryCharging className="w-3 h-3 text-amber-600" />
                <span className="truncate max-w-[110px]">{nomad.powerOutlets.split('/')[0]}</span>
              </span>
              <span className="flex items-center gap-1">
                <Headphones className="w-3 h-3 text-indigo-600" />
                <span className="truncate max-w-[100px]">{nomad.noiseLevel.split('/')[0]}</span>
              </span>
            </div>
          </div>
        ) : (
          <p className="text-[12.5px] text-stone-600 line-clamp-2 leading-relaxed tracking-wide pt-0.5 font-normal">
            {spot.description}
          </p>
        )}
      </div>
    </div>
  );
};
