# Panduan Menjalankan Project - Padi Sharpening Center

Berikut adalah panduan lengkap cara mengoperasikan dan menjalankan website **Padi Sharpening Center** di lingkungan lokal Anda.

---

## 1. Prasyarat Sistem
Pastikan perangkat Anda sudah menginstal:
*   **Node.js** (Rekomendasi versi v18 atau v20+)
*   **Laragon** (Dengan MySQL/MariaDB aktif)

---

## 2. Konfigurasi Database (Laragon)
1.  Buka aplikasi **Laragon** di komputer Anda.
2.  Klik tombol **Start All** untuk mengaktifkan Apache dan MySQL.
3.  Konfigurasi koneksi MySQL di file `.env` di root folder:
    *   **Host/IP:** `127.0.0.1` (Port `3306`)
    *   **User:** `root`
    *   **Password:** *(Kosong / Tanpa Password)*
    *   **Database Name:** `padi_sharpening_center`
4.  Secara otomatis, Prisma akan membuat database tersebut jika belum tersedia saat sinkronisasi skema dijalankan.

---

## 3. Perintah Terminal untuk Menjalankan Project

Jalankan perintah berikut di dalam terminal root folder project (`d:\Padi Sharpening Center`):

### A. Instalasi Dependencies (Pertama kali running)
```bash
npm install
```

### B. Sinkronisasi Skema Database & Prisma Client
Jika Anda melakukan perubahan model database atau baru pertama kali setup database di Laragon:
```bash
npx prisma db push
```
*Perintah ini akan secara otomatis memetakan skema Prisma ke database MySQL lokal Anda.*

### C. Menjalankan Server Pengembangan (Development Mode)
Untuk menjalankan server lokal dengan fitur live-reload (HMR) ketika ada perubahan kode:
```bash
npm run dev
```
*Server akan berjalan secara default di alamat: [http://localhost:3000](http://localhost:3000)*

### D. Menjalankan Server Produksi (Production Mode)
Untuk menguji performa penuh versi build produksi yang super cepat:
```bash
# 1. Build berkas Next.js
npm run build

# 2. Jalankan server produksi
npm run start
```

---

## 4. Daftar Lengkap Link URL Halaman Web

### Halaman Publik (Frontend)
*   **Beranda (Home):** [http://localhost:3000/](http://localhost:3000/)
*   **Tentang Kami (About Us):** [http://localhost:3000/about](http://localhost:3000/about)
*   **Layanan Jasa (Services):** [http://localhost:3000/services](http://localhost:3000/services)
*   **Portofolio:** [http://localhost:3000/portfolio](http://localhost:3000/portfolio)
*   **Katalog Toko (Catalog):** [http://localhost:3000/catalog](http://localhost:3000/catalog)
*   **Hubungi Kami (Contact):** [http://localhost:3000/contact](http://localhost:3000/contact)
*   **Kelas Training:** [http://localhost:3000/training](http://localhost:3000/training)

### Dashboard Admin (Backend/CMS)
*   **Dashboard Utama:** [http://localhost:3000/admin](http://localhost:3000/admin) *(Saat ini dapat diakses langsung tanpa login karena berfokus pada integrasi CRUD Sprints)*
*   **Kelola Produk:** [http://localhost:3000/admin/produk](http://localhost:3000/admin/produk) *(Dilengkapi fitur Google Auto-Translate)*
*   **Kelola Layanan:** [http://localhost:3000/admin/layanan](http://localhost:3000/admin/layanan) *(Dilengkapi fitur Google Auto-Translate)*
*   **Kelola Training:** [http://localhost:3000/admin/training](http://localhost:3000/admin/training) *(Dilengkapi fitur Google Auto-Translate)*
*   **Pengaturan Web (SiteSettings):** [http://localhost:3000/admin/pengaturan](http://localhost:3000/admin/pengaturan) *(Pengaturan logo, teks hero, dan deskripsi)*
*   **Analitik Kunjungan:** [http://localhost:3000/admin/analitik](http://localhost:3000/admin/analitik) *(Grafik trafik dinamis & perangkat)*
*   **Audit Log:** [http://localhost:3000/admin/log-aktivitas](http://localhost:3000/admin/log-aktivitas) *(Histori CRUD Admin & IP Address)*
