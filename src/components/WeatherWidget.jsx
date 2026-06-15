import { useEffect, useState } from "react";

// Live local conditions via the Open-Meteo third-party API (free, no key, CORS-enabled).
// Uses the lightweight JSON "current" endpoint instead of the protobuf SDK.
const LAT = 31.95;   // Amman, Jordan
const LON = 35.93;
const LOCATION = "Amman, JO";

// WMO weather codes → [label, emoji]
const CODES = {
  0: ["Clear sky", "☀️"], 1: ["Mainly clear", "🌤️"], 2: ["Partly cloudy", "⛅"], 3: ["Overcast", "☁️"],
  45: ["Fog", "🌫️"], 48: ["Rime fog", "🌫️"],
  51: ["Light drizzle", "🌦️"], 53: ["Drizzle", "🌦️"], 55: ["Dense drizzle", "🌦️"],
  61: ["Light rain", "🌧️"], 63: ["Rain", "🌧️"], 65: ["Heavy rain", "🌧️"],
  71: ["Light snow", "🌨️"], 73: ["Snow", "🌨️"], 75: ["Heavy snow", "❄️"],
  80: ["Showers", "🌦️"], 81: ["Showers", "🌧️"], 82: ["Violent showers", "⛈️"],
  95: ["Thunderstorm", "⛈️"], 96: ["Thunderstorm", "⛈️"], 99: ["Thunderstorm", "⛈️"],
};

const WeatherWidget = () => {
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => setCurrent(d.current))
      .catch((err) => console.error("Weather fetch failed:", err));
  }, []);

  if (!current) return null;

  const [label, icon] = CODES[current.weather_code] || ["—", "🌡️"];

  return (
    <div className="weather-card glass-card" title="Live weather · Open-Meteo">
      <div className="weather-loc">
        <span className="material-symbols-outlined mi-16">location_on</span> {LOCATION}
      </div>
      <div className="weather-main">
        <span className="weather-icon">{icon}</span>
        <span className="weather-temp">{Math.round(current.temperature_2m)}°C</span>
      </div>
      <div className="weather-desc">{label} · {Math.round(current.wind_speed_10m)} km/h wind</div>
    </div>
  );
};

export default WeatherWidget;
