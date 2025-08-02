import PerbandinganMurid from "../models/perbandingan.murid.model.js";

// Tambah perbandingan murid (dan simetrisnya)
export const addPerbandinganMurid = async (req, res) => {
  try {
    const { kriteria, murid1, murid2, nilai } = req.body;

    // 🔒 Validasi tidak boleh membandingkan murid dengan dirinya sendiri
    if (murid1 === murid2) {
      return res.status(400).json({
        message: "Tidak boleh membandingkan murid dengan dirinya sendiri.",
      });
    }

    // 🔍 Cek apakah data perbandingan arah ini sudah pernah ada
    const existing = await PerbandinganMurid.findOne({
      kriteria,
      murid1,
      murid2,
    });

    if (existing) {
      return res.status(400).json({
        message: "Perbandingan murid untuk kriteria ini sudah ada.",
      });
    }

    // ✅ Validasi nilai tidak boleh 0
    const nilaiFix = Number(nilai);
    if (nilaiFix === 0 || isNaN(nilaiFix)) {
      return res.status(400).json({
        message: "Nilai perbandingan tidak valid.",
      });
    }

    // ✅ Simpan hanya 1 arah (tanpa simetris)
    const perbandingan = new PerbandinganMurid({
      kriteria,
      murid1,
      murid2,
      nilai: nilaiFix,
    });

    await perbandingan.save();

    res.status(201).json({
      message: "Perbandingan murid berhasil disimpan.",
      data: perbandingan,
    });
  } catch (error) {
    console.error("Error addPerbandinganMurid:", error);
    res.status(500).json({
      message: "Gagal menyimpan perbandingan murid.",
      error,
    });
  }
};

// Ambil semua perbandingan
export const getAllPerbandinganMurid = async (req, res) => {
  try {
    const list = await PerbandinganMurid.find().populate("kriteria").populate("murid1").populate("murid2");
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data", error });
  }
};

// Ambil perbandingan berdasarkan kriteria
export const getPerbandinganByKriteria = async (req, res) => {
  try {
    const { kriteriaId } = req.params;
    const list = await PerbandinganMurid.find({ kriteria: kriteriaId }).populate("murid1").populate("murid2");
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data per kriteria", error });
  }
};

// Hapus satu perbandingan (dan simetrisnya)
export const deletePerbandinganMurid = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await PerbandinganMurid.findByIdAndDelete(id);
    if (!data) return res.status(404).json({ message: "Data tidak ditemukan" });

    res.status(200).json({ message: "Perbandingan berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus data", error });
  }
};

// 5️⃣ Hapus semua perbandingan murid berdasarkan kriteria
export const deleteall = async (req, res) => {
  try {
    const result = await PerbandinganMurid.deleteMany({});

    res.status(200).json({
      message: `Berhasil menghapus ${result.deletedCount} perbandingan untuk kriteria.`,
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus perbandingan berdasarkan kriteria", error });
  }
};
export const deletePerbandinganByKriteria = async (req, res) => {
  try {
    const { kriteriaId } = req.params;
    const result = await PerbandinganMurid.deleteMany({ kriteria: kriteriaId });

    res.status(200).json({
      message: `Berhasil menghapus ${result.deletedCount} perbandingan untuk kriteria.`,
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus perbandingan berdasarkan kriteria", error });
  }
};
