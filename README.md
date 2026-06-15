# voltflow-client

React + Vite front end for VoltFlow. Same architecture as the course reference
`05-FullStack/store-app/store-client`:

- **Vite 6 + React 19**, plain `.jsx` (no TypeScript)
- Arrow-function components, default export, in flat `src/components/`
- **No react-router** — `App.jsx` holds the current page in state and renders
  conditionally (the repo's pattern)
- State via `useState`/`useEffect` + props; user persisted in `localStorage`
- Data through `src/services/api.js` (fetch wrapper around `http://localhost:5000/api`)
- **Plain CSS** design system: `index.css` (tokens + base + helpers) and
  `App.css` (component classes). No Tailwind.

## Run

```bash
npm install
npm run dev      # http://localhost:3000  (needs voltflow-server on :5000)
```

## Pages (`page` state in App.jsx)

| `page` value | Component | From original file |
|---|---|---|
| `landing` | `Landing` | voltflow_landing_page.html |
| `signin` | `SignIn` | voltflow_sign_in.html |
| `stations` | `StationDiscovery` + `StationCard` | user_homepage_creative_station_discovery.html |
| `details` | `MachineDetails` | machine_details_booking_creative_light_view.html |
| `bookings` | `MyBookings` (table) | user_dashboard_my_bookings.html |
| `bookings-creative` | `MyBookingsCreative` (cards) | user_dashboard_creative_my_bookings.html |
| `admin` | `AdminDashboard` | admin_master_dashboard.html |
| `admin-enhanced` | `AdminDashboardEnhanced` | admin_dashboard_enhanced_creative_overview.html |

Shared: `Navbar`, `Sidebar`, `Footer`.

## Styling note

The original HTML was generated with **Tailwind (CDN) using arbitrary utility
values**. Per the chosen approach, styling was migrated to **plain CSS** (the
repo's convention) by porting the `tailwind.config` design tokens into CSS
custom properties and rebuilding each page against a unified set of semantic
component classes. The look is faithful and cohesive; it is intentionally a
clean re-creation rather than a pixel-for-pixel clone of every Stitch export.
Tweak values in `index.css` / `App.css` to fine-tune.
