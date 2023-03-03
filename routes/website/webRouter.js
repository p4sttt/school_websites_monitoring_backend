const Router = require("express");
const { body } = require("express-validator");

const webController = require("./webController");

const router = Router();
const controller = new webController();

router.get("/", controller.getAll);
router.post(
  "/create",
  [body("title").notEmpty(), body("url").notEmpty().isURL()],
  controller.create
);

module.exports = router;
