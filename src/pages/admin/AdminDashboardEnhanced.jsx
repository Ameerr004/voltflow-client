import { useEffect, useState } from "react";
import { getAllBookings, cancelBooking, getStations, getSlotWindows } from "../../api/api";
import { useAuth } from "../../auth/AuthContext.jsx";
import { fmtFull, nextDays, isoDate, dayLabel, dayNum, nowHHMM } from "../../utils/dates";

const DAYS = nextDays(4);
const initials = (email) => (email ? email.slice(0, 2).toUpperCase() : "??");

const statusPill = (status) => {
  if (status === "no-show") return "status-noshow";
  if (status === "completed") return "status-completed";
  if (status === "in-progress") return "status-progress";
  return "status-confirmed";
};

// Enhanced admin overview: utilization ring + peak-forecast panel + a day
// selector that filters the reservations list. The admin shell is AdminLayout.
const AdminDashboardEnhanced = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [stations, setStations] = useState([]);
  const [dayIdx, setDayIdx] = useState(0);
  const [windows, setWindows] = useState([]);

  const load = () => {
    const role = user?.role || "admin";
    getAllBookings(role).then(setBookings).catch((err) => console.error(err));
    getStations().then(setStations).catch((err) => console.error(err));
  };

  useEffect(load, [user]);

  // Time windows come straight from the database for the selected day.
  useEffect(() => {
    getSlotWindows(isoDate(DAYS[dayIdx])).then(setWindows).catch(() => setWindows([]));
  }, [dayIdx]);

  const handleCancel = async (id) => {
    await cancelBooking(id);
    load();
  };

  // Real machine utilization
  const activeMachines = stations.filter((s) => s.status === "online").length;
  const totalMachines = stations.length;

  // Reservations filtered to the selected day (compared in local time)
  const selectedDate = isoDate(DAYS[dayIdx]);
  const dayBookings = bookings.filter((b) => isoDate(new Date(b.slot_date)) === selectedDate);

  // Real peak forecast: windows come from the database; on "today" we drop any
  // window that has already finished (follows real time). Then count the
  // selected day's bookings per window and surface the busiest one.
  const hhmm = (t) => (t || "").slice(0, 5);
  const visibleWindows = dayIdx === 0
    ? windows.filter((w) => hhmm(w.end_time) > nowHHMM())
    : windows;
  const windowCounts = visibleWindows.map(
    (w) => dayBookings.filter((b) => hhmm(b.start_time) === hhmm(w.start_time)).length
  );
  const peakCount = windowCounts.length ? Math.max(0, ...windowCounts) : 0;
  const peakIdx = peakCount > 0 ? windowCounts.indexOf(peakCount) : -1;
  const peakLabel = peakIdx >= 0
    ? `${hhmm(visibleWindows[peakIdx].start_time)} - ${hhmm(visibleWindows[peakIdx].end_time)}`
    : "—";
  const peakLoad = totalMachines ? Math.min(100, Math.round((peakCount / totalMachines) * 100)) : 0;

  // Real trend: selected day's booking count vs. the previous day's.
  const prevDay = new Date(DAYS[dayIdx]);
  prevDay.setDate(prevDay.getDate() - 1);
  const prevDate = isoDate(prevDay);
  const prevCount = bookings.filter((b) => isoDate(new Date(b.slot_date)) === prevDate).length;
  const deltaPct = prevCount ? Math.round(((dayBookings.length - prevCount) / prevCount) * 100) : null;
  const deltaUp = deltaPct === null ? null : deltaPct >= 0;
  const deltaCls = deltaPct === null ? "status-completed" : deltaUp ? "status-confirmed" : "status-noshow";
  const deltaIcon = deltaUp === false ? "trending_down" : "trending_up";
  const deltaText = deltaPct === null ? "—" : `${deltaPct >= 0 ? "+" : ""}${deltaPct}%`;

  return (
    <div className="admin-main">
      <header className="admin-header">
        <div className="admin-header-inner">
          <div>
            <h2 className="headline-md fw-800">Dashboard Overview</h2>
            <p className="body-sm text-muted">Monitor station performance and daily reservations.</p>
          </div>
          <button className="btn btn-outline" onClick={load}>
            <span className="material-symbols-outlined">refresh</span> Refresh
          </button>
        </div>
      </header>

      <div className="admin-content flex-col gap-lg">
        {/* Top metrics */}
        <div className="grid-2 mt-md">
          <div className="metric-card">
            <span className="metric-label">Active Bookings
              <span className={`status-pill ${deltaCls}`} title={`vs ${fmtFull(prevDate)} (${prevCount} booking${prevCount === 1 ? "" : "s"})`}>
                <span className="material-symbols-outlined mi-14">{deltaIcon}</span> {deltaText}
              </span>
            </span>
            <div className="metric-value metric-xl">{dayBookings.length}</div>
          </div>

          <div className="metric-card">
            <span className="metric-label">Machine Utilization
              <span className="material-symbols-outlined text-secondary">ev_station</span>
            </span>
            <div className="flex items-center gap-md mt-auto">
              <div>
                <div className="metric-value metric-lg">{activeMachines} <span className="title-lg text-muted">/ {totalMachines}</span></div>
                <span className="body-sm text-muted">Machines Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Peak forecast panel */}
        <div className="card forecast-card">
          <div className="flex justify-between items-center">
            <span className="label-md uppercase forecast-eyebrow">
              <span className="material-symbols-outlined forecast-icon">insights</span> Peak Forecast
            </span>
          </div>
          <h4 className="headline-md forecast-peak">{peakLabel}</h4>
          <p className="body-sm forecast-sub">
            {peakIdx >= 0 ? `Predicted ${peakLoad}% capacity load` : "No bookings yet for this day"}
          </p>
          <div className="flex items-end gap-sm forecast-bars">
            {windowCounts.map((c, i) => {
              const h = totalMachines ? Math.min(100, Math.max(6, Math.round((c / totalMachines) * 100))) : 6;
              return (
                <div
                  key={i}
                  className={`forecast-bar ${i === peakIdx ? "peak" : ""}`}
                  title={`${hhmm(visibleWindows[i].start_time)} - ${hhmm(visibleWindows[i].end_time)}: ${c} booking${c === 1 ? "" : "s"}`}
                  style={{ height: `${h}%` }}
                />
              );
            })}
          </div>
        </div>

        {/* Reservations table (filtered by selected day) */}
        <section className="flex-col gap-md">
          <div className="flex justify-between items-end flex-wrap gap-sm">
            <div>
              <h3 className="headline-md fw-800">Reservations</h3>
              <p className="body-sm text-muted">Showing bookings for {fmtFull(selectedDate)}.</p>
            </div>
            <div className="date-toggle">
              {DAYS.map((d, i) => (
                <button key={i} className={`date-btn ${dayIdx === i ? "active" : ""}`} onClick={() => setDayIdx(i)}>
                  <span className="day">{dayLabel(d, i)}</span>
                  <span className="num">{dayNum(d)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Date</th>
                  <th>Station</th>
                  <th>Time Slot</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {dayBookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div className="flex items-center gap-sm">
                        <div className="avatar avatar-primary">{initials(b.booked_by)}</div>
                        <span className="fw-600">{b.booked_by}</span>
                      </div>
                    </td>
                    <td className="text-muted">{fmtFull(b.slot_date)}</td>
                    <td><span className="tag font-mono">{b.station_name}</span></td>
                    <td className="text-muted fw-500">{b.start_time} - {b.end_time}</td>
                    <td><span className={`status-pill ${statusPill(b.status)}`}><span className="dot dot-primary" />{b.status}</span></td>
                    <td className="text-right">
                      <button className="btn btn-outline" onClick={() => handleCancel(b.id)}>Cancel</button>
                    </td>
                  </tr>
                ))}
                {dayBookings.length === 0 && (
                  <tr><td colSpan={6} className="text-center text-muted pad-lg">No reservations for {fmtFull(selectedDate)}.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardEnhanced;
