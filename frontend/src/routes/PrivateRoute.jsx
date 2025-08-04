import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    // Not Logged In
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Logged in but Role Not Allowed
    return <Navigate to="/login" replace />;
  }

  // Allowed: Render Child Routes
  return <Outlet />;
};

export default PrivateRoute;
