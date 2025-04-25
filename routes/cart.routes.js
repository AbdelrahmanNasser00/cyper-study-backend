const router = require("express").Router();
const { cartController } = require("../config/DIContainer");
const authenticate = require("../middlewares/authenticate.middleware");
const validator = require("express-joi-validation").createValidator({});
const authorize = require("../middlewares/role.middleware");

router.get("/", authenticate, authorize(["student"]), cartController.getCart);

router.post(
  "/:id",
  authenticate,
  authorize(["student"]),
  cartController.addToCart
);

router.delete(
  "/:id",
  authenticate,
  authorize(["student"]),
  cartController.removeFromCart
);

module.exports = router;
