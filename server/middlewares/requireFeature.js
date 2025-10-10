// middlewares/requireFeature.js

export const requireFeature = (featureKey) => {
  return (req, res, next) => {
    req.requiredFeature = featureKey;
    next();
  };
};
