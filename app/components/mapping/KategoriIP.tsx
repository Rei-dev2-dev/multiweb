"use client";

import React, { useState } from "react";
import {
  Layers,
  Plus,
  Trash2,
  Globe,
  Tag,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Radio,
  Edit2
} from "lucide-react";
import { useData, IpMonitoring, IpKategori } from "../../context/DataContext";

import { MapCoordinatePicker } from "./MapCoordinatePicker";

export const KategoriIP: React.FC = () => {
  const {
    ipList,
    ipKategoriList,
    addIp,
    deleteIp,
    addIpKategori,
    deleteIpKategori
  } = useData();

  // Active sub-tab
  const [activeSubTab, setActiveSubTab] = useState<"data_ip" | "kategori_ip">("data_ip");

  // Modal State for New IP
  const [showIpModal, setShowIpModal] = useState(false);
  const [namaIp, setNamaIp] = useState("");
  const [alamatIp, setAlamatIp] = useState("");
  const [latitude, setLatitude] = useState("-3.3308");
  const [longitude, setLongitude] = useState("114.5560");
  const [lokasiDetail, setLokasiDetail] = useState("Terminal Petikemas Banjarmasin (Pelindo TPKB)");
  const [kategoriId, setKategoriId] = useState<number>(ipKategoriList[0]?.id || 1);

  // Modal State for New Category
  const [showKatModal, setShowKatModal] = useState(false);
  const [namaKat, setNamaKat] = useState("");

  const [notifMsg, setNotifMsg] = useState("");

  // Presets
  const handlePresetLocation = (preset: "tpkb" | "dermaga" | "gate") => {
    if (preset === "tpkb") {
      setLatitude("-3.3308");
      setLongitude("114.5560");
      setLokasiDetail("Kantor & Yard Utama Pelindo TPKB");
    } else if (preset === "dermaga") {
      setLatitude("-3.3325");
      setLongitude("114.5540");
      setLokasiDetail("Dermaga Tambat Petikemas Trisakti");
    } else if (preset === "gate") {
      setLatitude("-3.3298");
      setLongitude("114.5572");
      setLokasiDetail("Pos Gate In/Out Jl. Barito Hilir No. 6");
    }
  };

  const handleCreateIp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaIp.trim() || !alamatIp.trim()) return;

    addIp({
      nama_ip: namaIp.trim(),
      alamat_ip: alamatIp.trim(),
      latitude: parseFloat(latitude) || -3.3197,
      longitude: parseFloat(longitude) || 114.5912,
      kategori_id: Number(kategoriId),
      lokasi_detail: lokasiDetail.trim() || "Kalimantan Selatan"
    });

    setNamaIp("");
    setAlamatIp("");
    setLokasiDetail("");
    setShowIpModal(false);
    setNotifMsg("Data IP Monitoring berhasil didaftarkan!");
    setTimeout(() => setNotifMsg(""), 3000);
  };

  const handleCreateKategori = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKat.trim()) return;

    addIpKategori({
      nama_kategori: namaKat.trim()
    });

    setNamaKat("");
    setShowKatModal(false);
    setNotifMsg("Kategori IP berhasil ditambahkan!");
    setTimeout(() => setNotifMsg(""), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            Manajemen Data & Kategori IP Monitoring
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Konfigurasi titik koordinat IP, subnet alamat, dan kelompok perangkat jaringan
          </p>
        </div>

        {/* Subtab Toggle Buttons */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveSubTab("data_ip")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeSubTab === "data_ip"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Daftar Data IP ({ipList.length})
          </button>
          <button
            onClick={() => setActiveSubTab("kategori_ip")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeSubTab === "kategori_ip"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Kategori IP ({ipKategoriList.length})
          </button>
        </div>
      </div>

      {notifMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {notifMsg}
        </div>
      )}

      {/* SUB-TAB 1: DATA IP */}
      {activeSubTab === "data_ip" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowIpModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              + Daftarkan Node IP Baru
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Nama IP / Hostname</th>
                    <th className="px-4 py-3">Alamat IP</th>
                    <th className="px-4 py-3">Kategori</th>
                    <th className="px-4 py-3">Koordinat Geospasial</th>
                    <th className="px-4 py-3">Lokasi / Detail Site</th>
                    <th className="px-4 py-3">Status Terkini</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {ipList.map((ip) => (
                    <tr key={ip.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900">{ip.nama_ip}</td>
                      <td className="px-4 py-3 font-mono text-slate-700 font-semibold">
                        <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {ip.alamat_ip}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-medium border border-emerald-100">
                          {ip.kategori_nama}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-500 text-[11px]">
                        {ip.latitude.toFixed(4)}, {ip.longitude.toFixed(4)}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{ip.lokasi_detail}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            ip.status === "online"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {ip.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Hapus node IP "${ip.nama_ip}"?`)) {
                              deleteIp(ip.id);
                            }
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          title="Hapus IP"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: KATEGORI IP */}
      {activeSubTab === "kategori_ip" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowKatModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              + Tambah Kategori IP
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Nama Kategori IP</th>
                  <th className="px-4 py-3">Jumlah IP Terhubung</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {ipKategoriList.map((kat) => {
                  const count = ipList.filter((ip) => ip.kategori_id === kat.id).length;
                  return (
                    <tr key={kat.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-500">#{kat.id}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{kat.nama_kategori}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-semibold rounded-full border border-emerald-100">
                          {count} Node
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Hapus kategori IP "${kat.nama_kategori}"?`)) {
                              deleteIpKategori(kat.id);
                            }
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
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
        </div>
      )}

      {/* Modal Tambah IP Baru */}
      {showIpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-8">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Radio className="w-5 h-5 text-emerald-600" />
              Daftarkan Node IP Baru
            </h3>
            <form onSubmit={handleCreateIp} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Host / Perangkat <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={namaIp}
                    onChange={(e) => setNamaIp(e.target.value)}
                    placeholder="Contoh: Router-POP-Gatot-Subroto"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kategori Perangkat
                  </label>
                  <select
                    value={kategoriId}
                    onChange={(e) => setKategoriId(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    {ipKategoriList.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.nama_kategori}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Alamat IP Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={alamatIp}
                  onChange={(e) => setAlamatIp(e.target.value)}
                  placeholder="Contoh: 10.200.1.50"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Interactive Map Coordinate Picker */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <MapCoordinatePicker
                  latitude={parseFloat(latitude) || -3.3308}
                  longitude={parseFloat(longitude) || 114.5560}
                  onChangeCoordinates={(lat, lng) => {
                    setLatitude(lat.toString());
                    setLongitude(lng.toString());
                  }}
                />

                {/* Coordinate text inputs */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-bold text-slate-600 uppercase text-[10px] tracking-wider mb-1">
                      Latitude Terpilih
                    </label>
                    <input
                      type="text"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      placeholder="Latitude (-3.3308)"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 uppercase text-[10px] tracking-wider mb-1">
                      Longitude Terpilih
                    </label>
                    <input
                      type="text"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      placeholder="Longitude (114.5560)"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-800"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Lokasi / Detail Site
                </label>
                <input
                  type="text"
                  value={lokasiDetail}
                  onChange={(e) => setLokasiDetail(e.target.value)}
                  placeholder="Contoh: Gedung Lantai 2, Jl. Barito Hilir No. 6"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowIpModal(false)}
                  className="px-3 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs"
                >
                  Simpan Node IP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Kategori */}
      {showKatModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-600" />
              Tambah Kategori IP Baru
            </h3>
            <form onSubmit={handleCreateKategori} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Kategori IP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={namaKat}
                  onChange={(e) => setNamaKat(e.target.value)}
                  placeholder="Contoh: Radio Link Wireless Backbone"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowKatModal(false)}
                  className="px-3 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs"
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
