const express = require('express')
const router = express.Router()
const {verifyToken} = require('../ultilities/verifyToken');
const {verifyUserLoggedIn} = require('../ultilities/verifyUserLoggedIn');
const {verifyAdmin} = require('../ultilities/verifyAdmin');
const {createContact, checkContact, getContact} = require('../controller/contact');

// @route POST api/contact
// @desc CREATE contact
// @access Private
router.post('/create', createContact);

// @route PUT api/contact
// @desc Check contact
// @access Private
router.put('/edit/:contactID', verifyToken, verifyAdmin, checkContact);

// @route GET api/contact
// @desc GET contact
// @access Private
router.get('/', verifyToken, verifyAdmin, getContact);



module.exports = router;