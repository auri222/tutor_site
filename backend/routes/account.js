const express = require('express')
const router = express.Router()

const {verifyToken} = require('../ultilities/verifyToken');
const {verifyUserLoggedIn} = require('../ultilities/verifyUserLoggedIn');
const {verifyAdmin} = require('../ultilities/verifyAdmin');
const {getUsersList, countAdmins, countTutors, countUsers, editPassword, editAccountInfo, getAccount, countCourse, countContacts, getAllUsers, deleteAccount, lockAccount, unlockAccount, accountStat, lockAccountByUser} = require('../controller/account');

// // @route POST api/accounts
// // @desc Create account admin (Admin ONLY) 
// // @access Private
// router.put('/create', verifyToken, verifyAdmin, )

router.get('/all', getAllUsers);

// @route GET api/accounts
// @desc GET TOTAL accounts USER (PHHS)
// @access Private
router.get('/test', countUsers)

// @route GET api/accounts
// @desc GET TOTAL accounts USER (PHHS)
// @access Private
router.get('/user', verifyToken, verifyAdmin, countUsers)

// @route GET api/accounts
// @desc GET TOTAL accounts TUTOR
// @access Private
router.get('/tutor', verifyToken, verifyAdmin, countTutors)

// @route GET api/account
// @desc GET TOTAL course
// @access Private
router.get('/course', verifyToken, verifyAdmin, countCourse)

// @route GET api/accounts
// @desc GET TOTAL accounts TUTOR
// @access Private
router.get('/contact', verifyToken, verifyAdmin, countContacts)

// @route GET api/accounts
// @desc GET TOTAL accounts ADMIN
// @access Private
router.get('/admin', verifyToken, verifyAdmin, countAdmins)

// @route GET api/accounts
// @desc GET accounts
// @access Private
router.get('/', verifyToken, verifyAdmin, getUsersList)

// @route PUT api/accounts
// @desc Edit account info (logged in)
// @access Private
router.put('/edit/:id', verifyToken, verifyUserLoggedIn, editAccountInfo)

// @route PUT api/accounts
// @desc Lock account (logged in) => Accept user & tutor to send a request to delete their account
// @access Private
router.put('/deleteAccount/:id', verifyToken, verifyUserLoggedIn, lockAccountByUser)

// @route PUT api/accounts
// @desc Lock account (logged in) => Accept user & tutor to send a request to delete their account
// @access Private
router.put('/lock/:id', verifyToken, verifyAdmin, lockAccount)

// @route PUT api/accounts
// @desc Lock account (logged in)
// @access Private
router.put('/unlock/:id', verifyToken, verifyAdmin, unlockAccount)

// @route get api/accounts
// @desc get account total course (own or registered)
// @access Private
router.get('/stat/:id', verifyToken, verifyAdmin, accountStat)

// @route DELETE api/accounts
// @desc Delete account (logged in)
// @access Private
router.delete('/delete/:id', verifyToken, verifyAdmin, deleteAccount)

// @route PUT api/accounts
// @desc Check account old password (logged in - ez way) 
// @access Private
// router.post('/check/:id', verifyToken, verifyUserLoggedIn, )

// @route PUT api/accounts
// @desc Edit account password (logged in - ez way) 
// @access Private
router.put('/edit/password/:id', verifyToken, verifyUserLoggedIn, editPassword)

// @route GET api/accounts
// @desc GET account info (logged in - ez way) 
// @access Private
router.get('/:id', verifyToken, verifyUserLoggedIn, getAccount);



module.exports = router;