import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { getUserBookings, cancelBooking } from "../../api/api";
import { useAuth } from "../../auth/AuthContext.jsx";
import { fmtFull } from "../../utils/dates";

// Table variant of "My Bookings". Reads the user's upcoming booked slots.
const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    if (!user) return;
    setLoading(true);
    getUserBookings(user.email)
      .then(setBookings)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(load, [user]);

  const handleCancel = async (id) => {
    await cancelBooking(id);
    load();
  };

  return (
    <main className="main flex-col">
      <div className="mb-lg">
        <h1 className="headline-lg">My Bookings</h1>
        <p className="body-lg text-muted">Manage your upcoming EV charging reservations.</p>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading bookings…</span>
          </Spinner>
        </div>
      ) : (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Station</th>
              <th>Slot</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td className="fw-500">{fmtFull(b.slot_date)}</td>
                <td className="mono-id">{b.station_name}</td>
                <td className="text-muted">{b.start_time} - {b.end_time}</td>
                <td>
                  <span className="status-pill status-confirmed">
                    <span className="dot dot-primary pulse" /> Confirmed
                  </span>
                </td>
                <td className="text-right">
                  <button className="btn btn-danger" onClick={() => handleCancel(b.id)}>Cancel</button>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted pad-lg">
                  No bookings yet. Find a charger to make your first reservation.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      )}
    </main>
  );
};

export default MyBookings;
