const express = require('express');
const router = express.Router();
const { verifyToken } = require("../ultilities/verifyToken");
const { verifyUserLoggedIn } = require("../ultilities/verifyUserLoggedIn");

const {getNotifications, updateStatus, countNotification, updateAllStatus} = require("../controller/notification");

// @route PUT api/notification
// @desc PUT notification
// @access Private
router.put('/update/:notificationID', updateStatus);

// @route PUT api/notification
// @desc PUT notification
// @access Private
router.put('/updateAll/:id', updateAllStatus);

// @route GET api/notification
// @desc GET notification
// @access Private
router.get('/total/:id', verifyToken, verifyUserLoggedIn, countNotification);

// @route GET api/notification
// @desc GET notification
// @access Private
router.get('/', verifyToken, verifyUserLoggedIn, getNotifications);


module.exports = router;