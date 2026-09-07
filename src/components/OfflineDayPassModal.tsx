import React, { useRef, useState } from 'react';
import { GeneratedDay, ItineraryStop } from './AIItinerary';
import { 
  Printer, 
  Share2, 
  Copy, 
  Check, 
  X, 
  Sparkles, 
  MapPin, 
  Navigation, 
  Utensils, 
  Clock, 
  QrCode, 
  Download,
  PhoneCall
} from 'lucide-react';

interface OfflineDayPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: GeneratedDay | null;
  totalDays: number;
}

export const OfflineDayPassModal: React.FC<OfflineDayPassModalProps> = ({
  isOpen,
  onClose,
  day,
  totalDays
}) => {
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !day) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    let text = `🌴 *GOA DAY PASS — DAY ${day.dayNumber} OF ${totalDays}*\n`;
    text += `📍 *${day.title}*\n`;
    text += `🗺️ Territory: ${day.territory}\n`;
    text += `💰 Est. Spend: ${day.estBudget} | Total Travel: ${day.totalDistanceKm} km\n\n`;

    day.stops.forEach((s) => {
      text += `━━━━━━━━━━━━━━━━━━━━━\n`;
      text += `📍 *STOP ${s.stopNumber}: ${s.spot.name}* (${s.spot.area})\n`;
      text += `✨ *Plan:* ${s.activityTitle}\n`;
      text += `🍽️ *Must Try:* ${s.whatToOrderOrDo}\n`;
      text += `💡 *Insider Tip:* ${s.insiderTip}\n`;
      if (s.transitToNext) {
        text += `🛵 *Next Leg:* ~${s.transitToNext.durationMins} mins (${s.transitToNext.distanceKm} km) — ${s.transitToNext.routeNote}\n`;
      }
      text += `\n`;
    });

    if (day.customNotes) {
      text += `📝 *My Custom Notes:* ${day.customNotes}\n\n`;
    }

    text += `_Pocket Guide curated via goa.life — Offline Ready_`;

    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleCopyText = () => {
    let text = `🌴 GOA DAY PASS — DAY ${day.dayNumber}\n${day.title}\nTerritory: ${day.territory}\n\n`;
    day.stops.forEach((s) => {
      text += `Stop ${s.stopNumber}: ${s.spot.name} (${s.spot.area})\n- ${s.activityTitle}\n- Order: ${s.whatToOrderOrDo}\n- Tip: ${s.insiderTip}\n\n`;
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-stone-200 w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200/80 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Offline Pocket Pass</span>
            </span>
            <span className="text-xs text-stone-400">Day {day.dayNumber} of {totalDays}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsAppShare}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
              title="Share formatted WhatsApp day itinerary"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
              title="Print or Save PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Pocket Card Area */}
        <div ref={printRef} className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 bg-white print:p-0">
          
          {/* Boarding-Pass Header */}
          <div className="border-2 border-dashed border-stone-300 rounded-3xl p-6 bg-stone-50/60 relative overflow-hidden space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest text-orange-600 uppercase">
                  goa.life • Day Pass Circuit
                </span>
                <h3 className="text-xl sm:text-2xl font-normal font-serif-title text-stone-900 leading-snug mt-0.5">
                  {day.title}
                </h3>
                <p className="text-xs text-stone-500 font-medium mt-1">
                  {day.territory} • {day.stops.length} Stops • {day.totalDistanceKm} km total
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-2xl font-extrabold text-stone-900 font-mono">
                  DAY {day.dayNumber}
                </span>
                <span className="text-[10.5px] font-semibold text-stone-500 block">
                  Est. {day.estBudget}
                </span>
              </div>
            </div>

            {/* Micro route overview */}
            <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-stone-200 text-[11px] font-semibold text-stone-700">
              {day.stops.map((s, idx) => (
                <React.Fragment key={s.id}>
                  <span className="bg-white px-2 py-0.5 rounded-md border border-stone-200">
                    {s.stopNumber}. {s.spot.name}
                  </span>
                  {idx < day.stops.length - 1 && <span className="text-stone-400">→</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Sequential Stops */}
          <div className="space-y-4">
            {day.stops.map((stop) => (
              <div
                key={stop.id}
                className="p-4 rounded-2xl border border-stone-200 bg-white space-y-2.5 shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold">
                      {stop.stopNumber}
                    </span>
                    <h4 className="text-sm font-bold text-stone-900">
                      {stop.spot.name}
                    </h4>
                    <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                      {stop.spot.area}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-stone-500">
                    {stop.approxCost}
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed font-normal">
                  {stop.activityTitle}: {stop.activityDescription}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="p-2 rounded-xl bg-orange-50/70 border border-orange-100 text-orange-950">
                    <span className="font-bold">🍽️ Must Try: </span>
                    {stop.whatToOrderOrDo}
                  </div>
                  <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-100 text-amber-950">
                    <span className="font-bold">💡 Secret: </span>
                    {stop.insiderTip}
                  </div>
                </div>

                {stop.transitToNext && (
                  <div className="pt-2 border-t border-stone-100 flex items-center gap-2 text-[11px] text-stone-500">
                    <Navigation className="w-3.5 h-3.5 text-orange-600" />
                    <span>
                      Next leg: ~{stop.transitToNext.durationMins} mins ({stop.transitToNext.distanceKm} km) • {stop.transitToNext.routeNote}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Emergency Info on card */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-[11px] text-stone-500 flex items-center justify-between flex-wrap gap-2">
            <span>Emergency Police: <strong>112</strong> | Tourist Helpline: <strong>0832-2428800</strong></span>
            <span>Screenshot this pass for zero-reception beach areas</span>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
          <button
            onClick={handleCopyText}
            className="px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 font-semibold flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary Text'}</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Send to WhatsApp Group</span>
          </button>
        </div>
      </div>
    </div>
  );
};
