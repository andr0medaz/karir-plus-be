import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const EmployeeNIK = db.define(
  "employee_nik",
  {
    nik: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default EmployeeNIK;
