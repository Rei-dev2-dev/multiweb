"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Types
export interface User {
  id: number;
  nama: string;
  username: string;
  role: "admin" | "staff";
  avatar?: string;
}

export interface LaporanKategori {
  id: number;
  nama_kategori: string;
  deskripsi: string;
}

export interface Laporan {
  id: number;
  kategori_id: number;
  kategori_nama?: string;
  user_id: number;
  user_nama?: string;
  judul: string;
  deskripsi: string;
  tanggal: string;
  status: "Selesai" | "Dalam Proses" | "Pending Review";
  fotos: string[];
  created_at: string;
}

export interface IpKategori {
  id: number;
  nama_kategori: string;
}

export interface IpMonitoring {
  id: number;
  kategori_id: number;
  kategori_nama?: string;
  nama_ip: string;
  alamat_ip: string;
  latitude: number;
  longitude: number;
  status: "online" | "offline";
  last_ping?: string;
  response_time_ms?: number;
  lokasi_detail?: string;
}

export interface KategoriStock {
  id: number;
  nama_kategori: string;
}

export interface Barang {
  id: number;
  kategori_id: number;
  kategori_nama?: string;
  nama_barang: string;
  kode_barang: string;
  jumlah_stock: number;
  min_stock: number;
  satuan: string;
  foto: string;
}

export interface RiwayatStock {
  id: number;
  barang_id: number;
  barang_nama?: string;
  kode_barang?: string;
  user_id: number;
  user_nama?: string;
  jenis: "masuk" | "keluar";
  jumlah: number;
  keterangan: string;
  tanggal: string;
}

export interface PeminjamanBarang {
  id: number;
  barang_id: number;
  barang_nama?: string;
  kode_barang?: string;
  user_id: number;
  user_nama?: string;
  peminjam: string;
  divisi: string;
  jumlah: number;
  tanggal_pinjam: string;
  tanggal_kembali: string | null;
  status: "dipinjam" | "dikembalikan";
  catatan?: string;
}

