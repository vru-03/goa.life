import React, { useState } from 'react';
import { 
  Bike, 
  Car, 
  ShieldCheck, 
  ShieldAlert, 
  CloudRain, 
  Sun, 
  CheckSquare, 
  Square, 
  X, 
  Fuel, 
  Compass, 
  CreditCard, 
  FileText, 
  Sparkles,
  ChevronRight,
  Droplets,
  Wind
} from 'lucide-react';

interface TravelLogisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type GoaSeason = 'peak_winter' | 'lush_monsoon' | 'tropical_summer';

interface PackingCategory {
  title: string;
  items: { id: string; name: string; tip?: string }[];
}

const PACKING_LIST_DATA: PackingCategory[] = [
  {
    title: 'Essential Documents & Cash',
    items: [
      { id: 'doc-1', name: 'Physical Driving License', tip: 'Mandatory for scooter/car rentals' },
      { id: 'doc-2', name: 'Aadhaar / Passport copy', tip: 'For rental security deposit' },
      { id: 'doc-3', name: 'Liquid Cash (₹2,000–₹4,000)', tip: 'Village beach shacks & ferries often have patchy UPI' },
      { id: 'doc-4', name: 'DigiLocker App installed', tip: 'Accepted by Goa Traffic Police' },
    ]
  },
  {
    title: 'Coastal & Susegad Footwear & Wear',
    items: [
      { id: 'wear-1', name: 'Breathable linen / cotton shirts', tip: 'Stay cool in humid village walks' },
      { id: 'wear-2', name: 'Sturdy waterproof sandals / slides', tip: 'Essential for cobblestones & beach sands' },
      { id: 'wear-3', name: 'Polarized Sunglasses & Sun Hat', tip: 'High UV glare on coastal drives' },
      { id: 'wear-4', name: 'Light evening linen overlay', tip: 'Breezy coastal nights in North/South Goa' }
    ]
  },
  {
    title: 'Skin Care & Tropical Health',
    items: [
      { id: 'skin-1', name: 'Reef-safe Sunscreen (SPF 50+)', tip: 'Protects skin & marine life' },
      { id: 'skin-2', name: 'Odomos / Citronella Bug Spray', tip: 'Crucial for lush garden cafes & backwaters at dusk' },
      { id: 'skin-3', name: 'Electrolyte packets (ORS)', tip: 'Stay hydrated in coastal heat' },
      { id: 'skin-4', name: 'Waterproof phone pouch', tip: 'Protects from sea spray, sand & pool dips' }
    ]
  }
];

