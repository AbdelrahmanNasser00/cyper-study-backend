const router = require("express").Router();
const { reviewController } = require("../config/DIContainer");
const authenticate = require("../middlewares/authenticate.middleware");
const validator = require("express-joi-validation").createValidator({});
const authorize = require("../middlewares/role.middleware");
const reviewSchema = require("../validation/review.validation");

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management for courses
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Add a review for a course
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - rating
 *               - comment
 *             properties:
 *               courseId:
 *                 type: integer
 *                 description: ID of the course being reviewed
 *               rating:
 *                 type: number
 *                 format: float
 *                 description: Rating given to the course
 *               comment:
 *                 type: string
 *                 description: Review comment
 *             example:
 *               courseId: 101
 *               rating: 4.5
 *               comment: "Great course!"
 *     responses:
 *       201:
 *         description: Review added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 review:
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         description: Review already exists
 */
router.post(
  "/",
  authenticate,
  authorize(["student"]),
  validator.body(reviewSchema),
  reviewController.addReview
);

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Get all reviews for a course
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course ID
 *     responses:
 *       200:
 *         description: List of reviews for the course
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.get(
  "/:id",
  authenticate,
  authorize(["student","instructor", "admin"]),
  reviewController.getReviews
);

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: number
 *                 format: float
 *                 description: Updated rating for the course
 *               comment:
 *                 type: string
 *                 description: Updated review comment
 *             example:
 *               rating: 5.0
 *               comment: "Amazing course!"
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 review:
 *                   $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 */
router.put(
  "/:id",
  authenticate,
  authorize(["student"]),
  validator.body(reviewSchema),
  reviewController.updateReview
);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 review:
 *                   $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 */
router.delete(
  "/:id",
  authenticate,
  authorize(["student"]),
  reviewController.deleteReview
);

module.exports = router;
