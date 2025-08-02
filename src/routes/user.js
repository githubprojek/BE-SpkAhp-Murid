import express from "express";

import { addUser, getAllUsers, updateUser, deleteUser } from "../controllers/user.controllers.js";
import { verifyToken, adminOnly } from "../lib/auth.js";
const router = express.Router();

router.get("/getall", verifyToken, getAllUsers);
router.post("/add", verifyToken, addUser);
router.put("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, adminOnly, deleteUser);

export default router;
