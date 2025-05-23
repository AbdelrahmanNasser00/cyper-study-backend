const express = require("express");
const router = express.Router();
const validator = require("express-joi-validation").createValidator({});
const authorize = require("../middlewares/role.middleware");
const authenticate = require("../middlewares/authenticate.middleware");
const {
  couponValidationSchema,
  applyCouponSchema,
  validateCouponSchema,
  validateIDSchema,
} = require("../validation/coupon.validation");
const { couponController } = require("../config/DIContainer"); // Dependency Injection

/**
 * @swagger
 * tags:
 *   name: Coupons
 *   description: API for managing coupons
 */

/**
 * @swagger
 * /api/coupons:
 *   post:
 *     summary: Create a new coupon
 *     tags: [Coupons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Coupon'
 *     responses:
 *       201:
 *         description: Coupon created successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  authenticate,
  authorize(["instructor"]),
  validator.body(couponValidationSchema),
  couponController.createCoupon
);

/**
 * @swagger
 * /api//coupons/apply:
 *   post:
 *     summary: Apply a coupon to a course
 *     tags: [Coupons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplyCoupon'
 *     responses:
 *       200:
 *         description: Coupon applied successfully
 *       400:
 *         description: Invalid or expired coupon
 */
router.post(
  "/apply",
  authenticate,

  validator.body(applyCouponSchema),
  couponController.applyCoupon
);

/**
 * @swagger
 * /api/coupons:
 *   get:
 *     summary: Get all coupons
 *     tags: [Coupons]
 *     parameters:
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: integer
 *         description: Filter coupons by course ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of coupons per page
 *     responses:
 *       200:
 *         description: List of coupons retrieved successfully
 *       404:
 *         description: No coupons found
 */
router.get(
  "/",
  authenticate,
  authorize(["instructor"]),
  couponController.getAllCoupons
);

/**
 * @swagger
 * /api/coupons/validate:
 *   get:
 *     summary: Validate a coupon
 *     tags: [Coupons]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Coupon code to validate
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Course ID to validate the coupon for
 *     responses:
 *       200:
 *         description: Coupon is valid
 *       400:
 *         description: Invalid or expired coupon
 */
router.get(
  "/validate",
    authenticate,
   
  validator.query(validateCouponSchema),
  couponController.validateCoupon
);

/**
 * @swagger
 * /api/coupons/{id}:
 *   put:
 *     summary: Update a coupon
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the coupon to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Coupon'
 *     responses:
 *       200:
 *         description: Coupon updated successfully
 *       404:
 *         description: Coupon not found
 */
router.put(
  "/:id",
    authenticate,
    authorize(["instructor"]),
  validator.params(validateIDSchema),
  validator.body(couponValidationSchema),
  couponController.updateCoupon
);

/**
 * @swagger
 * /api/coupons/{id}:
 *   delete:
 *     summary: Delete a coupon
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the coupon to delete
 *     responses:
 *       204:
 *         description: Coupon deleted successfully
 *       404:
 *         description: Coupon not found
 */
router.delete(
  "/:id",
    authenticate,
    authorize(["instructor"]),
  validator.params(validateIDSchema),
  couponController.deleteCoupon
);

/**
 * @swagger
 * /api/coupons/{id}:
 *   get:
 *     summary: Get a coupon by ID
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the coupon to retrieve
 *     responses:
 *       200:
 *         description: Coupon retrieved successfully
 *       404:
 *         description: Coupon not found
 */
router.get(
  "/:id",
  authenticate,
  authorize(["instructor"]),
  validator.params(validateIDSchema),
  couponController.getCouponById
);

module.exports = router;
