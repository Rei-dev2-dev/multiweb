"use client";

import React from "react";
import {
  LayoutDashboard,
  FileText,
  Upload,
  History,
  Tag,
  MapPin,
  Globe,
  Package,
  PlusCircle,
  FolderPlus,
  BarChart3,
  Users,
  Radio,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Layers
} from "lucide-react";
import { useData } from "../context/DataContext";

export type ActiveTab =
  | "dashboard"
  | "laporan_upload"
  | "laporan_riwayat"
  | "laporan_kategori"
  | "mapping_dashboard"
  | "mapping_kategori"
  | "stock_tampilan"
  | "stock_tambah"
  | "stock_kategori"
  | "stock_laporan"
  | "stock_peminjaman";

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen
}) => {
  const { ipList, barangList, peminjamanList } = useData();

  // Collapsible menu sections
  const [openSections, setOpenSections] = React.useState({
    laporan: true,
    mapping: true,
    stock: true
  });

  const toggleSection = (section: "laporan" | "mapping" | "stock") => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const offlineIpCount = ipList.filter((ip) => ip.status === "offline").length;
  const lowStockCount = barangList.filter((b) => b.jumlah_stock <= b.min_stock).length;
  const activeLoansCount = peminjamanList.filter((p) => p.status === "dipinjam").length;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800 bg-slate-950/40">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-white tracking-wide">
              STAFF PORTAL
            </span>
            <span className="text-xs text-blue-400 font-medium">
              Monitoring & Ops Kalsel
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {/* Dashboard Overview */}
          <div>
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "dashboard"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>
          </div>

          {/* SECTION 1: LAPORAN PEKERJAAN */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection("laporan")}
              className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                Laporan Pekerjaan
              </span>
              {openSections.laporan ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>

            {openSections.laporan && (
              <div className="mt-1 space-y-0.5 pl-2 border-l border-slate-800 ml-3">
                <button
                  onClick={() => {
                    setActiveTab("laporan_upload");
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === "laporan_upload"
                      ? "bg-blue-600/20 text-blue-400 font-semibold border-r-2 border-blue-500"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span>Upload Laporan</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("laporan_riwayat");
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === "laporan_riwayat"
                      ? "bg-blue-600/20 text-blue-400 font-semibold border-r-2 border-blue-500"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <History className="w-4 h-4 text-slate-400" />
                  <span>Riwayat Laporan</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("laporan_kategori");
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === "laporan_kategori"
                      ? "bg-blue-600/20 text-blue-400 font-semibold border-r-2 border-blue-500"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <Tag className="w-4 h-4 text-slate-400" />
                  <span>Kategori Laporan</span>
                </button>
              </div>
            )}
          </div>

          {/* SECTION 2: MAPPING MONITORING */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection("mapping")}
              className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200"
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Mapping Monitoring IP
              </span>
              {openSections.mapping ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>

            {openSections.mapping && (
              <div className="mt-1 space-y-0.5 pl-2 border-l border-slate-800 ml-3">
                <button
                  onClick={() => {
                    setActiveTab("mapping_dashboard");
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === "mapping_dashboard"
                      ? "bg-emerald-600/20 text-emerald-400 font-semibold border-r-2 border-emerald-500"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span>Dashboard Mapping</span>
                  </div>
                  {offlineIpCount > 0 && (
                    <span className="bg-red-500/20 text-red-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold border border-red-500/30">
                      {offlineIpCount} Off
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setActiveTab("mapping_kategori");
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === "mapping_kategori"
                      ? "bg-emerald-600/20 text-emerald-400 font-semibold border-r-2 border-emerald-500"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <Layers className="w-4 h-4 text-slate-400" />
                  <span>Kategori & Data IP</span>
                </button>
              </div>
            )}
          </div>

          {/* SECTION 3: STOCK BARANG */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection("stock")}
              className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200"
            >
              <span className="flex items-center gap-2">
                <Package className="w-3.5 h-3.5 text-amber-400" />
                Stock Barang
              </span>
              {openSections.stock ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>

            {openSections.stock && (
              <div className="mt-1 space-y-0.5 pl-2 border-l border-slate-800 ml-3">
                <button
                  onClick={() => {
                    setActiveTab("stock_tampilan");
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === "stock_tampilan"
                      ? "bg-amber-600/20 text-amber-400 font-semibold border-r-2 border-amber-500"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Package className="w-4 h-4 text-slate-400" />
                    <span>Tampilan Stock</span>
                  </div>
                  {lowStockCount > 0 && (
                    <span className="bg-amber-500/20 text-amber-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold border border-amber-500/30">
                      {lowStockCount} Low
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setActiveTab("stock_tambah");
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === "stock_tambah"
                      ? "bg-amber-600/20 text-amber-400 font-semibold border-r-2 border-amber-500"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-slate-400" />
                  <span>Tambah Stock</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("stock_kategori");
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === "stock_kategori"
                      ? "bg-amber-600/20 text-amber-400 font-semibold border-r-2 border-amber-500"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <FolderPlus className="w-4 h-4 text-slate-400" />
                  <span>Kategori Stock</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("stock_laporan");
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === "stock_laporan"
                      ? "bg-amber-600/20 text-amber-400 font-semibold border-r-2 border-amber-500"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-slate-400" />
                  <span>Laporan Stock</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("stock_peminjaman");
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === "stock_peminjaman"
                      ? "bg-amber-600/20 text-amber-400 font-semibold border-r-2 border-amber-500"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>Peminjaman Barang</span>
                  </div>
                  {activeLoansCount > 0 && (
                    <span className="bg-blue-500/20 text-blue-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {activeLoansCount}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/30 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Server Kalsel Active</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 bg-slate-800 rounded font-mono text-slate-300">v1.0-staff</span>
        </div>
      </aside>
    </>
  );
};
