const express = require("express");
const coursevilleController = require("../controller/courseview_controller");

const router = express.Router();

router.get("/auth_app", coursevilleController.authApp);
router.get("/access_token", coursevilleController.accessToken);
router.get("/logout", coursevilleController.logout);
router.get("/profile", coursevilleController.getProfileInformation);

module.exports = router;
