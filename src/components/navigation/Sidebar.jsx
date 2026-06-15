import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";

// Admin side navigation. Desktop = fixed rail; mobile = slide-in drawer toggled
// by a hamburger. Active link is driven by the route via NavLink.
const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const handleLogout = () => {
    close();
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) => `side-link ${isActive ? "active" : ""}`;

  return (
    <>
      <button className="sidebar-toggle" aria-label="Open menu" onClick={() => setOpen(true)}>
        <span className="material-symbols-outlined">menu</span>
      </button>

      {open && <div className="sidebar-backdrop" onClick={close} />}

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="flex items-center gap-sm sidebar-brand">
          <div className="spec-icon sidebar-brand-icon">
            <span className="material-symbols-outlined mi-20">electric_bolt</span>
          </div>
          <h1 className="title-lg">VoltFlow <span className="text-muted fw-400">Admin</span></h1>
        </div>

        <nav className="sidebar-nav">
          <NavLink end to="/admin" className={linkClass} onClick={close}>
            <span className="material-symbols-outlined">dashboard</span>
            Overview
          </NavLink>
          <NavLink to="/admin/enhanced" className={linkClass} onClick={close}>
            <span className="material-symbols-outlined">insights</span>
            Enhanced Overview
          </NavLink>
          <NavLink to="/admin/manage-machines" className={linkClass} onClick={close}>
            <span className="material-symbols-outlined">ev_station</span>
            Manage Machines
          </NavLink>
          <NavLink to="/admin/history" className={linkClass} onClick={close}>
            <span className="material-symbols-outlined">history</span>
            Booking History
          </NavLink>

          <a className="side-link danger" onClick={handleLogout}>
            <span className="material-symbols-outlined">logout</span>
            Log Out
          </a>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
