const express = require("express");
const itemController = require("../controller/item_controller");

const router = express.Router();

router.get("/get_course/:student_id", itemController.getCourses);
router.post("/put_course/:student_id", itemController.postCourses);

module.exports = router;
