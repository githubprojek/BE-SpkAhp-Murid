// models/MuridDetail.js
import mongoose from "mongoose";

const muridSchema = new mongoose.Schema({
  nis: { type: String, required: true },
  nama: { type: String, required: true },
  kelas: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const Murid = mongoose.model("Murid", muridSchema);
export default Murid;
