import React, { useEffect, useRef, useState } from 'react';
import { Spot, Region, Category } from '../types';
import L from 'leaflet';
import 'leaflet.markercluster';
import { 
  Star, 
  Search, 
  Sparkles, 
  Layers, 
  MapPin, 
  Navigation, 
  ZoomIn, 
  Maximize2,
  SlidersHorizontal,
  Compass
} from 'lucide-react';

interface InteractiveMapProps {
  spots: Spot[];
  currentRegion: Region;
  onSelectRegion: (region: Region) => void;
  onSelectSpot: (spot: Spot) => void;
}

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'all', label: 'All Categories' },
  { id: 'dining', label: 'Culinary & Dining' },
  { id: 'cafe', label: 'Bakeries & Cafes' },
  { id: 'nightlife', label: 'Bars & Nightlife' },
  { id: 'heritage', label: 'Heritage & Forts' },
  { id: 'beach', label: 'Beaches & Coves' },
  { id: 'nature', label: 'Nature & Lagoons' },
  { id: 'wellness', label: 'Yoga & Retreats' },
];

const HIGH_DENSITY_AREAS = [
  { name: 'Assagao & Anjuna', lat: 15.589, lng: 73.774, zoom: 14, region: 'North' },
  { name: 'Fontainhas & Panaji', lat: 15.498, lng: 73.831, zoom: 15, region: 'North' },
  { name: 'Vagator & Chapora', lat: 15.602, lng: 73.744, zoom: 14, region: 'North' },
  { name: 'Ashwem & Mandrem', lat: 15.660, lng: 73.717, zoom: 13, region: 'North' },
  { name: 'Palolem & Patnem', lat: 15.010, lng: 74.023, zoom: 14, region: 'South' },
  { name: 'Benaulim & Margao', lat: 15.260, lng: 73.940, zoom: 14, region: 'South' },
];

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  spots,
  currentRegion,
  onSelectRegion,
  onSelectSpot,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [mapSearch, setMapSearch] = useState('');
  const [onlyHiddenGems, setOnlyHiddenGems] = useState(false);
  const [enableClustering, setEnableClustering] = useState(true);
  const [selectedAreaPreset, setSelectedAreaPreset] = useState<string | null>(null);

  // Filter spots
  const filteredSpots = spots.filter((spot) => {
    const matchesRegion = currentRegion === 'all' || spot.region === currentRegion;
    const matchesCategory = selectedCategory === 'all' || spot.category === selectedCategory;
    const matchesHiddenGems = !onlyHiddenGems || Boolean(spot.hiddenGem);
    const matchesSearch =
      mapSearch.trim() === '' ||
      spot.name.toLowerCase().includes(mapSearch.toLowerCase()) ||
      spot.area.toLowerCase().includes(mapSearch.toLowerCase()) ||
      spot.category.toLowerCase().includes(mapSearch.toLowerCase());
    return matchesRegion && matchesCategory && matchesHiddenGems && matchesSearch;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [15.35, 73.95],
        zoom: 10,
        scrollWheelZoom: true,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }
  }, []);

  // Update Markers & Marker Clustering
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove previous cluster or layer
    if (clusterGroupRef.current) {
      map.removeLayer(clusterGroupRef.current);
      clusterGroupRef.current.clearLayers();
    }

    markersRef.current = {};

    let activeLayerGroup: any;

    if (enableClustering) {
      // Initialize MarkerClusterGroup
      activeLayerGroup = (L as any).markerClusterGroup({
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        spiderfyOnMaxZoom: true,
        spiderfyDistanceMultiplier: 1.5,
        removeOutsideVisibleBounds: true,
        maxClusterRadius: 50,
        iconCreateFunction: (cluster: any) => {
          const markers = cluster.getAllChildMarkers();
          const count = markers.length;

          let northCount = 0;
          let southCount = 0;
          markers.forEach((m: any) => {
            if (m.options?.customRegion === 'north') northCount++;
            else if (m.options?.customRegion === 'south') southCount++;
          });

          let clusterClass = 'cluster-mixed';
          if (northCount > 0 && southCount === 0) {
            clusterClass = 'cluster-north';
          } else if (southCount > 0 && northCount === 0) {
            clusterClass = 'cluster-south';
          }

          let size = 36;
          let fontSize = 12;
          if (count >= 15) {
            size = 48;
            fontSize = 14;
          } else if (count >= 8) {
            size = 42;
            fontSize = 13;
          } else if (count >= 4) {
            size = 38;
            fontSize = 12.5;
          }

          return L.divIcon({
            html: `
              <div class="cluster-pill ${clusterClass}" style="width: ${size}px; height: ${size}px; font-size: ${fontSize}px;">
                <span>${count}</span>
              </div>
            `,
            className: 'custom-cluster-icon',
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
          });
        }
      });
    } else {
      activeLayerGroup = L.featureGroup();
    }

    clusterGroupRef.current = activeLayerGroup;

    filteredSpots.forEach((spot) => {
      const isNorth = spot.region === 'north';
      const bgColor = isNorth ? '#ea580c' : '#059669';

      const customIcon = L.divIcon({
        className: 'custom-pin',
        html: `
          <div style="
            background: ${bgColor};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 2.5px solid white;
            box-shadow: 0 3px 10px rgba(0,0,0,0.32);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          ">
            <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -16]
      });

      const marker = L.marker([spot.coordinates.lat, spot.coordinates.lng], { 
        icon: customIcon,
        // @ts-ignore
        customRegion: spot.region,
        customSpotId: spot.id
      });

      const dietTag = spot.dietaryType === 'veg' 
        ? '<span style="background: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 4px; font-size: 9.5px; font-weight: 700; border: 1px solid #bbf7d0;">🌱 Veg Only</span>' 
        : '';

      const popupContent = `
        <div style="width: 220px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 4px;">
          <img src="${spot.heroImage}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 10px; margin-bottom: 7px;" />
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: ${isNorth ? '#ea580c' : '#059669'};">${spot.area} • ${isNorth ? 'North' : 'South'}</span>
            ${dietTag}
          </div>
          <h4 style="margin: 0 0 3px; font-size: 13.5px; font-weight: 700; color: #18181b; line-height: 1.2;">${spot.name}</h4>
          <p style="margin: 0 0 8px; font-size: 11px; color: #71717a; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${spot.description}</p>
          <div style="display: flex; gap: 4px;">
            <button id="btn-spot-${spot.id}" style="
              flex: 1;
              background: #18181b;
              color: white;
              border: none;
              padding: 7px 10px;
              border-radius: 8px;
              font-size: 11px;
              font-weight: 600;
              cursor: pointer;
              transition: background 0.15s;
            ">
              View Spot Details →
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-spot-${spot.id}`);
        if (btn) {
          btn.onclick = () => onSelectSpot(spot);
        }
      });

      activeLayerGroup.addLayer(marker);
      markersRef.current[spot.id] = marker;
    });

    map.addLayer(activeLayerGroup);

    // Zoom adjustments on region changes if no specific area was picked
    if (filteredSpots.length > 0 && !selectedAreaPreset) {
      if (currentRegion === 'north') {
        map.flyTo([15.60, 73.76], 11, { duration: 0.5 });
      } else if (currentRegion === 'south') {
        map.flyTo([15.15, 73.98], 11, { duration: 0.5 });
      } else {
        map.flyToBounds(activeLayerGroup.getBounds().pad(0.08), { duration: 0.5, maxZoom: 11 });
      }
    }
  }, [filteredSpots, currentRegion, enableClustering]);

  const handleFocusSpot = (spot: Spot) => {
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([spot.coordinates.lat, spot.coordinates.lng], 15, { duration: 0.6 });
      setTimeout(() => {
        const marker = markersRef.current[spot.id];
        if (marker) {
          if (enableClustering && clusterGroupRef.current) {
            clusterGroupRef.current.zoomToShowLayer(marker, () => {
              marker.openPopup();
            });
          } else {
            marker.openPopup();
          }
        }
      }, 400);
    }
  };

  const handleJumpToArea = (area: typeof HIGH_DENSITY_AREAS[0]) => {
    setSelectedAreaPreset(area.name);
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([area.lat, area.lng], area.zoom, { duration: 0.7 });
    }
  };

  const handleResetZoom = () => {
    setSelectedAreaPreset(null);
    const map = mapInstanceRef.current;
    if (map && clusterGroupRef.current) {
      if (currentRegion === 'north') {
        map.flyTo([15.60, 73.76], 11, { duration: 0.5 });
      } else if (currentRegion === 'south') {
        map.flyTo([15.15, 73.98], 11, { duration: 0.5 });
      } else {
        map.flyToBounds(clusterGroupRef.current.getBounds().pad(0.08), { duration: 0.5, maxZoom: 11 });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 animate-in fade-in duration-300">
      {/* Minimal Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-normal text-stone-900 font-serif-title tracking-tight leading-snug">
              Interactive Goa Map
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
              <Layers className="w-3 h-3 text-orange-600" />
              <span>Smart Clustering Active</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 font-normal tracking-wide leading-relaxed">
            Curated venues with automatic clustering in dense hubs (Assagao, Anjuna, Fontainhas, Palolem).
          </p>
        </div>

        {/* Region & Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Cluster Mode Toggle */}
          <button
            onClick={() => setEnableClustering(!enableClustering)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              enableClustering
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 border border-stone-200'
            }`}
            title="Toggle cluster grouping on/off"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{enableClustering ? 'Clusters: ON' : 'Clusters: OFF'}</span>
          </button>

          {/* Hidden Gems Filter */}
          <button
            onClick={() => setOnlyHiddenGems(!onlyHiddenGems)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              onlyHiddenGems
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100/80 border border-amber-200/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hidden Gems</span>
          </button>

          {/* Region Tabs: All, North Goa, South Goa */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-medium border border-stone-200/70">
            <button
              onClick={() => {
                setSelectedAreaPreset(null);
                onSelectRegion('all');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentRegion === 'all' ? 'bg-white shadow-xs text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setSelectedAreaPreset(null);
                onSelectRegion('north');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentRegion === 'north' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              North Goa
            </button>
            <button
              onClick={() => {
                setSelectedAreaPreset(null);
                onSelectRegion('south');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentRegion === 'south' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              South Goa
            </button>
          </div>
        </div>
      </div>

      {/* Quick Jump Density Hub Presets */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5 text-xs">
        <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-orange-600" />
          <span>Hubs:</span>
        </span>
        {HIGH_DENSITY_AREAS.map((area) => {
          const isSelected = selectedAreaPreset === area.name;
          return (
            <button
              key={area.name}
              onClick={() => handleJumpToArea(area)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-semibold text-[11px] transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-orange-600 text-white shadow-2xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400 hover:bg-stone-50'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${area.region === 'North' ? 'bg-orange-400' : 'bg-emerald-400'}`} />
              <span>{area.name}</span>
            </button>
          );
        })}

        {selectedAreaPreset && (
          <button
            onClick={handleResetZoom}
            className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 transition-all shrink-0"
          >
            Reset View ↺
          </button>
        )}
      </div>

      {/* Map Search & Category Filter Chips */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative sm:w-72 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search spot name, area..."
            value={mapSearch}
            onChange={(e) => setMapSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-stone-100 border border-stone-200 focus:outline-none focus:bg-white focus:border-stone-400 transition-all placeholder:text-stone-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 text-xs">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-all ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 border border-stone-200/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Map Container */}
        <div className="lg:col-span-2 rounded-3xl overflow-hidden border border-stone-200/80 shadow-xs relative bg-stone-100">
          <div ref={mapContainerRef} className="w-full h-[540px]" />
          
          {/* Subtle Dynamic Cluster Info Legend */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl text-[11px] border border-stone-200 flex items-center gap-3.5 text-stone-700 font-medium shadow-md">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span>
              <span>North Goa</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>South Goa</span>
            </span>
            <span className="text-stone-300">|</span>
            <span className="text-stone-500 font-semibold">Curated Locations</span>
          </div>

          {/* Quick Fit Bounds Control */}
          <button
            onClick={handleResetZoom}
            className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-md hover:bg-white p-2.5 rounded-xl border border-stone-200 text-stone-700 shadow-md transition-all hover:scale-105"
            title="Fit all markers in view"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Side List */}
        <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
          <div className="p-2.5 bg-stone-50 border border-stone-200/60 rounded-2xl text-xs text-stone-600 flex items-center justify-between">
            <span className="font-semibold">Curated Locations</span>
            <span className="text-[11px] text-stone-400">Click any card to fly on map</span>
          </div>

          {filteredSpots.map((spot) => (
            <div
              key={spot.id}
              onClick={() => handleFocusSpot(spot)}
              className="p-3 rounded-2xl bg-white border border-stone-200/80 hover:border-stone-400 cursor-pointer flex items-center justify-between gap-3 transition-all hover:shadow-xs group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={spot.heroImage}
                  alt={spot.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-semibold text-stone-900 truncate group-hover:text-orange-600 transition-colors">
                      {spot.name}
                    </h4>
                    {spot.dietaryType === 'veg' && (
                      <span className="text-[9.5px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                        🌱 Veg Only
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 truncate">
                    {spot.area} • {spot.region === 'north' ? 'North' : 'South'} • <span className="capitalize">{spot.category}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-stone-700 font-medium shrink-0">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{spot.rating}</span>
              </div>
            </div>
          ))}

          {filteredSpots.length === 0 && (
            <div className="p-8 text-center text-stone-400 text-xs bg-white rounded-2xl border border-stone-200">
              No spots match the selected criteria on the map.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
