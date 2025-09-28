import { Navigate } from "react-router-dom";
import { useAuth } from "../../common/hooks/useAuth";

const PublicProtectedRoutes = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user.roles.includes("admin") || user.roles.includes("editor")) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PublicProtectedRoutes;
