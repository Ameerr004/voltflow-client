import { useEffect, useState } from "react";

// Live local conditions via WeatherAPI.com (third-party API, requires a key).
// The key comes from the environment: VITE_WEATHER_API_KEY.
const LAT = 31.95;   // Amman, Jordan
const LON = 35.93;
const LOCATION = "Amman, JO";
const WEATHER_KEY = import.meta.env.VITE_WEATHER_API_KEY;

// Pick an emoji from a WeatherAPI.com condition text
function emojiFor(text = "") {
  const t = text.toLowerCase();
  if (t.includes("thunder")) return "⛈️";
  if (t.includes("snow") || t.includes("sleet") || t.includes("ice")) return "🌨️";
  if (t.includes("rain") || t.includes("drizzle")) return "🌧️";
  if (t.includes("fog") || t.includes("mist")) return "🌫️";
  if (t.includes("cloud") || t.includes("overcast")) return "☁️";
  if (t.includes("sun") || t.includes("clear")) return "☀️";
  return "🌤️";
}

const WeatherWidget = () => {
  const [w, setW] = useState(null);

  useEffect(() => {
    if (!WEATHER_KEY) {
      console.warn("VITE_WEATHER_API_KEY is not set — weather widget hidden.");
      return;
    }
    const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_KEY}&q=${LAT},${LON}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => setW(d.current))
      .catch((err) => console.error("Weather fetch failed:", err));
  }, []);

  if (!w) return null;

  return (
    <div className="weather-card glass-card" title="Live weather · WeatherAPI.com">
      <div className="weather-loc">
        <span className="material-symbols-outlined mi-16">location_on</span> {LOCATION}
      </div>
      <div className="weather-main">
        <span className="weather-icon">{emojiFor(w.condition?.text)}</span>
        <span className="weather-temp">{Math.round(w.temp_c)}°C</span>
      </div>
      <div className="weather-desc">{w.condition?.text} · {Math.round(w.wind_kph)} km/h wind</div>
    </div>
  );
};

export default WeatherWidget;
