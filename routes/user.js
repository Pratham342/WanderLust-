const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");
const passport = require("passport");

router.route("/signup")
// sign up form rendering 
.get(userController.renderSignupForm)
// api to create a new user and registering it 
.post(wrapAsync(userController.createUser));

router.route("/login")
// api for render login form 
.get(userController.renderloginForm)
// API for logging in the user who passes the authentication norms 
.post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true}), userController.loginUser);

// logout route to logout the user out from the session 
router.get("/logout", userController.logoutUser);

module.exports = router; 





