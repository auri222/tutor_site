const express = require("express");
const router = express.Router();
const {verifyToken} = require("../ultilities/verifyToken");
const {verifyTutor} = require("../ultilities/verifyTutor");
const { verifyUser } = require("../ultilities/verifyUser");
const { verifyAdmin } = require("../ultilities/verifyAdmin");
const {getTutors, getTutor, editProfile, randomTutors} = require("../controller/tutors");

// @route GET api/tutors
// @desc get list tutors
// @access Public
router.get('/', getTutors);

// @route GET api/tutors
// @desc get list tutors
// @access Public
router.get('/random', randomTutors);

// @route PUT api/tutors
// @desc EDIT profile tutor (TUTOR ONLY)
// @access Private
router.put('/edit/:id', verifyToken, verifyTutor, editProfile);

// @route GET api/tutors
// @desc get list tutors
// @access Public
router.get('/:id', getTutor);



module.exports = router;