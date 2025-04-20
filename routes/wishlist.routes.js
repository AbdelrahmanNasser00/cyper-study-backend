const router = require("express").Router();
const { wishlistController } = require("../config/DIContainer");
const authenticate = require("../middlewares/authenticate.middleware");
const validator = require("express-joi-validation").createValidator({});
const authorize = require("../middlewares/role.middleware");
const wishlistSchema = require("../validation/wishlist.validation");

// const { wishlistSchema } = require("../schemas/wishlist.schema");

router.get(
  "/",
  authenticate,
  authorize(["student"]),
  wishlistController.getWishlist
);
router.post(
  "/",
  validator.body(wishlistSchema),
  authenticate,
  authorize(["student"]),
  wishlistController.addCourseToWishlist
);
router.delete(
  "/:id",
  authenticate,
  authorize(["student"]),
  wishlistController.removeCourseFromWishlist
);

module.exports = router;
