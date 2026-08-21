import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Search, X } from 'lucide-react';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function LocationPicker({ onLocationSelect, initialVenue = '' }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [search, setSearch] = useState(initialVenue);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-0.187, 5.603], // Accra, Ghana default
      zoom: 11,
    });

    // Add Mapbox Zoom In/Out & Compass controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add Mapbox Native Fullscreen/Expand control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      placeMarker(lng, lat);
      reverseGeocode(lng, lat);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  const placeMarker = (lng, lat) => {
    if (marker.current) marker.current.remove();
    const el = document.createElement('div');
    el.style.cssText = `
      width: 36px; height: 36px;
      background: #6c47ff;
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 4px 20px rgba(108,71,255,0.5);
    `;
    marker.current = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat([lng, lat])
      .addTo(map.current);
    map.current.flyTo({ center: [lng, lat], zoom: 15, duration: 800 });
  };

  const reverseGeocode = async (lng, lat) => {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await res.json();
      const place = data.features?.[0]?.place_name;
      if (place) {
        setSearch(place);
        setSelected({ lng, lat, venue: place });
        onLocationSelect({ latitude: lat, longitude: lng, venue: place });
      }
    } catch {}
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(search)}.json?access_token=${mapboxgl.accessToken}&country=gh&limit=5`
      );
      const data = await res.json();
      setResults(data.features || []);
    } catch {} finally {
      setSearching(false);
    }
  };

  const handleSelect = (feature) => {
    const [lng, lat] = feature.center;
    const venue = feature.place_name;
    setSearch(venue);
    setResults([]);
    setSelected({ lng, lat, venue });
    placeMarker(lng, lat);
    onLocationSelect({ latitude: lat, longitude: lng, venue });
  };

  return (
    <div className="space-y-3">
      {/* Search input */}
      <div className="relative">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 transition-colors focus-within:border-[#6c47ff]/50">
            <Search size={15} className="shrink-0 text-white" />

            <input
              type="text"
              placeholder="Search for venue or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="min-w-0 flex-1 bg-transparent text-base text-white placeholder-white outline-none"
            />

            {search && (
              <button
                onClick={() => {
                  setSearch('');
                  setResults([]);
                }}
                className="shrink-0 text-white hover:text-white"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <button
            onClick={handleSearch}
            disabled={searching}
            className="w-full shrink-0 rounded-lg bg-[#6c47ff] px-4 py-3 text-base font-medium text-white transition-all hover:bg-[#7c57ff] disabled:opacity-50 sm:w-auto"
          >
            {searching ? '...' : 'Search'}
          </button>
        </div>

        {/* Search results dropdown */}
        {results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#111122] border border-white/10 rounded-full overflow-hidden z-50 shadow-xl">
            {results.map((feature) => (
              <button
                key={feature.id}
                onClick={() => handleSelect(feature)}
                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
              >
                <MapPin size={14} className="text-[#6c47ff] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white text-base">{feature.text}</p>
                  <p className="text-white text-base">{feature.place_name}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="relative rounded-2xl overflow-hidden" style={{ height: 280 }}>
        <div ref={mapContainer} className="w-full h-full" />
        {!selected && (
          <div className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none">
            <div className="bg-black/60 backdrop-blur-sm text-white text-base px-4 py-2 rounded-full border border-white/10">
              Search or click on the map to set location
            </div>
          </div>
        )}
      </div>

      {/* Selected location */}
      {selected && (
        <div className="flex items-center gap-3 bg-[#6c47ff]/10 border border-[#6c47ff]/20 rounded-full px-4 py-3">
          <MapPin size={14} className="text-[#6c47ff] flex-shrink-0" />
          <p className="text-white text-base flex-1 truncate">{selected.venue}</p>
          <span className="text-[#a78bfa] text-base">✓ Set</span>
        </div>
      )}
    </div>
  );
}