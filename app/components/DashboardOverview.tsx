"use client";

import React from "react";
import {
  FileText,
  MapPin,
  Package,
  Activity,
  CheckCircle2,
  AlertOctagon,
  ArrowUpRight,
  TrendingUp,
  Clock,
  ExternalLink,
  Layers,
  Sparkles,
  Users
} from "lucide-react";
import { useData } from "../context/DataContext";
import { ActiveTab } from "./Sidebar";

interface DashboardOverviewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  setActiveTab
}) => {
  const {
    laporanList,
    ipList,
    barangList,
    peminjamanList,
    riwayatStockList
  } = useData();

  const totalLaporan = laporanList.length;
  const onlineIps = ipList.filter((ip) => ip.status === "online").length;
  const offlineIps = ipList.filter((ip) => ip.status === "offline").length;
  const totalBarang = barangList.length;
  const totalStockUnits = barangList.reduce((acc, curr) => acc + curr.jumlah_stock, 0);
  const activeLoans = peminjamanList.filter((p) => p.status === "dipinjam").length;
  const uptimePercentage = ipList.length > 0 ? Math.round((onlineIps / ipList.length) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-xs font-semibold text-blue-100 mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Portal Terintegrasi Monitoring & Operasional
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang di Sistem Internal Staff
          </h2>
          <p className="mt-2 text-sm text-blue-100/90 leading-relaxed">
            Kelola pelaporan kegiatan teknis lapangan, pantau uptime IP & tower wireless di wilayah Banjarmasin / Kalimantan Selatan secara real-time, serta kelola logistik stok barang.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("laporan_upload")}
              className="px-4 py-2 bg-white text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors shadow-md flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Buat Laporan Baru
            </button>
            <button
              onClick={() => setActiveTab("mapping_dashboard")}
              className="px-4 py-2 bg-blue-600/60 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-colors border border-white/20 flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Buka Peta Monitoring IP
            </button>
          </div>
        </div>

        {/* Decorative Grid SVG */}
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none w-96 flex items-center justify-center">
          <Activity className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Laporan */}
        <div
          onClick={() => setActiveTab("laporan_riwayat")}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Laporan Pekerjaan
            </span>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalLaporan}</span>
            <span className="text-xs font-medium text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> Terverifikasi
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Terakhir diinput: {laporanList[0]?.tanggal || "-"}
          </p>
        </div>

        {/* Card 2: IP Uptime */}
        <div
          onClick={() => setActiveTab("mapping_dashboard")}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              IP Monitoring Status
            </span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{uptimePercentage}%</span>
            <span className="text-xs font-medium text-slate-500">
              ({onlineIps} Online / {offlineIps} Offline)
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${uptimePercentage}%` }}
            />
          </div>
        </div>

        {/* Card 3: Stock Barang */}
        <div
          onClick={() => setActiveTab("stock_tampilan")}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Stock Gudang
            </span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalStockUnits}</span>
            <span className="text-xs font-medium text-slate-500">
              Unit/Roll ({totalBarang} Item)
            </span>
          </div>
          <p className="mt-2 text-xs text-amber-600 font-medium">
            {barangList.filter((b) => b.jumlah_stock <= b.min_stock).length} item perlu restock
          </p>
        </div>

        {/* Card 4: Peminjaman */}
        <div
          onClick={() => setActiveTab("stock_peminjaman")}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Peminjaman Aktif
            </span>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{activeLoans}</span>
            <span className="text-xs font-medium text-slate-500">Alat Sedang Dipinjam</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Splicer, OTDR, Crimping tools dll.
          </p>
        </div>
      </div>

      {/* Main Grid: IP Map Status Feed & Recent Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live IP Node Status */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Live Status Node & Router Kalsel
                </h3>
                <p className="text-xs text-slate-500">
                  Data status ping real-time dari POP dan BTS site
                </p>
              </div>
              <button
                onClick={() => setActiveTab("mapping_dashboard")}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                Lihat di Peta <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 overflow-hidden">
              {ipList.slice(0, 5).map((ip) => (
                <div
                  key={ip.id}
                  className="py-3 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full shrink-0 ${
                        ip.status === "online"
                          ? "bg-emerald-500 ring-4 ring-emerald-100"
                          : "bg-red-500 ring-4 ring-red-100"
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">
                          {ip.nama_ip}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-mono">
                          {ip.alamat_ip}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {ip.lokasi_detail}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        ip.status === "online"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {ip.status.toUpperCase()}
                      {ip.status === "online" && ` (${ip.response_time_ms}ms)`}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">{ip.last_ping}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Interval Ping: Otomatis per 12 detik</span>
            <span className="text-emerald-600 font-medium">Banjarmasin & Banjarbaru Node</span>
          </div>
        </div>

        {/* Right 1 Col: Recent Reports */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Laporan Terbaru
              </h3>
              <button
                onClick={() => setActiveTab("laporan_riwayat")}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                Semua <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {laporanList.slice(0, 3).map((laporan) => (
                <div
                  key={laporan.id}
                  className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span className="font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                      {laporan.kategori_nama}
                    </span>
                    <span>{laporan.tanggal}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                    {laporan.judul}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {laporan.deskripsi}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Oleh: {laporan.user_nama}</span>
                    <span className="font-medium text-slate-600">
                      {laporan.fotos.length} Foto
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab("laporan_upload")}
            className="mt-4 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors text-center"
          >
            + Upload Laporan Baru
          </button>
        </div>
      </div>
    </div>
  );
};
