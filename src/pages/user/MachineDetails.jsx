import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { getStation, getSlots, bookSlot } from "../../api/api";
import { useAuth } from "../../auth/AuthContext.jsx";
import { nextDays, isoDate, dayLabel, dayNum, nowHHMM } from "../../utils/dates";

const DAYS = nextDays(4);

const MachineDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [station, setStation] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [warnLogin, setWarnLogin] = useState(false);

  const activeDate = isoDate(DAYS[activeIdx]);

  useEffect(() => {
    getStation(id).then(setStation).catch((err) => console.error(err));
  }, [id]);

  const loadSlots = () => {
    getSlots(id, activeDate).then(setSlots).catch((err) => console.error(err));
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadSlots, [id, activeIdx]);

  // On "today", hide slots that have already finished (real-time)
  const visibleSlots = slots.filter((slot) => activeIdx !== 0 || slot.end_time > nowHHMM());

  const handleSlotClick = (slot) => {
    if (slot.status !== "available") return; // booked / blocked aren't selectable
    if (!user) { setWarnLogin(true); return; } // must be logged in to book
    setSelected(slot);
    setConfirming(true);
  };

  const confirmBooking = async () => {
    try {
      await bookSlot(selected.id, user.email);
      setConfirming(false);
      setSelected(null);
      navigate("/bookings");
    } catch (err) {
      alert(err.message);
      loadSlots();
    }
  };

  const s = station || { id, name: "Loading…", connector_type: "—", power_kw: "—", price_per_kwh: "—" };

  return (
    <>
      <main className="main flex-col">
        <nav className="breadcrumbs">
          <a onClick={() => navigate("/stations")}>Stations</a>
          <span className="material-symbols-outlined mi-16">chevron_right</span>
          <span className="text-primary">VoltFlow Station #{8800 + Number(id)}</span>
        </nav>

        <div className="mb-lg">
          <h1 className="headline-lg">Machine Details &amp; Booking</h1>
          <p className="body-lg text-secondary">Select an available time slot for your charge.</p>
        </div>

        {/* Login warning (React-Bootstrap Alert) */}
        {!user && warnLogin && (
          <Alert variant="warning" className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <span className="d-flex align-items-center gap-2">
              <span className="material-symbols-outlined">warning</span>
              Please sign in first to book a slot.
            </span>
            <button className="btn btn-primary" onClick={() => navigate("/signin")}>Log In</button>
          </Alert>
        )}

        {/* Status card */}
        <div className="card status-card">
          <div className="status-card-bar" />
          <div className="flex justify-between items-end flex-wrap gap-md">
            <div>
              <div className="flex items-center gap-sm mb-sm">
                <span className="chip chip-primary">Ultra-Fast</span>
                <span className="chip chip-online"><span className="dot dot-success pulse" /> Online</span>
              </div>
              <h2 className="display-lg station-name">{s.name}</h2>
            </div>
            <div className="spec-strip">
              <div>
                <span className="label-mono text-secondary spec-key">TYPE</span>
                <span className="body-lg fw-600">{s.connector_type}</span>
              </div>
              <div>
                <span className="label-mono text-secondary spec-key">POWER</span>
                <span className="body-lg fw-600">{s.power_kw}kW</span>
              </div>
              <div>
                <span className="label-mono text-secondary spec-key">PRICE</span>
                <span className="body-lg text-primary fw-600">${s.price_per_kwh}/kWh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Date toggle (real, live dates — past days never appear) */}
        <div className="date-toggle">
          {DAYS.map((d, i) => (
            <button key={i} className={`date-btn ${activeIdx === i ? "active" : ""}`} onClick={() => setActiveIdx(i)}>
              <span className="day">{dayLabel(d, i)}</span>
              <span className="num">{dayNum(d)}</span>
            </button>
          ))}
        </div>

        {/* Slots */}
        <div className="slot-grid">
          {visibleSlots.map((slot, i) => {
            const isSelected = selected?.id === slot.id;
            const booked = slot.status === "booked";
            const blocked = slot.status === "blocked";
            return (
              <button
                key={slot.id}
                className={`slot ${booked ? "booked" : ""} ${blocked ? "blocked" : ""} ${isSelected ? "selected" : ""}`}
                disabled={booked || blocked}
                onClick={() => handleSlotClick(slot)}
              >
                <div className="flex justify-between items-start">
                  <span className="label-mono text-secondary">SLOT {i + 1}</span>
                  <span className={`material-symbols-outlined ${booked || blocked ? "ic-secondary" : "ic-primary"}`}>
                    {booked ? "block" : blocked ? "do_not_disturb_on" : isSelected ? "check_circle" : "radio_button_unchecked"}
                  </span>
                </div>
                <div>
                  <span className="slot-time">{slot.start_time} - {slot.end_time}</span>
                  <span className={`body-sm ${blocked ? "c-error" : booked ? "c-secondary" : "c-primary"}`}>
                    {booked ? "Booked" : blocked ? "Unavailable" : isSelected ? "Selected" : "Available"}
                  </span>
                </div>
              </button>
            );
          })}
          {visibleSlots.length === 0 && (
            <p className="text-muted">No slots available for this day.</p>
          )}
        </div>
      </main>

      {/* Confirm booking modal */}
      {confirming && selected && (
        <div className="modal-overlay" onClick={() => setConfirming(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-md">
              <h3 className="headline-md">Confirm Booking</h3>
              <button className="btn-ghost" onClick={() => setConfirming(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="modal-info">
              <div className="mb-sm">
                <span className="label-mono text-secondary block">STATION</span>
                <span className="body-lg">VoltFlow Station #{8800 + Number(id)} - {s.name}</span>
              </div>
              <div>
                <span className="label-mono text-secondary block">TIME SLOT</span>
                <span className="headline-md">{selected.start_time} - {selected.end_time}</span>
              </div>
            </div>
            <p className="body-sm text-secondary mb-lg">
              By confirming, you agree to the booking terms. A hold may be placed on your default payment method.
            </p>
            <div className="flex gap-sm justify-end">
              <button className="btn btn-outline" onClick={() => setConfirming(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={confirmBooking}>Confirm Booking</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MachineDetails;
