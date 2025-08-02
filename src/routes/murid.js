import express from "express";
import { addMurid, getAllMurid, updateMurid, deleteMurid } from "../controllers/murid.controllers.js";
import { verifyToken, guruOnly } from "../lib/auth.js";
const router = express.Router();

router.get("/getall", getAllMurid);
router.post("/add", verifyToken, guruOnly, addMurid);
router.put("/update/:id", verifyToken, guruOnly, updateMurid);
router.delete("/delete/:id", verifyToken, guruOnly, deleteMurid);

export default router;
