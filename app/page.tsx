"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataProvider } from "./context/DataContext";
import { Sidebar, ActiveTab } from "./components/Sidebar";
import { Header } from "./components/Header";
import { DashboardOverview } from "./components/DashboardOverview";
import { UploadLaporan } from "./components/laporan/UploadLaporan";
import { RiwayatLaporan } from "./components/laporan/RiwayatLaporan";
import { KategoriLaporan } from "./components/laporan/KategoriLaporan";
import { MappingDashboard } from "./components/mapping/MappingDashboard";
import { KategoriIP } from "./components/mapping/KategoriIP";
import { StockTampilan } from "./components/stock/StockTampilan";
import { TambahStock } from "./components/stock/TambahStock";
import { KategoriStock } from "./components/stock/KategoriStock";
import { LaporanStock } from "./components/stock/LaporanStock";
import { RiwayatPeminjaman } from "./components/stock/RiwayatPeminjaman";

function DashboardApp() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isAuthChecked, setIsAuthChecked] = useState<boolean>(false);

  // Auth guard — redirect ke /login jika belum login
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem("mw_auth") === "true";
      if (!isAuth) {
        router.replace("/login");
      } else {
        setIsAuthChecked(true);
      }
    }
  }, [router]);

  // Tampilkan loading sampai auth selesai dicek
  if (!isAuthChecked) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-slate-500 font-medium">Memuat dashboard...</span>
        </div>
      </div>
    );
  }


  // Get current page titles
  const getPageInfo = () => {
    switch (activeTab) {
      case "dashboard":
        return {
          title: "Dashboard Overview",
          subtitle: "Ringkasan metrik laporan pekerjaan, IP monitoring, dan inventaris barang"
        };
      case "laporan_upload":
        return {
          title: "Upload Laporan Pekerjaan",
          subtitle: "Form input dokumentasi teknis lapangan dan unggah multi-foto"
        };
      case "laporan_riwayat":
        return {
          title: "Riwayat Laporan Pekerjaan",
          subtitle: "Daftar riwayat dan galeri foto laporan kegiatan operasional staff"
        };
      case "laporan_kategori":
        return {
          title: "Kategori Laporan",
          subtitle: "Master data pengelompokan jenis laporan teknis"
        };
      case "mapping_dashboard":
        return {
          title: "Dashboard Mapping Monitoring",
          subtitle: "Pemetaan interaktif status router, tower & BTS Kalsel secara real-time"
        };
      case "mapping_kategori":
        return {
          title: "Kategori & Data IP",
          subtitle: "Manajemen daftar titik IP address dan kategori grup perangkat"
        };
      case "stock_tampilan":
        return {
          title: "Tampilan Stock Barang",
          subtitle: "Katalog stok ketersediaan barang dan peringatan restock gudang"
        };
      case "stock_tambah":
        return {
          title: "Tambah Stock Barang",
          subtitle: "Form registrasi item barang baru ke dalam database inventaris"
        };
      case "stock_kategori":
        return {
          title: "Kategori Stock",
          subtitle: "Master data pengelompokan jenis barang dan logistik"
        };
      case "stock_laporan":
        return {
          title: "Laporan Stock Barang",
          subtitle: "Rekapitulasi riwayat transaksi mutasi barang masuk dan keluar"
        };
      case "stock_peminjaman":
        return {
          title: "Riwayat Peminjaman Barang",
          subtitle: "Pencatatan peminjaman alat kerja oleh staff lapangan dan pengembalian"
        };
      default:
        return {
          title: "Portal Staff Internal",
          subtitle: "Sistem Manajemen Operasional & Monitoring Kalsel"
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Sticky Header */}
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && <DashboardOverview setActiveTab={setActiveTab} />}
          {activeTab === "laporan_upload" && <UploadLaporan setActiveTab={setActiveTab} />}
          {activeTab === "laporan_riwayat" && <RiwayatLaporan setActiveTab={setActiveTab} />}
          {activeTab === "laporan_kategori" && <KategoriLaporan />}
          {activeTab === "mapping_dashboard" && <MappingDashboard setActiveTab={setActiveTab} />}
          {activeTab === "mapping_kategori" && <KategoriIP />}
          {activeTab === "stock_tampilan" && <StockTampilan setActiveTab={setActiveTab} />}
          {activeTab === "stock_tambah" && <TambahStock setActiveTab={setActiveTab} />}
          {activeTab === "stock_kategori" && <KategoriStock />}
          {activeTab === "stock_laporan" && <LaporanStock />}
          {activeTab === "stock_peminjaman" && <RiwayatPeminjaman />}
        </main>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <DataProvider>
      <DashboardApp />
    </DataProvider>
  );
}
