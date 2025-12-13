// backend/utils/generateToken.js
import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd, // ✅ required on https (Render)
    sameSite: isProd ? "none" : "lax", // ✅ required for cross-site cookies (Vercel -> Render)
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
};

export default generateToken;
