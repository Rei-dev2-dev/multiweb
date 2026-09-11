"use client";

import React, { useState } from "react";
import {
  Globe,
  Radio,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  MapPin,
  PlusCircle,
  Terminal,
  Activity
} from "lucide-react";
import { useData, IpMonitoring } from "../../context/DataContext";
import { LeafletMap } from "./LeafletMap";
import { CliPingConsole } from "./CliPingConsole";
import { ActiveTab } from "../Sidebar";

interface MappingDashboardProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const MappingDashboard: React.FC<MappingDashboardProps> = ({ setActiveTab }) => {
  const {
    ipList,
    ipKategoriList,
    toggleIpStatus,
    pingAllIps,
    isAutoPingActive,
    setIsAutoPingActive
  } = useData();

  const [selectedIpId, setSelectedIpId] = useState<number | null>(ipList[0]?.id || null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPinging, setIsPinging] = useState(false);

  // Filter IPs
  const filteredIps = ipList.filter((ip) => {
    const matchesCategory =
      filterCategory === "all" || ip.kategori_id.toString() === filterCategory;
    const matchesStatus = filterStatus === "all" || ip.status === filterStatus;
    const matchesSearch =
      ip.nama_ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ip.alamat_ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ip.lokasi_detail && ip.lokasi_detail.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const onlineCount = ipList.filter((i) => i.status === "online").length;
  const offlineCount = ipList.filter((i) => i.status === "offline").length;
  const selectedIp = ipList.find((i) => i.id === selectedIpId) || ipList[0] || null;

  const handleManualPing = () => {
    setIsPinging(true);
    pingAllIps();
    setTimeout(() => {
      setIsPinging(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600" />
            Dashboard Mapping IP Monitoring — Pelindo TPKB Trisakti
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Visualisasi geospasial real-time & live CLI continuous ping monitoring infrastruktur jaringan Pelindo
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Auto Ping Toggle */}
          <button
            onClick={() => setIsAutoPingActive(!isAutoPingActive)}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              isAutoPingActive
                ? "bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100"
                : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
            }`}
          >
            {isAutoPingActive ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <Pause className="w-3.5 h-3.5" />
                Auto-Ping Aktif (12s)
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                Nyalakan Auto-Ping
              </>
            )}
          </button>

          {/* Manual Ping Button */}
          <button
            onClick={handleManualPing}
            disabled={isPinging}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? "animate-spin" : ""}`} />
            Ping Semua IP Sekarang
          </button>

          {/* Manage IP button */}
          <button
            onClick={() => setActiveTab("mapping_kategori")}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Kelola Data IP
          </button>
        </div>
      </div>

      {/* KPI Stats Pill Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Total IP Node</span>
            <p className="text-xl font-bold text-slate-900">{ipList.length} Node</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Status Online</span>
            <p className="text-xl font-bold text-emerald-600">{onlineCount} Aktif</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Status Offline</span>
            <p className="text-xl font-bold text-red-600">{offlineCount} Terputus</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Avg Ping Latency</span>
            <p className="text-xl font-bold text-purple-700">~2.8 ms</p>
          </div>
        </div>
      </div>

      {/* SECTION 1: FULL WIDTH MAP */}
      <div className="space-y-3">
        {/* Map Filter & Info Bar */}
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">Filter Tampilan Peta:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                  filterStatus === "all"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Semua ({ipList.length})
              </button>
              <button
                onClick={() => setFilterStatus("online")}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                  filterStatus === "online"
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
              >
                Online ({onlineCount})
              </button>
              <button
                onClick={() => setFilterStatus("offline")}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                  filterStatus === "offline"
                    ? "bg-red-600 text-white"
                    : "bg-red-50 text-red-700 hover:bg-red-100"
                }`}
              >
                Offline ({offlineCount})
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-2">
            <span>Menampilkan <strong>{filteredIps.length} titik node</strong> di Pelindo TPKB Trisakti</span>
          </div>
        </div>

        {/* The Full Width Leaflet Map Component */}
        <LeafletMap
          ips={filteredIps}
          selectedIpId={selectedIpId}
          onSelectIp={(ip) => setSelectedIpId(ip.id)}
          onToggleStatus={toggleIpStatus}
        />
      </div>

      {/* SECTION 2: BOTTOM 2-COLUMN GRID (Daftar IP di Kiri + CLI Continuous Ping di Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Daftar Node IP */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-col h-[520px]">
          <div className="mb-3 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                Daftar Node IP Pelindo TPKB
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">
                {filteredIps.length} Node
              </span>
            </div>

            {/* Quick Search & Filter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama IP, subnet..."
                  className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">Semua Kategori IP</option>
                {ipKategoriList.map((kat) => (
                  <option key={kat.id} value={kat.id.toString()}>
                    {kat.nama_kategori}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Node Cards Scrollable List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredIps.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Tidak ada data IP yang cocok dengan filter pencarian.
              </div>
            ) : (
              filteredIps.map((ip) => {
                const isSelected = selectedIpId === ip.id;
                const isOnline = ip.status === "online";
                return (
                  <div
                    key={ip.id}
                    onClick={() => setSelectedIpId(ip.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50/60 shadow-xs ring-2 ring-blue-400"
                        : "border-slate-200 hover:border-slate-300 bg-slate-50/30 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              isOnline ? "bg-emerald-500" : "bg-red-500"
                            }`}
                          />
                          <p className="font-bold text-slate-900 truncate">
                            {ip.nama_ip}
                          </p>
                        </div>
                        <p className="font-mono text-[11px] text-slate-600 mt-0.5">
                          {ip.alamat_ip}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${
                            isOnline
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {ip.status}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                            <Terminal className="w-3 h-3" /> Pinging di CLI
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                      <span className="truncate">{ip.lokasi_detail}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleIpStatus(ip.id);
                        }}
                        className="text-blue-600 hover:underline font-semibold ml-1 shrink-0"
                      >
                        Simulasi Toggle
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Live CLI Continuous Ping Console */}
        <CliPingConsole
          ips={ipList}
          selectedIp={selectedIp}
          onSelectIp={(ip) => setSelectedIpId(ip.id)}
        />
      </div>
    </div>
  );
};
