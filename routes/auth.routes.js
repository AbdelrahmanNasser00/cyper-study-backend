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

router.post("/login", validator.body(loginSchema), authController.login);

module.exports = router;
