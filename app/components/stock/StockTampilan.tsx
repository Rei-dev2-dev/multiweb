"use client";

import React, { useState } from "react";
import {
  Package,
  Search,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Tag,
  ArrowDownRight,
  ArrowUpRight,
  Layers,
  X
} from "lucide-react";
import { useData, Barang } from "../../context/DataContext";
import { ActiveTab } from "../Sidebar";

interface StockTampilanProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const StockTampilan: React.FC<StockTampilanProps> = ({ setActiveTab }) => {
  const {
    barangList,
    stockKategoriList,
    updateBarangStock
  } = useData();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKategori, setSelectedKategori] = useState<string>("all");
  const [stockStatusFilter, setStockStatusFilter] = useState<string>("all");

  // Quick Restock Modal
  const [restockItem, setRestockItem] = useState<Barang | null>(null);
  const [restockQty, setRestockQty] = useState<number>(1);
  const [restockJenis, setRestockJenis] = useState<"masuk" | "keluar">("masuk");
  const [restockKet, setRestockKet] = useState("");

  const filteredBarang = barangList.filter((b) => {
    const matchesSearch =
      b.nama_barang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.kode_barang.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesKategori =
      selectedKategori === "all" || b.kategori_id.toString() === selectedKategori;

    const isLow = b.jumlah_stock <= b.min_stock && b.jumlah_stock > 0;
    const isOut = b.jumlah_stock === 0;
    const isSafe = b.jumlah_stock > b.min_stock;

    let matchesStatus = true;
    if (stockStatusFilter === "low") matchesStatus = isLow;
    if (stockStatusFilter === "out") matchesStatus = isOut;
    if (stockStatusFilter === "safe") matchesStatus = isSafe;

    return matchesSearch && matchesKategori && matchesStatus;
  });

  const lowStockCount = barangList.filter((b) => b.jumlah_stock <= b.min_stock && b.jumlah_stock > 0).length;
  const outOfStockCount = barangList.filter((b) => b.jumlah_stock === 0).length;

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockItem || restockQty <= 0) return;

    updateBarangStock(
      restockItem.id,
      restockQty,
      restockJenis,
      restockKet.trim() || (restockJenis === "masuk" ? "Restock Cepat Gudang" : "Pengurangan Stok Manual")
    );

    setRestockItem(null);
    setRestockQty(1);
    setRestockKet("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-600" />
            Tampilan & Inventaris Stock Barang
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pantau ketersediaan perangkat jaringan, kabel fiber optic, tools, dan material instalasi
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("stock_tambah")}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            + Tambah Item Barang
          </button>
        </div>
      </div>

      {/* Warning Alert if any low stock */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-amber-800 text-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">Peringatan Ketersediaan Stok</p>
              <p className="text-amber-700">
                Terdapat <strong>{lowStockCount} item menipis</strong> di bawah batas minimum dan{" "}
                <strong>{outOfStockCount} item habis</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => setStockStatusFilter("low")}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors shadow-xs"
          >
            Filter Barang Menipis
          </button>
        </div>
      )}

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama barang, kode SKU..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Filter Kategori */}
          <div className="relative">
            <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="all">Semua Kategori Barang</option>
              {stockKategoriList.map((k) => (
                <option key={k.id} value={k.id.toString()}>
                  {k.nama_kategori}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Status Stok */}
          <select
            value={stockStatusFilter}
            onChange={(e) => setStockStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
          >
            <option value="all">Semua Status Stok</option>
            <option value="safe">Stok Aman (Di atas Minimum)</option>
            <option value="low">Stok Menipis (Warning)</option>
            <option value="out">Stok Habis (0)</option>
          </select>
        </div>
      </div>

      {/* Stock Inventory Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Foto</th>
                <th className="px-4 py-3">Kode SKU</th>
                <th className="px-4 py-3">Nama Barang</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Jumlah Stok</th>
                <th className="px-4 py-3">Batas Min</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredBarang.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    Tidak ada data barang yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredBarang.map((b) => {
                  const isLow = b.jumlah_stock <= b.min_stock && b.jumlah_stock > 0;
                  const isOut = b.jumlah_stock === 0;
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-2xs">
                          <img
                            src={b.foto}
                            alt={b.nama_barang}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-700 whitespace-nowrap">
                        {b.kode_barang}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900 max-w-xs">
                        {b.nama_barang}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded font-medium border border-amber-100">
                          {b.kategori_nama}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-extrabold text-slate-900">
                          {b.jumlah_stock}
                        </span>{" "}
                        <span className="text-slate-500 font-medium">{b.satuan}</span>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-500 whitespace-nowrap">
                        {b.min_stock} {b.satuan}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {isOut ? (
                          <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full font-bold text-[10px] border border-red-200">
                            HABIS
                          </span>
                        ) : isLow ? (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px] border border-amber-200 animate-pulse">
                            MENIPIS
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-bold text-[10px] border border-emerald-200">
                            AMAN
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            setRestockItem(b);
                            setRestockQty(1);
                            setRestockJenis("masuk");
                          }}
                          className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-[11px] font-bold transition-colors shadow-2xs"
                        >
                          Update / Restock
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Restock / Mutasi Modal */}
      {restockItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Update Stok: {restockItem.nama_barang}
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">
                  SKU: {restockItem.kode_barang} | Saat ini: {restockItem.jumlah_stock} {restockItem.satuan}
                </span>
              </div>
              <button
                onClick={() => setRestockItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Jenis Pergerakan Stok
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRestockJenis("masuk")}
                    className={`p-2.5 rounded-lg border font-bold flex items-center justify-center gap-1.5 transition-all ${
                      restockJenis === "masuk"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-200"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <ArrowDownRight className="w-4 h-4 text-emerald-600" />
                    Barang Masuk (Restock)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRestockJenis("keluar")}
                    className={`p-2.5 rounded-lg border font-bold flex items-center justify-center gap-1.5 transition-all ${
                      restockJenis === "keluar"
                        ? "bg-red-50 border-red-500 text-red-800 ring-2 ring-red-200"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4 text-red-600" />
                    Barang Keluar (Pakai)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Jumlah ({restockItem.satuan}) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Keterangan / Keperluan
                </label>
                <input
                  type="text"
                  value={restockKet}
                  onChange={(e) => setRestockKet(e.target.value)}
                  placeholder="Contoh: Tambahan PO Baru / Pemasangan Site BJM"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRestockItem(null)}
                  className="px-3 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
