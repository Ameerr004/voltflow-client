import { useNavigate } from "react-router-dom";
import "./Landing.css";

const STATS = [
  { num: "500", suffix: "+", label: "Stations nationwide" },
  { num: "350", suffix: "kW", label: "Peak charging speed" },
  { num: "99.9", suffix: "%", label: "Network uptime" },
];

const SPECS = [
  { icon: "bolt", title: "150kW+ High-Speed", text: "Rapid charging infrastructure designed to minimize downtime and keep you on the road." },
  { icon: "cable", title: "Universal Compatibility", text: "Supports major standards including CCS2 and Type 2 connectors for broad EV adoption." },
  { icon: "verified", title: "24/7 Reliability", text: "Monitored continuously for uptime. Technical support available around the clock." },
];

const STEPS = [
  { n: "01", title: "Find", text: "Locate an available, compatible charger near your route using our interactive map." },
  { n: "02", title: "Book", text: "Reserve your slot instantly to guarantee availability upon arrival at the station." },
  { n: "03", title: "Charge", text: "Plug in and monitor your charging session in real-time through the dashboard." },
];

const ZONES = [
  { zone: "Zone Alpha", title: "Downtown Hubs", text: "Accessible urban charging for daily commuters and city logistics." },
  { zone: "Zone Beta", title: "Transit Depots", text: "Heavy-duty charging bays for commercial fleets and transit vehicles." },
  { zone: "Zone Gamma", title: "Highway Rest Stops", text: "Ultra-fast charging for long-haul journeys and intercity travel." },
];

const Landing = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="landing-bg" />
      <div className="landing-orbs" />

      <main className="main flex-col gap-xl">
        {/* Hero */}
        <section className="hero">
          <div className="hero-copy">
            <span className="label-md uppercase text-primary tracking-widest">⚡ The EV charging network</span>
            <h1 className="display-lg">Powering the Future of <span className="gradient-animate">Every Journey</span></h1>
            <p className="body-lg text-muted hero-lead">
              Effortless, high-speed EV charging tailored for modern logistics and everyday drivers.
              Secure your slot, charge up, and stay moving with zero friction.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary btn-pill" onClick={() => navigate("/stations")}>Book a Slot Now</a>
              <a className="btn btn-outline btn-pill" onClick={() => navigate("/about")}>About Us</a>
            </div>

            <div className="hero-stats">
              {STATS.map((s) => (
                <div key={s.label} className="hero-stat">
                  <div className="num"><span>{s.num}{s.suffix}</span></div>
                  <div className="lbl">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="net-hub">
              <span className="net-ring r1" />
              <span className="net-ring r2" />
              <span className="net-ring r3" />
              <div className="net-orbit">
                <div className="net-pin p1"><span className="material-symbols-outlined">ev_station</span></div>
                <div className="net-pin p2"><span className="material-symbols-outlined">ev_station</span></div>
                <div className="net-pin p3"><span className="material-symbols-outlined">ev_station</span></div>
                <div className="net-pin p4"><span className="material-symbols-outlined">ev_station</span></div>
              </div>
              <div className="net-core"><span className="material-symbols-outlined">bolt</span></div>
              <span className="net-spark s1" />
              <span className="net-spark s2" />
            </div>
          </div>
        </section>

        {/* Specs */}
        <section className="section">
          <div className="section-head">
            <h2 className="headline-lg">Engineered for Tomorrow</h2>
            <p className="body-lg text-muted">Built for speed, compatibility, and absolute reliability across all networks.</p>
          </div>
          <div className="grid-3">
            {SPECS.map((s) => (
              <div key={s.title} className="glass-card spec-card">
                <div className="spec-icon"><span className="material-symbols-outlined">{s.icon}</span></div>
                <h3 className="title-lg">{s.title}</h3>
                <p className="body-md text-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="section items-center">
          <h2 className="headline-lg">Seamless Experience</h2>
          <div className="steps">
            {STEPS.map((s) => (
              <div key={s.n} className="step">
                <div className="step-num">{s.n}</div>
                <h4 className="title-lg">{s.title}</h4>
                <p className="body-md text-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Locations */}
        <section className="section">
          <div className="flex justify-between items-end flex-wrap gap-sm">
            <div className="flex-col gap-xs">
              <h2 className="headline-lg">Strategic Locations</h2>
              <p className="body-lg text-muted">Placed exactly where the journey demands.</p>
            </div>
            <a className="label-md text-primary flex items-center gap-xs uppercase" onClick={() => navigate("/stations")}>
              View Network Map <span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>
          <div className="grid-3">
            {ZONES.map((z) => (
              <div key={z.zone} className="glass-card location-card">
                <span className="label-sm text-primary uppercase tracking-widest">{z.zone}</span>
                <h4 className="title-lg">{z.title}</h4>
                <p className="body-md text-muted">{z.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to action banner */}
        <section className="cta-banner">
          <span className="label-md uppercase tracking-widest cta-eyebrow">Ready when you are</span>
          <h2 className="headline-lg">Power up in seconds.</h2>
          <p className="body-lg cta-sub">
            Reserve your charging slot now and hit the road with total confidence — no queues, no surprises.
          </p>
          <button className="btn btn-pill btn-light" onClick={() => navigate("/stations")}>
            Find a Charger <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </section>
      </main>
    </>
  );
};

export default Landing;
