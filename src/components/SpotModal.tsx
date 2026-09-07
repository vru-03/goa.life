import React, { useState } from 'react';
import { Spot, SpotReview } from '../types';
import { X, Star, MapPin, Heart, Clock, Navigation, Plus, Share2, Check, Wifi, Armchair, BatteryCharging, Headphones, Zap, ShieldCheck } from 'lucide-react';
import { getSpotNomadMetrics } from '../utils/nomadUtils';

interface SpotModalProps {
  spot: Spot;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (spotId: string) => void;
  reviews: SpotReview[];
  onOpenAddReview: (spot: Spot) => void;
  onAddToPlanner?: (spot: Spot) => void;
}

export const SpotModal: React.FC<SpotModalProps> = ({
  spot,
  onClose,
  isSaved,
  onToggleSave,
  reviews,
  onOpenAddReview,
  onAddToPlanner
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const spotReviews = reviews.filter((r) => r.spotId === spot.id);
  const images = spot.galleryImages && spot.galleryImages.length > 0 
    ? spot.galleryImages 
    : [spot.heroImage];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${spot.name} - Goa.Life`,
        text: spot.tagline,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${spot.name}, ${spot.area}, Goa`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-xl border border-stone-200 my-auto flex flex-col max-h-[90vh]">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              {spot.region === 'north' ? 'North Goa' : 'South Goa'}
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs font-medium text-stone-600">{spot.area}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(spot.id)}
              className="p-2 rounded-full text-stone-500 hover:text-rose-500 hover:bg-stone-50 transition-all"
              title="Save"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-all"
              title="Share"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-all"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Title & Tagline */}
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-normal text-stone-900 font-serif-title tracking-tight leading-snug">
                  {spot.name}
                </h2>
                {spot.dietaryType === 'veg' && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    🌱 Veg Only
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-stone-800 shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{spot.rating}</span>
                <span className="text-stone-400 font-normal">({spot.reviewCount})</span>
              </div>
            </div>
            <p className="text-stone-500 text-xs sm:text-sm font-normal tracking-wide leading-relaxed">
              {spot.tagline}
            </p>
          </div>

          {/* Photo Gallery */}
          <div className="space-y-2">
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-stone-100">
              <img
                src={images[activeImageIndex]}
                alt={spot.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border transition-all ${
                      activeImageIndex === idx ? 'border-stone-900' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-stone-100 text-xs">
            <div>
              <span className="text-stone-400 block mb-0.5 tracking-wide">Best Time</span>
              <span className="font-medium text-stone-800">{spot.bestTime}</span>
            </div>
            <div>
              <span className="text-stone-400 block mb-0.5 tracking-wide">Budget Style</span>
              <span className="font-medium text-stone-800">
                {spot.priceTier === '$' || spot.priceTier === '₹'
                  ? 'Pocket-Friendly'
                  : spot.priceTier === '$$' || spot.priceTier === '₹₹'
                  ? 'Balanced'
                  : 'Elevated Luxury'}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block mb-0.5 tracking-wide">Category</span>
              <span className="font-medium text-stone-800 capitalize">
                {spot.category}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block mb-0.5 tracking-wide">Hours</span>
              <span className="font-medium text-stone-800">{spot.openingHours}</span>
            </div>
          </div>

          {/* Story / Description */}
          <div className="space-y-2">
            <h4 className="text-[11px] uppercase tracking-widest font-semibold text-stone-400">
              Overview
            </h4>
            <p className="text-stone-700 text-xs sm:text-sm leading-relaxed tracking-wide whitespace-pre-line font-normal">
              {spot.longDescription || spot.description}
            </p>
          </div>

          {/* Digital Nomad & Remote Work Scorecard */}
          {(() => {
            const nomad = getSpotNomadMetrics(spot);
            return (
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
                      <Zap className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Digital Nomad Scorecard</span>
                    </span>
                    <span className="text-xs font-bold text-stone-900">
                      {nomad.nomadScore}/10 Overall
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    ⚡ {nomad.wifiSpeedMbps} Mbps Fiber
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-stone-200/60">
                    <div className="flex items-center gap-1 text-stone-400 text-[10.5px] mb-1">
                      <Wifi className="w-3 h-3 text-emerald-600" />
                      <span>Wi-Fi Stability</span>
                    </div>
                    <span className="font-semibold text-stone-800 text-[11.5px] block">{nomad.wifiRating}</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-stone-200/60">
                    <div className="flex items-center gap-1 text-stone-400 text-[10.5px] mb-1">
                      <Armchair className="w-3 h-3 text-stone-600" />
                      <span>Seating Comfort</span>
                    </div>
                    <span className="font-semibold text-stone-800 text-[11.5px] block">{nomad.seatingComfort}</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-stone-200/60">
                    <div className="flex items-center gap-1 text-stone-400 text-[10.5px] mb-1">
                      <BatteryCharging className="w-3 h-3 text-amber-600" />
                      <span>Power Outlets</span>
                    </div>
                    <span className="font-semibold text-stone-800 text-[11.5px] block">{nomad.powerOutlets}</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-stone-200/60">
                    <div className="flex items-center gap-1 text-stone-400 text-[10.5px] mb-1">
                      <Headphones className="w-3 h-3 text-indigo-600" />
                      <span>Focus & Noise</span>
                    </div>
                    <span className="font-semibold text-stone-800 text-[11.5px] block">{nomad.noiseLevel}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-200/50 flex-wrap gap-2">
                  <span>⏰ <strong>Best Work Hours:</strong> {nomad.bestTimeForWork}</span>
                  {nomad.backupPower && (
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Generator & Inverter Backup
                    </span>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Must Try List */}
          {spot.mustTry && spot.mustTry.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[11px] uppercase tracking-widest font-semibold text-stone-400">
                Recommended / Must Try
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {spot.mustTry.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 text-xs font-medium tracking-wide"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Location & Directions */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-stone-900">{spot.address}</p>
              <p className="text-[11px] text-stone-500">{spot.area}, Goa</p>
            </div>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium flex items-center gap-1.5 shrink-0 transition-all"
            >
              <Navigation className="w-3 h-3" />
              <span>Directions</span>
            </a>
          </div>

          {/* Community Reviews Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-400">
                User Reviews ({spotReviews.length})
              </h4>
              <button
                onClick={() => onOpenAddReview(spot)}
                className="text-xs font-semibold text-stone-900 hover:text-orange-600 transition-colors"
              >
                + Write a Review
              </button>
            </div>

            {spotReviews.length === 0 ? (
              <p className="text-xs text-stone-400 italic py-2">
                No reviews yet for {spot.name}. Be the first to share your experience!
              </p>
            ) : (
              <div className="space-y-3">
                {spotReviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-xl bg-stone-50 text-xs space-y-1.5 border border-stone-100">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-900">{rev.author}</span>
                      <span className="text-[11px] text-stone-400">{rev.date}</span>
                    </div>
                    <p className="font-medium text-stone-800">"{rev.title}"</p>
                    <p className="text-stone-600 leading-relaxed">{rev.comment}</p>
                    {rev.insiderTip && (
                      <p className="text-[11px] text-stone-500 pt-1">
                        <strong>Tip:</strong> {rev.insiderTip}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-3">
          {onAddToPlanner && (
            <button
              onClick={() => {
                onAddToPlanner(spot);
                onClose();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Trip Planner</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl text-stone-600 hover:text-stone-900 text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
