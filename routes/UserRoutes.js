import express from "express";
import { createUser, deleteUser, getUsers, updateUser, validateWorkExperience, validateWorkExperienceTest2, login } from "../controllers/UserController.js";

const router = express.Router();

router.get("/employee", getUsers);
router.get("/api/employees/:nik/work-experience", validateWorkExperience);
router.post("/employee/create", createUser);
router.get("/api/:nik", validateWorkExperienceTest2);
router.patch("/api/employee/update/:nik", updateUser);
router.delete("/api/employee/delete/:nik", deleteUser);
// unutk login
router.post("/api/login", login);

export default router;
