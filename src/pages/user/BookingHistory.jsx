import { useEffect, useState } from "react";
import { getUserHistory } from "../../api/api";
import { useAuth } from "../../auth/AuthContext.jsx";
import { fmtFull } from "../../utils/dates";

// Charging history — the user's finished (past) bookings. A reservation moves
// here automatically once its time slot has ended.
const BookingHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!user) return;
    getUserHistory(user.email).then(setHistory).catch((err) => console.error(err));
  }, [user]);

  const totalHours = (history.length * 2).toFixed(1);

  return (
    <main className="main flex-col">
      <div className="mb-lg">
        <h1 className="headline-lg">Charging History</h1>
        <p className="body-lg text-muted">
          Your completed charging sessions — {history.length} total · {totalHours} hrs charged.
        </p>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Station</th>
              <th>Slot</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((b) => (
              <tr key={b.id}>
                <td className="fw-500">{fmtFull(b.slot_date)}</td>
                <td className="mono-id">{b.station_name}</td>
                <td className="text-muted">{b.start_time} - {b.end_time}</td>
                <td>
                  <span className="status-pill status-completed">
                    <span className="material-symbols-outlined mi-14">check_circle</span> Completed
                  </span>
                </td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-muted pad-lg">
                  No past sessions yet. Your finished bookings will appear here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default BookingHistory;
