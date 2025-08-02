import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// REGISTER
export const signup = async (req, res) => {
  try {
    const { nama, email, password, no_hp, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email sudah terdaftar" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ nama, email, password: hashedPassword, no_hp, role });
    await user.save();

    res.status(201).json({ message: "Registrasi berhasil", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: "Password salah" });

    const token = jwt.sign({ id: user._id, nama: user.nama, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      message: "Login berhasil",
      token,
      user: { id: user._id, nama: user.nama, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
