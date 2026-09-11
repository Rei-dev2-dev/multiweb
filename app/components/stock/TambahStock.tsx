"use client";

import React, { useState } from "react";
import {
  PlusCircle,
  Package,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  X
} from "lucide-react";
import { useData } from "../../context/DataContext";
import { ActiveTab } from "../Sidebar";

interface TambahStockProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const TambahStock: React.FC<TambahStockProps> = ({ setActiveTab }) => {
  const { stockKategoriList, addBarang } = useData();

  const [namaBarang, setNamaBarang] = useState("");
  const [kodeBarang, setKodeBarang] = useState("");
  const [kategoriId, setKategoriId] = useState<number>(stockKategoriList[0]?.id || 1);
  const [jumlahStock, setJumlahStock] = useState<number>(10);
  const [minStock, setMinStock] = useState<number>(2);
  const [satuan, setSatuan] = useState("Unit");
  const [fotoUrl, setFotoUrl] = useState(
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300&auto=format&fit=crop&q=80"
  );

  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFotoUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaBarang.trim()) {
      setErrorMsg("Nama barang wajib diisi!");
      return;
    }
    if (!kodeBarang.trim()) {
      setErrorMsg("Kode SKU barang wajib diisi!");
      return;
    }

    addBarang({
      nama_barang: namaBarang.trim(),
      kode_barang: kodeBarang.trim().toUpperCase(),
      kategori_id: Number(kategoriId),
      jumlah_stock: Number(jumlahStock),
      min_stock: Number(minStock),
      satuan: satuan.trim(),
      foto: fotoUrl
    });

    setSuccessMsg(true);
    setErrorMsg("");

    // Reset fields
    setNamaBarang("");
    setKodeBarang("");
    setJumlahStock(10);
    setMinStock(2);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-amber-600" />
            Tambah Master Data Barang Baru
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Daftarkan inventaris baru ke database stok gudang logistik internal
          </p>
        </div>

        <button
          onClick={() => setActiveTab("stock_tampilan")}
          className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
        >
          Lihat Stok <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-bold">Barang Berhasil Didaftarkan!</p>
              <p className="text-xs text-emerald-700">
                Data barang dan mutasi stok awal telah otomatis dicatat di riwayat mutasi.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("stock_tampilan")}
            className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
          >
            Lihat di Tabel Stok
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 text-xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="font-semibold">{errorMsg}</p>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nama Barang */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nama Barang / Perangkat <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={namaBarang}
                onChange={(e) => setNamaBarang(e.target.value)}
                placeholder="Contoh: Mikrotik Routerboard RB4011"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            {/* Kode SKU */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kode Barang / SKU <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={kodeBarang}
                onChange={(e) => setKodeBarang(e.target.value)}
                placeholder="Contoh: NET-RB4011-RM"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500 uppercase"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Kategori */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kategori Barang
              </label>
              <select
                value={kategoriId}
                onChange={(e) => setKategoriId(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
              >
                {stockKategoriList.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama_kategori}
                  </option>
                ))}
              </select>
            </div>

            {/* Jumlah Stok Awal */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Jumlah Stok Awal <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                value={jumlahStock}
                onChange={(e) => setJumlahStock(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-bold"
                required
              />
            </div>

            {/* Batas Minimum */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Batas Minimum Warning
              </label>
              <input
                type="number"
                min={1}
                value={minStock}
                onChange={(e) => setMinStock(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          {/* Satuan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Satuan Barang
              </label>
              <select
                value={satuan}
                onChange={(e) => setSatuan(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value="Unit">Unit</option>
                <option value="Roll">Roll</option>
                <option value="Box">Box</option>
                <option value="Meter">Meter</option>
                <option value="Pcs">Pcs</option>
                <option value="Set">Set</option>
              </select>
            </div>

            {/* Foto URL / Upload */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                URL Foto Barang / Unggah
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={fotoUrl}
                  onChange={(e) => setFotoUrl(e.target.value)}
                  placeholder="https://images.unsplash..."
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
                <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer font-bold border border-slate-300">
                  <UploadCloud className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Preview Image */}
          {fotoUrl && (
            <div className="mt-2 flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-300 bg-white shrink-0">
                <img
                  src={fotoUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-bold text-slate-800">Preview Foto Barang</span>
                <p className="text-[11px] text-slate-500">
                  Foto ini akan tampil pada katalog stok dan laporan mutasi barang.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Submit Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200/80 flex items-center justify-end gap-3">
          <button
            type="submit"
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Simpan Data Barang
          </button>
        </div>
      </form>
    </div>
  );
};