export const TravelLogisticsModal: React.FC<TravelLogisticsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'rentals' | 'season' | 'packing'>('rentals');
  const [selectedSeason, setSelectedSeason] = useState<GoaSeason>('peak_winter');
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  if (!isOpen) return null;

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const totalItems = PACKING_LIST_DATA.reduce((sum, c) => sum + c.items.length, 0);
  const packedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-stone-200 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-900 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-normal text-stone-900 font-serif-title">
                  Goa Travel &amp; Logistics Survival Guide
                </h2>
                <span className="text-[11px] font-bold bg-orange-100 text-orange-900 px-2 py-0.5 rounded-full">
                  Insider Rules
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Transparent vehicle rates, police checkpoint tips, seasonal guide &amp; packing checklist.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-stone-100 bg-white flex items-center gap-2">
          {[
            { id: 'rentals' as const, label: '🛵 Scooter & Car Rentals', icon: Bike },
            { id: 'season' as const, label: '🌦️ Seasonal Switcher', icon: Sun },
            { id: 'packing' as const, label: `🎒 Packing Checklist (${packedCount}/${totalItems})`, icon: CheckSquare },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'border-orange-600 text-orange-900'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: RENTALS & POLICE GUIDE */}
          {activeTab === 'rentals' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Rental Rates Standards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                    Transparent Rental Rate Benchmark (Standard vs Season)
                  </h3>
                  <span className="text-[11px] text-stone-500 font-medium">Standard Goa Rates</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { title: 'Activa / Access Scooter', normPrice: '₹350 – ₹500/day', peakPrice: '₹700 – ₹1,000 (NYE)', note: 'Easiest for village lanes & beach parking' },
                    { title: 'Royal Enfield / Hunter', normPrice: '₹800 – ₹1,200/day', peakPrice: '₹1,500 – ₹2,000', note: 'Great for coastal highway cruises' },
                    { title: 'Thar 4x4 / Gypsy', normPrice: '₹2,500 – ₹3,500/day', peakPrice: '₹4,500 – ₹6,000', note: 'Iconic open-top beach cruiser' },
                    { title: 'Self-Drive Swift / i20', normPrice: '₹1,200 – ₹1,800/day', peakPrice: '₹2,500 – ₹3,500', note: 'AC comfort for family & luggage hops' },
                  ].map((v, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                      <h4 className="text-xs font-bold text-stone-900">{v.title}</h4>
                      <div>
                        <span className="text-sm font-extrabold text-orange-600 block">{v.normPrice}</span>
                        <span className="text-[10px] text-stone-400">Peak Dec: {v.peakPrice}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 leading-snug">{v.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Police Checkpoints & Legal Survival */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Rule 1 */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                    <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Mandatory Helmets &amp; NH66 Highway Rules</span>
                  </div>
                  <p className="text-xs text-amber-950 leading-relaxed">
                    Helmets are <strong>strictly mandatory for BOTH rider and pillion</strong> on all national highways (NH66, Panaji Atal Setu, Mandovi &amp; Zuari bridges). Fines are ₹1,000+ with automatic camera surveillance.
                  </p>
                </div>

                {/* Rule 2 */}
                <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                    <ShieldAlert className="w-4 h-4 text-rose-700 shrink-0" />
                    <span>Zero Tolerance Drinking &amp; Driving</span>
                  </div>
                  <p className="text-xs text-rose-950 leading-relaxed">
                    Goa Traffic Police actively set up breathalyzer checkpoints on weekend nights outside Anjuna, Vagator, and Calangute circle roads. Always book a cab or designate a sober driver.
                  </p>
                </div>

                {/* Rule 3 */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                    <Fuel className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Petrol Pumps vs Bottle Shops</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Roadside bottle vendors sell petrol at ₹120–₹140/liter. It is great for emergencies, but fill up at authorized petrol pumps (~₹98/L) to avoid watered-down fuel or carb clogs.
                  </p>
                </div>

                {/* Rule 4 */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                    <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Deposit Norms (Never Hand Over Original Passport)</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Reputable rental vendors ask for a photocopy of Aadhaar/Passport or a modest security deposit (₹1,000–₹2,000). Never surrender your original passport or physical driving license to rental vendors.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SEASONAL SWITCHER */}
          {activeTab === 'season' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Season Selector Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'peak_winter' as GoaSeason, title: 'Winter Coastal Sun', months: 'October – March', icon: Sun, highlight: 'Prime beach weather, all shacks open & vibrant nightlife' },
                  { id: 'lush_monsoon' as GoaSeason, title: 'Lush Green Susegad', months: 'June – September', icon: CloudRain, highlight: 'Emerald paddy fields, roaring waterfalls, misty Ghats & cheap stays' },
                  { id: 'tropical_summer' as GoaSeason, title: 'Mango & Cashew Summer', months: 'April – May', icon: Droplets, highlight: 'Warm golden sea, sweet Mankurad mangoes & uncrowded shores' }
                ].map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSeason(s.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedSeason === s.id
                        ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                        : 'border-stone-200 hover:border-stone-400 bg-stone-50 text-stone-800'
                    }`}
                  >
                    <s.icon className={`w-5 h-5 mb-2 ${selectedSeason === s.id ? 'text-amber-400' : 'text-orange-600'}`} />
                    <h4 className="text-xs font-bold">{s.title}</h4>
                    <span className={`text-[10px] block mb-1 ${selectedSeason === s.id ? 'text-stone-300' : 'text-stone-500'}`}>
                      {s.months}
                    </span>
                    <p className={`text-[11px] leading-snug ${selectedSeason === s.id ? 'text-stone-300' : 'text-stone-600'}`}>
                      {s.highlight}
                    </p>
                  </div>
                ))}
              </div>

              {/* Dynamic Season Details */}
              {selectedSeason === 'peak_winter' && (
                <div className="p-5 rounded-3xl bg-amber-50/60 border border-amber-200/80 space-y-3">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-700" />
                    <span>Peak Season Travel Blueprint (Oct – Mar)</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-amber-950">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-700 font-bold">•</span>
                      <span><strong>What to do:</strong> Explore all open beach shacks at Mandrem, Morjim, and Palolem. Enjoy clifftop sundowners, open-air flea markets, and live music gigs.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-700 font-bold">•</span>
                      <span><strong>Insider Tip:</strong> Assagao and Fontainhas boutique dining spots (Gunpowder, Jamun, Olive, Viva Panjim) book out 2–3 days in advance. Reserve early!</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-700 font-bold">•</span>
                      <span><strong>Sea Conditions:</strong> Gentle, flat turquoise waters. Perfect for swimming, paddleboarding, and dolphin watching.</span>
                    </li>
                  </ul>
                </div>
              )}

              {selectedSeason === 'lush_monsoon' && (
                <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CloudRain className="w-4 h-4 text-emerald-700" />
                    <span>Monsoon Magic Travel Blueprint (Jun – Sep)</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-emerald-950">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span><strong>What to do:</strong> Head inland! Trek to Dudhsagar Waterfalls, explore spice plantations in Ponda, take river ferries to Divar Island, and cozy up in Portuguese heritage villas.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span><strong>Swimming Warning:</strong> Sea swimming is strictly prohibited across all beaches due to ferocious waves and high undertows. Beach shacks are dismantled for the season.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span><strong>What to eat:</strong> Hot Ross Omelette with pao, freshly fried spicy Rava Prawns, and piping hot Sol Kadi during afternoon downpours.</span>
                    </li>
                  </ul>
                </div>
              )}

              {selectedSeason === 'tropical_summer' && (
                <div className="p-5 rounded-3xl bg-orange-50/60 border border-orange-200/80 space-y-3">
                  <h4 className="text-xs font-bold text-orange-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-orange-700" />
                    <span>Tropical Summer &amp; Mango Blueprint (Apr – May)</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-orange-950">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-700 font-bold">•</span>
                      <span><strong>What to do:</strong> Early morning coastal walks (7:00 AM – 9:30 AM), afternoon susegad siestas in air-conditioned cafes, and late sunset swims around 5:30 PM.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-700 font-bold">•</span>
                      <span><strong>Seasonal Fruit Royalty:</strong> Feast on authentic Goan <em>Mankurad</em> &amp; <em>Hilario</em> mangoes, and taste fresh Cashew Apple Neera (sweet unfermented cashew juice).</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PACKING CHECKLIST */}
          {activeTab === 'packing' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="flex items-center justify-between bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Interactive Packing Progress</h4>
                  <p className="text-[11px] text-stone-500">Tap items to mark them as packed in your bag.</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-orange-600">{packedCount} of {totalItems} Packed</span>
                  <div className="w-28 h-1.5 bg-stone-200 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-orange-600 transition-all duration-300"
                      style={{ width: `${(packedCount / totalItems) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PACKING_LIST_DATA.map((cat, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white border border-stone-200/80 space-y-3">
                    <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-2">
                      {cat.title}
                    </h4>

                    <div className="space-y-2">
                      {cat.items.map((item) => {
                        const isChecked = Boolean(checkedItems[item.id]);
                        return (
                          <div
                            key={item.id}
                            onClick={() => toggleCheck(item.id)}
                            className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                              isChecked
                                ? 'bg-emerald-50/60 border-emerald-200 text-stone-800'
                                : 'bg-stone-50/50 border-stone-200/60 hover:bg-stone-100/60 text-stone-700'
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Square className="w-4 h-4 text-stone-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className={`text-xs block font-semibold ${isChecked ? 'line-through text-stone-400' : ''}`}>
                                {item.name}
                              </span>
                              {item.tip && (
                                <span className="text-[10px] text-stone-500 block leading-tight mt-0.5">
                                  {item.tip}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
          <span className="text-stone-500">
            Emergency Helpline: Police <strong>112</strong> • Women Safety <strong>1091</strong> • Tourist Police <strong>0832-2428800</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-900 text-white font-semibold hover:bg-stone-800 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
