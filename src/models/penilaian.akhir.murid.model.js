import mongoose from "mongoose";

const penilaianAkhirMuridSchema = new mongoose.Schema({
  murid: { type: mongoose.Schema.Types.ObjectId, ref: "Murid", required: true },
  rincian: [
    {
      kriteria: { type: mongoose.Schema.Types.ObjectId, ref: "Kriteria" },
      bobotKriteria: Number,
      bobotMurid: Number,
      skor: Number,
    },
  ],
  totalSkor: Number,
});

const PenilaianAkhirMurid = mongoose.model("PenilaianAkhirMurid", penilaianAkhirMuridSchema);
export default PenilaianAkhirMurid;
