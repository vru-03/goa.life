import React from 'react';
import { Spot } from '../types';
import { X, Heart, Trash2, ArrowUpRight, Plus, MapPin } from 'lucide-react';

interface SavedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedSpots: Spot[];
  onRemoveSaved: (spotId: string) => void;
  onSelectSpot: (spot: Spot) => void;
  onAddToPlanner: (spot: Spot) => void;
}

export const SavedDrawer: React.FC<SavedDrawerProps> = ({
  isOpen,
  onClose,
  savedSpots,
  onRemoveSaved,
  onSelectSpot,
  onAddToPlanner
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base font-serif-title">
                Your Goa Bucket List
              </h3>
              <p className="text-[11px] text-stone-500">{savedSpots.length} saved destinations</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {savedSpots.length === 0 ? (
            <div className="text-center py-16 text-stone-400 space-y-3">
              <Heart className="w-12 h-12 stroke-1 text-stone-300 mx-auto" />
              <p className="text-sm font-semibold text-stone-700">Your bucket list is empty</p>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Click the heart icon on any beach, cafe, or heritage spot to save it for your Goa trip!
              </p>
            </div>
          ) : (
            savedSpots.map((spot) => (
              <div
                key={spot.id}
                className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/90 flex items-center justify-between gap-3 group hover:border-orange-300 transition-all"
              >
                <div
                  onClick={() => {
                    onSelectSpot(spot);
                    onClose();
                  }}
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                >
                  <img
                    src={spot.heroImage}
                    alt={spot.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                      spot.region === 'north' ? 'bg-orange-100 text-orange-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {spot.region}
                    </span>
                    <h5 className="font-bold text-xs text-stone-900 truncate mt-0.5 group-hover:text-orange-600">
                      {spot.name}
                    </h5>
                    <p className="text-[11px] text-stone-500 truncate">{spot.area} • {spot.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      onAddToPlanner(spot);
                      onClose();
                    }}
                    className="p-2 rounded-xl bg-orange-100 text-orange-800 hover:bg-orange-200 text-xs font-semibold"
                    title="Add to Itinerary"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onRemoveSaved(spot.id)}
                    className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedSpots.length > 0 && (
          <div className="p-6 border-t border-stone-100 bg-stone-50/50 space-y-2">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-stone-900 text-white text-xs font-bold shadow-md hover:bg-stone-800 transition-all"
            >
              Continue Exploring
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