interface DataContextType {
  currentUser: User;
  users: User[];
  // Laporan
  laporanList: Laporan[];
  laporanKategoriList: LaporanKategori[];
  addLaporan: (laporan: Omit<Laporan, "id" | "created_at">) => void;
  deleteLaporan: (id: number) => void;
  addLaporanKategori: (kat: Omit<LaporanKategori, "id">) => void;
  deleteLaporanKategori: (id: number) => void;
  // IP Monitoring
  ipList: IpMonitoring[];
  ipKategoriList: IpKategori[];
  addIp: (ip: Omit<IpMonitoring, "id" | "status">) => void;
  updateIp: (id: number, ip: Partial<IpMonitoring>) => void;
  deleteIp: (id: number) => void;
  addIpKategori: (kat: Omit<IpKategori, "id">) => void;
  deleteIpKategori: (id: number) => void;
  toggleIpStatus: (id: number) => void;
  pingAllIps: () => void;
  isAutoPingActive: boolean;
  setIsAutoPingActive: (active: boolean) => void;
  // Stock
  barangList: Barang[];
  stockKategoriList: KategoriStock[];
  riwayatStockList: RiwayatStock[];
  peminjamanList: PeminjamanBarang[];
  addBarang: (barang: Omit<Barang, "id">) => void;
  updateBarangStock: (barangId: number, jumlah: number, jenis: "masuk" | "keluar", keterangan: string) => void;
  addStockKategori: (kat: Omit<KategoriStock, "id">) => void;
  deleteStockKategori: (id: number) => void;
  addPeminjaman: (pinjam: Omit<PeminjamanBarang, "id" | "status" | "tanggal_kembali">) => void;
  returnPeminjaman: (id: number, tanggalKembali: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial Mock Data
const INITIAL_USERS: User[] = [
  { id: 1, nama: "Ahmad Rifai", username: "rifai", role: "admin", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
  { id: 2, nama: "Budi Santoso", username: "budi", role: "staff", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
  { id: 3, nama: "Siti Rahmah", username: "siti", role: "staff", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
];

const INITIAL_LAPORAN_KAT: LaporanKategori[] = [
  { id: 1, nama_kategori: "Maintenance Jaringan", deskripsi: "Perawatan router, switch, access point dan kabel fiber optic" },
  { id: 2, nama_kategori: "Instalasi Perangkat", deskripsi: "Pemasangan perangkat baru di lokasi site/kantor" },
  { id: 3, nama_kategori: "Troubleshooting Site", deskripsi: "Perbaikan kendala jaringan, server down, atau link putus" },
  { id: 4, nama_kategori: "Inspeksi Rutin", deskripsi: "Pemeriksaan berkala suhu perangkat, UPS, dan kelistrikan" },
];

const INITIAL_LAPORAN: Laporan[] = [
  {
    id: 1,
    kategori_id: 1,
    kategori_nama: "Maintenance Jaringan",
    user_id: 1,
    user_nama: "Ahmad Rifai",
    judul: "Perapian Patch Cord & Rack Server Hub Kayutangi",
    deskripsi: "Telah dilakukan perapian kabel UTP Cat6, penggantian 2 patch cord FO yang bengkok, dan labeling ulang switch port 1-24 di POP Kayutangi Banjarmasin Utara.",
    tanggal: "2026-09-10",
    status: "Selesai",
    fotos: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80"
    ],
    created_at: "2026-09-10 14:32"
  },
  {
    id: 2,
    kategori_id: 3,
    kategori_nama: "Troubleshooting Site",
    user_id: 2,
    user_nama: "Budi Santoso",
    judul: "Penanganan Link Putus Radio Wireless Tower Siring 0 KM",
    deskripsi: "Link wireless mengalami degradasi signal dBm akibat antena bergeser terpaan angin kencang. Alignment ulang berhasil menaikkan sinyal ke -54 dBm, CCQ 98%.",
    tanggal: "2026-09-09",
    status: "Selesai",
    fotos: [
      "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800&auto=format&fit=crop&q=80"
    ],
    created_at: "2026-09-09 11:15"
  },
  {
    id: 3,
    kategori_id: 2,
    kategori_nama: "Instalasi Perangkat",
    user_id: 3,
    user_nama: "Siti Rahmah",
    judul: "Pemasangan Mikrotik CCR & Switch PoE di Kantor Cabang Banjarbaru",
    deskripsi: "Instalasi 1 unit Mikrotik CCR2004 dan 1 unit Switch Gigabit PoE 24 port. Konfigurasi VLAN 100 (Staff) dan VLAN 200 (Guest Hotspot) berjalan normal.",
    tanggal: "2026-09-08",
    status: "Dalam Proses",
    fotos: [
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&auto=format&fit=crop&q=80"
    ],
    created_at: "2026-09-08 16:45"
  }
];

const INITIAL_IP_KAT: IpKategori[] = [
  { id: 1, nama_kategori: "Core Switch & Yard POP" },
  { id: 2, nama_kategori: "AP Wireless Dermaga & RTG" },
  { id: 3, nama_kategori: "Server Gate & Sistem TOS" },
  { id: 4, nama_kategori: "CCTV & NVR Area Pelabuhan" },
  { id: 5, nama_kategori: "Radio Link Backbone Trisakti" },
];

const INITIAL_IPS: IpMonitoring[] = [
  {
    id: 1,
    kategori_id: 1,
    kategori_nama: "Core Switch & Yard POP",
    nama_ip: "Core-Switch-TPKB-Main",
    alamat_ip: "10.210.1.1",
    latitude: -3.3308,
    longitude: 114.5558,
    status: "online",
    last_ping: "Baru saja",
    response_time_ms: 1,
    lokasi_detail: "Gedung Kantor Utama TPKB Pelindo Lt. 2"
  },
  {
    id: 2,
    kategori_id: 3,
    kategori_nama: "Server Gate & Sistem TOS",
    nama_ip: "Server-TOS-Gate-In-Out",
    alamat_ip: "10.210.1.10",
    latitude: -3.3298,
    longitude: 114.5572,
    status: "online",
    last_ping: "Baru saja",
    response_time_ms: 2,
    lokasi_detail: "Pos Gate In/Out Truk Kontainer TPKB"
  },
  {
    id: 3,
    kategori_id: 2,
    kategori_nama: "AP Wireless Dermaga & RTG",
    nama_ip: "AP-Wireless-Dermaga-01",
    alamat_ip: "10.210.2.15",
    latitude: -3.3325,
    longitude: 114.5540,
    status: "online",
    last_ping: "Baru saja",
    response_time_ms: 4,
    lokasi_detail: "Dermaga Tambat Kapal Petikemas No. 1-3"
  },
  {
    id: 4,
    kategori_id: 4,
    kategori_nama: "CCTV & NVR Area Pelabuhan",
    nama_ip: "NVR-CCTV-Container-Yard",
    alamat_ip: "192.168.10.50",
    latitude: -3.3315,
    longitude: 114.5550,
    status: "offline",
    last_ping: "2 menit lalu (Request Timeout)",
    response_time_ms: 0,
    lokasi_detail: "Tower Monitor Lapangan Penumpukan Blok B"
  },
  {
    id: 5,
    kategori_id: 2,
    kategori_nama: "AP Wireless Dermaga & RTG",
    nama_ip: "AP-RTG-Crane-Wireless-04",
    alamat_ip: "10.210.2.24",
    latitude: -3.3318,
    longitude: 114.5565,
    status: "online",
    last_ping: "Baru saja",
    response_time_ms: 6,
    lokasi_detail: "Mobile Unit Rubber Tyred Gantry (RTG 04)"
  },
  {
    id: 6,
    kategori_id: 5,
    kategori_nama: "Radio Link Backbone Trisakti",
    nama_ip: "Radio-Link-Trisakti-POP-Kayutangi",
    alamat_ip: "10.210.5.1",
    latitude: -3.3285,
    longitude: 114.5590,
    status: "online",
    last_ping: "Baru saja",
    response_time_ms: 3,
    lokasi_detail: "Tower Antena Utama Pelabuhan Trisakti"
  },
  {
    id: 7,
    kategori_id: 4,
    kategori_nama: "CCTV & NVR Area Pelabuhan",
    nama_ip: "CCTV-Thermal-Gate-Barito",
    alamat_ip: "192.168.10.88",
    latitude: -3.3292,
    longitude: 114.5585,
    status: "offline",
    last_ping: "1 menit lalu (Packet Loss 100%)",
    response_time_ms: 0,
    lokasi_detail: "Pintu Masuk Truk Jl. Barito Hilir No. 6"
  },
  {
    id: 8,
    kategori_id: 1,
    kategori_nama: "Core Switch & Yard POP",
    nama_ip: "Switch-Distribusi-Workshop-TPKB",
    alamat_ip: "10.210.1.20",
    latitude: -3.3332,
    longitude: 114.5560,
    status: "online",
    last_ping: "Baru saja",
    response_time_ms: 2,
    lokasi_detail: "Gedung Workshop Maintenance Alat TPKB"
  }
];


const INITIAL_STOCK_KAT: KategoriStock[] = [
  { id: 1, nama_kategori: "Perangkat Jaringan (Networking)" },
  { id: 2, nama_kategori: "Kabel & Aksesoris FO" },
  { id: 3, nama_kategori: "Konektor & Crimping" },
  { id: 4, nama_kategori: "Peralatan Kerja & Tools" },
  { id: 5, nama_kategori: "Power & UPS" },
];

const INITIAL_BARANG: Barang[] = [
  {
    id: 1,
    kategori_id: 1,
    kategori_nama: "Perangkat Jaringan (Networking)",
    nama_barang: "Mikrotik RouterBoard RB4011iGS+RM",
    kode_barang: "NET-RB4011",
    jumlah_stock: 4,
    min_stock: 2,
    satuan: "Unit",
    foto: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    kategori_id: 1,
    kategori_nama: "Perangkat Jaringan (Networking)",
    nama_barang: "Switch Ubiquiti UniFi Pro 24 PoE Gen2",
    kode_barang: "NET-USW24P",
    jumlah_stock: 2,
    min_stock: 3,
    satuan: "Unit",
    foto: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    kategori_id: 2,
    kategori_nama: "Kabel & Aksesoris FO",
    nama_barang: "Kabel Fiber Optic Dropcore 1 Core 3 Seling (1000m)",
    kode_barang: "FO-DC1C1K",
    jumlah_stock: 8,
    min_stock: 5,
    satuan: "Roll",
    foto: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    kategori_id: 3,
    kategori_nama: "Konektor & Crimping",
    nama_barang: "Fast Connector Fiber Optic SC/UPC (Isi 100)",
    kode_barang: "FO-SCUPC-100",
    jumlah_stock: 15,
    min_stock: 5,
    satuan: "Box",
    foto: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    kategori_id: 4,
    kategori_nama: "Peralatan Kerja & Tools",
    nama_barang: "Fusion Splicer Fiber Optic Signalfire AI-9",
    kode_barang: "TOOL-AI9",
    jumlah_stock: 2,
    min_stock: 1,
    satuan: "Unit",
    foto: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: 6,
    kategori_id: 4,
    kategori_nama: "Peralatan Kerja & Tools",
    nama_barang: "Optical Time Domain Reflectometer (OTDR) Mini",
    kode_barang: "TOOL-OTDR-M",
    jumlah_stock: 1,
    min_stock: 2,
    satuan: "Unit",
    foto: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: 7,
    kategori_id: 5,
    kategori_nama: "Power & UPS",
    nama_barang: "UPS APC Smart-UPS RT 2000VA Online 230V",
    kode_barang: "PWR-APC2K",
    jumlah_stock: 1,
    min_stock: 2,
    satuan: "Unit",
    foto: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=300&auto=format&fit=crop&q=80"
  }
];

const INITIAL_RIWAYAT_STOCK: RiwayatStock[] = [
  {
    id: 1,
    barang_id: 1,
    barang_nama: "Mikrotik RouterBoard RB4011iGS+RM",
    kode_barang: "NET-RB4011",
    user_id: 1,
    user_nama: "Ahmad Rifai",
    jenis: "masuk",
    jumlah: 5,
    keterangan: "Penerimaan PO Batch #2026/09",
    tanggal: "2026-09-01 09:30"
  },
  {
    id: 2,
    barang_id: 1,
    barang_nama: "Mikrotik RouterBoard RB4011iGS+RM",
    kode_barang: "NET-RB4011",
    user_id: 2,
    user_nama: "Budi Santoso",
    jenis: "keluar",
    jumlah: 1,
    keterangan: "Pemasangan Site Baru Banjarbaru",
    tanggal: "2026-09-08 14:00"
  },
  {
    id: 3,
    barang_id: 3,
    barang_nama: "Kabel Fiber Optic Dropcore 1 Core 3 Seling (1000m)",
    kode_barang: "FO-DC1C1K",
    user_id: 3,
    user_nama: "Siti Rahmah",
    jenis: "keluar",
    jumlah: 2,
    keterangan: "Penarikan jalur baru Pelabuhan Trisakti",
    tanggal: "2026-09-07 10:15"
  },
  {
    id: 4,
    barang_id: 4,
    barang_nama: "Fast Connector Fiber Optic SC/UPC (Isi 100)",
    kode_barang: "FO-SCUPC-100",
    user_id: 1,
    user_nama: "Ahmad Rifai",
    jenis: "masuk",
    jumlah: 20,
    keterangan: "Restock gudang pusat",
    tanggal: "2026-09-05 11:20"
  }
];

const INITIAL_PEMINJAMAN: PeminjamanBarang[] = [
  {
    id: 1,
    barang_id: 5,
    barang_nama: "Fusion Splicer Fiber Optic Signalfire AI-9",
    kode_barang: "TOOL-AI9",
    user_id: 2,
    user_nama: "Budi Santoso",
    peminjam: "Budi Santoso",
    divisi: "Field Engineer",
    jumlah: 1,
    tanggal_pinjam: "2026-09-09",
    tanggal_kembali: null,
    status: "dipinjam",
    catatan: "Splicing core kabel putus di Km 6"
  },
  {
    id: 2,
    barang_id: 6,
    barang_nama: "Optical Time Domain Reflectometer (OTDR) Mini",
    kode_barang: "TOOL-OTDR-M",
    user_id: 3,
    user_nama: "Siti Rahmah",
    peminjam: "Siti Rahmah",
    divisi: "NOC Team",
    jumlah: 1,
    tanggal_pinjam: "2026-09-06",
    tanggal_kembali: "2026-09-07",
    status: "dikembalikan",
    catatan: "Ukur redaman kabel FO Martapura"
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser] = useState<User>(INITIAL_USERS[0]);
  const [users] = useState<User[]>(INITIAL_USERS);

  // Laporan
  const [laporanKategoriList, setLaporanKategoriList] = useState<LaporanKategori[]>(INITIAL_LAPORAN_KAT);
  const [laporanList, setLaporanList] = useState<Laporan[]>(INITIAL_LAPORAN);

  // IP Monitoring
  const [ipKategoriList, setIpKategoriList] = useState<IpKategori[]>(INITIAL_IP_KAT);
  const [ipList, setIpList] = useState<IpMonitoring[]>(INITIAL_IPS);
  const [isAutoPingActive, setIsAutoPingActive] = useState<boolean>(true);

  // Stock
  const [stockKategoriList, setStockKategoriList] = useState<KategoriStock[]>(INITIAL_STOCK_KAT);
  const [barangList, setBarangList] = useState<Barang[]>(INITIAL_BARANG);
  const [riwayatStockList, setRiwayatStockList] = useState<RiwayatStock[]>(INITIAL_RIWAYAT_STOCK);
  const [peminjamanList, setPeminjamanList] = useState<PeminjamanBarang[]>(INITIAL_PEMINJAMAN);

  // Auto Ping Simulation Effect (Polling every 12 seconds)
  useEffect(() => {
    if (!isAutoPingActive) return;

    const interval = setInterval(() => {
      setIpList((prev) =>
        prev.map((ip) => {
          const isProblematic = ip.id === 4 || ip.id === 7;
          const status = isProblematic ? (Math.random() > 0.85 ? "online" : "offline") : (Math.random() > 0.05 ? "online" : "offline");
          const response_time_ms = status === "online" ? Math.floor(Math.random() * 15) + 2 : 0;
          return {
            ...ip,
            status,
            response_time_ms,
            last_ping: status === "online" ? "Baru saja" : "Timeout (100% loss)"
          };
        })
      );
    }, 12000);

    return () => clearInterval(interval);
  }, [isAutoPingActive]);

  // Laporan actions
  const addLaporan = (newLaporan: Omit<Laporan, "id" | "created_at">) => {
    const kat = laporanKategoriList.find((k) => k.id === newLaporan.kategori_id);
    const item: Laporan = {
      ...newLaporan,
      id: Date.now(),
      kategori_nama: kat?.nama_kategori || "Umum",
      user_nama: currentUser.nama,
      created_at: new Date().toISOString().replace("T", " ").substring(0, 16)
    };
    setLaporanList([item, ...laporanList]);
  };

  const deleteLaporan = (id: number) => {
    setLaporanList(laporanList.filter((l) => l.id !== id));
  };

  const addLaporanKategori = (kat: Omit<LaporanKategori, "id">) => {
    const item: LaporanKategori = { ...kat, id: Date.now() };
    setLaporanKategoriList([...laporanKategoriList, item]);
  };

  const deleteLaporanKategori = (id: number) => {
    setLaporanKategoriList(laporanKategoriList.filter((k) => k.id !== id));
  };

  // IP actions
  const addIp = (newIp: Omit<IpMonitoring, "id" | "status">) => {
    const kat = ipKategoriList.find((k) => k.id === newIp.kategori_id);
    const item: IpMonitoring = {
      ...newIp,
      id: Date.now(),
      kategori_nama: kat?.nama_kategori || "Lainnya",
      status: "online",
      last_ping: "Baru saja",
      response_time_ms: Math.floor(Math.random() * 10) + 2
    };
    setIpList([item, ...ipList]);
  };

  const updateIp = (id: number, updated: Partial<IpMonitoring>) => {
    setIpList(
      ipList.map((ip) => {
        if (ip.id === id) {
          const kat = updated.kategori_id ? ipKategoriList.find((k) => k.id === updated.kategori_id) : undefined;
          return {
            ...ip,
            ...updated,
            kategori_nama: kat ? kat.nama_kategori : ip.kategori_nama
          };
        }
        return ip;
      })
    );
  };

  const deleteIp = (id: number) => {
    setIpList(ipList.filter((ip) => ip.id !== id));
  };

  const addIpKategori = (kat: Omit<IpKategori, "id">) => {
    setIpKategoriList([...ipKategoriList, { ...kat, id: Date.now() }]);
  };

  const deleteIpKategori = (id: number) => {
    setIpKategoriList(ipKategoriList.filter((k) => k.id !== id));
  };

  const toggleIpStatus = (id: number) => {
    setIpList(
      ipList.map((ip) => {
        if (ip.id === id) {
          const newStatus = ip.status === "online" ? "offline" : "online";
          return {
            ...ip,
            status: newStatus,
            response_time_ms: newStatus === "online" ? 5 : 0,
            last_ping: newStatus === "online" ? "Baru saja" : "Manual Offline"
          };
        }
        return ip;
      })
    );
  };

  const pingAllIps = () => {
    setIpList(
      ipList.map((ip) => {
        const isOffline = Math.random() < 0.2;
        return {
          ...ip,
          status: isOffline ? "offline" : "online",
          response_time_ms: isOffline ? 0 : Math.floor(Math.random() * 20) + 2,
          last_ping: isOffline ? "Timeout" : "Baru saja"
        };
      })
    );
  };

  // Stock actions
  const addBarang = (barang: Omit<Barang, "id">) => {
    const kat = stockKategoriList.find((k) => k.id === barang.kategori_id);
    const item: Barang = {
      ...barang,
      id: Date.now(),
      kategori_nama: kat?.nama_kategori || "Umum"
    };
    setBarangList([item, ...barangList]);

    const riwayat: RiwayatStock = {
      id: Date.now(),
      barang_id: item.id,
      barang_nama: item.nama_barang,
      kode_barang: item.kode_barang,
      user_id: currentUser.id,
      user_nama: currentUser.nama,
      jenis: "masuk",
      jumlah: item.jumlah_stock,
      keterangan: "Stok Awal Input Barang Baru",
      tanggal: new Date().toISOString().replace("T", " ").substring(0, 16)
    };
    setRiwayatStockList([riwayat, ...riwayatStockList]);
  };

  const updateBarangStock = (barangId: number, jumlah: number, jenis: "masuk" | "keluar", keterangan: string) => {
    const target = barangList.find((b) => b.id === barangId);
    if (!target) return;

    const newStock = jenis === "masuk" ? target.jumlah_stock + jumlah : Math.max(0, target.jumlah_stock - jumlah);

    setBarangList(
      barangList.map((b) => (b.id === barangId ? { ...b, jumlah_stock: newStock } : b))
    );

    const riwayat: RiwayatStock = {
      id: Date.now(),
      barang_id: target.id,
      barang_nama: target.nama_barang,
      kode_barang: target.kode_barang,
      user_id: currentUser.id,
      user_nama: currentUser.nama,
      jenis,
      jumlah,
      keterangan,
      tanggal: new Date().toISOString().replace("T", " ").substring(0, 16)
    };
    setRiwayatStockList([riwayat, ...riwayatStockList]);
  };

  const addStockKategori = (kat: Omit<KategoriStock, "id">) => {
    setStockKategoriList([...stockKategoriList, { ...kat, id: Date.now() }]);
  };

  const deleteStockKategori = (id: number) => {
    setStockKategoriList(stockKategoriList.filter((k) => k.id !== id));
  };

  const addPeminjaman = (pinjam: Omit<PeminjamanBarang, "id" | "status" | "tanggal_kembali">) => {
    const barang = barangList.find((b) => b.id === pinjam.barang_id);
    const item: PeminjamanBarang = {
      ...pinjam,
      id: Date.now(),
      barang_nama: barang?.nama_barang || "Barang",
      kode_barang: barang?.kode_barang || "-",
      status: "dipinjam",
      tanggal_kembali: null
    };
    setPeminjamanList([item, ...peminjamanList]);

    if (barang) {
      updateBarangStock(barang.id, pinjam.jumlah, "keluar", `Peminjaman oleh ${pinjam.peminjam} (${pinjam.divisi})`);
    }
  };

  const returnPeminjaman = (id: number, tanggalKembali: string) => {
    const target = peminjamanList.find((p) => p.id === id);
    if (!target) return;

    setPeminjamanList(
      peminjamanList.map((p) =>
        p.id === id ? { ...p, status: "dikembalikan", tanggal_kembali: tanggalKembali } : p
      )
    );

    if (target.barang_id) {
      updateBarangStock(target.barang_id, target.jumlah, "masuk", `Pengembalian pinjaman dari ${target.peminjam}`);
    }
  };

  return (
    <DataContext.Provider
      value={{
        currentUser,
        users,
        laporanList,
        laporanKategoriList,
        addLaporan,
        deleteLaporan,
        addLaporanKategori,
        deleteLaporanKategori,
        ipList,
        ipKategoriList,
        addIp,
        updateIp,
        deleteIp,
        addIpKategori,
        deleteIpKategori,
        toggleIpStatus,
        pingAllIps,
        isAutoPingActive,
        setIsAutoPingActive,
        barangList,
        stockKategoriList,
        riwayatStockList,
        peminjamanList,
        addBarang,
        updateBarangStock,
        addStockKategori,
        deleteStockKategori,
        addPeminjaman,
        returnPeminjaman
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
