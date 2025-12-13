import jwt from "jsonwebtoken";

/**
 * generateToken(res, userId)
 * - Signs a JWT containing the user's Mongo _id (as `id`)
 * - Stores it in an HttpOnly cookie named `token`
 *
 * NOTE:
 * - For cross-site deployments (Vercel frontend + Render backend), production MUST use:
 *   secure: true  and  sameSite: "none"
 * - For local dev/test over http://, secure must be false and sameSite should be "lax"
 */
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  const isProd = process.env.NODE_ENV === "production";
  const isTestOrDev =
    process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd && !isTestOrDev ? true : false, // secure cookies only over HTTPS
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export default generateToken;
