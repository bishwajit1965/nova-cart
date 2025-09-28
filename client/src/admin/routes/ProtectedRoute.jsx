import { Navigate, useLocation } from "react-router-dom";

import Loader from "../../common/components/ui/Loader";
import { useAuth } from "../../common/hooks/useAuth";

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  requiredPermissions = [],
  superAdminOnly = false,
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;

  // Not authenticated: redirect to login with "from"
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Super admin only route
  if (superAdminOnly && !user.isSuperAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Roles check
  const userRoles = (
    user.roles?.map((r) => (typeof r === "string" ? r : r.name)) || []
  ).map((r) => r.toLowerCase());
  const allowedRolesLower = allowedRoles.map((r) => r.toLowerCase());

  const userPermissions = user.permissions || [];
  const isAdmin = userRoles.includes("admin");

  const hasRoleAccess =
    isAdmin ||
    allowedRoles.length === 0 ||
    allowedRolesLower.some((role) => userRoles.includes(role));

  const hasPermissionAccess =
    isAdmin ||
    requiredPermissions.length === 0 ||
    requiredPermissions.every((perm) => userPermissions.includes(perm));

  if (!hasRoleAccess || !hasPermissionAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
