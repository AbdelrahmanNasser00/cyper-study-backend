const express = require("express");
require("express-async-errors");
const cors = require("cors");

require("dotenv").config();
const sequelize = require("./config/database");
const authRoutes = require("./routes/auth.routes");
const courseRoutes = require("./routes/courses.routes");
const morgan = require("morgan");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // Sync all models
    await sequelize.sync({ alter: true });
    console.log("Models synchronized");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

testConnection();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(errorHandler);
