import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export const addUser = async (req, res) => {
  try {
    const { nama, email, password, no_hp, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email sudah terdaftar" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ nama, email, password: hashedPassword, no_hp, role });
    await user.save();
    res.status(201).json({ message: "User berhasil ditambahkan", user });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambahkan user", error });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { nama, email, password, no_hp, role } = req.body;
    const id = req.params.id;

    let updateData = { nama, email, no_hp, role };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json({ message: "User berhasil diperbarui", user });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui user", error });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
