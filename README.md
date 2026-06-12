# TechLiftED

A production-ready, full-stack web platform for **TechLiftED** — an online engineering & tech
education brand for students in India. It ships three programs (Electrical & Mechanical
Engineering, Coding with Python, and a rolling AI-Tools track), a polished multi-step application
flow, a Google Sheets data sink, and a Twilio WhatsApp community-invite system with an admin
dashboard.

- **Frontend:** React (Vite) + TypeScript, CSS Modules, Framer Motion. Dark, cool-toned, high-tech UI.
- **Backend:** Node.js + Express (TypeScript), PostgreSQL (Neon) via `node-postgres`.
- **Integrations:** Google Sheets API v4 (service account) + Twilio WhatsApp API.

---

## Table of contents

1. [Project structure](#project-structure)
2. [Quick start (local)](#quick-start-local)
3. [Environment variables](#environment-variables)
4. [Google Sheets setup](#google-sheets-setup)
5. [Twilio WhatsApp setup](#twilio-whatsapp-setup)
6. [How the app works](#how-the-app-works)
7. [API reference](#api-reference)
8. [Admin dashboard](#admin-dashboard)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## Project structure

```
techlifted/
├── backend/                 # Express + TypeScript API
│   ├── src/
│   │   ├── config/env.ts     # env loading + integration flags
│   │   ├── db/database.ts     # better-sqlite3 schema + queries
│   │   ├── middleware/        # auth, multer upload, error handler
│   │   ├── routes/            # applications, whatsapp, health
│   │   ├── services/          # googleSheets, twilio
│   │   ├── utils/             # validation, phone (E.164), logger
│   │   └── index.ts           # app entry
│   ├── uploads/               # stored PDF uploads (gitignored)
│   ├── data/                  # SQLite file lives here (gitignored)
│   └── .env.example
├── frontend/                # React + Vite + TS
│   ├── src/
│   │   ├── components/        # Navbar, Footer, ProgramCard, Accordion, …
│   │   ├── data/              # programs.ts, constants.ts
│   │   ├── lib/api.ts         # typed API client
│   │   ├── pages/             # Home, Programs, ProgramDetail, Apply, About,
│   │   │                      #   Contact, Admin, NotFound
│   │   └── styles/            # tokens.css, global.css
│   └── .env.example
├── scripts/setup.mjs        # one-shot install + env bootstrap
├── package.json             # root scripts (dev/build via concurrently)
└── README.md
```

---

## Quick start (local)

Prerequisites: **Node.js 18+** and npm.

```bash
# 1. From the repo root, install everything and create .env files:
npm run setup
#    (equivalent to: npm install in root, backend, and frontend,
#     and copying each .env.example → .env)

# 2. Fill in backend/.env  (at minimum set ADMIN_TOKEN to use /admin).
#    Google Sheets and Twilio are optional for local testing — the app
#    degrades gracefully when they're not configured.

# 3. Run both servers together:
npm run dev
```

- Frontend → **http://localhost:5173**
- Backend → **http://localhost:4000**

The Vite dev server proxies `/api/*` and `/uploads/*` to the backend, so no CORS or base-URL config
is needed locally.

> Prefer to run them separately?
> `npm --prefix backend run dev` and `npm --prefix frontend run dev`.

### Production build

```bash
npm run build              # builds backend (tsc) and frontend (vite)
npm --prefix backend run start    # serves the compiled API from dist/
npm --prefix frontend run preview # previews the built frontend
```

---

## Environment variables

### `backend/.env`

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | no (4000) | API port. |
| `NODE_ENV` | no | `development` / `production`. |
| `CORS_ORIGIN` | yes (prod) | Comma-separated allowed frontend origins, e.g. `https://techlifted.vercel.app`. |
| `ADMIN_TOKEN` | yes (for /admin) | Secret token gating `GET /api/applications` and WhatsApp invites. |
| `DATABASE_URL` | **yes** | Postgres connection string (free from Neon). Same value locally and in production. |
| `UPLOAD_DIR` | no | Upload directory (default `uploads`). |
| `MAX_UPLOAD_BYTES` | no | Max file size (default `5242880` = 5MB). |
| `DEFAULT_COUNTRY_CODE` | no | Default phone country code (default `+91`). |
| `GOOGLE_SERVICE_ACCOUNT_BASE64` | for Sheets | base64-encoded service-account JSON. |
| `GOOGLE_SHEET_ID` | for Sheets | Spreadsheet ID from the sheet URL. |
| `GOOGLE_SHEET_NAME` | no | Tab name (default `TechLiftED Enrollment Data`). |
| `TWILIO_ACCOUNT_SID` | for WhatsApp | Twilio Account SID. |
| `TWILIO_AUTH_TOKEN` | for WhatsApp | Twilio Auth Token. |
| `TWILIO_WHATSAPP_FROM` | for WhatsApp | Sender, e.g. `whatsapp:+14155238886`. |
| `WHATSAPP_COMMUNITY_LINK` | for WhatsApp | Community invite link sent in messages. |

Generate a strong admin token:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### `frontend/.env`

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | prod only | Deployed backend origin. **Leave empty in local dev** (the proxy handles it). |
| `VITE_API_PROXY_TARGET` | no | Dev proxy target (default `http://localhost:4000`). |
| `VITE_WHATSAPP_COMMUNITY` | recommended | Public WhatsApp community link shown across the site. |

---

## Database setup

The backend stores applications and contact messages in **PostgreSQL**. The free, recommended host
is **Neon** (serverless Postgres) — your data persists across deploys and restarts.

1. Sign up at **https://neon.tech** (GitHub login works).
2. Create a project (name it `techlifted`; pick a region near your users).
3. On the project dashboard, copy the **Connection string** — it looks like
   `postgresql://user:password@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require`.
4. Put it in `backend/.env` as `DATABASE_URL=...`, and set the same value in your host (Render).
   Use the **same** connection string locally and in production so they share one database.

The backend creates its tables automatically on first start. `GET /api/health` shows
`database: true` when connected.

## Google Sheets setup

The backend appends every successful application as a row to a Google Sheet (in addition to storing
it in Postgres). Setup is a one-time process:

1. **Create a Google Cloud project** — <https://console.cloud.google.com/> → *Select a project* →
   *New Project*.
2. **Enable the Sheets API** — *APIs & Services → Library* → search **Google Sheets API** →
   **Enable**.
3. **Create a service account** — *APIs & Services → Credentials → Create Credentials → Service
   account*. Give it a name; no special roles are needed.
4. **Create a JSON key** — open the service account → *Keys → Add Key → Create new key → JSON*.
   A `*.json` file downloads. **Keep it secret.**
5. **Create your spreadsheet** — make a new Google Sheet. Copy its **ID** from the URL:
   `https://docs.google.com/spreadsheets/d/`**`THIS_IS_THE_ID`**`/edit`.
   The backend will create a tab named `TechLiftED Enrollment Data` and add headers automatically.
6. **Share the sheet with the service account** — open the JSON key, copy the `client_email`
   (looks like `name@project.iam.gserviceaccount.com`), then **Share** the spreadsheet with that
   email as **Editor**.
7. **Base64-encode the key** into `GOOGLE_SERVICE_ACCOUNT_BASE64`:

   - macOS / Linux:
     ```bash
     base64 -i service-account.json | tr -d '\n'
     ```
   - Windows (PowerShell):
     ```powershell
     [Convert]::ToBase64String([IO.File]::ReadAllBytes("service-account.json"))
     ```

8. Paste that string into `backend/.env` as `GOOGLE_SERVICE_ACCOUNT_BASE64`, set `GOOGLE_SHEET_ID`,
   and restart the backend.

**Resilience:** Sheets appends are wrapped in try/catch with **3 retries**. If Sheets is down, the
applicant is still saved to SQLite and the API returns success with a non-blocking warning — you
never lose an applicant. Check `GET /api/health` to confirm `googleSheets: true`.

---

## Twilio WhatsApp setup

> **Important reality:** WhatsApp does **not** allow programmatically adding someone to a
> Community/Group via any official API. TechLiftED therefore sends each applicant an **invite
> message** containing your community link — they tap to join themselves.

1. **Create a Twilio account** — <https://www.twilio.com/try-twilio>.
2. **Activate WhatsApp:**
   - *Testing:* Console → *Messaging → Try it out → Send a WhatsApp message* to activate the
     **WhatsApp Sandbox**. You'll get a sandbox sender like `whatsapp:+14155238886`. Recipients must
     first join the sandbox by sending the given `join <code>` message.
   - *Production:* register a **WhatsApp Business sender** and a message template (Twilio →
     *Messaging → Senders → WhatsApp senders*). Production sends require an approved template.
3. **Copy credentials** from the Console dashboard:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_FROM` = your sandbox/business sender, including the `whatsapp:` prefix.
4. **Create your WhatsApp Community/Group** in the WhatsApp app, open its invite link, and copy it
   into `WHATSAPP_COMMUNITY_LINK`. Use the same link in `frontend/.env`'s `VITE_WHATSAPP_COMMUNITY`.
5. Restart the backend. `GET /api/health` should report `twilioWhatsApp: true`.

**Sending invites:** go to `/admin`, enter your `ADMIN_TOKEN`, and click **Send Invites** (optionally
within a date range). The message sent is:

> Welcome to TechLiftED! Tap to join our student community for class updates and support: *{link}*

Each recipient is marked `whatsapp_invited = true` on success, so re-running never double-sends.
Transient failures retry up to 3 times; invalid numbers are skipped and logged.

---

## How the app works

**Application flow (`/apply`):** a 4-step form (Personal → Program & Devices → Documents → Review)
with a progress bar, inline validation, large mobile tap targets, and optional PDF uploads. On
submit the backend:

1. Validates & sanitizes every field; normalizes the phone to **E.164** (`+91…`).
2. Saves the application to **SQLite**.
3. Appends a row to **Google Sheets** (with retries) — non-blocking.
4. Returns success (plus any warning if Sheets failed), and the UI shows an enrolled confirmation
   with the WhatsApp community link.

**Pages:** Home, Programs, three Program detail pages (`/programs/engineering|coding|ai-tools`),
Apply, About, Contact, Admin, and a 404. A floating WhatsApp button is present site-wide.

---

## API reference

Base URL: `http://localhost:4000` in dev.

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/health` | — | Liveness + which integrations are configured. |
| `POST` | `/api/applications` | — | Submit an application (`multipart/form-data`). PDF uploads `marksheet`, `idProof` (≤5MB each). |
| `GET` | `/api/applications` | admin | List all applications. |
| `POST` | `/api/contact` | — | Submit a contact message (`{ name, email, message }`). Saved to SQLite + a "Contact Messages" sheet tab. |
| `GET` | `/api/contact` | admin | List all contact messages. |
| `POST` | `/api/whatsapp/invite` | admin | Send WhatsApp invites to un-invited applicants. Body: `{ from?, to? }` ISO dates. |

**Admin auth:** send the token as `Authorization: Bearer <ADMIN_TOKEN>` or `x-admin-token: <token>`.

Example submission:

```bash
curl -X POST http://localhost:4000/api/applications \
  -F "fullName=Priya Sharma" -F "email=priya@example.com" \
  -F "countryCode=+91" -F "phone=9876543210" \
  -F "state=Maharashtra" -F "program=coding" \
  -F 'devices=["Laptop","Smartphone"]' -F "agree=true"
```

---

## Admin dashboard

Visit **`/admin`** and enter your `ADMIN_TOKEN` (stored only in your browser session). You can:

- View every application (contact, program, devices, uploaded files).
- See totals: total / invited / pending invite.
- Send WhatsApp community invites with an optional date-range filter and a live results toast.

---

## Deployment

The frontend and backend deploy independently.

### Backend → Render or Railway

**Render (web service):**
1. Push this repo to GitHub.
2. Render → *New → Web Service* → connect the repo.
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
4. **Environment:** add every variable from `backend/.env` (set `CORS_ORIGIN` to your frontend URL,
   plus `ADMIN_TOKEN`, Google, Twilio values). Render sets `PORT` automatically.
5. **Database:** set `DATABASE_URL` to your Neon Postgres connection string (see
   [Database setup](#database-setup)). Because the database is hosted on Neon, your data persists
   across deploys and restarts — no Render disk needed.

**Railway:**
1. Railway → *New Project → Deploy from GitHub repo*.
2. Set the service **Root Directory** to `backend`.
3. Build: `npm install && npm run build`; Start: `npm run start`.
4. Add the same environment variables, including `DATABASE_URL` (your Neon string). No volume is
   needed since the database is hosted on Neon.

### Frontend → Vercel or Netlify

**Vercel:**
1. Vercel → *Add New → Project* → import the repo.
2. **Root Directory:** `frontend`. Framework preset: **Vite**.
   - Build Command: `npm run build` · Output Directory: `dist`.
3. **Environment Variables:** set `VITE_API_BASE_URL` to your backend URL (e.g.
   `https://techlifted-api.onrender.com`) and `VITE_WHATSAPP_COMMUNITY` to your community link.
4. Add a rewrite so client-side routing works (already covered by Vercel's SPA handling for Vite;
   if needed, add `frontend/vercel.json` with a catch-all rewrite to `/index.html`).

**Netlify:**
1. Netlify → *Add new site → Import an existing project*.
2. **Base directory:** `frontend` · **Build command:** `npm run build` · **Publish directory:**
   `frontend/dist`.
3. Set the same `VITE_*` environment variables.
4. Add SPA fallback: a `frontend/public/_redirects` file containing `/*  /index.html  200`.

> After deploying, set the backend's `CORS_ORIGIN` to the exact frontend origin (no trailing slash).

---

## Troubleshooting

- **`/admin` says "Admin access is not configured"** — set `ADMIN_TOKEN` in `backend/.env` and
  restart.
- **Sheets not syncing** — confirm the sheet is shared with the service-account `client_email` as
  Editor, the base64 key is unbroken (no newlines), and `GET /api/health` shows `googleSheets: true`.
- **WhatsApp not sending** — in the Twilio Sandbox, recipients must first join the sandbox. For
  production, an approved template is required. Check `twilioWhatsApp: true` on `/api/health`.
- **CORS errors in production** — `CORS_ORIGIN` must exactly match the frontend origin.
- **Database connection fails** — confirm `DATABASE_URL` is set and ends with `?sslmode=require`
  (Neon requires SSL). `GET /api/health` reports `database: true` when connected.

---

## License

MIT — see individual package manifests.
