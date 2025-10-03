// utils/cartWishlistHelpers.js
export const canAddItem = (list, productId, limit = 10) => {
  // already in list?
  const exists = list.some((item) => item._id === productId);

  if (exists) {
    return { allowed: false, reason: "already_added" };
  }

  if (list.length >= limit) {
    return { allowed: false, reason: "limit_reached" };
  }

  return { allowed: true, reason: null };
};
