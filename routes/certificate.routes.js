const router = require("express").Router();
const { certificateController } = require("../config/DIContainer");
const authenticate = require("../middlewares/authenticate.middleware");
// const validator = require("express-joi-validation").createValidator({});
const authorize = require("../middlewares/role.middleware");

router.post(
  "/",
  authenticate,
  authorize(["student"], certificateController.generateCertificate)
);

router.get(
  "/",
  authenticate,
  authorize(["instructor"]),
  certificateController.getAllCertificates
);

router.get(
  "/my-certificates",
  authenticate,
  authorize(["student"]),
  certificateController.getMyCertificates
);

router.get(
  "/:id",
  authorize(["instructor"]),
  certificateController.getCertificateById
);

router.delete(
  "/:id",
  authenticate,
  authorize(["instructor"]),
  certificateController.deleteCertificate
);

module.exports = router;
