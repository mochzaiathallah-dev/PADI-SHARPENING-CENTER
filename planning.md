# Project Planning & System Design
**Project Name:** Padi Sharpening Center (Web Compro, E-Commerce, & Management System)

## 1. System Requirements Specification (SRS)
**a. Validasi & SEO Rules:**
- Title tag maksimal 60 karakter, Description maksimal 160 karakter.
- Wajib menginjeksi properti SEO & Geo-Tags di *layout* utama Next.js:
  - `Title`: Padi Sharpening Center - Jasa Asah Pisau Profesional & Alat Sembelih
  - `Description`: Pusat layanan asah pisau profesional, penjualan alat tajam, dan pelatihan di Surabaya. Kembalikan ketajaman bilah Anda dengan presisi tinggi bersama Padi Solutions.
  - `Keywords`: Jasa asah pisau Surabaya, Asah pisau profesional, Jual pisau sembelih, Pelatihan asah pisau, Batu asah, Padi Sharpening Center
  - `geo.region`: 'ID-JI'
  - `geo.placename`: 'Surabaya'
  - `geo.position`: '-7.3193;112.7990' (Kordinat area Rungkut/Medokan Ayu)
  - `ICBM`: '-7.3193, 112.7990'

**b. Behavior:**
- Animasi 3D hanya dirender saat *viewport* terlihat.
- *Image optimization* menggunakan Next Image (WebP auto-compress, menjaga kualitas logo "Gemini_Generated_Image_vygb5wvygb5wvygb-clean (1).jpg" dan aset lainnya tetap HD).

**c. Aturan Aplikasi:**
- Semua perubahan produk di *frontend* langsung memperbarui *Schema Markup* (`Product` schema) secara otomatis dari database untuk sinkronisasi harga/stok di Google Search.

## 2. System Design Document (SDD)
**a. Arsitektur SEO & AI:**
- SSR (Server-Side Rendering) wajib aktif pada halaman produk dan layanan agar AI dan Googlebot langsung membaca HTML final tanpa perlu merender JavaScript terlebih dahulu.
- **Sitemap & Robots.txt:** Dibuat dinamis `sitemap.xml` yang otomatis mengindeks URL produk atau layanan baru.

**b. Database (MySQL IDWebHost):**
- Tabel Utama: `Users`, `Products`, `Categories`, `Services`, `Trainings`, `Orders`, `Portfolios`. (Koneksi dibatasi *Connection Pooling* untuk keamanan *shared hosting*).

## 3. UI/UX Flow
1. **Landing Page:** Hero Section 3D -> Layanan Unggulan -> Katalog Singkat -> Footer lengkap dengan informasi NAP (Name, Address, Phone) untuk optimasi Local SEO.
2. **Navigasi Publik:** Katalog Toko -> Detail Produk (dengan UI *breadcrumbs* untuk SEO) -> Checkout.
3. **Admin Dashboard:** Halaman CMS untuk mengontrol produk dan juga memiliki kolom *input* khusus untuk kustomisasi *Meta Title* dan *Meta Description* per produk/layanan.

## 4. Task Breakdown (Sprints)
- **Sprint 1 (Setup, DB & SEO Base):** Setup Next.js, Tailwind, Shadcn. Konfigurasi Prisma/MySQL. Setup struktur metadata global, JSON-LD `LocalBusiness`, dan Geo-tags.
- **Sprint 2 (Frontend Compro & 3D):** Desain UI *Home*, *About*, *Layanan*. Integrasi 3D model.
- **Sprint 3 (E-Commerce & Training):** UI halaman katalog toko, penyewaan, reservasi training dengan integrasi *Schema Markup* dinamis per halaman.
- **Sprint 4 (Admin Dashboard):** UI Admin dan API untuk CRUD data.
- **Sprint 5 (Integration & Optimization):** *Lighthouse testing* (harus skor 90+ untuk SEO & Performance), pengujian kompresi gambar, dan pengecekan *fast origin transfer*.
- **Sprint 6 (Deployment):** Deploy ke Vercel/Cloudflare, submit XML Sitemap ke Google Search Console.