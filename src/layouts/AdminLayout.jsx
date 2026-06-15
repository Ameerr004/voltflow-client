import { Outlet } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar.jsx";

// Shell for admin pages: side navigation + page content (with decorative glows).
export default function AdminLayout() {
  return (
    <div className="admin page">
      <div className="glow glow-tl" />
      <div className="glow glow-br" />
      <Sidebar />
      <Outlet />
    </div>
  );
}
