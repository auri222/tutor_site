const express = require("express");
const router = express.Router();
const {verifyToken} = require('../ultilities/verifyToken');
const {verifyTutor} = require("../ultilities/verifyTutor");
const {createTA, editTA, deleteTA, getAchievementList, getAchievement} = require("../controller/tutor_achievements");

// @route POST api/achievement
// @desc Create tutor achievement (tutor_id)
// @access Private
router.post('/create', verifyToken, verifyTutor, createTA);

// @route PUT api/achievement
// @desc Edit tutor achievement (achievement_id)
// @access Private
router.put('/edit/:id', verifyToken, verifyTutor, editTA);

// @route DELETE api/achievement
// @desc Delete tutor achievement (achievement_id)
// @access Private
router.delete('/delete/:achievementID&:accountID', verifyToken, verifyTutor, deleteTA);

// @route GET api/achievement
// @desc GET tutor achievement (tutor_id) - Achievement ID to load
// @access Private
router.get('/:achievementID', verifyToken, verifyTutor, getAchievement);

// @route GET api/achievement
// @desc GET tutor achievement (tutor_id) - Account tutor ID to load
// @access Private
router.get('/achievements/:id', getAchievementList);


module.exports = router;