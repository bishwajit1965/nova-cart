import api from "./api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const apiService = {
  async getAll(endpoint) {
    const res = await api.get(`${API_BASE_URL}/${endpoint}`);
    console.log("Raw response from API:", res.data); // 👈 log here to confirm
    return res.data;
  },

  async getById(endpoint, id) {
    const res = await api.get(`${API_BASE_URL}/${endpoint}/${id}`);
    return res.data;
  },

  async create(path, data) {
    const res = await api.post(`${API_BASE_URL}/${path}`, data);
    return res.data;
  },

  async update(path, data) {
    const res = await api.patch(`${API_BASE_URL}/${path}`, data);
    return res.data;
  },
  async delete(path) {
    const res = await api.delete(`${API_BASE_URL}/${path}`);
    return res.data;
  },
};

export default apiService;
