// server/utils/serializePlan.js
export const serializePlan = (plan) => {
  if (!plan) return null;

  // If the plan is a Mongoose document, convert to plain object first
  const plainPlan = plan.toObject ? plan.toObject() : plan;

  return {
    _id: plainPlan._id,
    title: plainPlan.title,
    key: plainPlan.key,
    price: plainPlan.price,
    duration: plainPlan.duration || null, // optional
    description: plainPlan.description || "",
    isPopular: plainPlan.isPopular || false,

    // Normalize features: handle both populated and unpopulated states
    features: Array.isArray(plainPlan.features)
      ? plainPlan.features.map((feature) => ({
          _id: feature._id || feature,
          key: feature.key || "",
          title: feature.title || "",
          description: feature.description || "",
        }))
      : [],

    createdAt: plainPlan.createdAt,
    updatedAt: plainPlan.updatedAt,
  };
};
