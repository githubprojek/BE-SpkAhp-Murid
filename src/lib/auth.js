import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Verifikasi token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token tidak ditemukan" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Token tidak valid" });
  }
};

// Admin only
export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Akses ditolak, hanya untuk admin" });
  }
  next();
};

// Guru only
export const guruOnly = (req, res, next) => {
  if (req.user.role !== "guru") {
    return res.status(403).json({ message: "Akses ditolak, hanya untuk guru" });
  }
  next();
};
