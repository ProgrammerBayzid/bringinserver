const router = require("express").Router();
const { singUp, verifyOtp, users,} = require("../Controllers/userController");

router.route("/signup").post(singUp);

router.route("/signup/verify").post(verifyOtp);
router.route("/users").get(users);

module.exports = router;
