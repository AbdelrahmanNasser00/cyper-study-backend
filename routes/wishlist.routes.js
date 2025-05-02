const router = require("express").Router();
const { wishlistController } = require("../config/DIContainer");
const authenticate = require("../middlewares/authenticate.middleware");
const validator = require("express-joi-validation").createValidator({});
const authorize = require("../middlewares/role.middleware");
const wishlistSchema = require("../validation/wishlist.validation");

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Wishlist management for students
 */

/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Get the wishlist of the logged-in student
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of courses in the wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Wishlist item ID
 *                   userId:
 *                     type: integer
 *                     description: ID of the student
 *                   courseId:
 *                     type: integer
 *                     description: ID of the course
 */
router.get(
  "/",
  authenticate,
  authorize(["student"]),
  wishlistController.getWishlist
);

/**
 * @swagger
 * /wishlist:
 *   post:
 *     summary: Add a course to the wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WishlistItem'
 *     responses:
 *       201:
 *         description: Course added to wishlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 wishlist:
 *                   type: object
 *                   description: The created wishlist item
 */
router.post(
  "/",
  validator.body(wishlistSchema),
  authenticate,
  authorize(["student"]),
  wishlistController.addCourseToWishlist
);

/**
 * @swagger
 * /wishlist/{id}:
 *   delete:
 *     summary: Remove a course from the wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the wishlist item to remove
 *     responses:
 *       200:
 *         description: Course removed from wishlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 wishlist:
 *                   type: object
 *                   description: The removed wishlist item
 */
router.delete(
  "/:id",
  authenticate,
  authorize(["student"]),
  wishlistController.removeCourseFromWishlist
);

module.exports = router;
