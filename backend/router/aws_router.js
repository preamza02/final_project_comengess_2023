const express = require("express");
const awsController = require("../controller/aws_controller");

const router = express.Router();

router.get("/get_course/:student_id", awsController.getCourses);
router.get("/update_course/:student_id", awsController.postCourses);
router.post("/put_course/:student_id", awsController.postCourses);

module.exports = router;
