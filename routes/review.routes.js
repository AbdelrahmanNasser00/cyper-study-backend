const router = require("express").Router();
const { reviewController } = require("../config/DIContainer");
const authenticate = require("../middlewares/authenticate.middleware");
const validator = require("express-joi-validation").createValidator({});
const authorize = require("../middlewares/role.middleware");
const reviewSchema = require("../validation/review.validation");

router.post(
  "/",
  authenticate,
  authorize(["student"]),
  validator.body(reviewSchema),
  reviewController.addReview
);

router.get(
  "/:id",
  authenticate,
  authorize(["student"]),
  reviewController.getReviews
);

router.put(
  "/:id",
  authenticate,
  authorize(["student"]),
  validator.body(reviewSchema),
  reviewController.updateReview
);

router.delete(
  "/:id",
  authenticate,
  authorize(["student"]),
  reviewController.deleteReview
);

module.exports = router;
