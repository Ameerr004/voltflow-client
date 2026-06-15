import { Outlet } from "react-router-dom";
import Navbar from "../components/navigation/Navbar.jsx";
import Footer from "../components/navigation/Footer.jsx";

// Shell for public/user pages: top navbar + page content + footer.
export default function PublicLayout() {
  return (
    <div className="page">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
