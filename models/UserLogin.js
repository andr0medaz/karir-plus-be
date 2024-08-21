import { Sequelize } from "sequelize";
import db_login from "../config/DatabaseLogin.js";

const { DataTypes } = Sequelize;

const UserLogin = db_login.define(
  "user_login",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

export default UserLogin;

(async () => {
  await db_login.sync();
})();
