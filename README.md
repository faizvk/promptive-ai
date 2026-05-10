# Promptive AI

AI image generation and content rewriting SaaS.

Promptive AI is a full-stack application that lets users generate AI images,
rewrite content in different tones, and manage their work through a secure
dashboard.

---

## Features

### Authentication
- Email/password sign-up and sign-in
- Sign in with Google (OAuth 2.0) — Google-verified emails are auto-trusted
- httpOnly cookies for both access (15 min) and refresh (7 day) tokens
- Silent refresh: stale access cookie → axios interceptor calls `/auth/refresh` once and retries
- Per-account lockout (5 failed attempts → 15-minute lock) on top of IP rate limiting
- Email verification with 24-hour signed link, resendable from a dashboard banner
- Forgot-password / reset-password flow with 1-hour signed link, password change invalidates existing sessions via `tokenVersion` bump
- Audit log of every auth event (signup, login success/fail/locked, logout, refresh fail, OAuth)
- Optional Cloudflare Turnstile gate on signup/login/forgot — no-op when not configured

### AI capabilities
- **Image generation** — text-to-image via Hugging Face FLUX.1 with selectable
  resolution and aspect ratio. Generated images are uploaded to Cloudinary.
- **Content rewrite** — Google Gemini rewrites your text in `professional`,
  `formal`, `casual`, or `creative` tone while preserving meaning.

### Dashboard
- Overview with real per-user counts and last-activity timestamp
- Image generation, content rewrite, and history pages
- Sidebar + topbar with mobile drawer

### History
- Per-user history for both image and rewrite outputs
- Grouped by Today / Yesterday / Earlier
- Copy rewritten text, download images, delete items

---

## Tech stack

### Frontend
React 19 (Vite), React Router 7, React Hook Form + Zod, Axios,
Framer Motion, Lucide React, Tailwind CSS v4.

### Backend
Node.js, Express 5, MongoDB (Mongoose), JWT, Helmet, express-rate-limit,
Morgan, Multer, Bcrypt, Cloudinary SDK, `@google/genai`,
`@huggingface/inference`, `google-auth-library`.

---

## Repository layout

```text
promptive-ai
├── backend
│   ├── auth/         # JWT + role middleware
│   ├── config/       # env loader, db, cloudinary, AI clients
│   ├── controller/   # request handlers
│   ├── model/        # Mongoose schemas (User, Image, Content)
│   ├── view/         # Express routers
│   ├── index.js      # app bootstrap
│   ├── package.json
│   └── .env.example
│
├── frontend
│   ├── src/
│   │   ├── api/         # axios client + per-resource calls
│   │   ├── animations/  # fade-in scroll observer
│   │   ├── components/  # Navbar, Footer, ServerLoadingScreen
│   │   ├── dashboard/   # DashboardLayout, Sidebar, Topbar, pages
│   │   ├── pages/       # public + auth + protected pages
│   │   ├── routes/      # ProtectedRoute, PublicRoute
│   │   ├── utils/       # auth helpers, zod schemas
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── .env.example
│
└── README.md
```

---

## Getting started

### Prerequisites
- Node.js 18+
- A MongoDB connection string
- Cloudinary, Google Gemini, and Hugging Face API keys
- Optional: Google OAuth client (for Sign in with Google)

### Backend

```bash
cd backend
cp .env.example .env       # fill in values
npm install
npm run dev                # nodemon on port 5000 (default)
```

The server fails fast at boot if any required env var is missing,
listing exactly which ones.

### Frontend

```bash
cd frontend
cp .env.example .env       # set VITE_API_BASE_URL=http://localhost:5000
npm install
npm run dev                # Vite on port 5173
```

---

## Environment variables

See `backend/.env.example` and `frontend/.env.example` for the canonical lists.

**Backend (required):**
`MONGO_URI`, `SECRET_KEY` (JWT), `CLOUDINARY_CLOUD_NAME`,
`CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `GEMINI_API_KEY`,
`HUGGINGFACE_API_KEY`.

**Backend (optional):**
`PORT` (default `5000`), `NODE_ENV`, `FRONTEND_URL`, `BACKEND_URL`,
`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`,
`ACCESS_TOKEN_TTL` (default `15m`), `REFRESH_TOKEN_TTL` (default `7d`),
`SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/`SMTP_PASS`/`SMTP_FROM` (emails fall back
to console logging when unset), `TURNSTILE_SECRET` (Cloudflare bot mitigation).

