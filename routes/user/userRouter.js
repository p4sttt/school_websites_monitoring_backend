const Router = require("express");
const { body } = require("express-validator");

const userController = require("./userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = Router();
const controller = new userController();

//request
router.post(
  "/addRequest",
  [
    body("title").notEmpty().isLength({ min: 2, max: 50 }),
    body("url").notEmpty().isURL(),
  ],
  authMiddleware,
  controller.addRequest
);

//comment
router.post(
  "/addComment",
  [
    body("text").notEmpty().isLength({min: 5, max: 250}),
    body("websiteId").notEmpty().isMongoId()
  ],
  authMiddleware,
  controller.addComment
)

//rating
router.post(
  "/addRating",
  [
    body("rating").isNumeric().isLength({max: 1}),
    body("websiteId").notEmpty().isMongoId()
  ],
  authMiddleware,
  controller.addRating
)

module.exports = router;
