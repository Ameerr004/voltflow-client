import { useEffect, useState } from "react";
import { getStations, getSlots, addSlot, setSlotStatus, updateSlotTime, deleteSlot, createStation, updateStation, deleteStation } from "../../api/api";
import { useAuth } from "../../auth/AuthContext.jsx";
import { nextDays, isoDate, dayLabel, dayNum } from "../../utils/dates";
import { fileToCompressedDataUrl } from "../../utils/image";

const DAYS = nextDays(4);
const EMPTY_FORM = { name: "", location: "", connector_type: "CCS2", power_kw: "", price_per_kwh: "", image_url: "", status: "online" };

// Admin "Manage Machines" / Fleet Status. Each station is a unit with a real,
// date-based slot grid (available / booked / blocked). Admins can block slots,
// add custom timeslots per day, and register/remove units. Shell = AdminLayout.
const ManageMachines = () => {
  const { user } = useAuth();
  const role = user?.role || "admin";
  const [stations, setStations] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [dayIdx, setDayIdx] = useState(0);
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ start_time: "", end_time: "" });
  const [editingSlot, setEditingSlot] = useState(null);
  const [editTimes, setEditTimes] = useState({ start_time: "", end_time: "" });
  const [search, setSearch] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = creating, else editing this station
  const [form, setForm] = useState(EMPTY_FORM);

  const gridDate = isoDate(DAYS[dayIdx]);

  const loadStations = () => getStations().then(setStations).catch(console.error);
  useEffect(() => { loadStations(); }, []);

  const loadSlots = (stationId, date) => {
    getSlots(stationId, date).then(setSlots).catch(() => setSlots([]));
  };

  const openUnit = (id) => {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    loadSlots(id, gridDate);
  };

  const changeDay = (i) => {
    setDayIdx(i);
    if (expanded) loadSlots(expanded, isoDate(DAYS[i]));
  };

  // Fleet stats (real)
  const total = stations.length;
  const active = stations.filter((s) => s.status === "online").length;
  const maint = total - active;
  const health = total ? Math.round((active / total) * 100) : 0;
  const totalOutputMW = (stations.reduce((sum, s) => sum + Number(s.power_kw || 0), 0) / 1000).toFixed(1);
  const maintNames = stations.filter((s) => s.status !== "online").map((s) => s.name).join(", ");

  const toggleStatus = async (station, status) => {
    if (station.status === status) return;
    await updateStation(station.id, { ...station, status }, role);
    loadStations();
  };

  const removeUnit = async (id) => {
    if (!confirm("Remove this unit and all its slots?")) return;
    await deleteStation(id, role);
    if (expanded === id) setExpanded(null);
    loadStations();
  };

  const toggleBlock = async (slot) => {
    if (slot.status === "booked") return; // can't block a booked slot
    const next = slot.status === "blocked" ? "available" : "blocked";
    await setSlotStatus(slot.id, next, role);
    loadSlots(expanded, gridDate);
  };

  const hhmm = (t) => (t || "").slice(0, 5);

  const startEdit = (e, slot) => {
    e.stopPropagation();
    setEditingSlot(slot.id);
    setEditTimes({ start_time: hhmm(slot.start_time), end_time: hhmm(slot.end_time) });
  };

  const cancelEdit = (e) => {
    if (e) e.stopPropagation();
    setEditingSlot(null);
  };

  const saveEdit = async (e, slot) => {
    e.stopPropagation();
    try {
      await updateSlotTime(slot.id, editTimes, role); // server blocks overlaps / bad ranges
      setEditingSlot(null);
      loadSlots(expanded, gridDate);
    } catch (err) {
      alert(err.message);
    }
  };

  const removeSlot = async (e, slot) => {
    e.stopPropagation();
    if (!confirm("Delete this timeslot?")) return;
    try {
      await deleteSlot(slot.id, role);
      loadSlots(expanded, gridDate);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!newSlot.start_time || !newSlot.end_time) return;
    try {
      await addSlot({ station_id: expanded, slot_date: gridDate, start_time: newSlot.start_time, end_time: newSlot.end_time }, role);
      setNewSlot({ start_time: "", end_time: "" });
      loadSlots(expanded, gridDate);
    } catch (err) {
      alert(err.message);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowRegister(true);
  };

  const openEdit = (s) => {
    setEditingId(s.id);
    setForm({
      name: s.name,
      location: s.location,
      connector_type: s.connector_type,
      power_kw: s.power_kw,
      price_per_kwh: s.price_per_kwh,
      image_url: s.image_url || "",
      status: s.status,
    });
    setShowRegister(true);
  };

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      setForm((f) => ({ ...f, image_url: dataUrl }));
    } catch {
      alert("Could not read that image. Try a different file.");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { ...form, power_kw: Number(form.power_kw), price_per_kwh: Number(form.price_per_kwh) };
    try {
      if (editingId) {
        await updateStation(editingId, payload, role);
      } else {
        await createStation(payload, role);
      }
      setShowRegister(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      loadStations();
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = stations.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-inner">
            <div>
              <h2 className="headline-lg">Fleet Status</h2>
              <p className="body-sm text-muted flex items-center gap-xs">
                <span className="dot dot-primary" /> LOCATION HQ · {total} UNITS · {active} ACTIVE
              </p>
            </div>
            <div className="fleet-toolbar">
              <div className="search-box">
                <span className="material-symbols-outlined text-muted mi-20">search</span>
                <input placeholder="Search units..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={openCreate}>
                <span className="material-symbols-outlined mi-18">add</span> Register Unit
              </button>
            </div>
          </div>
        </header>

        <div className="admin-content flex-col gap-lg">
          {/* Fleet stat cards */}
          <div className="fleet-stats mt-md">
            <div className="fleet-stat">
              <div className="stat-top">
                <div><p className="kv-label">Fleet Health</p><p className="headline-md">{health}%</p></div>
                <div className="stat-icon-box box-primary">
                  <span className="material-symbols-outlined">health_and_safety</span>
                </div>
              </div>
              <div className="bars">{[0, 1, 2, 3, 4, 5].map((i) => <span key={i} />)}</div>
            </div>
            <div className="fleet-stat">
              <div className="stat-top">
                <div><p className="kv-label">Active Units</p><p className="headline-md">{active} <span className="title-lg text-muted">/ {total}</span></p></div>
                <div className="stat-icon-box box-solid-primary"><span className="material-symbols-outlined">bolt</span></div>
              </div>
              <div className="progress"><div style={{ width: `${health}%` }} /></div>
            </div>
            <div className="fleet-stat">
              <div className="stat-top">
                <div><p className="kv-label">In Maintenance</p><p className="headline-md">{maint}</p></div>
                <div className="stat-icon-box box-error"><span className="material-symbols-outlined">build</span></div>
              </div>
              <p className="body-sm text-muted flex items-center gap-xs mt-sm">
                {maint > 0 ? <><span className="material-symbols-outlined text-error mi-16">warning</span> {maintNames}</> : "All units operational"}
              </p>
            </div>
            <div className="fleet-stat">
              <div className="stat-top">
                <div><p className="kv-label">Total Output</p><p className="headline-md text-primary">{totalOutputMW} MW</p></div>
                <div className="stat-icon-box box-surface"><span className="material-symbols-outlined">monitoring</span></div>
              </div>
              <p className="body-sm text-primary flex items-center gap-xs mt-sm">
                <span className="material-symbols-outlined mi-16">trending_up</span> Live capacity
              </p>
            </div>
          </div>

          {/* Unit management */}
          <section className="flex-col gap-md">
            <div className="flex justify-between items-end">
              <h3 className="title-lg">Unit Management</h3>
              <span className="body-sm text-muted">Sort by: <span className="text-primary fw-600">Status</span></span>
            </div>

            {filtered.map((s) => {
              const isMaint = s.status !== "online";
              const isOpen = expanded === s.id;
              return (
                <div key={s.id} className={`unit-card ${isMaint ? "maintenance" : ""}`}>
                  <div className="unit-head">
                    <div className="flex items-center gap-sm">
                      <div className="unit-icon"><span className="material-symbols-outlined">ev_station</span></div>
                      <div>
                        <p className="title-lg">{s.name}</p>
                        <p className="label-mono text-muted">MAC-8829-{String(s.id).padStart(2, "0")} · {s.connector_type} · {s.power_kw}kW</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-sm">
                      <div className="unit-toggle">
                        <button className={!isMaint ? "on" : ""} onClick={() => toggleStatus(s, "online")}>
                          {!isMaint && <span className="dot dot-primary" />} Available
                        </button>
                        <button className={isMaint ? "on maint" : ""} onClick={() => toggleStatus(s, "offline")}>
                          <span className="material-symbols-outlined mi-16">build</span> Maintenance
                        </button>
                      </div>
                      <button className="icon-btn" onClick={() => openEdit(s)} aria-label="Edit unit" title="Edit unit">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button className="icon-btn" onClick={() => openUnit(s.id)} aria-label="Expand">
                        <span className="material-symbols-outlined">{isOpen ? "expand_less" : "expand_more"}</span>
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="unit-body flex-col gap-md">
                      <div className="flex justify-between items-center flex-wrap gap-sm">
                        <h4 className="flex items-center gap-xs"><span className="material-symbols-outlined text-primary">calendar_month</span> Daily Booking Grid</h4>
                        <span className="label-mono text-muted">Click an open slot to block / unblock it</span>
                      </div>

                      {/* Day selector */}
                      <div className="date-toggle">
                        {DAYS.map((d, i) => (
                          <button key={i} className={`date-btn ${dayIdx === i ? "active" : ""}`} onClick={() => changeDay(i)}>
                            <span className="day">{dayLabel(d, i)}</span>
                            <span className="num">{dayNum(d)}</span>
                          </button>
                        ))}
                      </div>

                      <div className="booking-grid">
                        {slots.map((slot) => {
                          const booked = slot.status === "booked";
                          const blocked = slot.status === "blocked";
                          const editing = editingSlot === slot.id;
                          return (
                            <div
                              key={slot.id}
                              className={`slot-mini ${booked ? "booked" : ""} ${blocked ? "blocked" : ""} ${editing ? "editing" : ""}`}
                              onClick={() => { if (!editing) toggleBlock(slot); }}
                              title={editing ? "" : booked ? `Booked by ${slot.booked_by}` : blocked ? "Click to unblock" : "Click to block"}
                            >
                              {editing ? (
                                <div className="slot-edit" onClick={(e) => e.stopPropagation()}>
                                  <input className="glass-input" type="time" value={editTimes.start_time}
                                    onChange={(e) => setEditTimes({ ...editTimes, start_time: e.target.value })} />
                                  <input className="glass-input" type="time" value={editTimes.end_time}
                                    onChange={(e) => setEditTimes({ ...editTimes, end_time: e.target.value })} />
                                  <div className="slot-edit-actions">
                                    <button className="slot-act save" onClick={(e) => saveEdit(e, slot)} title="Save">
                                      <span className="material-symbols-outlined mi-16">check</span>
                                    </button>
                                    <button className="slot-act" onClick={cancelEdit} title="Cancel">
                                      <span className="material-symbols-outlined mi-16">close</span>
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="slot-mini-actions">
                                    <button className="slot-act" onClick={(e) => startEdit(e, slot)} title="Edit time">
                                      <span className="material-symbols-outlined mi-14">edit</span>
                                    </button>
                                    <button className="slot-act danger" onClick={(e) => removeSlot(e, slot)} title="Delete slot">
                                      <span className="material-symbols-outlined mi-14">delete</span>
                                    </button>
                                  </div>
                                  <div className="time">{slot.start_time}<br />{slot.end_time}</div>
                                  <span className="slot-status">
                                    {booked ? <><span className="material-symbols-outlined mi-14">lock</span> Booked</>
                                      : blocked ? <><span className="material-symbols-outlined mi-14">block</span> Blocked</>
                                      : "Available"}
                                  </span>
                                </>
                              )}
                            </div>
                          );
                        })}
                        {slots.length === 0 && <p className="text-muted">No slots for this day.</p>}
                      </div>

                      {/* Add a custom timeslot for this day */}
                      <form className="add-slot" onSubmit={handleAddSlot}>
                        <div className="field">
                          <label>Start</label>
                          <input className="glass-input" type="time" value={newSlot.start_time}
                            onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })} required />
                        </div>
                        <div className="field">
                          <label>End</label>
                          <input className="glass-input" type="time" value={newSlot.end_time}
                            onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })} required />
                        </div>
                        <button className="btn btn-primary" type="submit">
                          <span className="material-symbols-outlined mi-18">add</span> Add Timeslot
                        </button>
                        <div className="flex-1" />
                        <button type="button" className="btn btn-danger" onClick={() => removeUnit(s.id)}>
                          <span className="material-symbols-outlined mi-18">delete</span> Remove Unit
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              );
            })}
            {filtered.length === 0 && <p className="text-muted">No units match your search.</p>}
          </section>
        </div>
      </div>

      {/* Register / Edit Unit modal */}
      {showRegister && (
        <div className="modal-overlay" onClick={() => setShowRegister(false)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
            <div className="flex justify-between items-start mb-md">
              <h3 className="headline-md">{editingId ? "Edit Unit" : "Register Unit"}</h3>
              <button type="button" className="btn-ghost" onClick={() => setShowRegister(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="field">
              <label>Name</label>
              <input className="glass-input pl-sm" value={form.name} required
                onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Downtown Hub - Delta" />
            </div>
            <div className="field">
              <label>Location</label>
              <input className="glass-input pl-sm" value={form.location} required
                onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Tacoma, WA" />
            </div>
            <div className="field">
              <label>Connector Type</label>
              <select className="glass-input pl-sm" value={form.connector_type}
                onChange={(e) => setForm({ ...form, connector_type: e.target.value })}>
                <option>CCS2</option><option>CHAdeMO</option><option>Type 2</option>
              </select>
            </div>
            <div className="flex gap-sm">
              <div className="field flex-1">
                <label>Power (kW)</label>
                <input className="glass-input pl-sm" type="number" value={form.power_kw} required
                  onChange={(e) => setForm({ ...form, power_kw: e.target.value })} placeholder="150" />
              </div>
              <div className="field flex-1">
                <label>Price / kWh ($)</label>
                <input className="glass-input pl-sm" type="number" step="0.01" value={form.price_per_kwh} required
                  onChange={(e) => setForm({ ...form, price_per_kwh: e.target.value })} placeholder="0.45" />
              </div>
            </div>
            <div className="field">
              <label>Station Photo</label>
              <input className="file-input" type="file" accept="image/*" onChange={handleImageFile} />
            </div>
            {form.image_url && (
              <div className="unit-img-preview">
                <img src={form.image_url} alt="Station preview" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                <button type="button" className="img-remove" onClick={() => setForm({ ...form, image_url: "" })} title="Remove photo">
                  <span className="material-symbols-outlined mi-18">close</span>
                </button>
              </div>
            )}
            <div className="flex gap-sm justify-end mt-md">
              <button type="button" className="btn btn-outline" onClick={() => setShowRegister(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editingId ? "Save Changes" : "Register Unit"}</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ManageMachines;
