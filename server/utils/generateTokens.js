import jwt from "jsonwebtoken";

const generateTokens = (userPayload) => {
  const accessToken = jwt.sign(
    userPayload,
    process.env.ACCESS_TOKEN_SECRET || "access-secret",
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m" }
  );

  const refreshToken = jwt.sign(
    { id: userPayload.id },
    process.env.REFRESH_TOKEN_SECRET || "refresh-secret",
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d" }
  );
  return { accessToken, refreshToken };
};

export default generateTokens;
