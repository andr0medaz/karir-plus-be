import express from "express";
import { createUser, deleteUser, updateUser, login, getUsersV2 } from "../controllers/UserController.js";

const router = express.Router();

router.post("/api/employee/create", createUser);
router.patch("/api/employee/edit/:nik", updateUser);
router.delete("/api/employee/delete/:nik", deleteUser);
router.post("/api/login", login);
router.get("/api/get-employee-v2", getUsersV2);

export default router;
