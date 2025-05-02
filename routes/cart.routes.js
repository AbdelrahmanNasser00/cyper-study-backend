const router = require("express").Router();
const { cartController } = require("../config/DIContainer");
const authenticate = require("../middlewares/authenticate.middleware");
const authorize = require("../middlewares/role.middleware");

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management for students
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get the cart of the logged-in student
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of courses in the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPrice:
 *                   type: number
 *                   format: float
 *                   description: Total price of all items in the cart
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Course ID
 *                       title:
 *                         type: string
 *                         description: Course title
 *                       description:
 *                         type: string
 *                         description: Course description
 *                       price:
 *                         type: number
 *                         format: float
 *                         description: Course price
 *                       thumbnail:
 *                         type: string
 *                         description: Course thumbnail URL
 *                       level:
 *                         type: string
 *                         description: Course level
 *                       duration:
 *                         type: string
 *                         description: Course duration
 *                       instructor:
 *                         type: string
 *                         description: Instructor name
 *                       category:
 *                         type: string
 *                         description: Course category
 *                       cartItem:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: Cart item ID
 *                           coursePrice:
 *                             type: number
 *                             format: float
 *                             description: Price of the course in the cart
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: Date when the course was added to the cart
 */
router.get("/", authenticate, authorize(["student"]), cartController.getCart);

/**
 * @swagger
 * /cart/{id}:
 *   post:
 *     summary: Add a course to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the course to add to the cart
 *     responses:
 *       201:
 *         description: Course added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 cartItem:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Cart item ID
 *                     courseId:
 *                       type: integer
 *                       description: ID of the course
 *                     coursePrice:
 *                       type: number
 *                       format: float
 *                       description: Price of the course in the cart
 */
router.post(
  "/:id",
  authenticate,
  authorize(["student"]),
  cartController.addToCart
);

/**
 * @swagger
 * /cart/{id}:
 *   delete:
 *     summary: Remove a course from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the course to remove from the cart
 *     responses:
 *       200:
 *         description: Course removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 cartItem:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Cart item ID
 *                     courseId:
 *                       type: integer
 *                       description: ID of the course
 *                     coursePrice:
 *                       type: number
 *                       format: float
 *                       description: Price of the course in the cart
 */
router.delete(
  "/:id",
  authenticate,
  authorize(["student"]),
  cartController.removeFromCart
);

module.exports = router;
