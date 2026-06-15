// Small date helpers (local-time safe — avoids UTC off-by-one from toISOString).

export const isoDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// today + the next (n-1) days, as Date objects
export const nextDays = (n) =>
  Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

export const dayLabel = (d, i) => (i === 0 ? "TODAY" : d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase());
export const dayNum = (d) => d.getDate();
export const fmtFull = (s) => new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// "HH:MM" right now, for hiding slots that already finished today
export const nowHHMM = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};
