import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom teardrop pin (avoids Leaflet's default marker-image bundler issue).
const pinIcon = L.divIcon({
  className: "vf-pin",
  html: '<span class="vf-pin-dot"><span class="material-symbols-outlined">bolt</span></span>',
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -32],
});

// Geocoding via OpenStreetMap's Nominatim (free, no key). Turns a station's
// "location" text (e.g. "Seattle, WA") into [lat, lon] map coordinates.
const GEOCODE_URL =
  import.meta.env.VITE_GEOCODE_API_URL || "https://nominatim.openstreetmap.org/search";
const cache = {};

async function geocode(place) {
  if (place in cache) return cache[place];
  const res = await fetch(`${GEOCODE_URL}?format=json&limit=1&q=${encodeURIComponent(place)}`);
  const data = await res.json();
  const coords = data[0] ? [parseFloat(data[0].lat), parseFloat(data[0].lon)] : null;
  cache[place] = coords;
  return coords;
}

const StationsMap = ({ stations }) => {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const found = [];
      for (const s of stations) {
        try {
          const coords = await geocode(s.location);
          if (coords) found.push({ ...s, coords });
        } catch {
          /* skip a station that fails to geocode */
        }
      }
      if (!cancelled) {
        setPoints(found);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [stations]);

  if (loading) return <div className="stations-map-loading">Loading station map…</div>;
  if (points.length === 0) return null;

  return (
    <div className="stations-map">
      <MapContainer center={points[0].coords} zoom={5} scrollWheelZoom={false} className="stations-map-inner">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((p) => (
          <Marker key={p.id} position={p.coords} icon={pinIcon}>
            <Popup>
              <strong>{p.name}</strong><br />
              {p.location}<br />
              {p.power_kw} kW · ${p.price_per_kwh}/kWh<br />
              <em>{p.status === "online" ? "🟢 Online" : "⚪ Offline"}</em>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default StationsMap;
