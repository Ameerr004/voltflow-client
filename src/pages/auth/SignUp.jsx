import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../api/api";
import { useAuth } from "../../auth/AuthContext.jsx";

const HERO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAnVmJeDg5X5SeOJkkn4D7lcx9DLXniwgpU9O4SPLQPvZbBZCNcvFnAHH6rU1OpCfrsG-7FocvTguA2GKl3pD6oy1ekHS3l3GzjkpTxnFXXjfZGvWbpfV3x9qU8Pdc-vXVK35LaPEdxj5XHaYHBgIqP539ioVKQK09Ad0rFxvFnitjyu-7FWwpQ__B134Y7_Muojou0BMYu1HrV1x57WaVzy5PkYZr1Kfj-_glbaUthhxaWD9xZdVkP1G6KTz_mUg7H-h5QICLtsNM";

// Dedicated sign-up page. Always creates a regular "user" account (server-enforced).
const SignUp = () => {
  const { login: signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }
    try {
      const data = await signup(email, password);
      signIn(data.user);
      navigate("/stations");
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
            <h1 className="headline-lg mb-md">Join the Network.</h1>
            <p className="body-lg text-muted">
              Create your driver account to find chargers, reserve slots, and manage your EV
              charging sessions.
            </p>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <form className="glass-card auth-card" onSubmit={handleSignup}>
          <h2 className="headline-md mb-xs">Create Account</h2>
          <p className="body-md text-muted mb-lg">
            Sign up to start charging with VoltFlow.
          </p>

          <div className="field">
            <label htmlFor="su-email">Email Address</label>
            <div className="input-wrap">
              <span className="material-symbols-outlined">mail</span>
              <input id="su-email" className="glass-input" type="email" placeholder="Enter your email"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="field">
            <label htmlFor="su-password">Password</label>
            <div className="input-wrap">
              <span className="material-symbols-outlined">lock</span>
              <input id="su-password" className="glass-input" type="password" placeholder="Choose a password"
                value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>

          <div className="field">
            <label htmlFor="su-confirm">Confirm Password</label>
            <div className="input-wrap">
              <span className="material-symbols-outlined">lock</span>
              <input id="su-confirm" className="glass-input" type="password" placeholder="Re-enter your password"
                value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>
          </div>

          <button className="btn btn-primary btn-block mt-sm" type="submit">
            Create Account
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>

          <p className="body-sm text-muted text-center mt-md">
            Already have an account?{" "}
            <a className="text-primary link-bold" onClick={() => navigate("/signin")}>
              Sign In
            </a>
          </p>
        </form>
      </div>
    </main>
  );
};

export default SignUp;
