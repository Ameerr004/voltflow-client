import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";

// Shared top navigation. "My Bookings" only shows when signed in. The user icon
// opens a dropdown with the name + email and a Log Out action.
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const name = user ? user.email.split("@")[0] : null;

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) => `nav-link ${isActive ? "active" : ""}`;

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand clickable" onClick={() => navigate("/")}>
          <span className="material-symbols-outlined">bolt</span>
          <span>VoltFlow</span>
        </div>

        <nav className="nav-links">
          <NavLink to="/stations" className={linkClass}>Find a Charger</NavLink>
          {user && <NavLink to="/bookings" className={linkClass}>My Bookings</NavLink>}
          {user && <NavLink to="/history" className={linkClass}>History</NavLink>}
        </nav>

        <div className="flex items-center gap-sm">
          {user ? (
            <>
              <span className="user-greeting hide-mobile">
                Welcome, <strong>{name}</strong>
              </span>
              <div className="user-menu">
                <button className="icon-btn" aria-label="User menu" onClick={() => setMenuOpen((o) => !o)}>
                  <span className="material-symbols-outlined">person</span>
                </button>
                {menuOpen && (
                  <>
                    <div className="menu-backdrop" onClick={() => setMenuOpen(false)} />
                    <div className="user-dropdown">
                      <div className="u-name">{name}</div>
                      <div className="u-email">{user.email}</div>
                      <hr />
                      <button onClick={handleLogout}>
                        <span className="material-symbols-outlined mi-18">logout</span>
                        Log Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => navigate("/signin")}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
