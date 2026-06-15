// Thin API abstraction over fetch. The reference store-app calls fetch directly
// inside components; we keep the same fetch-based approach but centralise the
// base URL and request shape here so every component talks to the backend the
// same way (the "integration-ready" service layer).

// Backend base URL comes from the environment (Vite). Never hardcode it and
// never put secrets in VITE_* vars — they are bundled into the browser.
// Falls back to localhost for convenience if the variable is not set.
const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5001";
// Strip any trailing slashes so we never build a broken URL like "//api/...".
const API_URL = `${SERVER_URL.replace(/\/+$/, "")}/api`;

async function request(path, { method = "GET", body, role } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (role) headers["x-role"] = role; // admin-gated endpoints read this header

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // Network / server-unreachable errors
    throw new Error("Cannot reach the server. Please make sure the backend is running.");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

/* ---- Auth ---- */
export const login = (email, password) =>
  request("/auth/login", { method: "POST", body: { email, password } });

// Signups are always regular users — the server ignores any role sent here.
export const signup = (email, password) =>
  request("/auth/signup", { method: "POST", body: { email, password } });

/* ---- Stations ---- */
export const getStations = () => request("/stations");
export const getStation = (id) => request(`/stations/${id}`);
export const createStation = (station, role) =>
  request("/stations", { method: "POST", body: station, role });
export const updateStation = (id, station, role) =>
  request(`/stations/${id}`, { method: "PUT", body: station, role });
export const deleteStation = (id, role) =>
  request(`/stations/${id}`, { method: "DELETE", role });

/* ---- Slots (availability grid, per station + date) ---- */
export const getSlots = (stationId, date) =>
  request(`/slots?station_id=${stationId}&date=${date}`);
export const getSlotWindows = (date) => request(`/slots/windows?date=${date}`);
export const addSlot = (slot, role) =>
  request("/slots", { method: "POST", body: slot, role }); // admin
export const setSlotStatus = (id, status, role) =>
  request(`/slots/${id}`, { method: "PUT", body: { status }, role }); // admin block/unblock
export const updateSlotTime = (id, times, role) =>
  request(`/slots/${id}`, { method: "PUT", body: times, role }); // admin edit { start_time, end_time }
export const deleteSlot = (id, role) =>
  request(`/slots/${id}`, { method: "DELETE", role }); // admin
export const bookSlot = (id, email) =>
  request(`/slots/${id}/book`, { method: "POST", body: { email } });

/* ---- Bookings (a booking is a booked slot) ---- */
export const getUserBookings = (email) => request(`/bookings/${email}`);          // upcoming
export const getAllBookings = (role) => request("/bookings", { role });           // upcoming (admin)
export const getUserHistory = (email) => request(`/bookings/${email}/history`);   // past
export const getAllHistory = (role) => request("/bookings/history", { role });    // past (admin)
export const cancelBooking = (id) =>
  request(`/bookings/${id}`, { method: "DELETE" });
