import mongoose from "mongoose";

const bobotMuridSchema = new mongoose.Schema({
  kriteria: { type: mongoose.Schema.Types.ObjectId, ref: "Kriteria", required: true },
  murid: { type: mongoose.Schema.Types.ObjectId, ref: "Murid", required: true },
  bobot: { type: Number, required: true },

  // detail perhitungan AHP lokal
  matrix: [[Number]],
  normalizedMatrix: [[Number]],
  lambdaMax: Number,
  CI: Number,
  CR: Number,
  isKonsisten: Boolean,
});

const BobotMurid = mongoose.model("BobotMurid", bobotMuridSchema);
export default BobotMurid;
