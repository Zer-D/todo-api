# Todo List API

API backend profesional untuk manajemen Todo List, Kategori, dan Activity Log. Dibangun dengan arsitektur terstruktur (MVC + Service Layer) untuk memenuhi standar production, dilengkapi dengan autentikasi JWT, role-based access control (RBAC), validasi input, dan dokumentasi interaktif Swagger UI.

## Daftar Isi

* [Fitur](#fitur)
* [Teknologi yang Dipakai](#teknologi-yang-dipakai)
* [Struktur Project](#struktur-project)
* [Persyaratan](#persyaratan)
* [Instalasi](#instalasi)
* [Environment Variables](#environment-variables)
* [Menjalankan Project](#menjalankan-project)
* [Referensi Endpoint](#referensi-endpoint)

## Fitur

* **Autentikasi & Otorisasi:** Register & Login menggunakan JSON Web Token (JWT) dengan *role-based access* (`user` & `admin`).
* **Manajemen Todo & Kategori:** CRUD lengkap untuk Todo (dengan kepemilikan data/owner) dan Kategori.
* **Activity Log:** Mencatat seluruh riwayat aktivitas mutasi data pengguna ke database secara otomatis.
* **Protected Stats:** Endpoint ringkasan statistik data (total, selesai, belum selesai).
* **Keamanan & Validasi:** Global error handling, logger, dan validasi input ketat dengan `express-validator`.
* **Dokumentasi:** Dokumentasi API interaktif dengan Swagger UI.

## Teknologi yang Dipakai

* **Core:** Node.js, Express
* **Database:** MongoDB, Mongoose
* **Security:** bcryptjs, jsonwebtoken, dotenv
* **Validation:** express-validator
* **Dokumentasi:** swagger-jsdoc, swagger-ui-express

## Struktur Project

```
todo-api/
├── src/
│   ├── config/          # Konfigurasi database & Swagger
│   ├── controllers/     # Logika controller (auth, todo, category, stats, log)
│   ├── middlewares/     # Auth, error handler, logger, validation, notFound
│   ├── models/          # Skema Mongoose (user, todo, category, log)
│   ├── routes/          # Router untuk tiap endpoint API
│   ├── services/        # Business logic / service layer
│   ├── utils/           # Utility functions (AppError, catchAsync)
│   ├── validators/      # Skema validasi express-validator
│   ├── app.js           # Setup utama Express
│   └── server.js        # Entry point aplikasi
└── .env                 # Environment variables
```

## Persyaratan

### Sistem Operasi Kompatibel
* **Windows:** Windows 10 / 11 (64-bit)
* **Linux:** Ubuntu, Debian, Fedora, Arch Linux (atau distro Linux 64-bit lainnya)
* **macOS:** macOS 10.15 (Catalina) atau versi lebih baru (Apple Silicon & Intel)

### Perangkat Lunak
* [Node.js](https://nodejs.org/) (versi 18.x atau terbaru disarankan)
* MongoDB (Database lokal v5.0+ atau layanan cloud MongoDB Atlas)
* Git (opsional, untuk manajemen kode / version control)

## Instalasi

1. Clone repository ini:
   ```bash
   git clone https://github.com/Zer-D/todo-api.git
   cd todo-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables

Buat file bernama `.env` di root folder project, lalu isi dengan konfigurasi berikut:

```env
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/todo-db?retryWrites=true&w=majority
JWT_SECRET=rahasia_jwt_super_aman
JWT_EXPIRES_IN=1d
```

## Menjalankan Project

* Mode Development (menggunakan Nodemon):
  ```bash
  npm run dev
  ```

* Mode Production:
  ```bash
  npm start
  ```

Akses aplikasi melalui browser atau Postman di: `http://localhost:3000`

## Referensi Endpoint & Dokumentasi

Dokumentasi interaktif lengkap beserta uji coba endpoint dapat diakses melalui Swagger UI pada:
👉 **`http://localhost:3000/api-docs`**

* **Auth:** `POST /api/auth/register`, `POST /api/auth/login`
* **Todos:** `GET`, `POST`, `PUT`, `DELETE` pada `/api/todos`
* **Categories:** `GET`, `POST`, `PUT`, `DELETE` pada `/api/categories`
* **Stats:** `GET /api/stats/summary`
* **Logs:** `GET /api/logs` *(Khusus Admin)*
