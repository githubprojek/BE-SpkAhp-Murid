import express from "express";
import { addKriteria, getAllKriteria, updateKriteria, deleteKriteria } from "../controllers/kriteria.controllers.js";
import { verifyToken, adminOnly } from "../lib/auth.js";
const router = express.Router();

router.get("/getall", getAllKriteria);
router.post("/add", verifyToken, adminOnly, addKriteria);
router.put("/update/:id", verifyToken, adminOnly, updateKriteria);
router.delete("/delete/:id", verifyToken, adminOnly, deleteKriteria);

export default router;
