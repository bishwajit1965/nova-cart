// services/productService.js

import api from "../../superAdmin/services/api/api";

export const fetchBestSellers = async (limit = 8) => {
  const { data } = await api.get(
    `/client/products/best-sellers?limit=${limit}`
  );
  return data?.data;
};
