import React, { useState } from 'react';
import { LocalGuide, Spot } from '../types';
import { Clock, MapPin, ChevronRight } from 'lucide-react';

interface LocalGuidesProps {
  guides: LocalGuide[];
  spots: Spot[];
  onSelectSpotById: (spotId: string) => void;
}

export const LocalGuides: React.FC<LocalGuidesProps> = ({
  guides,
  spots,
  onSelectSpotById,
}) => {
  const [selectedGuideId, setSelectedGuideId] = useState<string>(guides[0]?.id || '');
  const activeGuide = guides.find((g) => g.id === selectedGuideId) || guides[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200/60 pb-4">
        <h2 className="text-2xl sm:text-3xl font-normal text-stone-900 font-serif-title tracking-tight leading-snug">
          Curated Guides &amp; Itineraries
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1 tracking-wide leading-relaxed">
          Handwritten trails by local Goans, architects, and food chroniclers.
        </p>
      </div>

      {/* Guide Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {guides.map((guide) => {
          const isSelected = guide.id === selectedGuideId;
          return (
            <button
              key={guide.id}
              onClick={() => setSelectedGuideId(guide.id)}
              className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                  : 'border-stone-200 bg-white hover:border-stone-400 text-stone-900'
              }`}
            >
              <div className="space-y-1.5">
                <span className={`text-[10px] font-semibold uppercase tracking-widest ${
                  isSelected ? 'text-stone-300' : 'text-stone-400'
                }`}>
                  {guide.duration} • {guide.region === 'both' ? 'All' : `${guide.region} Goa`}
                </span>
                <h4 className="text-xs font-serif-title font-medium leading-snug line-clamp-2">{guide.title}</h4>
              </div>

              <span className={`text-[11px] font-medium tracking-wide ${
                isSelected ? 'text-orange-300' : 'text-stone-500'
              }`}>
                {guide.readTime}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Guide Article */}
      {activeGuide && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 space-y-8 animate-in fade-in duration-200">
          {/* Article Header */}
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-stone-400 tracking-wide">
              <span>{activeGuide.duration}</span>
              <span>•</span>
              <span>{activeGuide.region === 'both' ? 'All Goa' : `${activeGuide.region} Goa`}</span>
              <span>•</span>
              <span>By {activeGuide.author.name}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-stone-900 font-serif-title leading-tight tracking-tight">
              {activeGuide.title}
            </h1>

            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed tracking-wide font-normal">
              {activeGuide.overview}
            </p>
          </div>

          {/* Timeline stops */}
          <div className="space-y-6 pt-4 border-t border-stone-100">
            <h3 className="text-lg font-normal text-stone-900 font-serif-title tracking-tight">
              The Schedule
            </h3>

            <div className="space-y-4">
              {activeGuide.itinerary.map((stop, idx) => {
                const linkedSpot = stop.spotId ? spots.find((s) => s.id === stop.spotId) : null;
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-500 tracking-wide">
                        {stop.time}
                      </span>
                      {linkedSpot && (
                        <button
                          onClick={() => onSelectSpotById(linkedSpot.id)}
                          className="text-xs font-medium text-stone-900 hover:text-amber-800 flex items-center gap-1 transition-colors"
                        >
                          <span>{linkedSpot.name}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <h4 className="text-sm font-serif-title font-medium text-stone-900">{stop.title}</h4>
                    <p className="text-xs text-stone-600 leading-relaxed tracking-wide font-normal">{stop.description}</p>

                    {stop.tip && (
                      <p className="text-[11px] text-stone-500 pt-1 tracking-wide leading-relaxed">
                        <strong className="font-semibold text-stone-700">Insider Tip:</strong> {stop.tip}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
