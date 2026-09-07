import React, { useState } from 'react';
import { Spot, Region } from '../types';
import { Sparkles, ArrowRight, RotateCcw, Compass, MapPin, Heart, Check, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VibeQuizProps {
  spots: Spot[];
  onSelectSpot: (spot: Spot) => void;
  onAddToPlanner: (spot: Spot) => void;
  onClose: () => void;
}

interface Question {
  question: string;
  options: {
    label: string;
    sublabel: string;
    vibeCategory: 'epicurean_north' | 'susegad_south' | 'heritage_south' | 'bohemian_north';
  }[];
}

const QUESTIONS: Question[] = [
  {
    question: "How does your dream Goa morning begin?",
    options: [
      {
        label: "Artisanal croissants & cold brew in an Assagao garden",
        sublabel: "Surrounded by bamboo canopies and gentle jazz beats",
        vibeCategory: 'epicurean_north'
      },
      {
        label: "Silent sunrise kayaking alongside river dolphins",
        sublabel: "Glass-calm emerald waters in Palolem crescent bay",
        vibeCategory: 'susegad_south'
      },
      {
        label: "Warm pastéis de nata in an 18th-century Portuguese lane",
        sublabel: "Historic cobblestone morning stroll in Fontainhas",
        vibeCategory: 'heritage_south'
      },
      {
        label: "Fresh fruit smoothie bowl after a surf session at Ashwem",
        sublabel: "Barefoot on wide golden sands with salty hair",
        vibeCategory: 'bohemian_north'
      }
    ]
  },
  {
    question: "What is your quintessential sunset vibe?",
    options: [
      {
        label: "Clifftop mezcal sundowners & melodic house tunes",
        sublabel: "Amphitheater ocean views at Titlie Vagator",
        vibeCategory: 'epicurean_north'
      },
      {
        label: "Wild laterite cliffs overlooking crashing azure waves",
        sublabel: "Peaceful solitude at Cabo de Rama Fortress",
        vibeCategory: 'susegad_south'
      },
      {
        label: "Heritage tavern hopping with craft kokum feni",
        sublabel: "Evening blues and banter outside Joseph Bar",
        vibeCategory: 'heritage_south'
      },
      {
        label: "Beachfront acoustic jam & sunset drum circle",
        sublabel: "Arambol sweet water lake & golden hour glow",
        vibeCategory: 'bohemian_north'
      }
    ]
  },
  {
    question: "Your ultimate dining feast in Goa would be...",
    options: [
      {
        label: "Kerala pepper fry & kokum margaritas in a courtyard",
        sublabel: "Fairy-lit culinary haven at Gunpowder Assagao",
        vibeCategory: 'epicurean_north'
      },
      {
        label: "Butter garlic King Crab & Pork Sorpotel with live retro music",
        sublabel: "Legendary seafood pilgrimage at Martin's Corner",
        vibeCategory: 'susegad_south'
      },
      {
        label: "Progressive 7-course indigenous tasting menu with feni pairings",
        sublabel: "Chef-driven culinary art at Cavatina",
        vibeCategory: 'heritage_south'
      },
      {
        label: "Levantine mezze platters, labneh & raw matcha cakes",
        sublabel: "Secret jungle retreat dining at Mojigao",
        vibeCategory: 'bohemian_north'
      }
    ]
  }
];

export const VibeQuiz: React.FC<VibeQuizProps> = ({
  spots,
  onSelectSpot,
  onAddToPlanner,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState({
    epicurean_north: 0,
    susegad_south: 0,
    heritage_south: 0,
    bohemian_north: 0
  });
  const [resultPersona, setResultPersona] = useState<string | null>(null);

  const handleSelectOption = (vibeCategory: keyof typeof scores) => {
    const updatedScores = {
      ...scores,
      [vibeCategory]: scores[vibeCategory] + 1
    };
    setScores(updatedScores);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate highest score
      let maxCat: string = 'epicurean_north';
      let maxScore = -1;
      (Object.keys(updatedScores) as (keyof typeof scores)[]).forEach((cat) => {
        if (updatedScores[cat] > maxScore) {
          maxScore = updatedScores[cat];
          maxCat = String(cat);
        }
      });
      setResultPersona(maxCat);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 }
      });
    }
  };

  const restartQuiz = () => {
    setCurrentStep(0);
    setScores({
      epicurean_north: 0,
      susegad_south: 0,
      heritage_south: 0,
      bohemian_north: 0
    });
    setResultPersona(null);
  };

  // Persona Details
  const PERSONAS: { [key: string]: { title: string; region: string; quote: string; recommendedSpotIds: string[] } } = {
    epicurean_north: {
      title: 'The North Goa Epicurean & Sunset Chaser',
      region: 'North Goa (Assagao & Vagator)',
      quote: 'You thrive where world-class dining meets breezy clifftop sundowners, curated design boutiques, and vibrant energy.',
      recommendedSpotIds: ['gunpowder-assagao', 'titlie-vagator', 'baba-au-rhum-anjuna', 'chapora-fort']
    },
    susegad_south: {
      title: 'The Susegad Soul & White Sand Pilgrim',
      region: 'South Goa (Palolem, Agonda & Betalbatim)',
      quote: 'Your heart belongs to slow mornings, untouched sandy bays, peaceful dolphin kayaks, and colossal seafood feasts.',
      recommendedSpotIds: ['palolem-beach', 'martins-corner-betalbatim', 'cabo-de-rama-cliff', 'agonda-beach-sanctuary']
    },
    heritage_south: {
      title: 'The Heritage Connoisseur & Feni Aficionado',
      region: 'Central / South Goa (Fontainhas Panaji & Benaulim)',
      quote: 'You appreciate 18th-century architecture, vintage taverns, warm pastéis de nata, and forgotten indigenous culinary traditions.',
      recommendedSpotIds: ['fontainhas-latin-quarter', 'joseph-bar-fontainhas', 'cavatina-by-avinash-martins', 'sahakari-spice-farm']
    },
    bohemian_north: {
      title: 'The Wild Bohemian & Forest Healer',
      region: 'North Goa (Ashwem, Arambol & Assagao)',
      quote: 'You gravitate towards yoga under jungle canopies, wide surf beaches, wholesome vegan mezze, and sweet water springs.',
      recommendedSpotIds: ['ashwem-beach', 'mojigao-assagao', 'arambol-sweet-water-lake', 'baba-au-rhum-anjuna']
    }
  };

  const persona = resultPersona ? PERSONAS[resultPersona] : null;
  const recommendedSpots = persona
    ? spots.filter((s) => persona.recommendedSpotIds.includes(s.id))
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {!resultPersona ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xl space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Goa Persona Matcher • Question {currentStep + 1} of {QUESTIONS.length}
              </span>
            </div>
            <div className="flex gap-1.5">
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === currentStep
                      ? 'w-8 bg-orange-600'
                      : i < currentStep
                      ? 'w-4 bg-emerald-500'
                      : 'w-4 bg-stone-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif-title">
            {QUESTIONS[currentStep].question}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {QUESTIONS[currentStep].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(option.vibeCategory)}
                className="p-5 rounded-2xl border-2 border-stone-200 hover:border-orange-500 bg-stone-50/60 hover:bg-orange-50/40 text-left transition-all group flex flex-col justify-between space-y-2 hover:scale-[1.01]"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-sm text-stone-900 group-hover:text-orange-950">
                    {option.label}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-white border border-stone-200 flex items-center justify-center text-xs text-stone-400 group-hover:border-orange-500 group-hover:text-orange-600 shrink-0">
                    →
                  </div>
                </div>
                <p className="text-xs text-stone-500 group-hover:text-stone-700">
                  {option.sublabel}
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Result Screen */
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-2xl space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider">
              ✨ Your Goa Vibe Archetype
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif-title">
              {persona?.title}
            </h2>

            <p className="text-stone-600 text-sm leading-relaxed">
              "{persona?.quote}"
            </p>

            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold">
              📍 Primary Territory: {persona?.region}
            </span>
          </div>

          {/* Recommended Spots */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-stone-900 text-base font-serif-title">
                Handpicked Spots Tailored to Your Persona
              </h4>
              <button
                onClick={restartQuiz}
                className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedSpots.map((spot) => (
                <div
                  key={spot.id}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-200/90 flex items-center justify-between gap-3 group hover:border-orange-400 transition-all"
                >
                  <div
                    onClick={() => onSelectSpot(spot)}
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  >
                    <img
                      src={spot.heroImage}
                      alt={spot.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
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

                  <button
                    onClick={() => onAddToPlanner(spot)}
                    className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shrink-0 shadow-xs flex items-center gap-1"
                    title="Add to Itinerary"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Plan</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-all"
            >
              Explore Full Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
