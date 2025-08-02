import PerbandinganMurid from "../models/perbandingan.murid.model.js";
import BobotMurid from "../models/bobot.murid.model.js";
import Kriteria from "../models/kriteria.model.js";
import Murid from "../models/murid.model.js";

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

export const hitungBobotMurid = async (req, res) => {
  try {
    const semuaKriteria = await Kriteria.find();
    const semuaMurid = await Murid.find();
    await BobotMurid.deleteMany();

    const hasil = [];

    for (const kriteria of semuaKriteria) {
      const muridIds = semuaMurid.map((m) => m._id.toString());
      const n = muridIds.length;
      if (n < 2) continue;

      const matrix = Array.from({ length: n }, () => Array.from({ length: n }, () => 1.0));

      const perbandingan = await PerbandinganMurid.find({ kriteria: kriteria._id });

      for (const item of perbandingan) {
        const i = muridIds.indexOf(item.murid1.toString());
        const j = muridIds.indexOf(item.murid2.toString());
        if (i !== -1 && j !== -1) {
          matrix[i][j] = parseFloat(item.nilai.toFixed(3));
        }
      }

      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (i !== j && matrix[i][j] === 1.0 && matrix[j][i] !== 1.0) {
            matrix[i][j] = parseFloat((1 / matrix[j][i]).toFixed(3));
          }
        }
      }

      const colSums = Array(n).fill(0);
      for (let j = 0; j < n; j++) {
        for (let i = 0; i < n; i++) {
          colSums[j] += matrix[i][j];
        }
        colSums[j] = parseFloat(colSums[j].toFixed(3));
      }

      const normalized = Array.from({ length: n }, () => Array(n).fill(0));
      const bobotsRaw = [];
      const bobotsRounded = [];

      for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = 0; j < n; j++) {
          const val = matrix[i][j] / colSums[j];
          normalized[i][j] = parseFloat(val.toFixed(3));
          sum += val;
        }
        const exact = sum / n;
        bobotsRaw[i] = parseFloat(exact.toFixed(3));
        bobotsRounded[i] = parseFloat(exact.toFixed(3));
      }

      const rowSumsNormalized = normalized.map((row) => parseFloat(row.reduce((sum, v) => sum + v, 0).toFixed(3)));

      const CM_PDF = colSums.map(
        (colSum, i) => parseFloat((colSum * bobotsRaw[i]).toFixed(3)) // gunakan bobotsRaw
      );

      const lambdaMax = parseFloat((CM_PDF.reduce((sum, val) => sum + val, 0) / n).toFixed(3));
      const CI = parseFloat(((lambdaMax - n) / (n - 1)).toFixed(3));
      const IR = 1.12; // Pakai nilai IR dari indeks ke-5 (sesuai instruksi dosen)
      const CR = parseFloat((IR === 0 ? 0 : CI / IR).toFixed(3));
      const isKonsisten = CR < 0.1;

      // ==================== LOGGING ====================
      console.log(`\n=== Perhitungan Kriteria: ${kriteria.nama} ===`);
      console.table(matrix);

      console.log("\nJumlah Kolom (colSums):");
      console.log(colSums.map((v) => v.toFixed(3)));

      console.log("\nNormalisasi Matriks:");
      normalized.forEach((row, i) => {
        console.log(
          `Murid ${i + 1}:`,
          row.map((v) => v.toFixed(3))
        );
      });

      console.log("\nJumlah Baris Normalisasi:");
      rowSumsNormalized.forEach((v, i) => {
        console.log(`Murid ${i + 1}: ${v.toFixed(3)}`);
      });

      console.log("\nBobot Real:");
      bobotsRaw.forEach((v, i) => {
        console.log(`Murid ${i + 1}: ${v.toFixed(3)}`);
      });

      console.log("\nBobot Final (3 digit):");
      bobotsRounded.forEach((v, i) => {
        console.log(`Murid ${i + 1}: ${v.toFixed(3)}`);
      });

      console.log("\nCM Versi PDF:");
      CM_PDF.forEach((v, i) => {
        console.log(`CM[${i}] = ${colSums[i].toFixed(3)} x ${bobotsRounded[i].toFixed(3)} = ${v.toFixed(3)}`);
      });

      console.log(`\nLambda Max = (total CM / n) = (${CM_PDF.reduce((a, b) => a + b, 0).toFixed(3)} / ${n}) = ${lambdaMax.toFixed(3)}`);
      console.log(`CI = (${lambdaMax.toFixed(3)} - ${n}) / (${n} - 1) = ${CI.toFixed(3)}`);
      console.log(`CR = ${CI.toFixed(3)} / 1.120 = ${CR.toFixed(3)}`);
      console.log(`Konsisten? ${isKonsisten ? "✅ Ya" : "❌ Tidak"}`);

      // ==================== SIMPAN ====================
      for (let i = 0; i < n; i++) {
        const doc = new BobotMurid({
          kriteria: kriteria._id,
          murid: muridIds[i],
          bobot: bobotsRounded[i],
          ...(i === 0 && {
            matrix,
            colSums,
            normalizedMatrix: normalized,
            rowSumsNormalized,
            CM: CM_PDF,
            lambdaMax,
            CI,
            CR,
            isKonsisten,
          }),
        });
        await doc.save();
        hasil.push(doc);
      }
    }

    res.status(200).json({
      message: "Bobot murid dihitung & disimpan (presisi 3 digit).",
      data: hasil,
    });
  } catch (error) {
    console.error("Gagal hitung bobot murid:", error);
    res.status(500).json({ message: "Gagal hitung bobot murid", error });
  }
};

// 2️⃣ Ambil semua bobot murid
export const getAllBobotMurid = async (req, res) => {
  try {
    const data = await BobotMurid.find().populate("kriteria").populate("murid");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data bobot murid", error });
  }
};

// 3️⃣ Ambil bobot murid berdasarkan kriteria
export const getBobotMuridByKriteria = async (req, res) => {
  try {
    const { kriteriaId } = req.params;
    const data = await BobotMurid.find({ kriteria: kriteriaId }).populate("murid");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil bobot berdasarkan kriteria", error });
  }
};

// 4️⃣ Hapus semua bobot murid
export const deleteBobotMuridById = async (req, res) => {
  try {
    const { id } = req.params;
    await BobotMurid.findByIdAndDelete(id);
    res.status(200).json({ message: "Semua bobot murid berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus semua bobot murid", error });
  }
};
