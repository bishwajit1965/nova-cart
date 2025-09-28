// utils/buildOrderFilters.js
export const buildOrderFilters = (query) => {
  const filters = {};
  if (query.status) filters.status = query.status;
  if (query.paymentMethod) filters.paymentMethod = query.paymentMethod;

  if (query.startDate && query.endDate) {
    filters.createdAt = {
      $gte: new Date(query.startDate),
      $lte: new Date(query.endDate),
    };
  }

  return filters;
};
