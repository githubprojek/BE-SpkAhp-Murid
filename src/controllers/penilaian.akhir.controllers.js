import BobotMurid from "../models/bobot.murid.model.js";
import BobotKriteria from "../models/bobot.kriteria.model.js";
import PenilaianAkhirMurid from "../models/penilaian.akhir.murid.model.js";
import Murid from "../models/murid.model.js";

export const hitungPenilaianAkhir = async (req, res) => {
  try {
    const semuaMurid = await Murid.find();
    const bobotKriteria = await BobotKriteria.find(); // bobot global
    const hasil = [];

    const bobotMap = {};
    bobotKriteria.forEach((b) => {
      bobotMap[b.kriteria.toString()] = b.bobot;
    });

    await PenilaianAkhirMurid.deleteMany(); // reset data lama

    for (const murid of semuaMurid) {
      const bobotMuridList = await BobotMurid.find({ murid: murid._id });

      const rincian = bobotMuridList.map((bm) => {
        const bobotK = bobotMap[bm.kriteria.toString()] || 0;
        const skor = bm.bobot * bobotK;
        return {
          kriteria: bm.kriteria,
          bobotKriteria: bobotK,
          bobotMurid: bm.bobot,
          skor,
        };
      });

      const totalSkor = rincian.reduce((acc, cur) => acc + cur.skor, 0);

      const simpan = await PenilaianAkhirMurid.create({
        murid: murid._id,
        rincian,
        totalSkor,
      });

      hasil.push(simpan);
    }

    res.status(200).json({
      message: "Penilaian akhir murid berhasil dihitung",
      data: hasil,
    });
  } catch (error) {
    console.error("Error hitung penilaian akhir:", error);
    res.status(500).json({ message: "Gagal menghitung penilaian akhir", error });
  }
};

export const getAllPenilaianAkhir = async (req, res) => {
  try {
    const data = await PenilaianAkhirMurid.find().populate("murid").populate("rincian.kriteria");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data penilaian akhir", error });
  }
};

export const deleteAllPenilaianAkhir = async (req, res) => {
  try {
    await PenilaianAkhirMurid.deleteMany();
    res.status(200).json({ message: "Semua penilaian akhir berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus penilaian akhir", error });
  }
};
