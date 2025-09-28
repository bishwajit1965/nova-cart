const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  const roles = user.roles.map((role) =>
    typeof role === "string" ? role : role.name
  );
  const permissions = user.permissions.map((perm) =>
    typeof perm === "string" ? perm : perm.name
  );

  const planTier = user?.plan?.tier ?? "free";
  // const planFeatures = user?.plan?.features ?? [];
  const planFeatures = Array.isArray(user?.plan?.features)
    ? user.plan.features.map((f) => (typeof f === "string" ? f : f.key))
    : [];

  const planPrice = user?.plan?.price ?? 0;

  return jwt.sign(
    {
      userId: user._id,
      name: user.name,
      email: user.email,
      roles,
      permissions,
      plan: { tier: planTier, features: planFeatures, price: planPrice },
      bio: user.bio,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "1d" }
  );
};

module.exports = generateAccessToken;
