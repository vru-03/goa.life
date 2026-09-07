import React, { useState } from 'react';
import { Spot, ItineraryItem } from '../types';
import { Trash2, Share2, Check } from 'lucide-react';

interface TripPlannerProps {
  spots: Spot[];
  itinerary: ItineraryItem[];
  onAddToItinerary: (spot: Spot, day: number, slot: ItineraryItem['timeSlot']) => void;
  onRemoveFromItinerary: (id: string) => void;
  onSelectSpot: (spot: Spot) => void;
}

const TIME_SLOTS: ItineraryItem['timeSlot'][] = [
  'Morning',
  'Afternoon',
  'Sunset / Golden Hour',
  'Night'
];

export const TripPlanner: React.FC<TripPlannerProps> = ({
  spots,
  itinerary,
  onAddToItinerary,
  onRemoveFromItinerary,
  onSelectSpot
}) => {
  const [activeDay, setActiveDay] = useState(1);
  const [selectedSpotToAdd, setSelectedSpotToAdd] = useState<string>(spots[0]?.id || '');
  const [selectedSlotToAdd, setSelectedSlotToAdd] = useState<ItineraryItem['timeSlot']>('Morning');
  const [copied, setCopied] = useState(false);

  const currentDayItems = itinerary.filter((item) => item.day === activeDay);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const spot = spots.find((s) => s.id === selectedSpotToAdd);
    if (spot) {
      onAddToItinerary(spot, activeDay, selectedSlotToAdd);
    }
  };

  const handleShare = () => {
    let text = `🌴 MY GOA TRIP ITINERARY 🌴\n\n`;
    [1, 2, 3].forEach((day) => {
      const items = itinerary.filter((i) => i.day === day);
      if (items.length > 0) {
        text += `Day ${day}:\n`;
        items.forEach((it) => {
          text += `- ${it.timeSlot}: ${it.spot.name} (${it.spot.region === 'north' ? 'North' : 'South'} Goa)\n`;
        });
        text += `\n`;
      }
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/60 pb-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-normal text-stone-900 font-serif-title tracking-tight leading-snug">
            Custom Trip Planner
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-normal tracking-wide leading-relaxed">
            Build your day-by-day Goa schedule and share with friends.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="px-3.5 py-1.5 rounded-xl border border-stone-200 hover:border-stone-400 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share Itinerary'}</span>
          </button>
        </div>
      </div>

      {/* Add Spot Simple Bar */}
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 bg-stone-50 p-3 rounded-2xl border border-stone-200">
        <select
          value={selectedSpotToAdd}
          onChange={(e) => setSelectedSpotToAdd(e.target.value)}
          className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-stone-200 focus:outline-none"
        >
          {spots.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.region === 'north' ? 'North' : 'South'} • {s.area}) {s.dietaryType === 'veg' ? '🌱' : ''}
            </option>
          ))}
        </select>

        <select
          value={selectedSlotToAdd}
          onChange={(e) => setSelectedSlotToAdd(e.target.value as any)}
          className="px-3 py-2 text-xs rounded-xl bg-white border border-stone-200 focus:outline-none"
        >
          {TIME_SLOTS.map((slot) => (
            <option key={slot} value={slot}>{slot}</option>
          ))}
        </select>

        <button
          type="submit"
          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-medium transition-all"
        >
          + Add to Day {activeDay}
        </button>
      </form>

      {/* Day Tabs */}
      <div className="flex gap-2">
        {[1, 2, 3].map((d) => (
          <button
            key={d}
            onClick={() => setActiveDay(d)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeDay === d
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Day {d}
          </button>
        ))}
      </div>

      {/* Slots */}
      <div className="space-y-3">
        {TIME_SLOTS.map((slot) => {
          const items = currentDayItems.filter((i) => i.timeSlot === slot);
          return (
            <div key={slot} className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
              <span className="text-xs font-semibold text-stone-400 block">{slot}</span>
              {items.length === 0 ? (
                <p className="text-xs text-stone-300 italic">No plans yet</p>
              ) : (
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          onClick={() => onSelectSpot(item.spot)}
                          className="font-medium text-stone-900 cursor-pointer hover:text-orange-600 truncate"
                        >
                          {item.spot.name} <span className="text-stone-400 font-normal">({item.spot.area})</span>
                        </span>
                        {item.spot.dietaryType === 'veg' && (
                          <span className="text-[9.5px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                            🌱 Veg Only
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => onRemoveFromItinerary(item.id)}
                        className="text-stone-400 hover:text-rose-600 ml-2 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
