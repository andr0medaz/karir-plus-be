// import menggunakan format es module
import express from "express";
// const express = require("express"); <--- merupakan contoh import dengan common js
import cors from "cors";
import UserRoutes from "./routes/UserRoutes.js";
// import sync database
import syncDatabase from "./models/syncDatabase.js";


const app = express();

// sync database
syncDatabase();

// middleware
app.use(cors());
app.use(express.json());
app.use(UserRoutes);


// port running
app.listen("5000", () => console.log("Server up and Running...."));
