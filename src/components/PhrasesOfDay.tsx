import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, RefreshCw, Copy, Check, MessageSquare, Sun, Sunset, Moon, Coffee, Heart } from 'lucide-react';
import { KonkaniPhrase } from '../types';
import { KONKANI_PHRASES, getKonkaniPhraseForNow } from '../data/phrases';

interface PhrasesOfDayProps {
  onOpenGlossary?: () => void;
}

export const PhrasesOfDay: React.FC<PhrasesOfDayProps> = ({ onOpenGlossary }) => {
  const [currentPhrase, setCurrentPhrase] = useState<KonkaniPhrase>(getKonkaniPhraseForNow());
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'morning' | 'afternoon' | 'evening' | 'night' | 'food' | 'susegad'>('all');
  const [isExpanded, setIsExpanded] = useState(false);

  // Time of day badge config
  const getTimeBadge = (timeOfDay: string) => {
    switch (timeOfDay) {
      case 'morning':
        return { label: 'Morning Greeting', icon: Sun, color: 'text-amber-600 bg-amber-50 border-amber-200' };
      case 'afternoon':
        return { label: 'Susegad Afternoon', icon: Coffee, color: 'text-orange-600 bg-orange-50 border-orange-200' };
      case 'evening':
        return { label: 'Golden Hour Sundowner', icon: Sunset, color: 'text-rose-600 bg-rose-50 border-rose-200' };
      case 'night':
        return { label: 'Starlit Night', icon: Moon, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' };
      default:
        return { label: 'Local Expression', icon: Sparkles, color: 'text-stone-700 bg-stone-100 border-stone-200' };
    }
  };

  const handleNextPhrase = () => {
    let pool = KONKANI_PHRASES;
    if (selectedCategory !== 'all') {
      pool = KONKANI_PHRASES.filter(
        (p) => p.timeOfDay === selectedCategory || p.category === selectedCategory
      );
      if (pool.length === 0) pool = KONKANI_PHRASES;
    }
    const currentIdx = pool.findIndex((p) => p.id === currentPhrase.id);
    const nextIdx = (currentIdx + 1) % pool.length;
    setCurrentPhrase(pool[nextIdx]);
  };

  const handleCategoryFilter = (cat: typeof selectedCategory) => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      setCurrentPhrase(getKonkaniPhraseForNow());
    } else {
      const match = KONKANI_PHRASES.find(
        (p) => p.timeOfDay === cat || p.category === cat
      );
      if (match) setCurrentPhrase(match);
    }
  };

  const handlePlayAudio = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    setIsPlayingAudio(true);
    const utterance = new SpeechSynthesisUtterance(currentPhrase.phrase);
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.lang = 'hi-IN'; // Closest native cadence for Konkani phonemes

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${currentPhrase.phrase} (${currentPhrase.meaning})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Badge = getTimeBadge(currentPhrase.timeOfDay);
  const BadgeIcon = Badge.icon;

  return (
    <div className="bg-gradient-to-r from-amber-50/70 via-orange-50/40 to-stone-50/60 border border-amber-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs transition-all">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        
        {/* Left: Content Header & Main Phrase */}
        <div className="space-y-2.5 flex-1 min-w-0">
          
          {/* Header Row */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded-md text-[10.5px]">
              <MessageSquare className="w-3 h-3 text-amber-700" />
              <span>Konkani Phrase of the Day</span>
            </span>

            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10.5px] font-semibold border ${Badge.color}`}>
              <BadgeIcon className="w-3 h-3" />
              <span>{Badge.label}</span>
            </span>
          </div>

          {/* Large Phrase in Konkani + Devanagari */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-3 flex-wrap">
              <h3 className="text-xl sm:text-2xl font-serif-title font-medium text-stone-900 tracking-tight">
                “{currentPhrase.phrase}”
              </h3>
              {currentPhrase.devanagari && (
                <span className="text-stone-400 font-sans text-sm tracking-wide">
                  ({currentPhrase.devanagari})
                </span>
              )}
            </div>

            {/* Phonetic Pronunciation Guide */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 font-mono text-[11px] bg-stone-100/90 px-2 py-0.5 rounded-md border border-stone-200/70">
                🗣️ /{currentPhrase.phonetic}/
              </span>
              <button
                onClick={handlePlayAudio}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                  isPlayingAudio
                    ? 'bg-orange-600 text-white animate-pulse'
                    : 'bg-white text-stone-700 hover:text-stone-950 border border-stone-200 hover:bg-stone-50'
                }`}
                title="Listen to Konkani pronunciation"
              >
                <Volume2 className="w-3 h-3 text-orange-600" />
                <span>{isPlayingAudio ? 'Speaking...' : 'Listen'}</span>
              </button>
            </div>
          </div>

          {/* Meaning & Practical Context */}
          <div className="space-y-1 pt-0.5">
            <p className="text-xs sm:text-sm font-medium text-stone-800">
              <span className="text-stone-400 font-normal">Meaning: </span>
              {currentPhrase.meaning}
            </p>
            <p className="text-xs text-stone-600 leading-relaxed max-w-2xl">
              <span className="text-stone-400 font-normal">When to use: </span>
              {currentPhrase.context}
            </p>
            {currentPhrase.culturalNote && (
              <p className="text-[11px] text-amber-800/90 italic pt-0.5 flex items-center gap-1">
                <span>💡 Insight:</span>
                <span>{currentPhrase.culturalNote}</span>
              </p>
            )}
          </div>
        </div>

        {/* Right Actions & Category Switcher */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-amber-200/60">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleNextPhrase}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold shadow-2xs hover:border-stone-300 transition-all"
              title="View next Konkani phrase"
            >
              <RefreshCw className="w-3 h-3 text-amber-600" />
              <span>Next Phrase</span>
            </button>

            <button
              onClick={handleCopy}
              className="p-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium shadow-2xs transition-all"
              title="Copy phrase and meaning"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {onOpenGlossary && (
              <button
                onClick={onOpenGlossary}
                className="hidden sm:inline-flex text-xs text-amber-900 hover:text-amber-950 font-medium underline underline-offset-2 ml-1"
              >
                Food Glossary →
              </button>
            )}
          </div>

          {/* Quick Scenario Pills */}
          <div className="flex items-center gap-1 overflow-x-auto text-[10.5px]">
            <button
              onClick={() => handleCategoryFilter('all')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                selectedCategory === 'all'
                  ? 'bg-amber-800 text-white font-semibold'
                  : 'bg-white/80 text-stone-600 hover:bg-white border border-stone-200/60'
              }`}
            >
              Now
            </button>
            <button
              onClick={() => handleCategoryFilter('morning')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                selectedCategory === 'morning'
                  ? 'bg-amber-800 text-white font-semibold'
                  : 'bg-white/80 text-stone-600 hover:bg-white border border-stone-200/60'
              }`}
            >
              Morning
            </button>
            <button
              onClick={() => handleCategoryFilter('afternoon')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                selectedCategory === 'afternoon'
                  ? 'bg-amber-800 text-white font-semibold'
                  : 'bg-white/80 text-stone-600 hover:bg-white border border-stone-200/60'
              }`}
            >
              Susegad
            </button>
            <button
              onClick={() => handleCategoryFilter('food')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                selectedCategory === 'food'
                  ? 'bg-amber-800 text-white font-semibold'
                  : 'bg-white/80 text-stone-600 hover:bg-white border border-stone-200/60'
              }`}
            >
              Food &amp; Dining
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
