import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { connectDb } from "./src/lib/db.js";
import kriteriaRoute from "./src/routes/kriteria.js";
import userRoute from "./src/routes/user.js";
import muridRoute from "./src/routes/murid.js";

import perbandinganRoute from "./src/routes/perbandingan.js";
import bobotRoute from "./src/routes/bobot.js";
import penilaianAkhirRoute from "./src/routes/penilaian.akhir.js";
import PerbandinganMuridRoute from "./src/routes/perbandingan.murid.js";
import BobotMuridRoute from "./src/routes/bobot.murid.js";
import authRoute from "./src/routes/auth.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet());

app.use("/kriteria", kriteriaRoute);
app.use("/user", userRoute);
app.use("/murid", muridRoute);
app.use("/perbandingan", perbandinganRoute);
app.use("/bobot", bobotRoute);
app.use("/penilaianakhir", penilaianAkhirRoute);
app.use("/perbandinganmurid", PerbandinganMuridRoute);
app.use("/bobotmurid", BobotMuridRoute);
app.use("/auth", authRoute);

app.get("/", (req, res) => {
  res.send("API Online 🚀");
});

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log("✅ Backend running on port:", PORT);
  });
});
