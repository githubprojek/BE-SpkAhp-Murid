import express from "express";
import { addPerbandinganMurid, getAllPerbandinganMurid, deletePerbandinganMurid, deletePerbandinganByKriteria, deleteall } from "../controllers/perbandingan.murid.controllers.js";
import { verifyToken, guruOnly } from "../lib/auth.js";

const router = express.Router();

router.get("/getall", getAllPerbandinganMurid);
router.post("/add", verifyToken, guruOnly, addPerbandinganMurid);
router.delete("/delete/:id", verifyToken, guruOnly, deletePerbandinganMurid);
router.delete("/deleteall", deleteall);
router.delete("/delete/kriteria/:kriteriaId", verifyToken, guruOnly, deletePerbandinganByKriteria);

export default router;
