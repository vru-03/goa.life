import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Radio, Sparkles, Waves, CloudRain, Sun, Music2 } from 'lucide-react';
import { Region } from '../types';

interface MusicPlayerProps {
  currentRegion?: Region;
}

export type SoundscapeType = 'waves' | 'rain' | 'acoustic' | 'sanctuary';

interface SoundscapeOption {
  id: SoundscapeType;
  title: string;
  subtitle: string;
  icon: any;
  tag: string;
}

const SOUNDSCAPES: SoundscapeOption[] = [
  {
    id: 'waves',
    title: 'Mandrem Sunset Waves',
    subtitle: 'Rhythmic Arabian Sea surf & warm coastal breeze',
    icon: Waves,
    tag: 'Coastal Surf'
  },
  {
    id: 'rain',
    title: 'Monsoon Palm Canopy',
    subtitle: 'Gentle tropical drizzle on lush Assagao greenery',
    icon: CloudRain,
    tag: 'Monsoon Rain'
  },
  {
    id: 'acoustic',
    title: 'Susegad Twilight Chords',
    subtitle: 'Warm acoustic major-7th jazz chords in Fontainhas',
    icon: Music2,
    tag: 'Acoustic Lounge'
  },
  {
    id: 'sanctuary',
    title: '432Hz Susegad Sanctuary',
    subtitle: 'Harmonic resonance for meditation & slow living',
    icon: Sun,
    tag: 'Harmonic Chill'
  }
];

