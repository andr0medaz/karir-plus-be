import { Sequelize } from "sequelize";
// import file Database file database di folder config
import db from "../config/Database.js";

const { DataTypes } = Sequelize;
const employee = db.define(
  "employee",
  {
    nik: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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

export default employee;

// untuk membuat tabel jika tabel belum ada di database main
(async () => {
  await db.sync();
})();
