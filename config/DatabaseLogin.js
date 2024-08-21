import { Sequelize } from "sequelize";

const db_login = new Sequelize("user_login", "root", "andro@123", {
  host: "localhost",
  dialect: "mysql",
});

export default db_login;
