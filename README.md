# Passify

Passify is a full-stack event ticketing platform for discovering experiences, selling tickets, and checking guests in at the door. Attendees browse and book events, receive QR tickets instantly, and keep everything in one place. Organisers create events, manage sales, and run fast entry validation without the usual admin chaos.

## Features

### For attendees
- Browse and search published events by category
- Book free tickets or pay securely via Paystack (GHS)
- Receive QR tickets by email and view them in **My Tickets**
- Google sign-in with role selection (attendee or organiser)

### For organisers
- Create and manage events with venue, capacity, pricing, and cover images
- Pick event locations with Mapbox
- Upload event images via Cloudinary
- Track ticket sales from the organiser dashboard
- Invite door validators with magic links
- Receive in-app notifications for approvals, bookings, and updates

### For validators & admins
- Validate tickets at the door with a 6-digit event PIN and QR scanner
- Admin review workflow for pending events (approve, reject, or cancel)

## Tech stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React 19, Vite, React Router, Tailwind CSS, shadcn/ui, Mapbox GL |
| **Backend** | Node.js, Express, Prisma, PostgreSQL |
| **Auth** | Google OAuth, JWT |
| **Payments** | Paystack |
| **Email** | Brevo (Sendinblue) |
| **Media** | Cloudinary |

## Project structure

```
passify/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── pages/       # Route pages
│       ├── components/  # UI and layout
│       ├── context/     # Auth state
│       └── services/    # API client
└── server/          # Express API
    ├── prisma/          # Schema and migrations
    └── src/
        ├── controllers/
        ├── routes/
        ├── middleware/
        └── services/
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- PostgreSQL database
- Accounts / API keys for:
  - Google OAuth
  - Paystack
  - Mapbox
  - Cloudinary
  - Brevo (email)

## Getting started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd passify
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `server/.env` file:

```env
PORT=3000
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/passify
JWT_SECRET=your_jwt_secret

# Google OAuth (used by the client; server verifies tokens)
# No server-side Google client secret required for token verification

# Paystack
PAYSTACK_SECRET_KEY=sk_test_...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Email (Brevo)
BREVO_API_KEY=...
EMAIL_USER=noreply@yourdomain.com
```

Run database migrations and start the API:

```bash
npx prisma migrate deploy
npm run dev
```

The server runs at `http://localhost:3000`.

### 3. Set up the frontend

In a new terminal:

```bash
cd client
npm install
```

Create a `client/.env` file:

```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_MAPBOX_TOKEN=your_mapbox_token
```

Start the dev server:

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

## Available scripts

### Client (`client/`)

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

### Server (`server/`)

| Command | Description |
| --- | --- |
| `npm run dev` | Start API with nodemon |
| `npm start` | Start production server |
| `npm run build` | Generate Prisma client |

## User roles

| Role | Description |
| --- | --- |
| **ATTENDEE** | Browse events, purchase tickets, manage profile |
| **ORGANISER** | Create events, manage sales, assign validators |
| **ADMIN** | Review and approve/reject submitted events |

## API overview

| Route prefix | Purpose |
| --- | --- |
| `/api/auth` | Google login, profile, role selection |
| `/api/events` | Public and organiser event management |
| `/api/tickets` | Ticket booking and retrieval |
| `/api/payments` | Paystack payment initialization and verification |
| `/api/validators` | Door validator access |
| `/api/scans` | QR ticket validation |
| `/api/notifications` | In-app notifications |
| `/api/admin` | Event approval and admin actions |
| `/health` | Server health check |

## Deployment

- **Frontend:** configured for SPA routing on Vercel (`client/vercel.json`).
- **Backend:** deploy the Express server with `DATABASE_URL` and the other environment variables set in your host.
- **Database:** run `npx prisma migrate deploy` against your production PostgreSQL instance before starting the server.

## Team

Built by Arnold Agbenyo and Lawrencia Adu Nyarkoa.

## License

Private project. All rights reserved.
