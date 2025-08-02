// models/PenilaianMurid.js
import mongoose from "mongoose";

const penilaianMuridSchema = new mongoose.Schema({
  murid: { type: mongoose.Schema.Types.ObjectId, ref: "Murid", required: true },
  kriteria: { type: mongoose.Schema.Types.ObjectId, ref: "Kriteria", required: true },
  nilai_murid: { type: Number },
});

const PenilaianMurid = mongoose.model("PenilaianMurid", penilaianMuridSchema);
export default PenilaianMurid;
