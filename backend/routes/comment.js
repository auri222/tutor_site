const express = require('express')
const router = express.Router()
const {verifyToken} = require('../ultilities/verifyToken');
const {verifyUserLoggedIn} = require('../ultilities/verifyUserLoggedIn');
const {createComment, editComment, getComments, deleteComment} = require('../controller/comment');

// @route POST api/comment
// @desc CREATE comment
// @access Private
router.post('/create', verifyToken, verifyUserLoggedIn, createComment);

// @route PUT api/comment
// @desc EDIT comment -> :id == commentID, req.body: comment, username
// @access Private
router.put('/edit/:id', verifyToken, verifyUserLoggedIn, editComment);

// @route DELETE api/comment
// @desc Delete comment -> :id == commentID
// @access Private
router.delete('/delete/:id', verifyToken, verifyUserLoggedIn, deleteComment);

// @route GET api/comment
// @desc LOAD comment -> account tutor id
// @access Public
router.get('/:tutor', getComments);

module.exports = router;