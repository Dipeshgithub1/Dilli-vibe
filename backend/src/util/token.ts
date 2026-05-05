
import jwt from "jsonwebtoken";

export const generateAccessToken = (user: any) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (user: any) => {
  return jwt.sign(
    { id: user._id },
    process.env.REFRESH_SECRET!,
    { expiresIn: "7d" }
  );
};