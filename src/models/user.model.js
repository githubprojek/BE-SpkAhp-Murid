// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  no_hp: { type: String, required: true },
  role: { type: String, enum: ["admin", "guru"], required: true },
});

const User = mongoose.model("User", userSchema);
export default User;
