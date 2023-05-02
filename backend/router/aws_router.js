const express = require("express");
const awsController = require("../controller/aws_controller");

const router = express.Router();

router.get("/get_course/:student_id", awsController.getStarting);
router.post("/update_course/:student_id", awsController.postCourses);
router.post("/delete_course/:student_id", awsController.deletCourses);
// router.post("/put_course/:student_id", awsController.postCourses);

module.exports = router;
