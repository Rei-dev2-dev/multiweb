"use client";

import React, { useState } from "react";
import {
  FolderPlus,
  Plus,
  Trash2,
  Package,
  CheckCircle2
} from "lucide-react";
import { useData } from "../../context/DataContext";

export const KategoriStock: React.FC = () => {
  const { stockKategoriList, barangList, addStockKategori, deleteStockKategori } =
    useData();

  const [namaKat, setNamaKat] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKat.trim()) return;

    addStockKategori({
      nama_kategori: namaKat.trim()
    });

    setNamaKat("");
    setShowModal(false);
    setSuccessMsg("Kategori stock berhasil ditambahkan!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-amber-600" />
            Manajemen Kategori Stock Barang
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pengelompokan barang logistik gudang (Networking, FO, Tools, Power, dll.)
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          + Tambah Kategori Stock
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {successMsg}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Nama Kategori Stock</th>
              <th className="px-4 py-3">Total Varian Barang</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {stockKategoriList.map((kat) => {
              const count = barangList.filter((b) => b.kategori_id === kat.id).length;
              return (
                <tr key={kat.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-500">#{kat.id}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{kat.nama_kategori}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-800 font-semibold rounded-full border border-amber-100">
                      {count} Item
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        if (confirm(`Hapus kategori "${kat.nama_kategori}"?`)) {
                          deleteStockKategori(kat.id);
                        }
                      }}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      title="Hapus Kategori"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah Kategori */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-amber-600" />
              Tambah Kategori Stock Baru
            </h3>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nama Kategori Barang <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={namaKat}
                  onChange={(e) => setNamaKat(e.target.value)}
                  placeholder="Contoh: Perangkat Wireless 5GHz"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-xs"
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
