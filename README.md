# Todo List Management API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18.x+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-55%20passing-brightgreen?style=for-the-badge&logo=jest&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**A production-ready REST API for managing todo lists, categories, and activity logs.**

Built with a structured architecture (MVC + Service Layer) and equipped with JWT authentication, role-based access control (RBAC), input validation, automated testing, and interactive Swagger UI documentation.

[![View on GitHub](https://img.shields.io/badge/GitHub-Zer--D%2Ftodo--api-181717?style=flat-square&logo=github)](https://github.com/Zer-D/todo-api)
[![Live Demo](https://img.shields.io/badge/Swagger_UI-Live_Demo-85EA2D?style=flat-square&logo=swagger)](http://localhost:3000/api-docs)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication & Authorization** | Register & Login using JSON Web Tokens (JWT) with role-based access (`user` & `admin`) |
| 📝 **Todo & Category Management** | Full CRUD operations for Todos (with data ownership) and Categories |
| 📊 **Activity Log** | Automatic logging of user data mutations. Admins see all logs; users see only their own |
| 📈 **Stats with API Key** | Summary statistics endpoint for external integrations, protected by `x-api-key` header |
| 🛡️ **Security & Validation** | Global error handling, request logging, and strict input validation with `express-validator` |
| 🧪 **Automated Testing** | 55 integration tests with Jest & Supertest using in-memory MongoDB |
| 📚 **Interactive Documentation** | Swagger UI with live endpoint testing at `/api-docs` |

---

## 🛠 Tech Stack

<div align="center">

| Category | Technologies |
|----------|--------------|
| **Runtime** | ![Node.js](https://img.shields.io/badge/Node.js-18.x+-339933?logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white) |
| **Database** | ![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-47A248?logo=mongodb&logoColor=white) ![Mongoose](https://img.shields.io/badge/Mongoose-8.x-880000?logo=mongoose&logoColor=white) |
| **Security** | ![bcryptjs](https://img.shields.io/badge/bcryptjs-3.x-green) ![jsonwebtoken](https://img.shields.io/badge/jsonwebtoken-9.x-orange) ![dotenv](https://img.shields.io/badge/dotenv-18.x-yellow) |
| **Validation** | ![express-validator](https://img.shields.io/badge/express--validator-7.x-red) |
| **Documentation** | ![Swagger](https://img.shields.io/badge/Swagger_UI-5.x-85EA2D?logo=swagger&logoColor=black) |
| **Testing** | ![Jest](https://img.shields.io/badge/Jest-30.x-C21325?logo=jest&logoColor=white) ![Supertest](https://img.shields.io/badge/Supertest-7.x-blue) ![mongodb-memory-server](https://img.shields.io/badge/mongodb--memory--server-11.x-green) |
| **Development** | ![Nodemon](https://img.shields.io/badge/Nodemon-3.x-76D04B?logo=nodemon&logoColor=white) |

</div>

---

## 📁 Project Structure

```
todo-api/
├── api/
│   └── index.js              # 🚀 Serverless entry point (Vercel)
├── src/
│   ├── config/               # ⚙️  DB & Swagger configuration
│   ├── controllers/          # 🎯 Request handlers (auth, todo, category, stats, log)
│   ├── middlewares/          # 🔒 Auth, RBAC, validation, error handling, logging
│   ├── models/               # 🗄️  Mongoose schemas (User, Todo, Category, Log)
│   ├── routes/               # 🛣️  API route definitions
│   ├── services/             # 💼 Business logic layer
│   ├── utils/                # 🛠️  AppError, catchAsync utilities
│   ├── validators/           # ✅ express-validator schemas
│   ├── app.js                # 📦 Express application setup
│   └── server.js             # 🏁 Local entry point
├── tests/                    # 🧪 Test suite (55 tests)
│   ├── setup.js              # In-memory MongoDB setup
│   ├── auth.test.js
│   ├── todo.test.js
│   ├── category.test.js
│   ├── log.test.js
│   └── stats.test.js
├── .env.example              # 📋 Environment template
├── .gitignore
├── jest.config.js
├── package.json
├── vercel.json               # ☁️ Vercel deployment config
└── README.md
```

> 💡 The `.env` file is created locally from `.env.example` and is **not** committed to the repository.

---

## 📋 Requirements

### Operating Systems
| OS | Version |
|----|---------|
| ![Windows](https://img.shields.io/badge/Windows-10%2F11-0078D6?logo=windows&logoColor=white) | 64-bit |
| ![Linux](https://img.shields.io/badge/Linux-Ubuntu%2C_Debian%2C_Fedora%2C_Arch-FCC624?logo=linux&logoColor=black) | Any 64-bit distribution |
| ![macOS](https://img.shields.io/badge/macOS-10.15%2B-000000?logo=apple&logoColor=white) | Catalina or later (Apple Silicon & Intel) |

### Software Dependencies
| Tool | Version | Required For |
|------|---------|--------------|
| [Node.js](https://nodejs.org/) | 18.x+ | Application runtime |
| [MongoDB](https://www.mongodb.com/) | 5.0+ | Database (local or Atlas) |
| Git | Latest | Version control (optional) |

> ⚠️ **MongoDB is required for running the application, NOT for running tests** (tests use in-memory MongoDB).

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/Zer-D/todo-api.git
cd todo-api
npm install
```

### 2. Configure Environment
```bash
# Linux / macOS
cp .env.example .env

# Windows (Command Prompt)
copy .env.example .env
```

Edit `.env` with your values:
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/todo_api_db
NODE_ENV=development
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=1d
EXTERNAL_API_KEY=your-external-api-key-here
```

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/todo_api_db` |
| `NODE_ENV` | Application mode | `development` / `production` |
| `JWT_SECRET` | **Secret for signing JWT tokens** | `long-random-string-256-bit` |
| `JWT_EXPIRES_IN` | Token expiration | `1d`, `7d`, `30d` |
| `EXTERNAL_API_KEY` | API key for stats endpoint | `external-api-key-123` |

> ⚠️ **Never commit a `.env` file containing real credentials!** Generate a strong `JWT_SECRET` for production:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### 3. Run the Application
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

🌐 **Access:** `http://localhost:3000`  
📚 **Swagger UI:** `http://localhost:3000/api-docs`

---

## 🧪 Running Tests

```bash
npm test
```

Runs **55 integration tests** with Jest & Supertest using `mongodb-memory-server` (no real database needed).

### Test Requirements
Create `.env.test` in project root:
```env
JWT_SECRET=test-secret-key
JWT_EXPIRES_IN=1d
EXTERNAL_API_KEY=test-api-key
```

> `MONGODB_URI` not required — tests use in-memory MongoDB.

### Test Coverage
| Test File | Coverage |
|-----------|----------|
| `auth.test.js` | Authentication (register, login, duplicate handling) |
| `todo.test.js` | Todo CRUD, ownership, pagination, filtering |
| `category.test.js` | Category CRUD, uniqueness, search, sorting |
| `log.test.js` | Activity logs, RBAC, pagination, sorting |
| `stats.test.js` | Stats endpoint with API key protection |

> 📥 First run downloads MongoDB binary automatically (requires internet).

---

## ☁️ Deployment (Vercel)

This project is **Vercel-ready** with `vercel.json` and `api/index.js`.

### Deploy Steps
1. **Import** repository to [Vercel](https://vercel.com/)
2. **Add Environment Variables** in Project Settings → Environment Variables
3. **Deploy** — Use **MongoDB Atlas** (local DB not accessible from Vercel)

### Vercel Config Highlights
```json
{
  "buildCommand": "npm install",
  "outputDirectory": ".",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": null,
  "rewrites": [
    { "source": "/(.*)", "destination": "/api/index.js" }
  ]
}
```

---

## 📖 API Reference

### 🔗 Interactive Documentation
**Swagger UI:** `http://localhost:3000/api-docs`

### 🔐 Authentication Methods

| Method | Used By | Header |
|--------|---------|--------|
| **JWT (Bearer)** | Todos, Categories, Logs | `Authorization: Bearer <token>` |
| **API Key** | Stats | `x-api-key: <EXTERNAL_API_KEY>` |

### 📋 Endpoints Overview

<details>
<summary><b>🔐 Auth Endpoints</b></summary>

| Method | Endpoint | Protection | Description |
|--------|----------|------------|-------------|
| `POST` | `/api/auth/register` | — | Register new user (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | — | Login & receive JWT token |

</details>

<details>
<summary><b>📝 Todo Endpoints</b></summary>

| Method | Endpoint | Protection | Description |
|--------|----------|------------|-------------|
| `POST` | `/api/todos` | JWT | Create todo (`title` required, `category` optional) |
| `GET` | `/api/todos` | JWT | List user's todos (admin sees all) with pagination, search, filter |
| `GET` | `/api/todos/:id` | JWT | Get single todo |
| `PUT` | `/api/todos/:id` | JWT | Update todo |
| `DELETE` | `/api/todos/:id` | JWT | Delete todo |

**Query Parameters (GET /api/todos):**
- `page`, `limit` (max 100), `search`, `completed` (boolean)
- `sortBy`: `createdAt` \| `title` \| `completed`
- `order`: `asc` \| `desc`

</details>

<details>
<summary><b>📂 Category Endpoints</b></summary>

| Method | Endpoint | Protection | Description |
|--------|----------|------------|-------------|
| `POST` | `/api/categories` | JWT | Create category (unique name) |
| `GET` | `/api/categories` | JWT | List categories with pagination & search |
| `GET` | `/api/categories/:id` | JWT | Get single category |
| `PUT` | `/api/categories/:id` | JWT | Update category |
| `DELETE` | `/api/categories/:id` | JWT | Delete category |

</details>

<details>
<summary><b>📊 Stats Endpoint</b></summary>

| Method | Endpoint | Protection | Description |
|--------|----------|------------|-------------|
| `GET` | `/api/stats/summary` | API Key | Summary: `totalTodos`, `completedTodos`, `pendingTodos` |

</details>

<details>
<summary><b>📜 Log Endpoints</b></summary>

| Method | Endpoint | Protection | Description |
|--------|----------|------------|-------------|
| `GET` | `/api/logs` | JWT | Admin: all logs; User: own logs only |

</details>

---

## 💡 Usage Examples

### Register & Login
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"secret123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"secret123"}'

# Response: { "success": true, "data": { "user": {...}, "token": "eyJhbGciOi..." } }
```

### Create Todo (with JWT)
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Learn Swagger","description":"Write API docs","category":"CAT_ID"}'
```

### Get Stats (with API Key)
```bash
curl -X GET http://localhost:3000/api/stats/summary \
  -H "x-api-key: YOUR_EXTERNAL_API_KEY"
```

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Request                         │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Middleware Layer                         │
│  • Logger  • CORS  • Body Parser  • Auth (JWT/API Key)     │
│  • Validation  • Role Check (RBAC)  • Error Handler        │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                      Route Layer                            │
│  /api/auth  •  /api/todos  •  /api/categories              │
│  /api/stats  •  /api/logs                                   │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Controller Layer                         │
│  Request handling → Validation → Service calls → Response  │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                           │
│  Business logic • Data transformation • External calls     │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                      Model Layer                            │
│  Mongoose Models: User • Todo • Category • Log             │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                      Database                               │
│                    MongoDB / Atlas                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Write tests for new features
- Follow existing code style (ESLint + Prettier)
- Update documentation for API changes
- Ensure all 55 tests pass before PR

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Zer-D** — [GitHub](https://github.com/Zer-D) • [Project Repository](https://github.com/Zer-D/todo-api)

---

<div align="center">

**Built with ❤️ using Node.js, Express, MongoDB & modern best practices**

[![Star this repo](https://img.shields.io/github/stars/Zer-D/todo-api?style=social)](https://github.com/Zer-D/todo-api)
[![Fork this repo](https://img.shields.io/github/forks/Zer-D/todo-api?style=social)](https://github.com/Zer-D/todo-api/fork)

</div>
