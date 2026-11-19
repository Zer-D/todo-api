# Todo List Management API

A production-ready REST API for managing todo lists, categories, and activity logs. Built with a structured architecture (MVC + Service Layer) and equipped with JWT authentication, role-based access control (RBAC), input validation, automated testing, and interactive Swagger UI documentation.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Running Tests](#running-tests)
- [Deployment (Vercel)](#deployment-vercel)
- [API Reference & Documentation](#api-reference--documentation)

## Features

- **Authentication & Authorization:** Register & Login using JSON Web Tokens (JWT) with role-based access (`user` & `admin`).
- **Todo & Category Management:** Full CRUD operations for Todos (with data ownership) and Categories.
- **Activity Log:** Automatic logging of user data mutations to the database. Admins can view logs for all users; regular users see only their own logs.
- **Stats with API Key:** Summary statistics endpoint (total, completed, pending) for external integrations, protected by `x-api-key` header (not JWT).
- **Security & Validation:** Global error handling, logging, and strict input validation with `express-validator`.
- **Automated Testing:** Integration tests with Jest & Supertest using an in-memory MongoDB database.
- **Documentation:** Interactive API documentation with Swagger UI.

## Tech Stack

- **Core:** Node.js, Express 5, CORS
- **Database:** MongoDB, Mongoose
- **Security:** bcryptjs, jsonwebtoken, dotenv
- **Validation:** express-validator
- **Documentation:** swagger-jsdoc, swagger-ui-express
- **Testing:** Jest, Supertest, mongodb-memory-server
- **Development:** Nodemon

## Project Structure

```
todo-api/
├── api/
│   └── index.js          # Serverless entry point for Vercel deployment
├── src/
│   ├── config/           # Database (db.js) & Swagger (swagger.js) configuration
│   ├── controllers/      # Controller logic (auth, todo, category, stats, log)
│   ├── middlewares/      # API key, auth, restrictTo (role), error handler, logger, validate, notFound
│   ├── models/           # Mongoose schemas (user, todo, category, log)
│   ├── routes/           # Router for each API endpoint
│   ├── services/         # Business logic / service layer (auth, todo, category, log)
│   ├── utils/            # Utility functions (AppError, catchAsync)
│   ├── validators/       # express-validator schemas (todo, category)
│   ├── app.js            # Main Express setup
│   └── server.js         # Local application entry point
├── tests/
│   ├── setup.js          # Test setup (in-memory database)
│   ├── auth.test.js      # Authentication tests
│   ├── todo.test.js      # Todo tests
│   ├── category.test.js  # Category tests
│   ├── log.test.js       # Activity log tests
│   └── stats.test.js     # Statistics tests
├── .env.example          # Example environment variables (copy to .env)
├── .gitignore
├── jest.config.js        # Jest configuration
├── package.json
├── vercel.json           # Vercel deployment configuration
└── README.md
```

> The `.env` file is created locally from `.env.example` and is not committed to the repository.

## Requirements

### Compatible Operating Systems

- **Windows:** Windows 10 / 11 (64-bit)
- **Linux:** Ubuntu, Debian, Fedora, Arch Linux (or any 64-bit Linux distribution)
- **macOS:** macOS 10.15 (Catalina) or later (Apple Silicon & Intel)

### Software

- [Node.js](https://nodejs.org/) (version 18.x or later recommended)
- MongoDB (Local database v5.0+ or MongoDB Atlas cloud service) — required for running the application, **not** for running tests
- Git (optional, for version control)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Zer-D/todo-api.git
   cd todo-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Environment Variables

Copy the example `.env.example` file to `.env` in the project root:

```bash
# Linux / macOS
cp .env.example .env

# Windows (Command Prompt)
copy .env.example .env
```

Then adjust the values. Default contents of `.env.example`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/todo_api_db
NODE_ENV=development
JWT_SECRET=replace-with-your-own-secret
JWT_EXPIRES_IN=1d
EXTERNAL_API_KEY=replace-with-your-own-api-key
```

| Variable            | Description                                                                                                 |
| ------------------- | ----------------------------------------------------------------------------------------------------------- |
| `PORT`              | Server port                                                                                                 |
| `MONGODB_URI`       | MongoDB connection string. Default for local database; for MongoDB Atlas use `mongodb+srv://...` URI       |
| `NODE_ENV`          | Application mode (`development` or `production`)                                                            |
| `JWT_SECRET`        | Secret key for signing JWT tokens. **Replace with a long random value in production**                       |
| `JWT_EXPIRES_IN`    | Token expiration time (e.g., `1d`)                                                                          |
| `EXTERNAL_API_KEY`  | API key for `GET /api/stats/summary`, sent via `x-api-key` header                                           |

> ⚠️ Never commit a `.env` file containing real credentials.

## Running the Project

- **Development Mode** (with Nodemon auto-reload):

  ```bash
  npm run dev
  ```

- **Production Mode**:

  ```bash
  npm start
  ```

Access the application via browser or Postman at: `http://localhost:3000`

## Running Tests

This project uses **Jest** and **Supertest** for API endpoint testing, with **mongodb-memory-server** as a temporary database so tests don't touch your actual database.

```bash
npm test
```

This runs `jest --runInBand --detectOpenHandles`, executing tests sequentially and reporting any unclosed connections.

Before running tests, create a `.env.test` file in the project root (loaded by `tests/setup.js`). Minimum required values:

```env
JWT_SECRET=test-secret-key
JWT_EXPIRES_IN=1d
EXTERNAL_API_KEY=test-api-key
```

> `MONGODB_URI` is not required as tests use an in-memory database.

Test coverage is located in the `tests/` folder: `auth.test.js` (authentication), `todo.test.js` (todos), `category.test.js` (categories), `log.test.js` (activity logs), and `stats.test.js` (statistics), with `setup.js` as shared configuration.

> On first run, `mongodb-memory-server` downloads the MongoDB binary automatically, requiring an internet connection.

## Deployment (Vercel)

This project includes `vercel.json` and `api/index.js` for deployment to [Vercel](https://vercel.com/) as a serverless function.

1. Import the repository to Vercel.
2. Add all environment variables (see [Environment Variables](#environment-variables)) in **Project Settings → Environment Variables**.
3. Deploy. For the database, use MongoDB Atlas since local databases are not accessible from Vercel.

## API Reference & Documentation

Complete interactive documentation with endpoint testing is available via Swagger UI at:

👉 **`http://localhost:3000/api-docs`**

### Authentication

Two protection mechanisms are used:

- **JWT (Bearer token):** Used by Todos, Categories, and Logs. Obtain a token from `POST /api/auth/login`, then send it via the `Authorization: Bearer <token>` header.
- **API Key:** Used by Stats. Send the `EXTERNAL_API_KEY` value via the `x-api-key` header.

### Endpoint List

| Group       | Method & Path                                                                                              | Protection | Description                                                                                  |
| ----------- | ---------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------- |
| Auth        | `POST /api/auth/register`                                                                                  | -          | Register a new user (`name`, `email`, `password`). Returns `409` if email already exists     |
| Auth        | `POST /api/auth/login`                                                                                     | -          | Login and receive a JWT token                                                                |
| Todos       | `POST /api/todos`                                                                                          | JWT        | Create a new todo (`title` required, `category` optional)                                    |
| Todos       | `GET /api/todos`                                                                                           | JWT        | List todos owned by the logged-in user (admin sees all users' todos). Query: `page`, `limit` (max 100), `search`, `completed`, `sortBy` (`createdAt`/`title`/`completed`), `order` |
| Todos       | `GET /api/todos/:id`, `PUT /api/todos/:id`, `DELETE /api/todos/:id`                                        | JWT        | Detail, update, and delete a todo. Returns `403` if todo doesn't belong to user (except admin), `404` if not found |
| Categories  | `POST /api/categories`                                                                                     | JWT        | Create a new category (name must be unique, `409` if duplicate)                              |
| Categories  | `GET /api/categories`                                                                                      | JWT        | List categories. Query: `page`, `limit`, `search`, `sortBy` (`createdAt`/`name`), `order`    |
| Categories  | `GET /api/categories/:id`, `PUT /api/categories/:id`, `DELETE /api/categories/:id`                         | JWT        | Detail, update, and delete a category                                                        |
| Stats       | `GET /api/stats/summary`                                                                                   | API Key    | Summary statistics: `totalTodos`, `completedTodos`, `pendingTodos`                           |
| Logs        | `GET /api/logs`                                                                                            | JWT        | Admin sees all users' logs; regular user sees only their own. Query: `page`, `limit`, `sortBy`, `order` |

Detailed request bodies and response examples for each endpoint are available in Swagger UI.
