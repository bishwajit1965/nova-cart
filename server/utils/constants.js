// server/constants.js

import dotenv from "dotenv";

dotenv.config(); // Load .env automatically

// Helper to ensure required env variables exist
function getEnvVar(key, fallback) {
  const value = process.env[key] || fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/*** ========================
 * DATABASE
 * ==========================*/
export const DB = {
  USER: getEnvVar("DB_USER"),
  NAME: getEnvVar("DB_NAME"),
  PASSWORD: getEnvVar("DB_PASSWORD"),
  HOST: getEnvVar("DB_HOST"),
  URI: getEnvVar("MONGO_URI"),
};

/*** ========================
 * SERVER
 * ==========================*/
export const SERVER = {
  PORT: getEnvVar("PORT", 3000),
  NODE_ENV: getEnvVar("NODE_ENV", "development"),
};

/*** ========================
 * CLIENT
 * ==========================*/

export const CLIENT = {
  URL: getEnvVar("CLIENT_URL"),
  ORIGIN: getEnvVar("CLIENT_ORIGIN"),
};

/*** ========================
 * JWT
 * ==========================*/
export const JWT = {
  COOKIE_NAME: getEnvVar("JWT_TOKEN", "JWT"),
  ACCESS_SECRET: getEnvVar("ACCESS_TOKEN_SECRET"),
  REFRESH_SECRET: getEnvVar("REFRESH_TOKEN_SECRET"),
  ACCESS_EXPIRES_IN: getEnvVar("ACCESS_TOKEN_EXPIRES_IN", "15m"),
  REFRESH_EXPIRES_IN: getEnvVar("REFRESH_TOKEN_EXPIRES_IN", "7d"),
};

/*** ========================
 * GOOGLE O-AUTH
 * ==========================*/
export const GOOGLE = {
  CLIENT_ID: getEnvVar("GOOGLE_CLIENT_ID"),
  CLIENT_SECRET: getEnvVar("GOOGLE_CLIENT_SECRET"),
  REDIRECT_URI: getEnvVar("GOOGLE_REDIRECT_URI"),
};

/*** ========================
 * NODE MAILER / SMTP
 * ==========================*/
export const SMTP = {
  EMAIL_USER: getEnvVar("EMAIL_USER"),
  EMAIL_PASS: getEnvVar("EMAIL_PASS"),
  EMAIL_HOST: getEnvVar("EMAIL_HOST"),
  SMTP_EMAIL: getEnvVar("SMTP_EMAIL"),
  SMTP_PASSWORD: getEnvVar("SMTP_PASSWORD"),
};

/*** ========================
 * SUPER ADMIN
 * ==========================*/
export const SUPERADMIN = {
  EMAIL: getEnvVar("SUPERADMIN_EMAIL"),
  PASSWORD: getEnvVar("SUPERADMIN_PASSWORD"),
};

/*** ========================
 * SEEDER USERS
 * ==========================*/
export const USERS = {
  SUPER_ADMIN: {
    NAME: getEnvVar("SUPER_ADMIN_NAME"),
    EMAIL: getEnvVar("SUPER_ADMIN_EMAIL"),
    PASSWORD: getEnvVar("SUPER_ADMIN_PASSWORD"),
  },
  ADMIN: {
    NAME: getEnvVar("ADMIN_NAME"),
    EMAIL: getEnvVar("ADMIN_EMAIL"),
    PASSWORD: getEnvVar("ADMIN_PASSWORD"),
  },
  EDITOR: {
    NAME: getEnvVar("EDITOR_NAME"),
    EMAIL: getEnvVar("EDITOR_EMAIL"),
    PASSWORD: getEnvVar("EDITOR_PASSWORD"),
  },
  NORMAL_USER: {
    NAME: getEnvVar("NORMAL_USER_NAME"),
    EMAIL: getEnvVar("NORMAL_USER_EMAIL"),
    PASSWORD: getEnvVar("NORMAL_USER_PASSWORD"),
  },
};

export default {
  DB,
  SERVER,
  CLIENT,
  JWT,
  GOOGLE,
  SMTP,
  SUPERADMIN,
  USERS,
};

// export const COOKIE_NAME = process.env.JWT_TOKEN || "JWT";

// export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

// export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// export const ACCESS_TOKEN_EXPIRES_IN =
//   process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";

// export const REFRESH_TOKEN_EXPIRES_IN =
//   process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

// export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
// export const NODE_ENV = process.env.NODE_ENV || "development";

// export const PORT = process.env.PORT || 3000;

// export const DB = {
//   URI: process.env.MONGO_URI,
// };

// export const GOOGLE = {
//   CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
//   CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
// };

// export const JWT = {
//   ACCESS_SECRET: process.env.ACCESS_TOKEN_SECRET,
//   REFRESH_SECRET: process.env.REFRESH_TOKEN_SECRET,
// };

// export default {
//   COOKIE_NAME,
//   ACCESS_TOKEN_SECRET,
//   REFRESH_TOKEN_SECRET,
//   ACCESS_TOKEN_EXPIRES_IN,
//   REFRESH_TOKEN_EXPIRES_IN,
//   CLIENT_URL,
//   NODE_ENV,
// };
