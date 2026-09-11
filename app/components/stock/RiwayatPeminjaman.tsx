"use client";

import React, { useState } from "react";
import {
  Users,
  Plus,
  CheckCircle2,
  Clock,
  RotateCcw,
  Search,
  Package,
  Calendar,
  X,
  AlertCircle
} from "lucide-react";
import { useData, PeminjamanBarang } from "../../context/DataContext";

export const RiwayatPeminjaman: React.FC = () => {
  const {
    peminjamanList,
    barangList,
    currentUser,
    addPeminjaman,
    returnPeminjaman
  } = useData();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Modal State for New Loan
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [barangId, setBarangId] = useState<number>(barangList[0]?.id || 1);
  const [peminjam, setPeminjam] = useState("");
  const [divisi, setDivisi] = useState("Field Engineer");
  const [jumlah, setJumlah] = useState<number>(1);
  const [tanggalPinjam, setTanggalPinjam] = useState(new Date().toISOString().split("T")[0]);
  const [catatan, setCatatan] = useState("");

  const [notifMsg, setNotifMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const filteredPeminjaman = peminjamanList.filter((p) => {
    const matchesSearch =
      p.peminjam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.divisi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.barang_nama && p.barang_nama.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.catatan && p.catatan.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === "all" || p.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const activeLoansCount = peminjamanList.filter((p) => p.status === "dipinjam").length;
  const returnedLoansCount = peminjamanList.filter((p) => p.status === "dikembalikan").length;

  const handleCreateLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!peminjam.trim()) {
      setErrorMsg("Nama peminjam wajib diisi!");
      return;
    }

    const selectedBarang = barangList.find((b) => b.id === Number(barangId));
    if (selectedBarang && selectedBarang.jumlah_stock < jumlah) {
      setErrorMsg(`Stok tidak mencukupi! Sisa stok barang ini hanya ${selectedBarang.jumlah_stock} ${selectedBarang.satuan}`);
      return;
    }

    addPeminjaman({
      barang_id: Number(barangId),
      user_id: currentUser.id,
      peminjam: peminjam.trim(),
      divisi: divisi.trim(),
      jumlah: Number(jumlah),
      tanggal_pinjam: tanggalPinjam,
      catatan: catatan.trim() || "Peminjaman operasional lapangan"
    });

    setPeminjam("");
    setCatatan("");
    setJumlah(1);
    setShowLoanModal(false);
    setErrorMsg("");
    setNotifMsg("Peminjaman berhasil dicatat & stok barang telah dikurangi!");
    setTimeout(() => setNotifMsg(""), 3500);
  };

  const handleReturn = (id: number, namaBarang: string) => {
    const today = new Date().toISOString().split("T")[0];
    if (confirm(`Konfirmasi pengembalian barang "${namaBarang}" hari ini (${today})?`)) {
      returnPeminjaman(id, today);
      setNotifMsg(`Barang "${namaBarang}" berhasil dikembalikan & stok bertambah kembali!`);
      setTimeout(() => setNotifMsg(""), 3500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600" />
            Riwayat Peminjaman Alat & Barang
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tracking peminjaman alat kerja (Fusion Splicer, OTDR, Crimper, dll.) oleh staff teknisi
          </p>
        </div>

        <button
          onClick={() => setShowLoanModal(true)}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          + Form Pinjam Barang Baru
        </button>
      </div>

      {notifMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {notifMsg}
        </div>
      )}

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Transaksi Pinjam</span>
            <p className="text-xl font-bold text-slate-900">{peminjamanList.length} Record</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Sedang Dipinjam</span>
            <p className="text-xl font-bold text-amber-600">{activeLoansCount} Alat Aktif</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Sudah Dikembalikan</span>
            <p className="text-xl font-bold text-emerald-600">{returnedLoansCount} Selesai</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama staff peminjam, barang, divisi..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
                filterStatus === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Semua ({peminjamanList.length})
            </button>
            <button
              onClick={() => setFilterStatus("dipinjam")}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
                filterStatus === "dipinjam"
                  ? "bg-amber-600 text-white"
                  : "bg-amber-50 text-amber-700 hover:bg-amber-100"
              }`}
            >
              Sedang Dipinjam ({activeLoansCount})
            </button>
            <button
              onClick={() => setFilterStatus("dikembalikan")}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
                filterStatus === "dikembalikan"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              Dikembalikan ({returnedLoansCount})
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Nama Peminjam & Divisi</th>
                <th className="px-4 py-3">Barang / Alat Kerja</th>
                <th className="px-4 py-3">Jumlah</th>
                <th className="px-4 py-3">Tgl Pinjam</th>
                <th className="px-4 py-3">Tgl Kembali</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Catatan / Keperluan</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPeminjaman.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    Tidak ada data peminjaman barang yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredPeminjaman.map((p) => {
                  const isBorrowed = p.status === "dipinjam";
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="font-bold text-slate-900">{p.peminjam}</p>
                        <p className="text-[11px] text-slate-500">{p.divisi}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-900">{p.barang_nama}</p>
                        <p className="font-mono text-[11px] text-slate-500">{p.kode_barang}</p>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-800 whitespace-nowrap">
                        {p.jumlah} Unit
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-700">
                        {p.tanggal_pinjam}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-700">
                        {p.tanggal_kembali ? (
                          <span className="text-emerald-700 font-medium">{p.tanggal_kembali}</span>
                        ) : (
                          <span className="text-amber-600 italic">Belum kembali</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            isBorrowed
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-xs">
                        {p.catatan || "-"}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {isBorrowed ? (
                          <button
                            onClick={() => handleReturn(p.id, p.barang_nama || "Barang")}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] shadow-xs flex items-center gap-1 ml-auto"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Kembalikan
                          </button>
                        ) : (
                          <span className="text-emerald-600 font-semibold text-[11px] flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Pinjam Barang */}
      {showLoanModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-600" />
                Formulir Peminjaman Alat / Barang
              </h3>
              <button
                onClick={() => setShowLoanModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateLoan} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Pilih Alat / Barang yang Dipinjam <span className="text-red-500">*</span>
                </label>
                <select
                  value={barangId}
                  onChange={(e) => setBarangId(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  {barangList.map((b) => (
                    <option key={b.id} value={b.id} disabled={b.jumlah_stock <= 0}>
                      {b.nama_barang} (Sisa Stok: {b.jumlah_stock} {b.satuan}) {b.jumlah_stock <= 0 ? "- STOK HABIS" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Staff Peminjam <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={peminjam}
                    onChange={(e) => setPeminjam(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Divisi / Tim
                  </label>
                  <select
                    value={divisi}
                    onChange={(e) => setDivisi(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Field Engineer">Field Engineer (Lapangan)</option>
                    <option value="NOC Team">NOC Team (Jaringan)</option>
                    <option value="Maintenance Tower">Maintenance Tower</option>
                    <option value="IT Support">IT Support Cabang</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Jumlah yang Dipinjam <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={jumlah}
                    onChange={(e) => setJumlah(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tanggal Peminjaman
                  </label>
                  <input
                    type="date"
                    value={tanggalPinjam}
                    onChange={(e) => setTanggalPinjam(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Catatan / Lokasi Penggunaan Alat
                </label>
                <textarea
                  rows={2}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Contoh: Dibawa untuk splicing FO putus di Jl. A. Yani KM 5..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLoanModal(false)}
                  className="px-3 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-xs"
                >
                  Catat Peminjaman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
