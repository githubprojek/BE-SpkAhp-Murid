import express from "express";
import { addPerbandingan, getAllPerbandingan, updatePerbandingan, deletePerbandingan, deleteAllPerbandingan } from "../controllers/perbandingan.controllers.js";
import { verifyToken, adminOnly } from "../lib/auth.js";
const router = express.Router();

router.get("/getall", getAllPerbandingan);
router.post("/add", verifyToken, adminOnly, addPerbandingan);
router.put("/update/:id", verifyToken, adminOnly, updatePerbandingan);
router.delete("/delete/:id", verifyToken, adminOnly, deletePerbandingan);
router.delete("/deleteall", verifyToken, adminOnly, deleteAllPerbandingan);

export default router;
