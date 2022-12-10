const express = require('express')
const router = express.Router()
const {getSubjects, createSubject, editSubject, getSubject} = require('../controller/subjects');

// @route GET api/subjects
// @desc GET subjects
// @access Public
router.get('/', getSubjects)

// @route POST api/subjects
// @desc CREATE subjects
// @access Public
router.post('/create', createSubject)

// @route PUT api/subjects
// @desc EDIT subjects
// @access Public
router.put('/edit/:id', editSubject)

// @route GET api/subject
// @desc GET subject
// @access Public
router.get('/:id', getSubject)

module.exports = router;