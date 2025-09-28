const hasAccess = ({
  user,
  allowedRoles = [],
  requiredPermissions = [],
  requiredFeature = null,
}) => {
  if (!user) return false;
  const roles = user?.roles || [];
  const permissions = user?.permissions || [];
  const features =
    user?.plan?.features.map((f) => (typeof f === "string" ? f : f.key)) || [];
  const isAdmin = roles.includes("admin");
  const roleOk =
    allowedRoles.length === 0 ||
    allowedRoles.some((r) => roles.includes(r)) ||
    isAdmin;
  const permissionOk =
    requiredPermissions.length === 0 ||
    requiredPermissions.every((p) => permissions.includes(p)) ||
    isAdmin;
  const featureOk =
    !requiredFeature || features.includes(requiredFeature) || isAdmin;

  return roleOk && permissionOk && featureOk;
};

export default hasAccess;
