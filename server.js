const express = require("express");
const cors = require("cors");

require("dotenv").config();
const sequelize = require("./config/database");
const app = express();
app.use(express.json());
app.use(cors());

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    await sequelize.sync({ alter: true });
    console.log("Models synchronized");
  } catch (error) {}
};

testConnection();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
