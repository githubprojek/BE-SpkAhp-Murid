import mongoose from "mongoose";

const bobotKriteriaSchema = new mongoose.Schema({
  kriteria: { type: mongoose.Schema.Types.ObjectId, ref: "Kriteria", required: true },
  bobot: { type: Number, required: true },

  // Detail AHP perbandingan kriteria
  matrix: [[Number]],
  normalizedMatrix: [[Number]],
  lambdaMax: Number,
  CI: Number,
  CR: Number,
  isKonsisten: Boolean,
});

const BobotKriteria = mongoose.model("BobotKriteria", bobotKriteriaSchema);
export default BobotKriteria;
