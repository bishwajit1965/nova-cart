const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user; // set by auth middleware

    if (!user || !user.roles || !Array.isArray(user.roles)) {
      return res
        .status(403)
        .json({ message: "Access denied. No user roles found." });
    }

    const hasRole = user.roles.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      return res
        .status(403)
        .json({ message: "Access denied. You do not have the required role." });
    }

    next();
  };
};

export default authorizeRoles;
