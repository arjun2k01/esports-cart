import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Determine if we are in a secure environment (Production)
  const isProduction = process.env.NODE_ENV === "production";
  
  // Tests run in "test" environment, Local dev runs in "development"
  const isTestOrDev = process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development";

  res.cookie("token", token, {
    httpOnly: true,
    // ✅ DISABLE 'secure' for tests/dev so cookies work over HTTP
    secure: !isTestOrDev, 
    // ✅ Use 'lax' for local dev/test to avoid SameSite issues with non-secure cookies
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export default generateToken;