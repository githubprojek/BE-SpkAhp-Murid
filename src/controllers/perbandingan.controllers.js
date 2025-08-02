import PerbandinganKriteria from "../models/perbandingan.model.js";

export const getAllPerbandingan = async (req, res) => {
  try {
    const perbandinganKriterias = await PerbandinganKriteria.find();
    res.status(200).json(perbandinganKriterias);
  } catch (error) {
    res.status(500).json({ message: "Error fetching perbandingan kriteria", error });
  }
};

export const addPerbandingan = async (req, res) => {
  try {
    const { kriteria1, kriteria2, nilai_kriteria } = req.body;

    // ✅ 1️⃣ Validasi tidak boleh sama
    if (kriteria1 === kriteria2) {
      return res.status(400).json({
        message: "Tidak boleh membandingkan kriteria dengan dirinya sendiri.",
      });
    }

    // ✅ 2️⃣ Cek duplikat hanya dalam arah yang sama (tidak cek arah balik)
    const existing = await PerbandinganKriteria.findOne({
      kriteria1,
      kriteria2,
    });

    if (existing) {
      return res.status(400).json({
        message: "Perbandingan kriteria ini sudah ada.",
      });
    }

    // ✅ 3️⃣ Biarkan nilai sesuai inputan (boleh desimal)
    const fixedNilai = Number(parseFloat(nilai_kriteria).toFixed(4));
    if (fixedNilai === 0) {
      return res.status(400).json({
        message: "Nilai perbandingan tidak valid (0).",
      });
    }

    // ✅ 4️⃣ Simpan hanya satu arah (tanpa otomatis simetris)
    const dataAsli = new PerbandinganKriteria({
      kriteria1,
      kriteria2,
      nilai_kriteria: fixedNilai,
    });

    await dataAsli.save();

    return res.status(201).json({
      message: "Perbandingan berhasil disimpan (input manual arah & nilai).",
      data: dataAsli,
    });
  } catch (error) {
    console.error("Error addPerbandingan:", error);
    return res.status(500).json({
      message: "Gagal menambahkan perbandingan",
      error,
    });
  }
};

export const updatePerbandingan = async (req, res) => {
  try {
    const id = req.params.id;
    const { kriteria1, kriteria2, nilai_kriteria } = req.body;

    // 1️⃣ Validasi tidak boleh sama
    if (kriteria1 === kriteria2) {
      return res.status(400).json({ message: "Tidak boleh membandingkan kriteria dengan dirinya sendiri." });
    }

    // 2️⃣ Cek duplikat lain
    const existing = await PerbandinganKriteria.findOne({
      $or: [
        { kriteria1, kriteria2 },
        { kriteria1: kriteria2, kriteria2: kriteria1 },
      ],
    });

    if (existing && existing._id.toString() !== id) {
      return res.status(400).json({ message: "Perbandingan kriteria ini sudah pernah dimasukkan." });
    }

    // 3️⃣ PAKSA FIX 4 digit
    const fixedNilai = Number(parseFloat(nilai_kriteria).toFixed(4));
    const fixedBalikan = Number(parseFloat((1 / fixedNilai).toFixed(4)));

    // 4️⃣ Update data asli & simetris
    const dataAsli = await PerbandinganKriteria.findByIdAndUpdate(id, { kriteria1, kriteria2, nilai_kriteria: fixedNilai }, { new: true });

    const dataSimetris = await PerbandinganKriteria.findOneAndUpdate({ kriteria1: kriteria2, kriteria2: kriteria1 }, { nilai_kriteria: fixedBalikan }, { new: true });

    res.status(200).json({
      message: "Perbandingan berhasil diperbarui (simetris fix).",
      dataAsli,
      dataSimetris,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal memperbarui perbandingan",
      error,
    });
  }
};

export const deletePerbandingan = async (req, res) => {
  try {
    const id = req.params.id;
    await PerbandinganKriteria.findByIdAndDelete(id);
    res.status(200).json({ message: "Perbandingan kriteria deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting perbandingan kriteria", error });
  }
};

export const deleteAllPerbandingan = async (req, res) => {
  try {
    await PerbandinganKriteria.deleteMany();
    res.status(200).json({ message: "All perbandingan kriteria deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting all perbandingan kriteria", error });
  }
};
