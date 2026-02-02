const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { savedRedirectUrl} = require("../middleware.js");
const { signup, renderSignupPage, login, renderLoginForm, logout } = require("../controllers/user.js");


//signup
router.route("/signup")
.get(renderSignupPage)
.post( wrapAsync(signup));

//login

router.route("/login")
.get(renderLoginForm)
.post(savedRedirectUrl,passport.authenticate('local', {failureFlash:true, failureRedirect: "/login"}),login);

//logout

router.get("/logout",logout)

module.exports = router;
 