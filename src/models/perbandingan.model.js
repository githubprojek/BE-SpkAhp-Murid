// models/PerbandinganKriteria.js
import mongoose from "mongoose";

const perbandinganKriteriaSchema = new mongoose.Schema({
  kriteria1: { type: mongoose.Schema.Types.ObjectId, ref: "Kriteria" },
  kriteria2: { type: mongoose.Schema.Types.ObjectId, ref: "Kriteria" },
  nilai_kriteria: { type: Number },
});

const PerbandinganKriteria = mongoose.model("PerbandinganKriteria", perbandinganKriteriaSchema);
export default PerbandinganKriteria;
