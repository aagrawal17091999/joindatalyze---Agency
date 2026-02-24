# Datalyze Backend Setup (MySQL + Firebase Auth)

## Overview

- **Stack:** Node.js, Express, MySQL, Firebase Admin (auth verification).
- **Security:** Helmet, CORS, rate limiting, input validation, parameterized queries, env-based config.

## Prerequisites

- Node.js 18+
- MySQL 8+ (local or hosted)
- Firebase project with Auth enabled
- Firebase **service account key** (JSON) for Admin SDK

## 1. MySQL

Create database and tables:

```bash
mysql -u root -p < server/sql/schema.sql
```

Or run the SQL in `server/sql/schema.sql` manually (creates `datalyze` DB, `users`, `contacts`).

## 2. Firebase Admin (service account)

1. Firebase Console → Project Settings → Service accounts.
2. Generate new private key (downloads JSON).
3. Place the file as `server/serviceAccountKey.json` (or set `GOOGLE_APPLICATION_CREDENTIALS` to its path).
4. **Never commit this file.** It is in `.gitignore`.

Alternative: set `FIREBASE_SERVICE_ACCOUNT_JSON` to the full JSON string (e.g. in PaaS env). For base64: encode the JSON and put in env.

## 3. Environment

Copy and edit:

```bash
cp server/.env.example server/.env
```

**MySQL (use one of these):**

- **`DATABASE_URL`** – e.g. `mysql://root:yourpassword@localhost:3306/datalyze`
- **Or** `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`

**Required:**

- MySQL vars above.
- `GOOGLE_APPLICATION_CREDENTIALS` or `FIREBASE_SERVICE_ACCOUNT_JSON` – Firebase Admin.
- `CORS_ORIGINS` – Allowed frontend origins (comma-separated). No trailing slash.

Optional: `PORT`, `API_PREFIX`, `NODE_ENV`, rate limit vars (see `server/.env.example`).

## 4. Create database and run migrations

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MySQL and Firebase settings (see section 3)

npm run db:create    # Create MySQL database (if needed)
npm run migrate     # Run Sequelize migrations (creates users, contacts tables)
```

## 5. Start the API

```bash
npm run dev    # Development (watch mode)
# or
npm start      # Production
```

API base: `http://localhost:4040/api` (or your `PORT` and `API_PREFIX`).

## 6. API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | No | Health + DB status |
| POST | `/api/contacts` | Optional (Bearer) | Submit contact/lead; link to user if token sent |
| GET | `/api/users/me` | Bearer required | Get or create user from Firebase token |

### Contact payload (POST /api/contacts)

```json
{
  "email": "user@example.com",
  "name": "Full Name",
  "company": "Optional",
  "message": "Optional message"
}
```

### Auth (protected routes)

Send Firebase ID token in header:

```
Authorization: Bearer <firebase-id-token>
```

Frontend: after `signInWithEmailAndPassword` (or similar), get token with `user.getIdToken()` and send it in the `Authorization` header.

## 7. Security summary

| Layer | What we use |
|-------|----------------|
| **Secrets** | All in env; no keys in code |
| **Auth** | Firebase Admin verifies ID token; never trust client-only checks |
| **CORS** | Allowed origins from `CORS_ORIGINS` only |
| **Headers** | Helmet (CSP, X-Frame-Options, etc.) |
| **Rate limit** | General (e.g. 100/15min); stricter for contacts (e.g. 10/15min) |
| **Input** | express-validator on contact form; length limits |
| **SQL** | Parameterized queries only (no string concatenation) |
| **Errors** | No stack traces in production |
| **Body size** | `express.json({ limit: '100kb' })` |

## 8. Production checklist

- [ ] `NODE_ENV=production`
- [ ] Strong `DATABASE_URL` (and restrict DB user permissions)
- [ ] `CORS_ORIGINS` set to your real frontend origin(s)
- [ ] HTTPS only (reverse proxy terminates SSL)
- [ ] Service account key stored securely (e.g. secret manager), not in repo
- [ ] Run schema migrations if you change tables (keep schema.sql or add migrations)

---

## 9. Frontend: wiring contact form

Set `VITE_API_BASE_URL` (e.g. `http://localhost:4040` for backend) in frontend `.env`.  
On Contact page, form POST to `VITE_API_BASE_URL/api/contacts` with JSON body.  
If user is signed in, send `Authorization: Bearer <idToken>` to link the submission to their account.
