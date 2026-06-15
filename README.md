# VoltFlow — Frontend

> A responsive, full-stack **EV charging network** web app built with **React + Vite**. Drivers find chargers, reserve real date/time slots, and track their charging history; admins manage the fleet, time-slots, and view network-wide analytics.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Authentication & Authorization](#authentication--authorization)
- [Routing Structure](#routing-structure)
- [Third-Party API](#third-party-api)
- [Environment & Configuration](#environment--configuration)
- [Getting Started](#getting-started)

---

## Overview

VoltFlow is a role-based EV-charging platform with two user types: **Driver (user)** and **Admin**. Drivers browse stations, book a 2-hour charging slot on a chosen day, manage upcoming reservations, and review completed sessions. Admins manage charging units (full CRUD), edit/block/delete individual time-slots, upload station photos, and monitor live metrics including a real **peak-demand forecast** and **booking history** across all drivers.

The UI is a custom plain-CSS design system enhanced with the **React-Bootstrap** UI framework (responsive grid, spinners, alerts). The landing page integrates a live **Open-Meteo** weather API.

---

## Features

### Driver (user)
- Browse all stations on **Find a Charger** with a live online/total count
- View a station's real **date-based slot grid** (booked / blocked / available; past slots auto-hide on "today")
- **Reserve a slot** (must be signed in — a Bootstrap alert prompts otherwise)
- **My Bookings** in two views: a table and a creative card layout (upcoming only)
- **Charging History** — completed sessions appear automatically once their time has passed
- Animated landing page with a coded charging-network hub and live weather

### Admin
- **Dashboard Overview** — real metrics (active bookings, total/active machines, busiest slot)
- **Enhanced Overview** — day selector, a real **peak-demand forecast** (busiest window + capacity load from live bookings, time-windows pulled from the database), and a real day-over-day trend pill
- **Manage Machines (Fleet)** — register / **edit** / remove units, **upload a station photo**, toggle Available/Maintenance
- Per-unit **daily slot grid** — block/unblock, **edit a slot's time**, **delete a slot**, add custom timeslots (with server-side overlap validation)
- **Booking History** — every driver's completed sessions network-wide

### Public
- Marketing landing page, About Us page, sign in / sign up
- Role-based redirect after login (admin → dashboard, driver → stations)

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19.1 | UI library |
| React Router DOM | 7.16 | Client-side routing |
| Vite | 6 | Build tool & dev server |
| React-Bootstrap + Bootstrap | 2.10 / 5.3 | UI framework (grid, spinners, alerts) |
| Plain CSS | — | Custom design system (tokens + component classes) |
| Open-Meteo API | — | Live weather widget on the landing page |

---

## Project Structure

```
src/
├── api/
│   └── api.js                    # Central fetch-based API service layer
├── auth/
│   ├── AuthContext.jsx           # useAuth() — in-memory session (user/login/logout)
│   └── RequireRole.jsx           # Route guard (any signed-in user / admin-only)
├── components/
│   ├── navigation/               # Navbar, Sidebar, Footer
│   ├── station/                  # StationCard
│   └── WeatherWidget.jsx         # Open-Meteo live weather card
├── layouts/
│   ├── PublicLayout.jsx          # Navbar + Outlet + Footer
│   └── AdminLayout.jsx           # Sidebar + Outlet
├── pages/
│   ├── landing/                  # Landing.jsx + Landing.css (animated hub + weather)
│   ├── about/                    # About.jsx + About.css
│   ├── auth/                     # SignIn, SignUp
│   ├── user/                     # StationDiscovery, MachineDetails, MyBookings,
│   │                             #   MyBookingsCreative, BookingHistory
│   └── admin/                    # AdminDashboard, AdminDashboardEnhanced,
│                                 #   ManageMachines, AllHistory
├── routes/
│   └── AppRoutes.jsx             # Full route tree with role protection
├── styles/
│   ├── index.css                 # Design tokens + base + helpers
│   ├── App.css                   # Component classes
│   └── extras.css                # Utility + replacement classes (no inline styles)
├── utils/
│   ├── dates.js                  # Local-safe date/slot helpers
│   └── image.js                  # Client-side image resize/compress for uploads
├── App.jsx                       # Renders <AppRoutes/>
└── main.jsx                      # BrowserRouter + AuthProvider + Bootstrap CSS
```

---

## Authentication & Authorization

The session is kept **in memory only** (React Context), so the app always starts logged-out on a fresh load — no stale sessions.

| Step | Details |
|---|---|
| **Sign up** | `POST /api/auth/signup` — always creates a **driver** (`role: user`, server-enforced), then redirects to `/stations` |
| **Sign in** | `POST /api/auth/login` — role comes from the database; admin → `/admin`, driver → `/stations` |
| **Authorization** | `RequireRole.jsx` guards routes — no role = any signed-in user; `role="admin"` = admin only |
| **Logout** | Clears the in-memory session and returns to `/` |

There is exactly **one admin account** (provisioned in the database); the public signup can never create an admin.

---

## Routing Structure

```
/                       → Landing (public)
/about                  → About Us (public)
/signin                 → Sign In
/signup                 → Sign Up
/stations               → Find a Charger (public)
/stations/:id           → Machine details + slot booking (public)

/bookings               → My Bookings (table)        [signed-in]
/bookings/cards         → My Bookings (cards)         [signed-in]
/history                → Charging History            [signed-in]

/admin                  → Dashboard Overview          [admin]
/admin/enhanced         → Enhanced Overview           [admin]
/admin/manage-machines  → Manage Machines (Fleet)     [admin]
/admin/history          → Booking History (all users) [admin]

*                       → Redirect to /
```

---

## Third-Party API

The landing page integrates the free **[Open-Meteo](https://open-meteo.com/)** weather API (no key required, CORS-enabled). The `WeatherWidget` fetches current conditions for the network's location and renders temperature, a condition icon, and wind speed:

```
GET https://api.open-meteo.com/v1/forecast
      ?latitude=31.95&longitude=35.93
      &current=temperature_2m,weather_code,wind_speed_10m&timezone=auto
```

---

## Environment & Configuration

The backend URL is **not hardcoded** — it comes from a Vite environment variable. Copy `.env.example` to `.env` and set:

```env
# Base URL of the backend server (no trailing slash, no /api suffix)
VITE_SERVER_URL=http://localhost:5001
```

`src/api/api.js` reads it and appends `/api` (trailing slashes are stripped so the URL is never broken):

```js
const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5001";
const API_URL = `${SERVER_URL.replace(/\/+$/, "")}/api`;
```

| Variable | Description |
|---|---|
| `VITE_SERVER_URL` | Base URL of the backend API server (e.g. `http://localhost:5001` in dev, your hosted URL in production) |

> `.env` is git-ignored; `.env.example` is committed so others know what to set. Vite exposes all `VITE_*` vars to the browser — **never** put secrets there. Restart `npm run dev` after changing `.env`. The Vite dev server runs the client on **http://localhost:3000**.

---

## Getting Started

**Prerequisites:** Node.js 18+, npm, and the VoltFlow backend running.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (needs the backend on :5001)
npm run dev          # http://localhost:3000
```

```bash
# Build for production
npm run build

# Preview the production build
npm run preview

# Lint
npm run lint
```

---

> © 2026 VoltFlow. Built for the HTU Full-Stack Web Application assignment.
