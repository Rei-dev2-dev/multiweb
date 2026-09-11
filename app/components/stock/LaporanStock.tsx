"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Search,
  Calendar,
  Filter,
  ArrowDownRight,
  ArrowUpRight,
  User,
  Package,
  FileSpreadsheet
} from "lucide-react";
import { useData } from "../../context/DataContext";

export const LaporanStock: React.FC = () => {
  const { riwayatStockList, stockKategoriList, barangList } = useData();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterJenis, setFilterJenis] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("");

  const filteredRiwayat = riwayatStockList.filter((item) => {
    const matchesSearch =
      (item.barang_nama && item.barang_nama.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.kode_barang && item.kode_barang.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.user_nama && item.user_nama.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.keterangan.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesJenis = filterJenis === "all" || item.jenis === filterJenis;
    const matchesDate = !filterDate || item.tanggal.startsWith(filterDate);

    return matchesSearch && matchesJenis && matchesDate;
  });

  const totalMasuk = filteredRiwayat
    .filter((r) => r.jenis === "masuk")
    .reduce((acc, curr) => acc + curr.jumlah, 0);

  const totalKeluar = filteredRiwayat
    .filter((r) => r.jenis === "keluar")
    .reduce((acc, curr) => acc + curr.jumlah, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-600" />
            Laporan Mutasi & Pergerakan Stok Barang
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Rekapitulasi logistik keluar-masuk barang, pemakaian site, dan penerimaan restock
          </p>
        </div>

        <button
          onClick={() => alert("Fitur Export Rekap Excel/PDF siap dihubungkan ke backend.")}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          Export Data Mutasi
        </button>
      </div>

      {/* Aggregate KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ArrowDownRight className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Barang Masuk</span>
            <p className="text-2xl font-black text-emerald-600">+{totalMasuk} <span className="text-xs font-medium text-slate-500">Unit/Item</span></p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Barang Keluar</span>
            <p className="text-2xl font-black text-red-600">-{totalKeluar} <span className="text-xs font-medium text-slate-500">Unit/Item</span></p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Aktivitas Mutasi</span>
            <p className="text-2xl font-black text-slate-900">{filteredRiwayat.length} <span className="text-xs font-medium text-slate-500">Transaksi</span></p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama barang, staff, atau keterangan..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <select
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
          >
            <option value="all">Semua Jenis Pergerakan (Masuk & Keluar)</option>
            <option value="masuk">Hanya Barang Masuk (Restock / Return)</option>
            <option value="keluar">Hanya Barang Keluar (Pakai / Pinjam)</option>
          </select>

          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Waktu Transaksi</th>
                <th className="px-4 py-3">Nama Barang & SKU</th>
                <th className="px-4 py-3">Jenis Mutasi</th>
                <th className="px-4 py-3">Kuantitas</th>
                <th className="px-4 py-3">Keterangan / Keperluan</th>
                <th className="px-4 py-3">Staff Pencatat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRiwayat.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    Tidak ada riwayat pergerakan stok yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredRiwayat.map((r) => {
                  const isMasuk = r.jenis === "masuk";
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">
                        {r.tanggal}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-900">{r.barang_nama}</p>
                        <p className="font-mono text-[11px] text-slate-500">{r.kode_barang}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            isMasuk
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-red-50 text-red-800 border border-red-200"
                          }`}
                        >
                          {isMasuk ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                          {isMasuk ? "MASUK" : "KELUAR"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-extrabold text-sm">
                        <span className={isMasuk ? "text-emerald-600" : "text-red-600"}>
                          {isMasuk ? `+${r.jumlah}` : `-${r.jumlah}`}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700 max-w-sm">
                        {r.keterangan}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-600 font-medium">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {r.user_nama}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
