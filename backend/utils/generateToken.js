import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,          // Required for HTTPS (Vercel + Render)
    sameSite: "none",      // Required for cross-site cookies
    path: "/",             // Ensure cookie is available to all routes
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export default generateToken;
