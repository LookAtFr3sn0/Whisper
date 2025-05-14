import { Sequelize } from "sequelize";

const db = "postgres://" + process.env.DB_HOST + ":5432/" + process.env.DB_NAME;

const sequelize = new Sequelize(db, {
  dialect: "postgres",
  logging: false,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to the database.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

export default sequelize;