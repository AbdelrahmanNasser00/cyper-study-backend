const express = require("express");
const router = express.Router();
const { enrollmentController } = require("../config/DIContainer");
const authenticate = require("../middlewares/authenticate.middleware");
const validator = require("express-joi-validation").createValidator({});
const { createOrderSchema } = require("../validation/enrollment.validation");

/**
 * @swagger
 * tags:
 *   name: Enrollment
 *   description: Enrollment and payment management for courses
 */

/**
 * @swagger
 * /enrollment:
 *   post:
 *     summary: Create an order for course enrollment
 *     tags: [Enrollment]
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
 *               - provider
 *             properties:
 *               courseId:
 *                 type: integer
 *                 description: ID of the course to enroll in
 *               couponCode:
 *                 type: string
 *                 description: Optional coupon code for discounts
 *               provider:
 *                 type: string
 *                 enum: [paypal, stripe, fawry]
 *                 description: Payment provider
 *             example:
 *               courseId: 101
 *               couponCode: "DISCOUNT10"
 *               provider: "paypal"
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 approvalUrl:
 *                   type: string
 *                   description: URL to approve the payment
 *                 orderId:
 *                   type: string
 *                   description: ID of the created order
 *       400:
 *         description: Validation error or invalid request
 */
router.post(
  "/",
  authenticate,
  validator.body(createOrderSchema),
  enrollmentController.createOrder
);

/**
 * @swagger
 * /enrollment/complete-order:
 *   get:
 *     summary: Complete the payment for an order
 *     tags: [Enrollment]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment token provided by the payment provider
 *     responses:
 *       200:
 *         description: Payment captured successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 orderDetails:
 *                   type: object
 *                   description: Details of the completed order
 *       400:
 *         description: Invalid token or payment error
 */
router.get("/complete-order", enrollmentController.completeOrder);

/**
 * @swagger
 * /enrollment/cancel-order:
 *   get:
 *     summary: Cancel an order
 *     tags: [Enrollment]
 *     responses:
 *       302:
 *         description: Redirect to the failure page
 */
router.get("/cancel-order", enrollmentController.cancelOrder);

module.exports = router;