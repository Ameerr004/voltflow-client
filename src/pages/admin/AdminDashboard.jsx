import { useEffect, useState } from "react";
import { getAllBookings, cancelBooking, getStations } from "../../api/api";
import { useAuth } from "../../auth/AuthContext.jsx";
import { fmtFull } from "../../utils/dates";

// Master admin dashboard: 3 metrics + reservations table. The admin shell
// (sidebar + glows) is provided by AdminLayout; this renders only .admin-main.
const AdminDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [stations, setStations] = useState([]);

  const load = () => {
    const role = user?.role || "admin";
    getAllBookings(role).then(setBookings).catch((err) => console.error(err));
    getStations().then(setStations).catch((err) => console.error(err));
  };

  useEffect(load, [user]);

  // Real metrics derived from live data
  const activeMachines = stations.filter((s) => s.status === "online").length;
  const totalMachines = stations.length;
  const busiestSlot = (() => {
    if (bookings.length === 0) return "—";
    const counts = {};
    bookings.forEach((b) => {
      const key = `${b.start_time} - ${b.end_time}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  })();

  const handleCancel = async (id) => {
    await cancelBooking(id);
    load();
  };

  return (
    <div className="admin-main">
      <header className="admin-header">
        <div className="admin-header-inner">
          <h2 className="headline-lg">Dashboard Overview</h2>
          <span className="glass-badge">
            <span className="material-symbols-outlined mi-16">bolt</span>
            Live Status: Active
          </span>
        </div>
      </header>

      <div className="admin-content flex-col gap-xl">
        {/* Metrics */}
        <div className="grid-3 mt-md">
          <div className="metric-card">
            <span className="metric-label">Active Bookings
              <span className="material-symbols-outlined text-primary">calendar_month</span>
            </span>
            <div className="metric-value">
              {bookings.length}
              <span className="body-md text-primary metric-badge">
                <span className="material-symbols-outlined mi-16 mi-mid">arrow_upward</span> 12%
              </span>
            </div>
          </div>
          <div className="metric-card">
            <span className="metric-label">Total Machines
              <span className="material-symbols-outlined text-secondary">ev_station</span>
            </span>
            <div className="metric-value">{activeMachines} <span className="headline-md text-muted fw-500">/ {totalMachines}</span></div>
          </div>
          <div className="metric-card">
            <span className="metric-label">Busiest Slot
              <span className="material-symbols-outlined ic-tertiary">schedule</span>
            </span>
            <div className="headline-lg pt-base">{busiestSlot}</div>
          </div>
        </div>

        {/* Reservations table */}
        <section className="flex-col gap-md">
          <div className="flex justify-between items-end section-underline">
            <h3 className="title-lg flex items-center gap-sm">
              <span className="title-accent" />
              Current Day Reservations
            </h3>
            <div className="label-md text-muted">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Date</th>
                  <th>Machine / Station</th>
                  <th>Selected Slot</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="fw-500">{b.booked_by}</td>
                    <td className="text-muted">{fmtFull(b.slot_date)}</td>
                    <td className="mono-id">{b.station_name}</td>
                    <td>{b.start_time} - {b.end_time}</td>
                    <td className="text-right">
                      <button className="btn btn-outline" onClick={() => handleCancel(b.id)}>Cancel</button>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr><td colSpan={5} className="text-center text-muted pad-lg">No upcoming reservations.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
