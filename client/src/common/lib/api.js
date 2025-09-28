import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  withCredentials: true, // ✅ Allows cookies & authentication tokens
});

// Add a request interceptor to set Content-type dynamically
api.interceptors.request.use(
  (config) => {
    if (!config.headers["Content-Type"]) {
      // set Content-type to JSON if not already specified
      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      } else {
        config.headers["Content-Type"] = "application/json";
      }
    }
    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);
export default api;
