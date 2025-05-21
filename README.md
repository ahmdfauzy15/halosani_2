# HaloSani

HaloSani adalah sebuah aplikasi web edukasi kesehatan mental berbasis Laravel (RESTful API) dan React JS (Frontend), yang dikembangkan sebagai Tugas Akhir oleh:

- **Nama**: Achmad Fauzy  
- **Universitas**: Universitas Trisakti  
- **NIM**: 064002100031

## 📌 Deskripsi

HaloSani adalah _upgrade_ dari versi sebelumnya, dengan peningkatan besar pada fitur **CMS admin**, interaksi user, dan sistem autentikasi yang lebih aman. Aplikasi ini bertujuan untuk menjadi media edukasi digital mengenai kesehatan mental yang modern, informatif, dan interaktif.

---

## 🚀 Teknologi yang Digunakan

- **Backend**: Laravel (REST API)
- **Frontend**: React JS + Tailwind CSS
- **Database**: MySQL
- **SMTP**: Untuk pengiriman OTP dan Forgot Password

---

## 🔐 Role dan Fitur Utama

### 👨‍💼 Admin Panel

#### ✅ Login Admin
- Login menggunakan `username` dan `password` (data disimpan di database).
- Tersedia 3 akun admin default.
- Login melalui halaman yang sama dengan user (login/register page).

#### 🧭 Dashboard Admin
- Side bar navigasi untuk CMS dan fitur admin lainnya.
- Info statistik pengunjung bulanan (dengan grafik).
- Fitur CRUD lengkap:

| Fitur CMS                   | Deskripsi |
|----------------------------|-----------|
| Event Carousel             | title, image, link, deskripsi singkat, tanggal event |
| Tentang Web HaloSani       | title, image, deskripsi, kontak, alamat |
| Blog Kesehatan Mental      | title, image, isi blog, waktu pembuatan |
| Video YouTube              | title, link YouTube, deskripsi singkat |
| Chat Room                  | komunitas chat |
| Ebook                      | title, link ebook, image, deskripsi singkat |
| Notifikasi ke User         | Kirim notifikasi via email (SMTP) |
| Feedback User              | Lihat feedback yang dikirim user |

#### 🆕 Manajemen Admin
- Admin dapat membuat admin lain (CRUD admin).

---

### 👤 User Panel

#### ✅ Autentikasi
- **Register** dengan data:
  - nama, email, jenis kelamin, usia, alamat, password
  - OTP dikirim ke email sebelum bisa login
- **Login** dengan email dan password
- **Forgot Password** dikirim via SMTP ke email user
- **Logout**

#### 🏠 Dashboard User
- Menampilkan:

| Fitur Konten               | Deskripsi |
|----------------------------|-----------|
| Event Carousel             | Lihat info event terbaru |
| Tentang Web                | Informasi tentang HaloSani |
| Chat Room Komunitas        | Forum diskusi interaktif |
| Blog Kesehatan Mental      | Artikel edukasi mental health |
| Video YouTube              | Video edukatif seputar kesehatan mental |
| Ebook                      | Kumpulan ebook yang dapat diakses user |
| Kirim Feedback             | User dapat memberikan kritik/saran |

---

## ⚙️ Cara Install

### 1. Clone Repository
```bash
git clone https://github.com/username/halosani.git
cd halosani


cd backend-laravel
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve


cd ../frontend-react
npm install
npm run dev

