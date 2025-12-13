import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  // ✅ IMPORTANT: middleware expects decoded.id
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,              // ✅ true in production (HTTPS)
    sameSite: isProd ? "none" : "lax", // ✅ cross-site cookie for Vercel+Render
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken;
