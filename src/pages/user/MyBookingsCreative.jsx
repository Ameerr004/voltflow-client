import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserBookings, cancelBooking } from "../../api/api";
import { useAuth } from "../../auth/AuthContext.jsx";
import { fmtFull } from "../../utils/dates";

// Creative card variant of "My Bookings": summary stats + reservation cards.
const MyBookingsCreative = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  const load = () => {
    if (!user) return;
    getUserBookings(user.email).then(setBookings).catch((err) => console.error(err));
  };

  useEffect(load, [user]);

  const handleCancel = async (id) => {
    await cancelBooking(id);
    load();
  };

  return (
    <main className="main flex-col gap-lg">
      <div className="flex justify-between items-end flex-wrap gap-md">
        <div>
          <h1 className="headline-lg">My Bookings</h1>
          <p className="body-lg text-muted">Manage your upcoming EV charging reservations.</p>
        </div>
        <div className="flex gap-sm">
          <button className="btn btn-outline" onClick={() => navigate("/bookings")}>
            <span className="material-symbols-outlined mi-18">table_rows</span> Table View
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/stations")}>
            <span className="material-symbols-outlined mi-18">ev_station</span> Find Nearest Station
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid-3">
        <div className="stat-card">
          <div className="stat-ring">{bookings.length}</div>
          <div>
            <p className="kv-label">Upcoming Bookings</p>
            <p className="body-md">Active reservations</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-ring stat-ring-plain">
            <span className="material-symbols-outlined">schedule</span>
          </div>
          <div>
            <p className="kv-label">Total Charging Time</p>
            <p className="headline-md lh-1">{(bookings.length * 2).toFixed(1)} <span className="body-md text-muted">hrs</span></p>
          </div>
        </div>
      </div>

      {/* Reservation cards */}
      <div className="grid-3">
        {bookings.map((b) => (
          <div key={b.id} className="card booking-card">
            <div className="booking-card-bar" />
            <div className="booking-card-body">
              <div className="flex justify-between items-start">
                <span className="status-pill status-confirmed">
                  <span className="dot dot-primary pulse" /> Confirmed
                </span>
                <div className="text-right">
                  <p className="kv-label">Date</p>
                  <p className="title-lg">{fmtFull(b.slot_date)}</p>
                </div>
              </div>

              <div className="booking-divider">
                <div className="booking-row">
                  <span className="material-symbols-outlined text-primary">ev_station</span>
                  <div>
                    <p className="kv-label">Station</p>
                    <p className="label-md text-primary">{b.station_name}</p>
                  </div>
                </div>
                <div className="booking-row">
                  <span className="material-symbols-outlined text-muted">schedule</span>
                  <div>
                    <p className="kv-label">Time Slot</p>
                    <p className="body-md">{b.start_time} - {b.end_time}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="btn btn-danger" onClick={() => handleCancel(b.id)}>Cancel Booking</button>
              </div>
            </div>
          </div>
        ))}
        {bookings.length === 0 && <p className="text-muted">No bookings yet.</p>}
      </div>
    </main>
  );
};

export default MyBookingsCreative;
