const express = require("express");
const itemController = require("../controller/item_controller");

const router = express.Router();

router.get("/get_course/:id", itemController.getCourses);

module.exports = router;
