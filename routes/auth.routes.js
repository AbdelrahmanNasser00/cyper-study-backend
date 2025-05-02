const router = require("express").Router();
const validator = require("express-joi-validation").createValidator({});
const registerSchema = require("../validation/register.validation");
const loginSchema = require("../validation/login.validation");
const { authController } = require("../config/DIContainer");

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and account management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *               - confirmPassword
 *               - role
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: First name of the user
 *               lastname:
 *                 type: string
 *                 description: Last name of the user
 *               email:
 *                 type: string
 *                 description: Email address of the user
 *               password:
 *                 type: string
 *                 description: Password for the account
 *               confirmPassword:
 *                 type: string
 *                 description: Confirmation of the password
 *               role:
 *                 type: string
 *                 enum: [student, instructor]
 *                 description: Role of the user
 *               bio:
 *                 type: string
 *                 description: Optional bio for the user
 *               profilePicture:
 *                 type: string
 *                 description: Optional profile picture URL
 *             example:
 *               firstname: John
 *               lastname: Doe
 *               email: john.doe@example.com
 *               password: password123
 *               confirmPassword: password123
 *               role: student
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: User ID
 *                 firstname:
 *                   type: string
 *                 lastname:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: Validation error or passwords do not match
 *       409:
 *         description: User already exists
 */
router.post(
  "/register",
  validator.body(registerSchema),
  authController.register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the user
 *               password:
 *                 type: string
 *                 description: Password for the account
 *             example:
 *               email: john.doe@example.com
 *               password: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                 role:
 *                   type: string
 *                   description: Role of the user
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", validator.body(loginSchema), authController.login);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the user
 *             example:
 *               email: john.doe@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       404:
 *         description: User with this email does not exist
 */
router.post("/forgot-password", authController.forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset the user's password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: Password reset token
 *               newPassword:
 *                 type: string
 *                 description: New password for the account
 *               confirmPassword:
 *                 type: string
 *                 description: Confirmation of the new password
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               newPassword: newpassword123
 *               confirmPassword: newpassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       400:
 *         description: Validation error or invalid token
 */
router.post("/reset-password", authController.resetPassword);

module.exports = router;