**Frontend:**
`VITE_API_BASE_URL` — base URL of the backend.
`VITE_TURNSTILE_SITE_KEY` (optional) — pair with backend `TURNSTILE_SECRET`.

---

## Routes

### Public
| Path                | Page                       |
| ------------------- | -------------------------- |
| `/`                 | Landing                    |
| `/image-generate`   | Public image marketing     |
| `/content-rewrite`  | Public rewrite marketing   |
| `/login`            | Sign in                    |
| `/signup`           | Sign up                    |
| `/forgot-password`  | Request password reset     |
| `/reset-password`   | Set a new password         |
| `/verify-email`     | Email verification target (handled by backend redirect) |

### Protected (require valid JWT)
| Path                  | Page             |
| --------------------- | ---------------- |
| `/dashboard`          | Overview         |
| `/dashboard/image`    | Image generation |
| `/dashboard/rewrite`  | Content rewrite  |
| `/dashboard/history`  | History          |

---

## API endpoints

All endpoints are mounted at the backend root (no `/api` prefix).

### Auth (rate-limited: 20 req / 15 min). All set/clear httpOnly cookies.
- `POST /auth/signup` — `{ name, email, password, turnstileToken? }`
- `POST /auth/login` — `{ email, password, turnstileToken? }`
- `POST /auth/logout` — clears cookies + bumps tokenVersion
- `GET  /auth/me` — current user (requires valid access cookie)
- `POST /auth/refresh` — re-issues access cookie from refresh cookie
- `GET  /auth/google` / `GET /auth/google/callback` — Google OAuth flow
- `POST /auth/verify-email/send` — re-issue verification email (auth required)
- `GET  /auth/verify-email?token=…` — completes verification, redirects to `/dashboard?verified=1`
- `POST /auth/forgot-password` — `{ email, turnstileToken? }` — always 200
- `POST /auth/reset-password` — `{ token, password }`

### AI (rate-limited: 10 req / min)
- `POST /images/generate-image` — `{ prompt, resolution, aspectRatio, quality?, negativePrompt?, seed? }`
- `POST /content/rewrite` — `{ text, tone }`

### History (auth required)
- `GET    /history?type=image|rewrite&page=&limit=`
- `DELETE /history/:type/:id`

### Dashboard (auth required)
- `GET /dashboard/overview`

### Health / status
- `GET /` — returns `{ status: "ok" }`
- `GET /health` — returns `{ status: "ok", uptime }`

---

## Production hardening

- `helmet()` for HTTP security headers
- 1 MB JSON body limit
- Rate limiting on `/auth/*` (20 req / 15 min) and AI endpoints (10 req / min)
- Per-account lockout: 5 failed logins → 15-minute lock (`423 Locked`)
- Generic auth error message (no user enumeration)
- httpOnly cookies (`Secure`, `SameSite=None` in prod, `Lax` locally)
- Access (15m) + refresh (7d) tokens with version-based instant revocation
- AuthEvent audit log for every auth event with IP + user agent
- Email verification + password reset use SHA-256-hashed tokens (raw token only travels in the email)
- Optional Cloudflare Turnstile (no-op when `TURNSTILE_SECRET` unset)
- Required-env validation at boot, fail-fast
- Graceful `SIGINT` / `SIGTERM` shutdown with timeout fallback
- Centralized error handler

---

## UI screenshots

### Landing
![landing page](frontend/public/one.png)
![landing page](frontend/public/two.png)

### Login
![login page](frontend/public/three.png)

### Dashboard
![dashboard](frontend/public/four.png)
![dashboard](frontend/public/five.png)
![dashboard](frontend/public/six.png)
![dashboard](frontend/public/seven.png)

### History
![history](frontend/public/eight.png)
![history](frontend/public/nine.png)

---

## Roadmap

- Subscription / billing (Stripe)
- Per-plan usage limits
- Admin dashboard + RBAC
- Export history (ZIP / PDF)
- Public API for third-party developers

---

## License

MIT

---

## Author

**Faiz VK** — building production-grade SaaS applications with React, Node,
and AI.
