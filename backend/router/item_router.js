const express = require("express");
const itemController = require("../controller/item_controller");

const router = express.Router();

// router.get("/get_course/:id", itemController.getCourses);
router.get("/get_course/", itemController.getCourses);
router.get("/get_course/:id", itemController.getCoursesID);
router.get("/put_score/:id", itemController.addItem);
router.get("/put_score/:id", itemController.addItem);

module.exports = router;
