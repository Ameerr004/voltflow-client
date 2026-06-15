import { useNavigate } from "react-router-dom";
import "./About.css";

const STATS = [
  { num: "500+", label: "Charging stations" },
  { num: "1.2M", label: "Sessions delivered" },
  { num: "350kW", label: "Peak charge speed" },
  { num: "99.9%", label: "Network uptime" },
];

const VALUES = [
  { icon: "bolt", title: "Speed Without Compromise", text: "Ultra-fast charging engineered to get drivers back on the road in minutes, not hours." },
  { icon: "public", title: "Sustainable by Design", text: "Every station is built to accelerate the shift to clean, electric mobility for everyone." },
  { icon: "shield", title: "Reliability You Can Trust", text: "Monitored 24/7 with live diagnostics, so a charger is ready whenever you arrive." },
  { icon: "diversity_3", title: "Built for People", text: "A seamless booking experience designed around real drivers and real journeys." },
];

const STEPS = [
  { year: "2021", title: "The Spark", text: "VoltFlow began with a simple idea: charging an EV should be as easy as filling a tank — only smarter." },
  { year: "2023", title: "Going Nationwide", text: "We scaled from a handful of pilot units to a connected network spanning hundreds of locations." },
  { year: "2025", title: "An Intelligent Grid", text: "Real-time slot booking, predictive load forecasting, and a fully managed fleet platform." },
];

// About Us — company story, mission, values and milestones. Public page,
// rendered inside PublicLayout (navbar + footer).
const About = () => {
  const navigate = useNavigate();

  return (
    <main className="main about flex-col gap-xl">
      {/* Hero */}
      <section className="about-hero">
        <span className="label-md uppercase text-primary tracking-widest">⚡ Who we are</span>
        <h1 className="display-lg">
          Driving the world toward <span className="gradient-animate">electric</span>.
        </h1>
        <p className="body-lg text-muted about-lead">
          VoltFlow is building the most reliable, intelligent EV charging network on the planet —
          one that puts effortless, high-speed charging within reach of every driver and every fleet.
        </p>
        <div className="about-hero-actions">
          <button className="btn btn-primary btn-pill" onClick={() => navigate("/stations")}>
            Find a Charger <span className="material-symbols-outlined">arrow_forward</span>
          </button>
          <button className="btn btn-outline btn-pill" onClick={() => navigate("/")}>Back Home</button>
        </div>
      </section>

      {/* Stats band */}
      <section className="about-stats">
        {STATS.map((s) => (
          <div key={s.label} className="about-stat">
            <div className="about-stat-num">{s.num}</div>
            <div className="about-stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Mission */}
      <section className="about-mission glass-card">
        <div className="about-mission-icon"><span className="material-symbols-outlined">target</span></div>
        <div className="flex-col gap-sm">
          <h2 className="headline-lg">Our Mission</h2>
          <p className="body-lg text-muted">
            To remove every barrier between drivers and clean energy. We design charging
            infrastructure that is fast, dependable, and beautifully simple to use — so going
            electric is never a compromise, but an upgrade.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="section-head">
          <h2 className="headline-lg">What We Stand For</h2>
          <p className="body-lg text-muted">The principles behind every station we build.</p>
        </div>
        <div className="grid-2">
          {VALUES.map((v) => (
            <div key={v.title} className="glass-card value-card">
              <div className="value-icon"><span className="material-symbols-outlined">{v.icon}</span></div>
              <div className="flex-col gap-xs">
                <h3 className="title-lg">{v.title}</h3>
                <p className="body-md text-muted">{v.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline / story */}
      <section className="section">
        <div className="section-head">
          <h2 className="headline-lg">Our Journey</h2>
          <p className="body-lg text-muted">From a single idea to an intelligent national grid.</p>
        </div>
        <div className="about-timeline">
          {STEPS.map((s) => (
            <div key={s.year} className="timeline-item">
              <div className="timeline-year">{s.year}</div>
              <div className="timeline-dot" />
              <div className="glass-card timeline-card">
                <h4 className="title-lg">{s.title}</h4>
                <p className="body-md text-muted">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <span className="label-md uppercase tracking-widest cta-eyebrow">Join the network</span>
        <h2 className="headline-lg">Ready to charge the future with us?</h2>
        <p className="body-lg cta-sub">
          Reserve a slot at a VoltFlow station today and experience charging the way it should be.
        </p>
        <button className="btn btn-pill btn-light" onClick={() => navigate("/stations")}>
          Get Started <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </section>
    </main>
  );
};

export default About;
