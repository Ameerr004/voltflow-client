import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import RequireRole from "../auth/RequireRole.jsx";
import Landing from "../pages/landing/Landing.jsx";
import About from "../pages/about/About.jsx";
import SignIn from "../pages/auth/SignIn.jsx";
import SignUp from "../pages/auth/SignUp.jsx";
import StationDiscovery from "../pages/user/StationDiscovery.jsx";
import MachineDetails from "../pages/user/MachineDetails.jsx";
import MyBookings from "../pages/user/MyBookings.jsx";
import BookingHistory from "../pages/user/BookingHistory.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminDashboardEnhanced from "../pages/admin/AdminDashboardEnhanced.jsx";
import ManageMachines from "../pages/admin/ManageMachines.jsx";
import AllHistory from "../pages/admin/AllHistory.jsx";

// The full route tree with layout wrappers and role protection.
export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth — full-screen, no navbar */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Public + user pages — navbar + footer shell */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/stations" element={<StationDiscovery />} />
        <Route path="/stations/:id" element={<MachineDetails />} />

        {/* Bookings + history require any signed-in user */}
        <Route element={<RequireRole />}>
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/history" element={<BookingHistory />} />
        </Route>
      </Route>

      {/* Admin — admin role only, sidebar shell */}
      <Route element={<RequireRole role="admin" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/enhanced" element={<AdminDashboardEnhanced />} />
          <Route path="/admin/manage-machines" element={<ManageMachines />} />
          <Route path="/admin/history" element={<AllHistory />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
