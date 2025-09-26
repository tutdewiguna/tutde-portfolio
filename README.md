# TutDe Portfolio 
Portfolio web pribadi ini dibangun menggunakan Laravel + Vite, dan menampilkan karya-karya fotografi, videografi, desain grafis, serta blog.

## 📦 Fitur

- Halaman publik:
  - Beranda (Home)
  - Fotografi (Photography) — galeri foto, filter, lightbox detail
  - Videografi (Videography) — galeri video
  - Desain Grafis (Graphic Design)
  - Blog / Posting Artikel
- Dashboard admin:
  - CRUD untuk item fotografi, filter, gambar galeri
  - CRUD untuk artikel blog, sertifikat, pengalaman kerja, pendidikan, dsb.
- Editor konten (CKEditor atau editor lain) untuk formatting h2, quote, tabel, dan lainnya (boleh integrasi nanti)
- Upload dan manajemen gambar (cover + galeri) dengan storage publik
- Responsif & animasi sederhana (scroll reveal, zoom, lightbox)

## 🧰 Teknologi & Tools

- Backend: PHP (Laravel)
- Frontend: Blade, CSS / SCSS, JavaScript (module custom)
- Bundler / Assets: Vite
- Database: MySQL / SQLite (tergantung pengaturan lokal)
- Penyimpanan file: `storage` → gunakan `php artisan storage:link` agar bisa diakses publik
- Editor teks: CKEditor (opsional, kalau sudah di-integrasi nanti)

## 🚀 Setup & Instalasi

Berikut langkah-langkah untuk menjalankan proyek ini secara lokal:

1. Clone repo:
   ```bash
   git clone https://github.com/tutdewiguna/tutde-portfolio.git
   cd tutde-portfolio
