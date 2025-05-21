const express = require("express");
const router = express.Router();
const { profileController } = require("../config/DIContainer");
const authenticate = require("../middlewares/authenticate.middleware");
const upload = require("../middlewares/uploadMiddleware");
const validator = require("express-joi-validation").createValidator({});
const {
  updateProfileSchema,
  updatePasswordSchema,
} = require("../validation/profile.validation");

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile management
 */

/**
 * @swagger
 * /api/profile:
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
 * 
 *    
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
 * /api/profile:
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
 *             type: object
 *           example:
 *             firstname: "Eman"
 *             lastname: "Mohamed"
 *             email: "ahmed@example.com"
 *             bio: "Web developer"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 firstname:
 *                   type: string
 *                 lastname:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 bio:
 *                   type: string
 *                 profilePicture:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *               example:
 *                 id: 3
 *                 firstname: "Eman"
 *                 lastname: "Mohamed"
 *                 email: "ahmed@example.com"
 *                 role: "instructor"
 *                 bio: "Web developer"
 *                 profilePicture: "http://example.com/profile.jpg"
 *                 createdAt: "2025-04-07T04:14:41.000Z"
 *                 updatedAt: "2025-05-21T08:49:30.973Z"
 */
router.put(
  "/",
  authenticate,
  validator.body(updateProfileSchema),
  profileController.updateProfile
);

/**
 * @swagger
 * /api/profile/password:
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
*            type: 'object'
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
 * /api/profile/picture:
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
  *             type: object
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
  upload.single("profilePicture"),
  (req, res, next) => profileController.updateProfilePicture(req, res, next)
);



module.exports = router;
