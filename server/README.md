# Datalyze API

Node/Express API with **MySQL** (Sequelize), **Firebase Authentication**, and migrations.

## Commands (run from `server/`)

| Command | Description |
|--------|-------------|
| `npm run dev` | Start API in development (watch mode) |
| `npm start` | Start API (production) |
| `npm run db:create` | Create MySQL database (if it doesn’t exist) |
| `npm run migrate` | Run Sequelize migrations |
| `npm run migrate:undo` | Undo last migration |

## Quick start (local)

1. **Env:** `cp .env.example .env` and set MySQL and Firebase vars (see below).
2. **Database:** Create DB once: `npm run db:create` (or `mysql -e "CREATE DATABASE IF NOT EXISTS datalyze"`).
3. **Migrations:** `npm run migrate`.
4. **Firebase:** Put service account JSON at `server/serviceAccountKey.json` (or set `GOOGLE_APPLICATION_CREDENTIALS`).
5. **Run:** `npm install && npm run dev`.

Full steps: **[../docs/backend-setup.md](../docs/backend-setup.md)**

## Env variables (MySQL)

Use either **one** of these:

- **`DATABASE_URL`** – e.g. `mysql://root:password@localhost:3306/datalyze`
- **Or** `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | No | Health + DB status |
| POST | `/api/contacts` | Optional | Submit contact/lead |
| GET | `/api/users/me` | Bearer required | Get/create user from Firebase token |

## Security

- Firebase Admin verifies ID tokens on protected routes
- Helmet, CORS, rate limiting, input validation
- Sequelize (parameterized queries); no secrets in code
