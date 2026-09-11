"use client";

import React, { useEffect, useRef } from "react";
import { IpMonitoring } from "../../context/DataContext";

interface LeafletMapProps {
  ips: IpMonitoring[];
  selectedIpId?: number | null;
  onSelectIp?: (ip: IpMonitoring) => void;
  onToggleStatus?: (id: number) => void;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  ips,
  selectedIpId,
  onSelectIp,
  onToggleStatus
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: number]: any }>({});

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    // Dynamically import leaflet (CSS + JS) to avoid SSR issues
    Promise.all([
      import("leaflet"),
      import("leaflet/dist/leaflet.css" as never),
    ]).then(([L]) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Initialize map if not yet created
      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [-3.3308, 114.5560], // Pelindo TPKB (Terminal Petikemas Banjarmasin)
          zoom: 16,
          scrollWheelZoom: true
        });

        // OpenStreetMap Tile Layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Pelindo TPKB',
          maxZoom: 19
        }).addTo(map);

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;

      // Clear existing markers
      Object.values(markersRef.current).forEach((marker: any) => marker.remove());
      markersRef.current = {};

      // Add markers for each IP
      ips.forEach((ip) => {
        const isOnline = ip.status === "online";

        // Custom HTML Marker Icon: Pure Clean Glowing Dot (Tanpa teks ON/OFF)
        const customIcon = L.divIcon({
          className: "custom-leaflet-marker",
          html: `
            <div class="relative flex items-center justify-center cursor-pointer">
              ${
                isOnline
                  ? `<span class="absolute w-7 h-7 rounded-full bg-emerald-500/35 marker-pulse-online"></span>
                     <span class="absolute w-4 h-4 rounded-full bg-emerald-400/50 animate-ping"></span>
                     <div class="w-4 h-4 rounded-full bg-emerald-500 shadow-md border-2 border-white ring-2 ring-emerald-400/40"></div>`
                  : `<span class="absolute w-6 h-6 rounded-full bg-red-500/30"></span>
                     <div class="w-4 h-4 rounded-full bg-red-500 shadow-md border-2 border-white ring-2 ring-red-400/40"></div>`
              }
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
          popupAnchor: [0, -12]
        });

        const marker = L.marker([ip.latitude, ip.longitude], { icon: customIcon }).addTo(map);

        // Popup Content
        const popupContent = document.createElement("div");
        popupContent.className = "p-1 text-slate-900 font-sans min-w-[200px]";
        popupContent.innerHTML = `
          <div class="flex items-center justify-between gap-2 border-b border-slate-200 pb-1.5 mb-1.5">
            <span class="font-bold text-xs text-slate-900">${ip.nama_ip}</span>
            <span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${
              isOnline ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
            }">
              ${isOnline ? "ONLINE" : "OFFLINE"}
            </span>
          </div>
          <div class="space-y-1 text-[11px] text-slate-600">
            <div><strong>IP:</strong> <code class="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">${ip.alamat_ip}</code></div>
            <div><strong>Kategori:</strong> ${ip.kategori_nama || "-"}</div>
            <div><strong>Lokasi:</strong> ${ip.lokasi_detail || "-"}</div>
            <div><strong>Lat/Lng:</strong> ${ip.latitude.toFixed(4)}, ${ip.longitude.toFixed(4)}</div>
            ${isOnline ? `<div><strong>Latency:</strong> <span class="text-emerald-600 font-bold">${ip.response_time_ms} ms</span></div>` : ""}
            <div class="text-[10px] text-slate-400 mt-1">Ping: ${ip.last_ping || "N/A"}</div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on("click", () => {
          if (onSelectIp) onSelectIp(ip);
        });

        markersRef.current[ip.id] = marker;
      });

      // Fly to selected IP if provided
      if (selectedIpId && markersRef.current[selectedIpId]) {
        const targetIp = ips.find((i) => i.id === selectedIpId);
        if (targetIp) {
          map.flyTo([targetIp.latitude, targetIp.longitude], 14, { duration: 1 });
          markersRef.current[selectedIpId].openPopup();
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [ips, selectedIpId]);

  const handleFlyTo = (lat: number, lng: number, zoom: number = 13) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], zoom, { duration: 1.2 });
    }
  };

  return (
    <div className="relative w-full h-[520px] rounded-xl overflow-hidden border border-slate-200 shadow-inner">
      {/* Quick Location Shortcuts */}
      <div className="absolute top-3 right-3 z-1000 flex flex-wrap gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-lg shadow-md border border-slate-200 text-xs">
        <button
          onClick={() => handleFlyTo(-3.3308, 114.5560, 16)}
          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded transition-colors border border-emerald-200"
        >
          ⚓ Pelindo TPKB (Pusat)
        </button>
        <button
          onClick={() => handleFlyTo(-3.3325, 114.5540, 17)}
          className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold rounded transition-colors"
        >
          Dermaga Kapal
        </button>
        <button
          onClick={() => handleFlyTo(-3.3298, 114.5572, 17)}
          className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold rounded transition-colors"
        >
          Gate In/Out Truk
        </button>
        <button
          onClick={() => handleFlyTo(-3.3315, 114.5550, 17)}
          className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold rounded transition-colors"
        >
          Container Yard
        </button>
      </div>

      {/* Map Container Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0 bg-slate-100" />
    </div>
  );
};
