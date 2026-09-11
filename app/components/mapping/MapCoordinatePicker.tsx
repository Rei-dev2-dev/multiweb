"use client";

import React, { useEffect, useRef } from "react";
import { MapPin, Navigation } from "lucide-react";

interface MapCoordinatePickerProps {
  latitude: number;
  longitude: number;
  onChangeCoordinates: (lat: number, lng: number) => void;
}

export const MapCoordinatePicker: React.FC<MapCoordinatePickerProps> = ({
  latitude,
  longitude,
  onChangeCoordinates
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      const initialLat = isNaN(latitude) ? -3.3308 : latitude;
      const initialLng = isNaN(longitude) ? 114.5560 : longitude;

      // Create map if not exists
      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [initialLat, initialLng],
          zoom: 16,
          scrollWheelZoom: true
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map);

        // Click on map to place/move marker
        map.on("click", (e: any) => {
          const { lat, lng } = e.latlng;
          onChangeCoordinates(Number(lat.toFixed(6)), Number(lng.toFixed(6)));
        });

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;

      // Custom draggable pin icon
      const customPinIcon = L.divIcon({
        className: "custom-picker-pin",
        html: `
          <div class="relative flex flex-col items-center -top-7 cursor-grab active:cursor-grabbing">
            <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-emerald-300 animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div class="w-2 h-2 bg-emerald-700 rounded-full shadow-md mt-0.5"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      // Update or create draggable marker
      if (!markerRef.current) {
        const marker = L.marker([initialLat, initialLng], {
          icon: customPinIcon,
          draggable: true
        }).addTo(map);

        marker.on("dragend", (e: any) => {
          const { lat, lng } = e.target.getLatLng();
          onChangeCoordinates(Number(lat.toFixed(6)), Number(lng.toFixed(6)));
        });

        markerRef.current = marker;
      } else {
        markerRef.current.setLatLng([initialLat, initialLng]);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [latitude, longitude]);

  const handleFlyToPreset = (lat: number, lng: number, zoom: number = 17) => {
    onChangeCoordinates(lat, lng);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], zoom, { duration: 0.8 });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-700 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-emerald-600" />
          Pilih Titik di Peta (Klik / Geser Pin):
        </span>
        <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold border border-emerald-200">
          Klik di mana saja pada peta
        </span>
      </div>

      <div className="relative w-full h-[220px] rounded-xl overflow-hidden border border-slate-300 shadow-inner bg-slate-100">
        {/* Preset Quick Buttons overlay */}
        <div className="absolute top-2 right-2 z-1000 flex flex-wrap gap-1 bg-white/90 backdrop-blur-xs p-1 rounded-lg shadow-md border border-slate-200 text-[10px]">
          <button
            type="button"
            onClick={() => handleFlyToPreset(-3.3308, 114.5560)}
            className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded"
          >
            ⚓ TPKB Pusat
          </button>
          <button
            type="button"
            onClick={() => handleFlyToPreset(-3.3325, 114.5540)}
            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded"
          >
            Dermaga
          </button>
          <button
            type="button"
            onClick={() => handleFlyToPreset(-3.3298, 114.5572)}
            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded"
          >
            Gate In/Out
          </button>
          <button
            type="button"
            onClick={() => handleFlyToPreset(-3.3315, 114.5550)}
            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded"
          >
            Yard Penumpukan
          </button>
        </div>

        {/* Map Container */}
        <div ref={mapContainerRef} className="w-full h-full z-0 cursor-crosshair" />
      </div>

      <p className="text-[11px] text-slate-500 italic">
        💡 Tips: Klik langsung pada area pelabuhan atau geser pin hijau untuk mengisi koordinat secara otomatis.
      </p>
    </div>
  );
};
