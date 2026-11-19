# Todo List API

API backend profesional untuk manajemen Todo List, Kategori, dan Activity Log. Dibangun dengan arsitektur terstruktur (MVC + Service Layer) untuk memenuhi standar production, dilengkapi dengan autentikasi JWT, role-based access control (RBAC), validasi input, pengujian otomatis, dan dokumentasi interaktif Swagger UI.

## Daftar Isi

* [Fitur](#fitur)
* [Teknologi yang Dipakai](#teknologi-yang-dipakai)
* [Struktur Project](#struktur-project)
* [Persyaratan](#persyaratan)
* [Instalasi](#instalasi)
* [Environment Variables](#environment-variables)
* [Menjalankan Project](#menjalankan-project)
* [Menjalankan Pengujian](#menjalankan-pengujian)
* [Deployment (Vercel)](#deployment-vercel)
* [Referensi Endpoint & Dokumentasi](#referensi-endpoint--dokumentasi)

## Fitur

* **Autentikasi & Otorisasi:** Register & Login menggunakan JSON Web Token (JWT) dengan *role-based access* (`user` & `admin`).
* **Manajemen Todo & Kategori:** CRUD lengkap untuk Todo (dengan kepemilikan data/owner) dan Kategori.
* **Activity Log:** Mencatat riwayat aktivitas mutasi data pengguna ke database secara otomatis. Admin dapat melihat log semua user, sedangkan user biasa hanya melihat log miliknya sendiri.
* **Stats dengan API Key:** Endpoint ringkasan statistik (total, selesai, belum selesai) untuk integrasi eksternal, diproteksi header `x-api-key` (bukan JWT).
* **Keamanan & Validasi:** Global error handling, logger, dan validasi input ketat dengan `express-validator`.
* **Pengujian Otomatis:** Integration test dengan Jest & Supertest menggunakan database MongoDB in-memory.
* **Dokumentasi:** Dokumentasi API interaktif dengan Swagger UI.

## Teknologi yang Dipakai

* **Core:** Node.js, Express 5, CORS
* **Database:** MongoDB, Mongoose
* **Security:** bcryptjs, jsonwebtoken, dotenv
* **Validation:** express-validator
* **Dokumentasi:** swagger-jsdoc, swagger-ui-express
* **Testing:** Jest, Supertest, mongodb-memory-server
* **Development:** Nodemon

## Struktur Project

```
todo-api/
├── api/
│   └── index.js         # Entry point serverless untuk deploy ke Vercel
├── src/
│   ├── config/          # Konfigurasi database (db.js) & Swagger (swagger.js)
│   ├── controllers/     # Logika controller (auth, todo, category, stats, log)
│   ├── middlewares/     # API key, auth, restrictTo (role), error handler, logger, validate, notFound
│   ├── models/          # Skema Mongoose (user, todo, category, log)
│   ├── routes/          # Router untuk tiap endpoint API
│   ├── services/        # Business logic / service layer (auth, todo, category, log)
│   ├── utils/           # Utility functions (AppError, catchAsync)
│   ├── validators/      # Skema validasi express-validator (todo, category)
│   ├── app.js           # Setup utama Express
│   └── server.js        # Entry point aplikasi (lokal)
├── tests/
│   ├── setup.js         # Setup pengujian (database in-memory)
│   ├── auth.test.js     # Pengujian autentikasi
│   ├── todo.test.js     # Pengujian todo
│   ├── category.test.js # Pengujian kategori
│   ├── log.test.js      # Pengujian activity log
│   └── stats.test.js    # Pengujian statistik
├── .env.example         # Contoh environment variables (salin menjadi .env)
├── .gitignore
├── jest.config.js       # Konfigurasi Jest
├── package.json
├── vercel.json          # Konfigurasi deployment Vercel
└── README.md
```

> File `.env` dibuat sendiri secara lokal dari `.env.example` dan tidak ikut di-push ke repository.

## Persyaratan

### Sistem Operasi Kompatibel
* **Windows:** Windows 10 / 11 (64-bit)
* **Linux:** Ubuntu, Debian, Fedora, Arch Linux (atau distro Linux 64-bit lainnya)
* **macOS:** macOS 10.15 (Catalina) atau versi lebih baru (Apple Silicon & Intel)

### Perangkat Lunak
* [Node.js](https://nodejs.org/) (versi 18.x atau terbaru disarankan)
* MongoDB (Database lokal v5.0+ atau layanan cloud MongoDB Atlas) — dibutuhkan untuk menjalankan aplikasi, **tidak** untuk menjalankan pengujian
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

Salin file contoh `.env.example` menjadi `.env` di root folder project:

```bash
# Linux / macOS
cp .env.example .env

# Windows (Command Prompt)
copy .env.example .env
```

Lalu sesuaikan isinya. Isi default dari `.env.example`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/todo_api_db
NODE_ENV=development
JWT_SECRET=isi-dengan-secret-kamu-sendiri
JWT_EXPIRES_IN=1d
EXTERNAL_API_KEY=isi-dengan-api-key-kamu-sendiri
```

| Variable           | Keterangan                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| `PORT`             | Port server                                                                                             |
| `MONGODB_URI`      | Connection string MongoDB. Default untuk database lokal; untuk MongoDB Atlas gunakan URI `mongodb+srv://...` |
| `NODE_ENV`         | Mode aplikasi (`development` atau `production`)                                                         |
| `JWT_SECRET`       | Secret key untuk menandatangani token JWT. **Ganti dengan nilai acak yang panjang di production**       |
| `JWT_EXPIRES_IN`   | Masa berlaku token (contoh: `1d`)                                                                       |
| `EXTERNAL_API_KEY` | API key untuk endpoint `GET /api/stats/summary`, dikirim lewat header `x-api-key`                       |

> ⚠️ Jangan pernah meng-commit file `.env` yang berisi kredensial asli.

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

## Menjalankan Pengujian

Project ini menggunakan **Jest** dan **Supertest** untuk menguji endpoint API, dengan **mongodb-memory-server** sebagai database sementara sehingga pengujian tidak menyentuh database asli kamu.

```bash
npm test
```

Script tersebut menjalankan `jest --runInBand --detectOpenHandles`, yaitu test dijalankan berurutan dan koneksi yang belum tertutup akan dilaporkan.

Sebelum menjalankan test, buat file `.env.test` di root project (dibaca oleh `tests/setup.js`). Isi minimal:

```env
JWT_SECRET=secret-khusus-testing
JWT_EXPIRES_IN=1d
EXTERNAL_API_KEY=api-key-khusus-testing
```

> `MONGODB_URI` tidak perlu diisi karena test memakai database in-memory.

Cakupan pengujian ada di folder `tests/`: `auth.test.js` (autentikasi), `todo.test.js` (todo), `category.test.js` (kategori), `log.test.js` (activity log), dan `stats.test.js` (statistik), dengan `setup.js` sebagai konfigurasi bersama.

> Saat pertama kali dijalankan, `mongodb-memory-server` akan mengunduh binary MongoDB secara otomatis, jadi dibutuhkan koneksi internet.

## Deployment (Vercel)

Project ini sudah menyertakan `vercel.json` dan `api/index.js` sehingga bisa di-deploy ke [Vercel](https://vercel.com/) sebagai serverless function.

1. Import repository ke Vercel.
2. Tambahkan semua environment variables (lihat bagian [Environment Variables](#environment-variables)) di **Project Settings → Environment Variables**.
3. Deploy. Untuk database, gunakan MongoDB Atlas karena database lokal tidak bisa diakses dari Vercel.

## Referensi Endpoint & Dokumentasi

Dokumentasi interaktif lengkap beserta uji coba endpoint dapat diakses melalui Swagger UI pada:
👉 **`http://localhost:3000/api-docs`**

### Autentikasi

Ada dua mekanisme proteksi:

* **JWT (Bearer token):** dipakai oleh Todos, Categories, dan Logs. Dapatkan token dari `POST /api/auth/login`, lalu kirim lewat header `Authorization: Bearer <token>`.
* **API Key:** dipakai oleh Stats. Kirim nilai `EXTERNAL_API_KEY` lewat header `x-api-key`.

### Daftar Endpoint

| Grup       | Method & Path                                                                                             | Proteksi  | Keterangan                                                                                  |
| ---------- | --------------------------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------- |
| Auth       | `POST /api/auth/register`                                                                                 | -         | Daftar user baru (`name`, `email`, `password`). Mengembalikan `409` jika email sudah terdaftar |
| Auth       | `POST /api/auth/login`                                                                                    | -         | Login dan mendapatkan JWT token                                                             |
|| Todos      | `POST /api/todos`                                                                                         | JWT       | Buat todo baru (`title` wajib, `category` opsional)                                                                              |
| Todos      | `GET /api/todos`                                                                                          | JWT       | Daftar todo milik user yang login (admin melihat todo semua user). Query: `page`, `limit` (maks 100), `search`, `completed`, `sortBy` (`createdAt`/`title`/`completed`), `order` |
| Todos      | `GET /api/todos/:id`, `PUT /api/todos/:id`, `DELETE /api/todos/:id`                                       | JWT       | Detail, update, dan hapus todo. Mengembalikan `403` jika todo bukan milik user (kecuali admin), `404` jika tidak ditemukan |
| Categories | `POST /api/categories`                                                                                    | JWT       | Buat kategori baru (nama harus unik, `409` jika sudah ada)                                                        |
| Categories | `GET /api/categories`                                                                                     | JWT       | Daftar kategori. Query: `page`, `limit`, `search`, `sortBy` (`createdAt`/`name`), `order`   |
| Categories | `GET /api/categories/:id`, `PUT /api/categories/:id`, `DELETE /api/categories/:id`                        | JWT       | Detail, update, dan hapus kategori                                                          |
| Stats      | `GET /api/stats/summary`                                                                                  | API Key   | Ringkasan statistik: `totalTodos`, `completedTodos`, `pendingTodos`                         |
| Logs       | `GET /api/logs`                                                                                           | JWT       | Admin melihat log semua user, user biasa hanya melihat log miliknya. Query: `page`, `limit`, `sortBy`, `order` |

Detail request body dan contoh response tiap endpoint tersedia di Swagger UI.
