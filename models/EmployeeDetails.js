import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import EmployeeNIK from "./EmployeeNIK.js"; // Mengimpor model EmployeeNIK

const { DataTypes } = Sequelize;

const EmployeeDetails = db.define(
  "employee_details",
  {
    nik: {
      type: DataTypes.INTEGER,
      references: {
        model: EmployeeNIK, // Relasi ke tabel EmployeeNIK
        key: "nik",
      },
    },
    name: DataTypes.STRING,
    tanggal_masuk: DataTypes.DATEONLY,
    pangkat: DataTypes.STRING,
    jabatan: DataTypes.STRING,
    academic_background: DataTypes.STRING,
    nomor_telepon: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

// Definisikan relasi One-to-One
EmployeeNIK.hasOne(EmployeeDetails, { foreignKey: "nik" });
EmployeeDetails.belongsTo(EmployeeNIK, { foreignKey: "nik" });

export default EmployeeDetails;
