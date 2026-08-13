# Product Requirements Document (PRD)
**Project Name:** Padi Sharpening Center (Web Compro, E-Commerce, & Management System)

## Project Goal
**Pertanyaan:** Apa yang sebenarnya ingin dibangun?
**Jawab:** Membangun website Company Profile terintegrasi dengan E-Commerce dan sistem reservasi pelatihan untuk Padi Sharpening Center. Website harus super ringan, memuat animasi 3D secara mulus tanpa mengorbankan performa (Fast Origin Transfer), memiliki Dashboard Admin mandiri untuk CRUD, dan dioptimasi penuh secara arsitektur untuk SEO Lokal (Surabaya) serta terbaca sempurna oleh mesin AI.

## Target User
**Pertanyaan:** Siapa yang akan menggunakan product ini?
**Jawab:** 
1. Pelanggan individu (rumah tangga/hobiis).
2. Klien B2B (bisnis kuliner, RPH/jagal, industri).
3. Peserta pelatihan/training.
4. Administrator/Owner.
5. Search Engine Bot (Googlebot) & AI Crawler.

## Problem Statement
**Pertanyaan:** Masalah apa yang diselesaikan?
**Jawab:** Saat ini, informasi layanan asah, penjualan alat tajam, dan pendaftaran pelatihan masih terpisah atau manual. Dibutuhkan satu platform digital yang terlihat sangat profesional (dengan elemen 3D), ringan, mendukung multibahasa, dikelola penuh dari dashboard admin, dan memastikan bisnis muncul di peringkat pertama Google Maps/Search serta direkomendasikan oleh AI saat user mencari jasa asah pisau.

## Main Features
**Pertanyaan:** Fitur apa yang wajib ada?
**Jawab:**
1. **Halaman Publik (Frontend):** Home, Tentang Kami, Hubungi Kami, Portofolio, Layanan.
2. **Katalog & E-Commerce:** Jual alat asah, pisau sembelih/daging, dan aksesoris (sarung pisau, grafir).
3. **Pengadaan & Reservasi:** Sistem pengadaan dan Registrasi Training.
4. **Dashboard Admin (CMS):** CRUD untuk semua konten frontend, manajemen stok, dan pesanan.
5. **Smart UI/UX:** Tema *Dark/Light mode* dan Multibahasa (Inggris/Indonesia) sinkron otomatis dengan *device*.
6. **Advanced SEO & AI Readiness (Wajib):** 
   - Meta tags dinamis per halaman.
   - Geo-Tagging hardcoded di *head* untuk target Surabaya/Jawa Timur.
   - Implementasi JSON-LD (Schema.org) untuk `LocalBusiness`, `Product`, dan `Course` agar data terstruktur dan mudah diserap mesin AI.

## Design & Tech Req
**Pertanyaan:** Apa saja requirement technical yang dibutuhkan?
**Jawab:**
- **Frontend & Backend:** Next.js (SSR & SSG untuk SEO super cepat).
- **Styling & UI:** Tailwind CSS, Shadcn UI (Clean, No Slop).
- **Animasi 3D:** Three.js / React Three Fiber (dioptimasi, objek *low-poly*).
- **Database & ORM:** MySQL di IDWebHost + Prisma/Drizzle ORM (wajib *Connection Pooling*).
- **SEO & Meta Handling:** Menggunakan fitur `generateMetadata` dari Next.js App Router.
- **Deployment:** Vercel / Cloudflare Pages.

## Success Criteria
**Pertanyaan:** Bare minimum apa yang wajib diselesaikan?
**Jawab:**
- Load time kurang dari 2 detik dengan animasi 3D berjalan lancar.
- Seluruh fungsi CRUD berjalan 100% tanpa *bug*.
- Data metadata, Geo-Tags, dan JSON-LD tervalidasi sempurna di Google Rich Results Test.