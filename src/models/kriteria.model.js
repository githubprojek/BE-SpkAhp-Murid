// models/Kriteria.js
import mongoose from "mongoose";

const kriteriaSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  keterangan: { type: String },
});

const Kriteria = mongoose.model("Kriteria", kriteriaSchema);
export default Kriteria;
