const express = require("express");
const router = express.Router();
const { enrollmentController } = require("../config/DIContainer");
const authenticate = require("../middlewares/authenticate.middleware");
const validator = require("express-joi-validation").createValidator({});
const { createOrderSchema } = require("../validation/enrollment.validation");
router.post("/",authenticate,validator.body(createOrderSchema), enrollmentController.createOrder);
router.get("/complete-order", enrollmentController.completeOrder);
router.get("/cancel-order", enrollmentController.cancelOrder);

module.exports = router;