import React, { useState } from 'react';
import { SpotReview, Region, Spot } from '../types';
import { Star, ThumbsUp, Plus, Search } from 'lucide-react';

interface ReviewSectionProps {
  reviews: SpotReview[];
  spots: Spot[];
  currentRegion: Region;
  onSelectRegion: (region: Region) => void;
  onOpenAddReview: (spot?: Spot) => void;
  onSelectSpotById: (spotId: string) => void;
  onUpvoteReview: (reviewId: string) => void;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  reviews,
  currentRegion,
  onSelectRegion,
  onOpenAddReview,
  onSelectSpotById,
  onUpvoteReview
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());

  const handleUpvote = (id: string) => {
    if (upvotedIds.has(id)) return;
    setUpvotedIds(new Set([...upvotedIds, id]));
    onUpvoteReview(id);
  };

  const filteredReviews = reviews.filter((rev) => {
    const matchesRegion = currentRegion === 'all' || rev.region === currentRegion;
    const matchesSearch =
      searchQuery.trim() === '' ||
      rev.spotName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/60 pb-4">
        <div>
          <h2 className="text-2xl font-normal text-stone-900 font-serif-title">
            Traveler Reviews &amp; Tips
          </h2>
          <p className="text-xs text-stone-500">
            Unbiased community reviews for North and South Goa
          </p>
        </div>

        <button
          onClick={() => onOpenAddReview()}
          className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center gap-1.5 self-start transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-stone-100/70 border border-stone-200 focus:outline-none focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-medium self-start">
          <button
            onClick={() => onSelectRegion('all')}
            className={`px-3 py-1 rounded-lg transition-all ${
              currentRegion === 'all' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500'
            }`}
          >
            All
          </button>
          <button
            onClick={() => onSelectRegion('north')}
            className={`px-3 py-1 rounded-lg transition-all ${
              currentRegion === 'north' ? 'bg-stone-900 text-white' : 'text-stone-500'
            }`}
          >
            North
          </button>
          <button
            onClick={() => onSelectRegion('south')}
            className={`px-3 py-1 rounded-lg transition-all ${
              currentRegion === 'south' ? 'bg-stone-900 text-white' : 'text-stone-500'
            }`}
          >
            South
          </button>
        </div>
      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-white border border-stone-200 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectSpotById(rev.spotId)}
                  className="font-bold text-xs text-stone-900 hover:text-orange-600 transition-colors text-left"
                >
                  {rev.spotName}
                </button>
                <span className="text-[10px] text-stone-400 uppercase font-medium">
                  {rev.region === 'north' ? 'North Goa' : 'South Goa'}
                </span>
              </div>

              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                    }`}
                  />
                ))}
              </div>

              <h4 className="text-xs font-bold text-stone-900">
                "{rev.title}"
              </h4>

              <p className="text-xs text-stone-600 leading-relaxed">
                {rev.comment}
              </p>

              {rev.insiderTip && (
                <p className="text-[11px] text-stone-500 pt-1">
                  <strong>Tip:</strong> {rev.insiderTip}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
              <span>{rev.author} • {rev.travelerType}</span>
              <button
                onClick={() => handleUpvote(rev.id)}
                disabled={upvotedIds.has(rev.id)}
                className="flex items-center gap-1 hover:text-stone-900 transition-colors"
              >
                <ThumbsUp className="w-3 h-3" />
                <span>{rev.helpfulCount}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
