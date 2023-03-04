const Router = require("express");

const adminController = require("./adminController");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = Router();
const controller = new adminController();

router.get("/getRequest", adminMiddleware, controller.getRequest);

module.exports = router;
