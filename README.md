# MountainTicket-VibeCoding
Sistem Pemesanan Tiket Pendakian – Backend API

Laporan Praktikum Pemrograman Web

Deskripsi

Backend ini dibuat untuk sistem pemesanan tiket pendakian gunung dengan fitur:

Registrasi pengguna

Login + JWT Authentication

Upload KTP pengguna

Pemesanan tiket pendakian

Pendaki tambahan + upload KTP masing-masing

Menyediakan endpoint untuk mengambil file identitas

Menyimpan data user dan tiket dengan MongoDB

Teknologi: Node.js, Express, MongoDB, Multer, JWT.

Struktur Folder

backend/
• models/
  User.js
  Ticket.js
• routes/
  auth.js
  ticket.js
• uploads/
  id/
  identitas/
• server.js
• package.json
• README.md

Instalasi

Clone repository
git clone https://github.com/username/project-pendakian.git

cd project-pendakian

Install dependencies
npm install

Pastikan MongoDB berjalan
Database default:
mongodb://127.0.0.1:27017/pendakian_db

Jalankan server
npm run dev

Server berjalan di: http://localhost:5000

API Endpoint
1. Autentikasi
Register

POST /auth/register
Body JSON:
{
"name": "Budi",
"email": "budi@gmail.com
",
"password": "123456",
"tanggalLahir": "2003-01-10",
"alamat": "Jakarta",
"kelamin": "L"
}

Login

POST /auth/login
Body JSON:
{
"email": "budi@gmail.com
",
"password": "123456"
}

Response berhasil: token JWT + data user.

2. Tiket Pendakian
Buat Tiket

POST /ticket/create
Headers: Authorization: Bearer <token>
Body type: multipart/form-data

Field:
• jumlahPendaki
• tanggalPendakian
• identityImage (file KTP pemesan)
• pendakiLain (string JSON)

Contoh pendakiLain:
[
{
"name": "Andi",
"usia": 21,
"tanggalLahir": "2004-10-02",
"alamat": "Bandung",
"kelamin": "L"
}
]

pendakiLain juga bisa diikuti file KTP masing-masing.

Mengambil File Identitas

GET /ticket/uploads/identitas/:filename

Model Database
User Model

• name
• email
• password
• tanggalLahir
• alamat
• kelamin

Ticket Model

• userId
• jumlahPendaki
• tanggalPendakian
• identityImage
• pendakiLain:
  name
  usia
  tanggalLahir
  alamat
  kelamin
  identityImage

Teknologi

• Node.js
• Express.js
• MongoDB (Mongoose)
• JWT Authentication
• Multer file upload
• CORS

Langkah Testing (Postman)

Register user

Login → dapatkan token

Buat tiket dengan form-data dan upload KTP

Lihat folder uploads/identitas

Akses gambar lewat:
http://localhost:5000/uploads/identitas/
<filename>

Identitas Developer

Nama: Prabaswara Febrian Winandika
NRP: 5027241069
Mata Kuliah: Praktikum Pemrograman Web
