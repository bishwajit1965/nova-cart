const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const buildUrl = (src) => {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return `${apiURL}${src.startsWith("/") ? src : `/uploads/${src}`}`;
};

export default buildUrl;
