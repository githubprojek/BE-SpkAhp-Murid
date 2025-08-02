const math = require("mathjs");
const readline = require("readline-sync");

const n = parseInt(readline.question("Berapa jumlah kriteria? ")); // Input jumlah kriteria
let kriteria = [];

console.log("\n=== AHP - INPUT Kriteria ===");
for (let i = 0; i < n; i++) {
  const namaKriteria = readline.question(`Masukkan nama kriteria ke-${i + 1}: `);
  kriteria.push(namaKriteria);
}

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

console.log("\n=== AHP - INPUT MATRKS PERBANDINGAN KRITERIA ===");
let matrix = [];

for (let i = 0; i < n; i++) {
  matrix[i] = [];
  for (let j = 0; j < n; j++) {
    if (i === j) {
      matrix[i][j] = 1;
    } else if (j < i) {
      matrix[i][j] = 1 / matrix[j][i]; // simetris
    } else {
      const nilai = parseFloat(readline.question(`Nilai perbandingan ${kriteria[i]} terhadap ${kriteria[j]}: `));
      matrix[i][j] = nilai;
    }
  }
}

// 1. Jumlah kolom
const colSums = Array(n).fill(0);
for (let j = 0; j < n; j++) {
  for (let i = 0; i < n; i++) {
    colSums[j] += matrix[i][j];
  }
}

// 2. Normalisasi dan bobot
const normalized = [];
for (let i = 0; i < n; i++) {
  normalized[i] = [];
  for (let j = 0; j < n; j++) {
    normalized[i][j] = matrix[i][j] / colSums[j];
  }
}

const weights = normalized.map((row) => row.reduce((a, b) => a + b) / n);

// 3. Konsistensi
const Aw = math.multiply(matrix, weights);
const lambdas = Aw.map((val, i) => val / weights[i]);
const lambdaMax = lambdas.reduce((a, b) => a + b) / n;
const CI = (lambdaMax - n) / (n - 1);
const RI = RI_TABLE[n];
const CR = CI / RI;

// 4. Tampilkan bobot
console.log("\n=== BOBOT KRITERIA ===");
weights.forEach((w, i) => {
  console.log(`${kriteria[i]}: ${w.toFixed(4)}`);
});
console.log(`\nCR: ${CR.toFixed(4)} → ${CR < 0.1 ? "Konsisten ✅" : "Tidak Konsisten ❌"}`);

// 5. Input Alternatif
const jumlahAlternatif = parseInt(readline.question("\nBerapa jumlah siswa? "));
let siswa = [];

for (let i = 0; i < jumlahAlternatif; i++) {
  const nama = readline.question(`\nNama siswa ke-${i + 1}: `);
  let nilai = [];
  for (let j = 0; j < n; j++) {
    const skor = parseFloat(readline.question(`  Masukkan nilai ${kriteria[j]}: `));
    nilai.push(skor);
  }
  siswa.push({ nama, nilai });
}

// 6. Hitung skor akhir siswa
siswa = siswa.map((s) => {
  let total = s.nilai.reduce((acc, val, i) => acc + val * weights[i], 0);
  return { ...s, total };
});

// 7. Urutkan berdasarkan skor
siswa.sort((a, b) => b.total - a.total);

// 8. Tampilkan hasil ranking
console.log("\n=== HASIL RANKING SISWA ===");
siswa.forEach((s, i) => {
  console.log(`${i + 1}. ${s.nama} - Skor Akhir: ${s.total.toFixed(4)}`);
});
