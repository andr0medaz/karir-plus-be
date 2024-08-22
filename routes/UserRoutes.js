import express from "express";
import { createUser, deleteUser, getUsers,updateUser, login, getUsersV2 } from "../controllers/UserController.js";

const router = express.Router();

router.get("/api/get-employee", getUsers);
router.post("/api/employee/create", createUser);
router.patch("/api/employee/edit/:nik", updateUser);
router.delete("/api/employee/delete/:nik", deleteUser);
// untuk login
router.post("/api/login", login);

// test api
router.get("/api/get-employe-v2", getUsersV2);

// router.get("/api/:nik", validateWorkExperienceTest2);
// router.get("/api/employees/:nik/work-experience", validateWorkExperience);

export default router;
