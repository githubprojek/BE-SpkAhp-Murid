import mongoose from "mongoose";

const perbandinganMuridSchema = new mongoose.Schema({
  kriteria: { type: mongoose.Schema.Types.ObjectId, ref: "Kriteria", required: true },
  murid1: { type: mongoose.Schema.Types.ObjectId, ref: "Murid", required: true },
  murid2: { type: mongoose.Schema.Types.ObjectId, ref: "Murid", required: true },
  nilai: { type: Number, required: true },
});

const PerbandinganMurid = mongoose.model("PerbandinganMurid", perbandinganMuridSchema);
export default PerbandinganMurid;
