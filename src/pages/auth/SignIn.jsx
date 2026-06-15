import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/api";
import { useAuth } from "../../auth/AuthContext.jsx";

const HERO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAnVmJeDg5X5SeOJkkn4D7lcx9DLXniwgpU9O4SPLQPvZbBZCNcvFnAHH6rU1OpCfrsG-7FocvTguA2GKl3pD6oy1ekHS3l3GzjkpTxnFXXjfZGvWbpfV3x9qU8Pdc-vXVK35LaPEdxj5XHaYHBgIqP539ioVKQK09Ad0rFxvFnitjyu-7FWwpQ__B134Y7_Muojou0BMYu1HrV1x57WaVzy5PkYZr1Kfj-_glbaUthhxaWD9xZdVkP1G6KTz_mUg7H-h5QICLtsNM";

// Sign-in only — role is read from the database, never chosen here.
const SignIn = () => {
  const { login: signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      signIn(data.user);
      navigate(data.user.role === "admin" ? "/admin" : "/stations");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <main className="auth">
      <div className="auth-hero">
        <img src={HERO_IMG} alt="Futuristic VoltFlow charging station at night" />
        <div className="auth-hero-overlay" />
        <div className="auth-hero-content">
          <div className="brand">
            <span className="material-symbols-outlined">electric_bolt</span>
            <span className="headline-md auth-brand-name">VoltFlow</span>
          </div>
          <div className="auth-hero-text">
            <h1 className="headline-lg mb-md">Powering the Future of Mobility.</h1>
            <p className="body-lg text-muted">
              Connect to the most advanced and reliable EV charging network. High-speed, seamless,
              and purely electric.
            </p>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <form className="glass-card auth-card" onSubmit={handleLogin}>
          <h2 className="headline-md mb-xs">Welcome Back</h2>
          <p className="body-md text-muted mb-lg">
            Access your operator dashboard or start charging.
          </p>

          <div className="field">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrap">
              <span className="material-symbols-outlined">mail</span>
              <input id="email" className="glass-input" type="email" placeholder="Enter your email"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <span className="material-symbols-outlined">lock</span>
              <input id="password" className="glass-input" type="password" placeholder="Enter your password"
                value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>

          <button className="btn btn-primary btn-block mt-sm" type="submit">
            Sign In
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>

          <p className="body-sm text-muted text-center mt-md">
            New to VoltFlow?{" "}
            <a className="text-primary link-bold" onClick={() => navigate("/signup")}>
              Create an Account
            </a>
          </p>
        </form>
      </div>
    </main>
  );
};

export default SignIn;
