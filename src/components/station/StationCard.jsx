// Presentational card for a single station — uniform, creative layout used in a
// responsive auto-fill grid. Offline stations are dimmed with a disabled CTA.
const speedLabel = (kw) => (kw >= 150 ? "Ultra-Fast" : kw >= 50 ? "Fast" : "Standard");

const StationCard = ({ station, image, onSelect }) => {
  const offline = station.status !== "online";
  const tags = (station.connector_type || "").split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <article className={`glass-card station-card ${offline ? "offline" : ""}`}>
      <div className="station-media" style={image ? { backgroundImage: `url('${image}')` } : undefined}>
        <span className="speed-badge">
          <span className="material-symbols-outlined mi-14">bolt</span>
          {station.power_kw}kW · {speedLabel(station.power_kw)}
        </span>
        <span className="glass-badge station-status">
          <span className={`dot ${offline ? "dot-muted" : "dot-primary"} ${offline ? "" : "pulse"}`} />
          {offline ? "Offline" : "Online"}
        </span>
      </div>

      <div className="station-body">
        <h2 className="title-lg">{station.name}</h2>
        <p className="station-loc body-sm">
          <span className="material-symbols-outlined mi-16">location_on</span>
          {station.location}
        </p>

        <div className="station-tags">
          {tags.map((t) => <span key={t} className="tag">{t}</span>)}
        </div>

        <div className="station-foot">
          <div className="station-price">
            ${station.price_per_kwh}<span> / kWh</span>
          </div>
          <button
            className={`btn ${offline ? "btn-outline" : "btn-primary"}`}
            disabled={offline}
            onClick={() => onSelect(station)}
          >
            {offline ? "Unavailable" : <>View Slots <span className="material-symbols-outlined mi-18">arrow_forward</span></>}
          </button>
        </div>
      </div>
    </article>
  );
};

export default StationCard;
