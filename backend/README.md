# Trust-Mediated Grievance Platform — Backend

Production-ready Node.js/Express backend for a community-driven grievance resolution platform with anonymous complaints, AI summarization, community trust scoring, and automated escalation.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js ≥18 |
| Framework | Express.js 4 |
| Database | Supabase (PostgreSQL) |
| Auth | JWT + bcrypt |
| AI | Google Gemini 1.5 Flash |
| Storage | Supabase Storage |
| Realtime | Supabase Realtime |
| Scheduling | node-cron |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# 3. Run database schema
# Copy supabase/schema.sql into Supabase SQL Editor and run

# 4. (Optional) Seed sample data
# Copy supabase/seed.sql into Supabase SQL Editor and run

# 5. Start development server
npm run dev
```

Server starts at `http://localhost:5000`. Health check: `GET /api/health`.

## Architecture

```
src/
├── config/          # Environment, Supabase clients, constants
├── controllers/     # Request handlers (thin, delegate to services)
├── middleware/       # Auth, validation, rate limiting, error handling
├── models/          # Data access layer (Supabase queries)
├── routes/          # Express route definitions
├── services/        # Business logic layer
├── validators/      # express-validator rule sets
├── utils/           # Response helpers, logger, code generator
├── jobs/            # Cron jobs (escalation)
├── app.js           # Express app factory
└── server.js        # Server entry point
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | No | Register new user |
| POST | `/api/auth/login` | No | User login |
| POST | `/api/auth/admin-login` | No | Admin-only login |
| POST | `/api/complaints/create` | Yes | Submit complaint |
| GET | `/api/complaints/list` | Yes | List complaints (filtered) |
| GET | `/api/complaints/:id` | Yes | Get complaint details |
| GET | `/api/complaints/track/:code?pin=` | No | Public complaint tracking |
| PUT | `/api/complaints/:id/update` | Yes | Update complaint |
| POST | `/api/complaints/:id/upload-proof` | Yes | Upload media files |
| POST | `/api/timeline/:id/add` | Admin/NGO | Add timeline entry |
| GET | `/api/timeline/:id` | Yes | Get complaint timeline |
| POST | `/api/validation/:id/vote` | Yes | Community support vote |
| POST | `/api/validation/:id/verify` | Validator | Trusted verification |
| POST | `/api/ai/process-complaint` | Admin | AI complaint analysis |
| GET | `/api/admin/dashboard-stats` | Admin | Dashboard statistics |
| GET | `/api/admin/queues` | Admin | Complaint queues |
| POST | `/api/admin/assign/:id` | Admin | Assign complaint |
| POST | `/api/admin/resolve/:id` | Admin | Resolve complaint |

## Status Flow

```
Submitted → Verified → Assigned → Under Review → Action Taken → Resolved
    ↓           ↓          ↓            ↓
  Escalated  Escalated  Escalated   Escalated → Assigned / Under Review
```

## Environment Variables

See `.env.example` for all required configuration.

## Scripts

```bash
npm run dev     # Start with nodemon (auto-reload)
npm start       # Production start
npm run lint    # ESLint check
```
