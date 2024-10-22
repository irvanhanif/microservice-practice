const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "mysql",
  database: "ecom-service",
  username: "root",
  password: "",
  port: 3306,
});

sequelize
  .authenticate()
  .then(() => console.log("Connection successfully"))
  .catch((err) => console.error("Unable connect db"));

module.exports = sequelize;
