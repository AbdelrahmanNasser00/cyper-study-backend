const express = require("express");
require("express-async-errors");
const cors = require("cors");

require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./docs/swagger");
const sequelize = require("./config/database");
const authRoutes = require("./routes/auth.routes");
const courseRoutes = require("./routes/courses.routes");
const lessonRoutes = require("./routes/lesson.routes");
const categoryRoutes = require("./routes/category.routes");
const wishlistRoutes = require("./routes/wishlist.routes");

const orderRoutes=require("./routes/enrollment.routes")
const couponsRouter=require("./routes/coupon.routes")

const cartRoutes = require("./routes/cart.routes");
const reviewsRoutes = require("./routes/review.routes");

const morgan = require("morgan");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.use("/api/orders",orderRoutes);
app.use("/api/coupons",couponsRouter);

app.use("/api/cart", cartRoutes);
app.use("/api/reviews", reviewsRoutes);

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
