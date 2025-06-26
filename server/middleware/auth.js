import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET;

export default async function authMiddleware(req, res, next) {
  // catch the bearer token from the request header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  // extract the token from the header

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error, "error in auth middleware");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
