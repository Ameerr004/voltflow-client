import { useEffect, useState } from "react";

// Live local conditions. Uses WeatherAPI.com when an API key is provided
// (VITE_WEATHER_API_KEY); otherwise falls back to the free/keyless Open-Meteo API.
const LAT = 31.95;   // Amman, Jordan
const LON = 35.93;
const LOCATION = "Amman, JO";

const WEATHER_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const OPEN_METEO_URL =
  import.meta.env.VITE_WEATHER_API_URL || "https://api.open-meteo.com/v1/forecast";

// Open-Meteo WMO weather codes → [label, emoji] (used only in the fallback)
const CODES = {
  0: ["Clear sky", "☀️"], 1: ["Mainly clear", "🌤️"], 2: ["Partly cloudy", "⛅"], 3: ["Overcast", "☁️"],
  45: ["Fog", "🌫️"], 48: ["Rime fog", "🌫️"],
  51: ["Light drizzle", "🌦️"], 53: ["Drizzle", "🌦️"], 55: ["Dense drizzle", "🌦️"],
  61: ["Light rain", "🌧️"], 63: ["Rain", "🌧️"], 65: ["Heavy rain", "🌧️"],
  71: ["Light snow", "🌨️"], 73: ["Snow", "🌨️"], 75: ["Heavy snow", "❄️"],
  80: ["Showers", "🌦️"], 81: ["Showers", "🌧️"], 82: ["Violent showers", "⛈️"],
  95: ["Thunderstorm", "⛈️"], 96: ["Thunderstorm", "⛈️"], 99: ["Thunderstorm", "⛈️"],
};

// Pick an emoji from a WeatherAPI.com condition text
function emojiFor(text) {
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
  const [w, setW] = useState(null); // normalized: { temp, wind, label, icon }

  useEffect(() => {
    async function load() {
      if (WEATHER_KEY) {
        // WeatherAPI.com (uses the API key)
        const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_KEY}&q=${LAT},${LON}`;
        const d = await fetch(url).then((r) => r.json());
        const c = d.current;
        setW({ temp: c.temp_c, wind: c.wind_kph, label: c.condition.text, icon: emojiFor(c.condition.text) });
      } else {
        // Open-Meteo (free, no key) — fallback
        const url = `${OPEN_METEO_URL}?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`;
        const d = await fetch(url).then((r) => r.json());
        const [label, icon] = CODES[d.current.weather_code] || ["—", "🌡️"];
        setW({ temp: d.current.temperature_2m, wind: d.current.wind_speed_10m, label, icon });
      }
    }
    load().catch((err) => console.error("Weather fetch failed:", err));
  }, []);

  if (!w) return null;

  return (
    <div className="weather-card glass-card" title="Live weather">
      <div className="weather-loc">
        <span className="material-symbols-outlined mi-16">location_on</span> {LOCATION}
      </div>
      <div className="weather-main">
        <span className="weather-icon">{w.icon}</span>
        <span className="weather-temp">{Math.round(w.temp)}°C</span>
      </div>
      <div className="weather-desc">{w.label} · {Math.round(w.wind)} km/h wind</div>
    </div>
  );
};

export default WeatherWidget;
