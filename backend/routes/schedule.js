const express = require('express')
const router = express.Router()
const {getSchedules} = require('../controller/schedule');

// @route GET api/schedule
// @desc GET schedules
// @access Public
router.get('/', getSchedules)

module.exports = router;