export const MusicPlayer: React.FC<MusicPlayerProps> = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.25);
  const [selectedSoundscape, setSelectedSoundscape] = useState<SoundscapeType>('acoustic');
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  // Audio Context references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const loopTimerRef = useRef<any>(null);
  const activeNodesRef = useRef<{
    oscillators: OscillatorNode[];
    gains: GainNode[];
    sources: AudioNode[];
  }>({ oscillators: [], gains: [], sources: [] });

  const stopAllAudio = () => {
    if (loopTimerRef.current) {
      clearInterval(loopTimerRef.current);
      loopTimerRef.current = null;
    }

    activeNodesRef.current.oscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    activeNodesRef.current.sources.forEach((src) => {
      try {
        (src as any).stop?.();
        src.disconnect();
      } catch {}
    });
    activeNodesRef.current.oscillators = [];
    activeNodesRef.current.gains = [];
    activeNodesRef.current.sources = [];

    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
      masterGainRef.current = null;
    }
  };

  const playSoundscape = (type: SoundscapeType) => {
    stopAllAudio();

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      if (type === 'acoustic') {
        // Goa Bossa / Susegad Twilight Chords
        const chordProgressions = [
          [261.63, 329.63, 392.00, 493.88, 587.33], // Cmaj9
          [220.00, 261.63, 329.63, 392.00, 493.88], // Am9
          [293.66, 349.23, 440.00, 523.25, 659.25], // Dm9
          [196.00, 246.94, 329.63, 392.00, 440.00]  // G13
        ];
        let chordIdx = 0;

        const triggerChord = () => {
          if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
          const now = ctx.currentTime;
          const chord = chordProgressions[chordIdx];

          chord.forEach((freq, stringIdx) => {
            const osc = ctx.createOscillator();
            const noteGain = ctx.createGain();

            osc.type = stringIdx === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, now);

            const noteStart = now + stringIdx * 0.03;
            const noteDuration = 3.8;

            noteGain.gain.setValueAtTime(0.0001, noteStart);
            noteGain.gain.exponentialRampToValueAtTime(0.06 / (stringIdx + 1), noteStart + 0.07);
            noteGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + noteDuration);

            // Chorus
            const lfo = ctx.createOscillator();
            lfo.frequency.setValueAtTime(0.2 + stringIdx * 0.05, noteStart);
            const lfoGain = ctx.createGain();
            lfoGain.gain.setValueAtTime(0.9, noteStart);
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);

            osc.connect(noteGain);
            noteGain.connect(masterGain);

            osc.start(noteStart);
            lfo.start(noteStart);
            osc.stop(noteStart + noteDuration + 0.1);
            lfo.stop(noteStart + noteDuration + 0.1);
          });

          chordIdx = (chordIdx + 1) % chordProgressions.length;
        };

        triggerChord();
        loopTimerRef.current = setInterval(triggerChord, 4000);

      } else if (type === 'waves') {
        // Ocean Surf Synthesis with filtered pink noise and LFO swell
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.11;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        const swellLfo = ctx.createOscillator();
        swellLfo.frequency.setValueAtTime(0.12, ctx.currentTime); // 8-second wave cycle
        const swellGain = ctx.createGain();
        swellGain.gain.setValueAtTime(260, ctx.currentTime);

        swellLfo.connect(swellGain);
        swellGain.connect(filter.frequency);

        const waveGain = ctx.createGain();
        waveGain.gain.setValueAtTime(0.18, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(waveGain);
        waveGain.connect(masterGain);

        whiteNoise.start();
        swellLfo.start();
        activeNodesRef.current.sources.push(whiteNoise);
        activeNodesRef.current.oscillators.push(swellLfo);

      } else if (type === 'rain') {
        // Gentle Monsoon Rain
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * 0.05;
        }

        const rainSource = ctx.createBufferSource();
        rainSource.buffer = noiseBuffer;
        rainSource.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, ctx.currentTime);
        filter.Q.setValueAtTime(0.8, ctx.currentTime);

        const rainGain = ctx.createGain();
        rainGain.gain.setValueAtTime(0.12, ctx.currentTime);

        rainSource.connect(filter);
        filter.connect(rainGain);
        rainGain.connect(masterGain);

        rainSource.start();
        activeNodesRef.current.sources.push(rainSource);

      } else if (type === 'sanctuary') {
        // 432Hz Calm Susegad Sanctuary
        const freqs = [432, 216, 648];
        freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, ctx.currentTime);

          const lfo = ctx.createOscillator();
          lfo.frequency.setValueAtTime(0.1 + idx * 0.03, ctx.currentTime);
          const lfoGain = ctx.createGain();
          lfoGain.gain.setValueAtTime(0.015, ctx.currentTime);

          lfo.connect(lfoGain);
          lfoGain.connect(gain.gain);

          gain.gain.setValueAtTime(0.04 / (idx + 1), ctx.currentTime);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start();
          lfo.start();
          activeNodesRef.current.oscillators.push(osc, lfo);
        });
      }

    } catch (err) {
      console.warn('Audio notice:', err);
    }
  };

  const handleToggle = () => {
    if (isPlaying) {
      stopAllAudio();
      setIsPlaying(false);
    } else {
      playSoundscape(selectedSoundscape);
      setIsPlaying(true);
    }
  };

  const handleSelect = (type: SoundscapeType) => {
    setSelectedSoundscape(type);
    if (isPlaying) {
      playSoundscape(type);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(newVol, audioCtxRef.current.currentTime);
    }
  };

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const currentOption = SOUNDSCAPES.find((s) => s.id === selectedSoundscape) || SOUNDSCAPES[0];

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Soundscape Selector Flyout */}
      {isOpenMenu && (
        <div className="mb-2 w-72 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200/80 shadow-lg p-3 space-y-2 animate-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-stone-100">
            <span className="text-[11px] font-bold text-stone-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Goa Susegad Soundscapes</span>
            </span>
            <span className="text-[10px] text-stone-400 font-mono">Live WebAudio</span>
          </div>

          <div className="space-y-1">
            {SOUNDSCAPES.map((s) => {
              const Icon = s.icon;
              const isSelected = selectedSoundscape === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelect(s.id)}
                  className={`w-full text-left p-2 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-stone-900 text-white font-medium shadow-xs'
                      : 'hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-orange-400' : 'text-stone-400'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold truncate">{s.title}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected ? 'bg-white/20 text-stone-200' : 'bg-stone-100 text-stone-500'
                      }`}>
                        {s.tag}
                      </span>
                    </div>
                    <p className={`text-[10px] truncate ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                      {s.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Volume Control */}
          <div className="pt-2 border-t border-stone-100 flex items-center gap-2 px-1">
            <VolumeX className="w-3 h-3 text-stone-400 shrink-0" />
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.01"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
            <Volume2 className="w-3 h-3 text-stone-400 shrink-0" />
          </div>
        </div>
      )}

      {/* Floating Mini Player Pill */}
      <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-2 rounded-full border border-stone-200 shadow-md text-xs text-stone-700">
        <button
          onClick={handleToggle}
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-xs ${
            isPlaying
              ? 'bg-orange-600 text-white animate-pulse'
              : 'bg-stone-900 text-white hover:bg-stone-800'
          }`}
          title={isPlaying ? 'Pause Goa Soundscape' : 'Play Goa Soundscape'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
        </button>

        <button
          onClick={() => setIsOpenMenu(!isOpenMenu)}
          className="flex items-center gap-1.5 text-left hover:text-stone-950 transition-colors"
        >
          <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-orange-500 animate-ping' : 'bg-stone-300'}`} />
          <div className="max-w-[130px] sm:max-w-[170px] truncate">
            <span className="block text-[11px] font-semibold text-stone-900 truncate">
              {isPlaying ? currentOption.title : 'Goa Ambient Vibes'}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
