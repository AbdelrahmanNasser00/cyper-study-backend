const router = require("express").Router();
const validator = require("express-joi-validation").createValidator({});
const registerSchema = require("../validation/register.validation");
const loginSchema = require("../validation/login.validation");
const { authController } = require("../config/DIContainer");

router.post(
  "/register",
  validator.body(registerSchema),
  authController.register
);
/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: user
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", validator.body(loginSchema), authController.login);



router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
