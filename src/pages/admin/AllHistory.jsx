import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { getAllHistory } from "../../api/api";
import { useAuth } from "../../auth/AuthContext.jsx";
import { fmtFull } from "../../utils/dates";

const initials = (email) => (email ? email.slice(0, 2).toUpperCase() : "??");

// Admin view of every user's finished (past) booking across the whole network.
const AllHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = user?.role || "admin";
    getAllHistory(role)
      .then(setHistory)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  const uniqueUsers = new Set(history.map((b) => b.booked_by)).size;

  return (
    <div className="admin-main">
      <header className="admin-header">
        <div className="admin-header-inner">
          <div>
            <h2 className="headline-md fw-800">Booking History</h2>
            <p className="body-sm text-muted">
              All completed charging sessions — {history.length} sessions · {uniqueUsers} drivers.
            </p>
          </div>
        </div>
      </header>

      <div className="admin-content flex-col gap-lg">
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" variant="primary" role="status">
              <span className="visually-hidden">Loading history…</span>
            </Spinner>
          </div>
        ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User Details</th>
                <th>Date</th>
                <th>Station</th>
                <th>Time Slot</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((b) => (
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
                  <td>
                    <span className="status-pill status-completed">
                      <span className="material-symbols-outlined mi-14">check_circle</span> Completed
                    </span>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr><td colSpan={5} className="text-center text-muted pad-lg">No completed sessions yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
};

export default AllHistory;
