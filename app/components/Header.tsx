"use client";

import React, { useState } from "react";
import {
  Menu,
  Bell,
  Radio,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  User as UserIcon,
  Sparkles
} from "lucide-react";
import { useData } from "../context/DataContext";

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
  subtitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  title,
  subtitle
}) => {
  const {
    currentUser,
    ipList,
    barangList,
    isAutoPingActive,
    setIsAutoPingActive,
    pingAllIps
  } = useData();

  const [showNotifications, setShowNotifications] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const offlineIps = ipList.filter((ip) => ip.status === "offline");
  const lowStock = barangList.filter((b) => b.jumlah_stock <= b.min_stock);
  const totalNotifications = offlineIps.length + lowStock.length;

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    pingAllIps();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden focus:outline-hidden"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg font-bold text-slate-900 leading-tight flex items-center gap-2">
            {title}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Auto Ping Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isAutoPingActive
                  ? "bg-emerald-500 animate-pulse ring-2 ring-emerald-200"
                  : "bg-slate-400"
              }`}
            />
            <span className="font-medium text-slate-700">
              {isAutoPingActive ? "Monitoring Live" : "Monitoring Paused"}
            </span>
          </div>

          <button
            onClick={() => setIsAutoPingActive(!isAutoPingActive)}
            className="text-[11px] text-blue-600 hover:underline font-semibold ml-1 pl-2 border-l border-slate-300"
          >
            {isAutoPingActive ? "Pause" : "Aktifkan"}
          </button>
        </div>

        {/* Manual Ping Refresh Button */}
        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200 hover:text-slate-900 flex items-center gap-1.5 text-xs font-medium transition-colors"
          title="Manual ping sekarang"
        >
          <RefreshCw className={`w-4 h-4 text-blue-600 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Ping Now</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 relative transition-colors"
          >
            <Bell className="w-5 h-5" />
            {totalNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {totalNotifications}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
                <span className="font-bold text-sm flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400" />
                  Notifikasi Sistem
                </span>
                <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                  {totalNotifications} alerts
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {offlineIps.length === 0 && lowStock.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-sm">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    Semua sistem normal & tidak ada peringatan.
                  </div>
                ) : (
                  <>
                    {offlineIps.map((ip) => (
                      <div
                        key={`ip-${ip.id}`}
                        className="p-3 hover:bg-red-50/60 transition-colors flex items-start gap-3 bg-red-50/20"
                      >
                        <div className="p-1.5 rounded-md bg-red-100 text-red-600 mt-0.5 shrink-0">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900">
                            IP Offline: {ip.nama_ip}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {ip.alamat_ip} • {ip.lokasi_detail}
                          </p>
                          <p className="text-[10px] text-red-600 font-medium mt-0.5">
                            Status: {ip.last_ping}
                          </p>
                        </div>
                      </div>
                    ))}

                    {lowStock.map((b) => (
                      <div
                        key={`stk-${b.id}`}
                        className="p-3 hover:bg-amber-50/60 transition-colors flex items-start gap-3 bg-amber-50/20"
                      >
                        <div className="p-1.5 rounded-md bg-amber-100 text-amber-600 mt-0.5 shrink-0">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900">
                            Stok Menipis: {b.nama_barang}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Tersisa {b.jumlah_stock} {b.satuan} (Min: {b.min_stock})
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Staff Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-300 bg-slate-100">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.nama}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                <UserIcon className="w-4 h-4" />
              </div>
            )}
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-bold text-slate-900 leading-none">
              {currentUser.nama}
            </span>
            <span className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider mt-0.5">
              Staff IT / {currentUser.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
