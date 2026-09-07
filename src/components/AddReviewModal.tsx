import React, { useState } from 'react';
import { Spot, SpotReview, Region } from '../types';
import { X, Star, Sparkles, Check, AlertCircle, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AddReviewModalProps {
  spots: Spot[];
  selectedSpot?: Spot | null;
  onClose: () => void;
  onSubmitReview: (review: SpotReview) => void;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({
  spots,
  selectedSpot,
  onClose,
  onSubmitReview
}) => {
  const [chosenSpotId, setChosenSpotId] = useState(selectedSpot?.id || (spots[0]?.id ?? ''));
  const [authorName, setAuthorName] = useState('');
  const [travelerType, setTravelerType] = useState<SpotReview['travelerType']>('Solo Traveler');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [insiderTip, setInsiderTip] = useState('');
  const [error, setError] = useState('');

  const currentSpot = spots.find((s) => s.id === chosenSpotId) || selectedSpot;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim()) {
      setError('Please enter your name or traveler alias.');
      return;
    }
    if (!title.trim() || !comment.trim()) {
      setError('Please provide a title and your honest review thoughts.');
      return;
    }

    const newReview: SpotReview = {
      id: `rev-${Date.now()}`,
      author: authorName.trim(),
      travelerType,
      rating,
      date: 'Just now',
      title: title.trim(),
      comment: comment.trim(),
      insiderTip: insiderTip.trim() || undefined,
      helpfulCount: 1,
      tags: [travelerType, currentSpot?.area || 'Goa'],
      spotId: chosenSpotId,
      spotName: currentSpot?.name || 'Goa Spot',
      region: currentSpot?.region || 'north'
    };

    onSubmitReview(newReview);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 my-auto p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-md">
              Community Review
            </span>
            <h3 className="text-2xl font-bold text-stone-900 mt-1 font-serif-title">
              Share Your Goa Experience
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Spot */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Select Spot / Area in Goa *
            </label>
            <select
              value={chosenSpotId}
              onChange={(e) => setChosenSpotId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
            >
              {spots.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.region === 'north' ? 'North Goa' : 'South Goa'} • {s.area})
                </option>
              ))}
            </select>
          </div>

          {/* Name & Traveler Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Your Name / Nickname *
              </label>
              <input
                type="text"
                placeholder="e.g. Samarth K."
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Traveler Profile *
              </label>
              <select
                value={travelerType}
                onChange={(e) => setTravelerType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
              >
                <option value="Solo Traveler">Solo Traveler</option>
                <option value="Couple">Couple</option>
                <option value="Friends Group">Friends Group</option>
                <option value="Family">Family</option>
                <option value="Digital Nomad">Digital Nomad</option>
                <option value="Local Goan">Local Goan</option>
              </select>
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Your Rating ({rating} of 5 Stars) *
            </label>
            <div className="flex items-center gap-1.5 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-amber-400 focus:outline-none hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Review Headline / One-liner *
            </label>
            <input
              type="text"
              placeholder="e.g. Unbelievable sunset with delicious cocktails!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
            />
          </div>

          {/* Detailed Comment */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Your Honest Experience &amp; Vibe *
            </label>
            <textarea
              rows={3}
              placeholder="Tell other travelers about the crowd, food flavor, seating, cleanliness, music..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Insider Tip */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              💡 Secret Insider Tip (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Park scooters at the north gate; order the butter garlic calamari."
              value={insiderTip}
              onChange={(e) => setInsiderTip(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-semibold shadow-md shadow-orange-600/20"
            >
              Submit Review &amp; Tip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
