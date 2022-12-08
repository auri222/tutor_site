const express = require("express");
const router = express.Router();
const { register_user, register_tutor, verifyUserOTP, verifyOTP, login, register_admin, logOut } = require('../controller/auth');
const {verifyToken} = require("../ultilities/verifyToken");
const {verifyUser} = require('../ultilities/verifyUser');
const {verifyTutor} = require('../ultilities/verifyTutor');
const {verifyAdmin} = require('../ultilities/verifyAdmin');
const {verifyUserLoggedIn} = require('../ultilities/verifyUserLoggedIn');

router.get("/checkAuthentication", verifyToken, (req, res, next) => {
  res.send("Hi, you are logged in");
})

router.get("/checkIfLoggedIn", verifyUserLoggedIn, (req, res, next) => {
  res.send("Hello user, you are logged in");
})

router.get("/checkUser", verifyToken, verifyUser, (req, res, next) => {
  res.send("Hello PHHS, you are logged in");
})

router.get("/checkTutor", verifyToken, verifyTutor, (req, res, next) => {
  res.send("Hello tutor, you are logged in");
})

router.get("/isAdmin", verifyAdmin ,(req, res, next) => {
  res.send("Hello admin, you are logged in");
} )



// @route POST api/auth/register-user
// @desc Register account ADMIN (FOR ADMIN ONLY)
// @access Private
router.post("/register-admin", register_admin);

// @route POST api/auth/register-user
// @desc Register account user
// @access Public
router.post("/register-user", register_user);

// @route POST api/auth/register-tutor
// @desc Register account tutor
// @access Public
router.post("/register-tutor", register_tutor);

// @route POST api/auth/login
// @desc Login
// @access Public
router.post("/login", login);

// @route GET api/auth/user
// @desc check account user
// @access Public
router.get("/user/:id", verifyUserOTP);

// @route POST api/auth/otp
// @desc check account OTP
// @access Private
router.post("/otp/:id", verifyOTP);


router.get("/logOut/:id", logOut);
module.exports = router;
