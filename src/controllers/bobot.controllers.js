import PerbandinganKriteria from "../models/perbandingan.model.js";
import Kriteria from "../models/kriteria.model.js";
import BobotKriteria from "../models/bobot.kriteria.model.js";

const RI_TABLE = {
  1: 0.0,
  2: 0.0,
  3: 0.58,
  4: 0.9,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49,
};

export const hitungBobotKriteria = async (req, res) => {
  try {
    const kriteriaList = await Kriteria.find();
    const n = kriteriaList.length;

    const matrix = Array.from({ length: n }, () => Array(n).fill(1));
    const perbandingan = await PerbandinganKriteria.find();

    for (const item of perbandingan) {
      const i = kriteriaList.findIndex((k) => k._id.equals(item.kriteria1));
      const j = kriteriaList.findIndex((k) => k._id.equals(item.kriteria2));
      if (i !== -1 && j !== -1) {
        matrix[i][j] = Number(item.nilai_kriteria);
      }
    }

    const colSums = Array(n).fill(0);
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        colSums[j] += matrix[i][j];
      }
    }

    const normalized = Array.from({ length: n }, () => Array(n).fill(0));
    const bobotsRaw = [];
    const bobotsRounded = [];

    function truncate(num, digits = 2) {
      const factor = 10 ** digits;
      return Math.floor(num * factor) / factor;
    }

    for (let i = 0; i < n; i++) {
      let rowSum = 0;
      for (let j = 0; j < n; j++) {
        const val = matrix[i][j] / colSums[j];
        normalized[i][j] = Number(val.toFixed(2)); // hanya untuk ditampilkan
        rowSum += val;
      }
      const bobotExact = rowSum / n;
      bobotsRaw[i] = truncate(bobotExact, 2);
      bobotsRounded[i] = bobotsRaw[i];
    }

    // === TOTAL TIAP BARIS NORMALISASI (untuk CM dikali colSums) ===
    const rowSumsNormalized = normalized.map((row) =>
      truncate(
        row.reduce((sum, v) => sum + v, 0),
        2
      )
    );
    console.log("\n=== TOTAL TIAP BARIS NORMALISASI (untuk CM dikali colSums) ===");
    rowSumsNormalized.forEach((sum, i) => console.log(`Total normalisasi baris ${i + 1} (${kriteriaList[i].nama}): ${sum}`));

    // === CM MENGGUNAKAN METODE PDF ===
    const CM_PDF = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      CM_PDF[i] = truncate(rowSumsNormalized[i] * colSums[i], 2);
    }

    const lambdaMax = Number((CM_PDF.reduce((sum, v) => sum + v, 0) / n).toFixed(3));
    const CI = Number(((lambdaMax - n) / (n - 1)).toFixed(3));
    const RI = RI_TABLE[n] || 0.9;
    const CR = Number((CI / RI).toFixed(3));
    const isKonsisten = CR <= 0.1;

    await BobotKriteria.deleteMany();
    for (let i = 0; i < n; i++) {
      const doc = new BobotKriteria({
        kriteria: kriteriaList[i]._id,
        bobot: bobotsRounded[i],
        ...(i === 0 && {
          matrix,
          colSums: colSums.map((v) => Number(v.toFixed(4))),
          normalizedMatrix: normalized.map((row) => row.map((v) => Number(v.toFixed(4)))),
          rowSumsNormalized,
          CM: CM_PDF,
          lambdaMax,
          CI,
          CR,
          isKonsisten,
        }),
      });
      await doc.save();
    }

    // === LOGGING ===
    console.log("=== LIST KRITERIA ===");
    kriteriaList.forEach((k, i) => console.log(`${i + 1}. ${k.nama} (${k._id})`));

    console.log("\n=== MATRKS PERBANDINGAN ===");
    console.table(matrix.map((row) => row.map((v) => Number(v.toFixed(4)))));

    console.log("\n=== JUMLAH SETIAP KOLOM ===");
    console.table(colSums.map((v) => Number(v.toFixed(4))));

    console.log("\n=== NORMALIZED MATRIX ===");
    console.table(normalized.map((row) => row.map((v) => Number(v.toFixed(4)))));

    console.log("\n=== BOBOT RAW (eigen vector rata-rata tiap baris) ===");
    bobotsRaw.forEach((b, i) => console.log(`Bobot ${kriteriaList[i].nama}: ${b.toFixed(4)}`));

    console.log("\n=== BOBOT ROUND (dibulatkan 2 angka) ===");
    bobotsRounded.forEach((b, i) => console.log(`Bobot ${kriteriaList[i].nama}: ${b}`));

    console.log("\n=== CM VERSI PDF (rowSum x colSum) ===");
    CM_PDF.forEach((cm, i) => console.log(`CM[${i}] = ${rowSumsNormalized[i]} x ${colSums[i]} = ${cm}`));

    console.log(`\nλmax (lambda max) = ${lambdaMax}`);
    console.log(`CI (Consistency Index) = ${CI}`);
    console.log(`CR (Consistency Ratio) = ${CR}`);
    console.log(`Apakah konsisten? ${isKonsisten ? "YA ✅" : "TIDAK ❌"}`);

    res.status(200).json({
      message: "Bobot kriteria dihitung & disimpan (menggunakan CM dari PDF).",
      matrix: matrix.map((row) => row.map((v) => Number(v.toFixed(4)))),
      colSums: colSums.map((v) => Number(v.toFixed(4))),
      normalized: normalized.map((row) => row.map((v) => Number(v.toFixed(4)))),
      bobotsRaw: bobotsRaw.map((v) => Number(v.toFixed(4))),
      bobotsRounded,
      rowSumsNormalized,
      CM: CM_PDF,
      lambdaMax,
      CI,
      CR,
      isKonsisten,
    });
  } catch (error) {
    console.error("Gagal hitung bobot kriteria:", error);
    res.status(500).json({ message: "Gagal hitung bobot kriteria", error });
  }
};

export const getBobotKriteria = async (req, res) => {
  try {
    const bobotKriteria = await BobotKriteria.find().populate("kriteria");
    res.status(200).json(bobotKriteria);
  } catch (error) {
    console.error("Error fetching bobot kriteria:", error);
    res.status(500).json({ message: "Gagal mendapatkan bobot kriteria", error });
  }
};

export const deleteBobotById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBobot = await BobotKriteria.findByIdAndDelete(id);
    if (!deletedBobot) {
      return res.status(404).json({ message: "Bobot not found" });
    }
    res.status(200).json({ message: "Bobot deleted successfully", deletedBobot });
  } catch (error) {
    console.error("Error deleting bobot:", error);
    res.status(500).json({ message: "Failed to delete bobot", error });
  }
};

export const getKonsistensiStatus = async (req, res) => {
  try {
    const all = await BobotKriteria.find();
    if (!all || all.length === 0) {
      return res.status(404).json({ message: "Data bobot kriteria tidak ditemukan." });
    }

    // Ambil status isKonsisten dari salah satu dokumen (karena AHP dihitung global)
    const isKonsisten = all[0].isKonsisten;

    res.status(200).json({ isKonsisten });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil status konsistensi", error: err });
  }
};
