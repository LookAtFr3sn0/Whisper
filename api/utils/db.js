import { Sequelize } from "sequelize";

const db = process.env.POSTGRES_URL;

const sequelize = new Sequelize(db, {
  dialect: "postgres",
  logging: false,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
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