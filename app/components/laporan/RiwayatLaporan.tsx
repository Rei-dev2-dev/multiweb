"use client";

import React, { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Calendar,
  User,
  Tag,
  Eye,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  PlusCircle,
  Clock,
  Layers
} from "lucide-react";
import { useData, Laporan } from "../../context/DataContext";
import { ActiveTab } from "../Sidebar";

interface RiwayatLaporanProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const RiwayatLaporan: React.FC<RiwayatLaporanProps> = ({ setActiveTab }) => {
  const { laporanList, laporanKategoriList, users, deleteLaporan } = useData();

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKategori, setSelectedKategori] = useState<string>("all");
  const [selectedStaff, setSelectedStaff] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Modal Detail State
  const [selectedLaporan, setSelectedLaporan] = useState<Laporan | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);

  // Filter logic
  const filteredLaporan = laporanList.filter((item) => {
    const matchesSearch =
      item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.user_nama && item.user_nama.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesKategori =
      selectedKategori === "all" || item.kategori_id.toString() === selectedKategori;

    const matchesStaff =
      selectedStaff === "all" || (item.user_nama && item.user_nama === selectedStaff);

    const matchesDate = !selectedDate || item.tanggal === selectedDate;

    return matchesSearch && matchesKategori && matchesStaff && matchesDate;
  });

  const handleOpenDetail = (laporan: Laporan) => {
    setSelectedLaporan(laporan);
    setActivePhotoIdx(0);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Riwayat & Daftar Laporan Pekerjaan
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Total {filteredLaporan.length} laporan pekerjaan terdata dalam sistem
          </p>
        </div>
        <button
          onClick={() => setActiveTab("laporan_upload")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          + Tambah Laporan Baru
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari judul, rincian teknis..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filter Kategori */}
          <div className="relative">
            <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">Semua Kategori</option>
              {laporanKategoriList.map((kat) => (
                <option key={kat.id} value={kat.id.toString()}>
                  {kat.nama_kategori}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Staff */}
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">Semua Staff</option>
              {users.map((u) => (
                <option key={u.id} value={u.nama}>
                  {u.nama} ({u.role})
                </option>
              ))}
            </select>
          </div>

          {/* Filter Tanggal */}
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        {/* Active Filters Reset */}
        {(searchTerm || selectedKategori !== "all" || selectedStaff !== "all" || selectedDate) && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>Menampilkan hasil filter spesifik</span>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedKategori("all");
                setSelectedStaff("all");
                setSelectedDate("");
              }}
              className="text-blue-600 hover:underline font-semibold"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </div>

      {/* Laporan Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Judul & Detail Pekerjaan</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Staff Pelaksana</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Dokumentasi Foto</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLaporan.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    Tidak ada data laporan yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredLaporan.map((laporan) => (
                  <tr key={laporan.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">
                      {laporan.tanggal}
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-bold text-slate-900 line-clamp-1">{laporan.judul}</p>
                      <p className="text-slate-500 text-[11px] line-clamp-2 mt-0.5">
                        {laporan.deskripsi}
                      </p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-medium border border-blue-100">
                        {laporan.kategori_nama}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {laporan.user_nama}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          laporan.status === "Selesai"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : laporan.status === "Dalam Proses"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {laporan.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {laporan.fotos.slice(0, 3).map((foto, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleOpenDetail(laporan)}
                            className="w-8 h-8 rounded-md overflow-hidden border border-slate-200 shrink-0 cursor-pointer hover:opacity-80 shadow-xs"
                          >
                            <img
                              src={foto}
                              alt="Foto"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {laporan.fotos.length > 3 && (
                          <span
                            onClick={() => handleOpenDetail(laporan)}
                            className="w-8 h-8 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center cursor-pointer border border-slate-200"
                          >
                            +{laporan.fotos.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenDetail(laporan)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Lihat Detail & Foto Lengkap"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus laporan "${laporan.judul}"?`)) {
                              deleteLaporan(laporan.id);
                            }
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          title="Hapus Laporan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Laporan & Gallery */}
      {selectedLaporan && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/60 sticky top-0 bg-white z-10">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {selectedLaporan.kategori_nama}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedLaporan.judul}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLaporan(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Photo Viewer (Active photo + Thumbnails) */}
              {selectedLaporan.fotos.length > 0 && (
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-200 shadow-inner">
                    <img
                      src={selectedLaporan.fotos[activePhotoIdx]}
                      alt="Foto Laporan Full"
                      className="max-h-full max-w-full object-contain"
                    />
                    {selectedLaporan.fotos.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setActivePhotoIdx((prev) =>
                              prev > 0 ? prev - 1 : selectedLaporan.fotos.length - 1
                            )
                          }
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-xs"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() =>
                            setActivePhotoIdx((prev) =>
                              prev < selectedLaporan.fotos.length - 1 ? prev + 1 : 0
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-xs"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-slate-900/80 text-white text-xs rounded-md backdrop-blur-xs font-medium">
                      Foto {activePhotoIdx + 1} dari {selectedLaporan.fotos.length}
                    </div>
                  </div>

                  {/* Thumbnails list */}
                  {selectedLaporan.fotos.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {selectedLaporan.fotos.map((foto, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActivePhotoIdx(idx)}
                          className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                            activePhotoIdx === idx
                              ? "border-blue-600 ring-2 ring-blue-100"
                              : "border-transparent opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={foto}
                            alt={`Thumb ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Detail Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-500 block">Tanggal Pekerjaan:</span>
                  <span className="font-bold text-slate-800">{selectedLaporan.tanggal}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Staff Pelaksana:</span>
                  <span className="font-bold text-slate-800">{selectedLaporan.user_nama}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Status:</span>
                  <span className="font-bold text-emerald-600">{selectedLaporan.status}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Waktu Submit:</span>
                  <span className="font-bold text-slate-800">{selectedLaporan.created_at}</span>
                </div>
              </div>

              {/* Deskripsi Lengkap */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Rincian Deskripsi & Penanganan:
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  {selectedLaporan.deskripsi}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedLaporan(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
