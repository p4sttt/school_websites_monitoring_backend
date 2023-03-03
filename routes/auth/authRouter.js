const Router = require("express");
const { body } = require("express-validator");

const authController = require("./authController");

const router = Router();
const controller = new authController();

router.post(
  "/register",
  [
    body("email").notEmpty().isEmail(),
    body("name").notEmpty().isLength({ min: 3, max: 10 }),
    body("password").notEmpty().isLength({ min: 5, max: 15 }),
  ],
  controller.register
);
router.post(
  "/login",
  [
    body("email").notEmpty().isEmail(),
    body("password").notEmpty().isLength({ min: 5, max: 15 }),
  ],
  controller.login
);

module.exports = router;
