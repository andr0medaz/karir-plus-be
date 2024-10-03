import db from "../config/Database.js";
import EmployeeNIK from "./EmployeeNIK.js";
import EmployeeDetails from "./EmployeeDetails.js";

// Sinkronisasi model
const syncDatabase = async () => {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
    await db.sync({ alter: true }); // Gunakan 'force: true' untuk drop tabel sebelum sinkronisasi
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Unable to synchronize the database:", error);
  }
};

export default syncDatabase;
