import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Loader from "../../common/components/ui/Loader";
import { useAuth } from "../../common/hooks/useAuth";
import api from "../../common/lib/api";

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  requiredPermissions = [],
  requiredFeatures = [],
  superAdminOnly = false,
  deniedMessage,
}) => {
  const { user, isAuthenticated, loading, setUser } = useAuth();
  const location = useLocation();

  const [refreshing, setRefreshing] = useState(true);

  // ✅ Always fetch fresh user when entering this route
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const me = await api.get("/auth/me", { withCredentials: true });
        setUser(me.data);
      } catch (err) {
        console.log("Failed to refresh user:", err);
      } finally {
        setRefreshing(false);
      }
    };
    fetchLatest();
  }, []);

  if (loading || refreshing) return <Loader />;

  // ✅ Not authenticated → go to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ Super admin only route
  if (superAdminOnly && !user.roles?.includes("super-admin")) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Roles
  const userRoles = (
    user.roles?.map((r) => (typeof r === "string" ? r : r.name)) || []
  ).map((r) => r.toLowerCase());
  const allowedRolesLower = allowedRoles.map((r) => r.toLowerCase());

  // ✅ Permissions
  const userPermissions = user.permissions || [];

  // ✅ Features (from plan)
  const userFeatures = user.plan?.features?.map((f) => f.key) || [];

  // ✅ Admin overrides everything
  const isAdmin =
    userRoles.includes("admin") || userRoles.includes("super-admin");

  const hasRoleAccess =
    isAdmin ||
    allowedRolesLower.length === 0 ||
    allowedRolesLower.some((role) => userRoles.includes(role));

  const hasPermissionAccess =
    isAdmin ||
    requiredPermissions.length === 0 ||
    requiredPermissions.every((perm) => userPermissions.includes(perm));

  const hasFeatureAccess =
    isAdmin ||
    requiredFeatures.length === 0 ||
    requiredFeatures.every((feat) => userFeatures.includes(feat));

  if (!hasRoleAccess || !hasPermissionAccess || !hasFeatureAccess) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ deniedMessage: deniedMessage || "Access denied" }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;

// import { Navigate, useLocation } from "react-router-dom";
// import Loader from "../../common/components/ui/Loader";
// import { useAuth } from "../../common/hooks/useAuth";

// const ProtectedRoute = ({
//   children,
//   allowedRoles = [],
//   requiredPermissions = [],
//   requiredFeatures = [],
//   superAdminOnly = false,
//   deniedMessage,
// }) => {
//   const { user, isAuthenticated, loading } = useAuth();
//   const location = useLocation();

//   if (loading) return <Loader />;

//   // ✅ Not logged in → login page
//   if (!isAuthenticated || !user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // ✅ Super admin only routes
//   if (superAdminOnly && !user.roles?.includes("super-admin")) {
//     return (
//       <Navigate
//         to="/unauthorized"
//         replace
//         state={{ deniedMessage: deniedMessage || "Super admin access only" }}
//       />
//     );
//   }

//   // ✅ Role prep
//   const userRoles = (
//     user.roles?.map((r) => (typeof r === "string" ? r : r.name)) || []
//   ).map((r) => r.toLowerCase());

//   const allowedRolesLower = allowedRoles.map((r) => r.toLowerCase());
//   const isAdmin =
//     userRoles.includes("admin") || userRoles.includes("super-admin");

//   // ✅ Permission + Feature lists
//   const userPermissions = user.permissions || [];

//   const userFeatures =
//     user.plan?.features?.map((f) => f.key.toLowerCase()) || [];

//   // ✅ Role access
//   const hasRoleAccess =
//     isAdmin ||
//     allowedRoles.length === 0 ||
//     allowedRolesLower.some((role) => userRoles.includes(role));

//   // ✅ Permission access
//   const hasPermissionAccess =
//     isAdmin ||
//     requiredPermissions.length === 0 ||
//     requiredPermissions.every((p) => userPermissions.includes(p));

//   // ✅ Feature access
//   const hasFeatureAccess =
//     isAdmin ||
//     requiredFeatures.length === 0 ||
//     requiredFeatures.every((f) => userFeatures.includes(f));

//   if (!hasRoleAccess || !hasPermissionAccess || !hasFeatureAccess) {
//     return (
//       <Navigate
//         to="/unauthorized"
//         replace
//         state={{ deniedMessage: deniedMessage || "Access denied" }}
//       />
//     );
//   }

//   return children;
// };

// export default ProtectedRoute;

// import { Navigate, useLocation } from "react-router-dom";

// import Loader from "../../common/components/ui/Loader";
// import { useAuth } from "../../common/hooks/useAuth";

// const ProtectedRoute = ({
//   children,
//   allowedRoles = [],
//   requiredPermissions = [],
//   requiredFeatures = [], // NEW
//   superAdminOnly = false,
//   deniedMessage,
// }) => {
//   const { user, isAuthenticated, loading } = useAuth();
//   const location = useLocation();

//   if (loading) return <Loader />;

//   // Not authenticated: redirect to login with "from"
//   if (!isAuthenticated || !user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // Super admin only route
//   if (superAdminOnly && !user.isSuperAdmin) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   // Roles check
//   const userRoles = (
//     user.roles?.map((r) => (typeof r === "string" ? r : r.name)) || []
//   ).map((r) => r.toLowerCase());
//   const allowedRolesLower = allowedRoles.map((r) => r.toLowerCase());

//   const userPermissions = user.permissions || [];
//   const userFeatures =
//     user.plan?.features.map((feat) => feat.key.toLowerCase()) || []; // ← plan features
//   const isAdmin = userRoles.includes("admin");

//   const hasRoleAccess =
//     isAdmin ||
//     allowedRoles.length === 0 ||
//     allowedRolesLower.some((role) => userRoles.includes(role));

//   const hasPermissionAccess =
//     isAdmin ||
//     requiredPermissions.length === 0 ||
//     requiredPermissions.every((perm) => userPermissions.includes(perm));

//   const hasFeatureAccess =
//     isAdmin ||
//     requiredFeatures.length === 0 ||
//     requiredFeatures.every((feat) => userFeatures.includes(feat));

//   if (!hasRoleAccess || !hasPermissionAccess || !hasFeatureAccess) {
//     return (
//       <Navigate
//         to="/unauthorized"
//         replace
//         state={{ deniedMessage: deniedMessage || "Access denied" }}
//       />
//     );
//   }

//   return children;
// };

// export default ProtectedRoute;
