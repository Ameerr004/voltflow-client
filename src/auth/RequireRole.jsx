import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

// Route guard. With no `role` it just requires a signed-in user; with a `role`
// it also enforces that role. Renders the nested routes via <Outlet/> when
// allowed, otherwise redirects.
export default function RequireRole({ role }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/signin" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return <Outlet />;
}
