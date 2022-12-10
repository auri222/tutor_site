const express = require('express');
const router = express.Router();
const {getClasses, createClass, editClass, getClass} = require('../controller/classes');

// @route GET api/class
// @desc GET classes
// @access Public
router.get('/', getClasses)

// @route GET api/class
// @desc GET classes
// @access Public
router.post('/create', createClass)

// @route PUT api/class
// @desc EDIT class name, code
// @access Public
router.put('/edit/:id', editClass)

// @route GET api/class
// @desc GET class name, code
// @access Public
router.get('/:id', getClass)

module.exports = router;