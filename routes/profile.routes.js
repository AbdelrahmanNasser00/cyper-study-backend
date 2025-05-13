const express = require("express");
const router = express.Router();
const { profileController } = require("../config/DIContainer");
const authenticate = require("../middlewares/authenticate.middleware");
const validator = require("express-joi-validation").createValidator({});
const {
  updateProfileSchema,
  updatePasswordSchema,
  updateProfilePictureSchema,
} = require("../validation/profile.validation");

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile management
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get the profile of the logged-in user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile details
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
 *                   description: First name of the user
 *                 lastname:
 *                   type: string
 *                   description: Last name of the user
 *                 email:
 *                   type: string
 *                   description: Email address of the user
 *                 bio:
 *                   type: string
 *                   description: User bio
 *                 profilePicture:
 *                   type: string
 *                   description: Profile picture URL
 */
router.get("/", authenticate, profileController.getProfile);

/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Update the profile of the logged-in user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfile'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 */
router.put(
  "/",
  authenticate,
  validator.body(updateProfileSchema),
  profileController.updateProfile
);

/**
 * @swagger
 * /profile/password:
 *   put:
 *     summary: Update the password of the logged-in user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePassword'
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 */
router.put(
  "/password",
  authenticate,
  validator.body(updatePasswordSchema),
  profileController.updatePassword
);

/**
 * @swagger
 * /profile/picture:
 *   put:
 *     summary: Update the profile picture of the logged-in user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfilePicture'
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 */
router.put(
  "/picture",
  authenticate,
  validator.body(updateProfilePictureSchema),
  profileController.updateProfilePicture
);

module.exports = router;