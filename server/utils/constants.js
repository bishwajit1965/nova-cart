import dotenv from "dotenv";

dotenv.config(); // Ensure env variables are loaded

export const COOKIE_NAME = process.env.JWT_TOKEN || "JWT";

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const ACCESS_TOKEN_EXPIRES_IN =
  process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";

export const REFRESH_TOKEN_EXPIRES_IN =
  process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
export const NODE_ENV = process.env.NODE_ENV || "development";

export const PORT = process.env.PORT || 3000;

export const DB = {
  URI: process.env.MONGO_URI,
};

export const GOOGLE = {
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};

export const JWT = {
  ACCESS_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_SECRET: process.env.REFRESH_TOKEN_SECRET,
};

export default {
  COOKIE_NAME,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  CLIENT_URL,
  NODE_ENV,
};
