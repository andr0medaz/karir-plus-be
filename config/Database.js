import { Sequelize } from "sequelize";

const db = new Sequelize("employee", "root", "andro@123", {
    host: "localhost",
    dialect: "mysql",
});


export default db;
