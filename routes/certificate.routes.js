const router = require("express").Router();
const { certificateController } = require("../config/DIContainer");
const authenticate = require("../middlewares/authenticate.middleware");
const authorize = require("../middlewares/role.middleware");

/**
 * @swagger
 * tags:
 *   name: Certificates
 *   description: Certificate management for courses
 */

/**
 * @swagger
 * /certificates:
 *   post:
 *     summary: Generate a certificate for a completed course
 *     tags: [Certificates]
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
 *             properties:
 *               courseId:
 *                 type: integer
 *                 description: ID of the course
 *             example:
 *               courseId: 101
 *     responses:
 *       200:
 *         description: Certificate generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Certificate'
 */
router.post(
  "/",
  authenticate,
  authorize(["student"]),
  certificateController.generateCertificate
);

/**
 * @swagger
 * /certificates:
 *   get:
 *     summary: Get all certificates (for instructors)
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all certificates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Certificate'
 */
router.get(
  "/",
  authenticate,
  authorize(["instructor"]),
  certificateController.getAllCertificates
);

/**
 * @swagger
 * /certificates/my-certificates:
 *   get:
 *     summary: Get all certificates for the logged-in student
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of certificates for the student
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Certificate'
 */
router.get(
  "/my-certificates",
  authenticate,
  authorize(["student"]),
  certificateController.getMyCertificates
);

/**
 * @swagger
 * /certificates/{id}:
 *   get:
 *     summary: Get a certificate by its ID
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the certificate
 *     responses:
 *       200:
 *         description: Certificate details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Certificate'
 */
router.get(
  "/:id",
  authenticate,
  authorize(["instructor", "student"]),
  certificateController.getCertificateById
);

/**
 * @swagger
 * /certificates/{id}:
 *   delete:
 *     summary: Delete a certificate by its ID
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the certificate
 *     responses:
 *       200:
 *         description: Certificate deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 */
router.delete(
  "/:id",
  authenticate,
  authorize(["instructor"]),
  certificateController.deleteCertificate
);

module.exports = router;
