import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function EventMap({ latitude, longitude, venue, className = '' }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!latitude || !longitude || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [longitude, latitude],
      zoom: 14,
    });

    const el = document.createElement('div');
    el.style.cssText = `
      width: 40px;
      height: 40px;
      background: #6c47ff;
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 4px 20px rgba(108,71,255,0.5);
      cursor: pointer;
    `;

    new mapboxgl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat([longitude, latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<div style="color:#fff;font-size:13px;font-weight:600;padding:4px 2px">${venue}</div>`)
      )
      .addTo(map.current);

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [latitude, longitude, venue]);

  if (!latitude || !longitude) return null;

  return (
    <div className={`relative rounded-2xl overflow-hidden ${className}`}>
      <div ref={mapContainer} className="w-full h-full" />
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 right-4 flex items-center gap-2 bg-[#6c47ff] hover:bg-[#7c57ff] text-white text-base font-medium px-4 py-2 rounded-xl transition-all shadow-lg"
      >
        🗺️ Get directions
      </a>
    </div>
  );
}