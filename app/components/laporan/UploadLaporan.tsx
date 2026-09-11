"use client";

import React, { useState } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  Layers,
  ArrowRight
} from "lucide-react";
import { useData } from "../../context/DataContext";
import { ActiveTab } from "../Sidebar";

interface UploadLaporanProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const UploadLaporan: React.FC<UploadLaporanProps> = ({ setActiveTab }) => {
  const { laporanKategoriList, currentUser, addLaporan } = useData();

  const [judul, setJudul] = useState("");
  const [kategoriId, setKategoriId] = useState<number>(laporanKategoriList[0]?.id || 1);
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState<"Selesai" | "Dalam Proses" | "Pending Review">("Selesai");
  const [deskripsi, setDeskripsi] = useState("");
  const [fotos, setFotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80"
  ]);
  const [sampleUrlInput, setSampleUrlInput] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);

  // Handle local image file upload (convert to Data URL for prototype preview)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const maxFileSize = 5 * 1024 * 1024; // 5 MB
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

    const newPhotos: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!allowedTypes.includes(file.type)) {
        setErrorMsg(`File ${file.name} bukan format gambar yang diizinkan (JPG/PNG/WEBP)`);
        return;
      }

      if (file.size > maxFileSize) {
        setErrorMsg(`File ${file.name} melebihi batas maksimal 5MB`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFotos((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
    setErrorMsg("");
  };

  const handleAddSampleUrl = () => {
    if (!sampleUrlInput.trim()) return;
    setFotos([...fotos, sampleUrlInput.trim()]);
    setSampleUrlInput("");
  };

  const handleRemovePhoto = (index: number) => {
    setFotos(fotos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim()) {
      setErrorMsg("Judul laporan wajib diisi!");
      return;
    }
    if (!deskripsi.trim()) {
      setErrorMsg("Deskripsi pekerjaan wajib diisi!");
      return;
    }
    if (fotos.length === 0) {
      setErrorMsg("Harap sertakan minimal 1 foto dokumentasi pekerjaan!");
      return;
    }

    addLaporan({
      kategori_id: Number(kategoriId),
      user_id: currentUser.id,
      judul,
      deskripsi,
      tanggal,
      status,
      fotos
    });

    setSuccessMsg(true);
    setErrorMsg("");

    // Reset form
    setJudul("");
    setDeskripsi("");
    setFotos([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Upload Laporan Pekerjaan
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Input dokumentasi hasil pekerjaan lapangan atau maintenance perangkat secara lengkap
          </p>
        </div>
        <button
          onClick={() => setActiveTab("laporan_riwayat")}
          className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
        >
          Lihat Riwayat <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-bold">Laporan Berhasil Disimpan!</p>
              <p className="text-xs text-emerald-700">
                Data laporan dan foto dokumentasi telah masuk ke dalam daftar riwayat laporan pekerjaan.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("laporan_riwayat")}
            className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
          >
            Buka Riwayat
          </button>
        </div>
      )}

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="text-xs font-semibold">{errorMsg}</p>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Judul Laporan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Judul Laporan Pekerjaan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Perapian Patch Cord & Splicing Core FO di POP Kayutangi"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>

          {/* Grid Kategori, Tanggal, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Kategori */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Kategori Pekerjaan
              </label>
              <select
                value={kategoriId}
                onChange={(e) => setKategoriId(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {laporanKategoriList.map((kat) => (
                  <option key={kat.id} value={kat.id}>
                    {kat.nama_kategori}
                  </option>
                ))}
              </select>
            </div>

            {/* Tanggal */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Tanggal Pelaksanaan
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Status Pekerjaan
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="Selesai">Selesai (Completed)</option>
                <option value="Dalam Proses">Dalam Proses (On Progress)</option>
                <option value="Pending Review">Pending Review</option>
              </select>
            </div>
          </div>

          {/* Deskripsi Pekerjaan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Deskripsi & Rincian Teknis <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Jelaskan kendala awal, tindakan penanganan yang dilakukan, material/alat yang dipakai, dan hasil akhir..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>

          {/* Upload Foto Dokumentasi (Multi-foto) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Foto Dokumentasi Pekerjaan (Multi Foto) <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500">
                {fotos.length} Foto terpilih (Maks 5MB per file)
              </span>
            </div>

            {/* Dropzone Container */}
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 rounded-xl p-6 text-center transition-colors">
              <input
                type="file"
                id="photo-upload"
                multiple
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="photo-upload"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Klik di sini untuk upload foto dokumentasi dari galeri/kamera
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mendukung JPG, PNG, WEBP (Bisa pilih beberapa file sekaligus)
                  </p>
                </div>
              </label>
            </div>

            {/* Quick Add URL (untuk kemudahan demo) */}
            <div className="mt-3 flex gap-2">
              <input
                type="url"
                value={sampleUrlInput}
                onChange={(e) => setSampleUrlInput(e.target.value)}
                placeholder="Atau tempel URL gambar web di sini untuk demo..."
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddSampleUrl}
                className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-medium hover:bg-slate-700 transition-colors"
              >
                Tambah URL
              </button>
            </div>

            {/* Photo Previews Grid */}
            {fotos.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {fotos.map((foto, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-100 shadow-xs"
                  >
                    <img
                      src={foto}
                      alt={`Dokumentasi ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1.5 right-1.5 p-1 bg-red-600/90 hover:bg-red-700 text-white rounded-full transition-colors shadow-xs"
                      title="Hapus foto ini"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="absolute bottom-1 left-1.5 bg-slate-900/70 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-xs">
                      Foto #{idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form Actions Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200/80 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setJudul("");
              setDeskripsi("");
              setFotos([]);
            }}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Reset Form
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Simpan & Terbitkan Laporan
          </button>
        </div>
      </form>
    </div>
  );
};
