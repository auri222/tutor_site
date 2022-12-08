const express = require('express');
const router = express.Router();
const { verifyToken } = require("../ultilities/verifyToken");
const {verifyTutor} = require("../ultilities/verifyTutor");
const { verifyUser } = require("../ultilities/verifyUser");

const {createPublicCourse, createPrivateCourse, acceptPrivateCourse, rejectPrivateCourse, registerCourse, unregisterCourse, deleteCourse, chooseCandidate, editCourse, getCourses, getCourse, getCourseByUserId, getRegisteredCourseByTutorId, getUnregistedCourseByTutorId, getAllCourse, loadRandomCourses} = require('../controller/course');

// @route GET api/course
// @desc SEARCH & GET courses 
// @access Public
router.get('/', getCourses)

// @route GET api/course
// @desc SEARCH & GET courses (for admin ONLY)
// @access Public
router.get('/random', loadRandomCourses)

// @route GET api/course
// @desc SEARCH & GET courses (for user ONLY)
// @access Public
router.get('/all', getAllCourse)


// @route POST api/course
// @desc POST create course (for user ONLY)
// @access Private
router.post('/createPublicCourse', verifyToken, verifyUser, createPublicCourse);

// @route POST api/course
// @desc POST create course (for user ONLY)
// @access Private
router.post('/createPrivateCourse', verifyToken, verifyUser, createPrivateCourse);

// @route PUT api/course
// @desc Update accept course (for tutor ONLY)
// @access Private
router.put('/acceptPrivateCourse/:id', verifyToken, verifyTutor, acceptPrivateCourse);

// @route DELETE api/course
// @desc drop course (for tutor ONLY)
// @access Private
router.delete('/rejectPrivateCourse/:courseID&:tutorID', verifyToken, verifyTutor, rejectPrivateCourse);


// @route PUT api/course
// @desc POST edit course (for user ONLY) :id == courseID, body: PHHS_id, updatedCourse => name, classes, subjects, schedules, addrs
// @access Private
router.put('/edit/:id', verifyToken, verifyUser, editCourse);

// @route PUT api/course
// @desc CHOOSE candidate for course (for user ONLY) => Đóng khóa học
// @access Private
router.put('/choose/:id', verifyToken, verifyUser, chooseCandidate);

// @route PUT api/course
// @desc PUT register course (for tutor ONLY - send acc_tutor_id in body) -> Candidates
// @access Private
router.put('/register/:id',  verifyToken, verifyTutor, registerCourse);

// @route PUT api/course
// @desc PUT register course (for tutor ONLY - send acc_tutor_id in body) 
// @access Private
router.put('/unregister/:id',  verifyToken, verifyTutor, unregisterCourse);


// @route DELETE api/course
// @desc DELETE edit course (for user ONLY)
// @access Private
router.delete('/delete/:courseID&:PHHSID', verifyToken, verifyUser, deleteCourse);

// @route GET api/course
// @desc SEARCH & GET courses (for user ONLY)
// @access Public
router.get('/:id', getCourse)

// @route GET api/course
// @desc GET list unregistered courses of tutor (for tutor ONLY) => not chosen yet
// @access Public
router.get('/tutor/unregistered/:id', getUnregistedCourseByTutorId) //tutorID
// @route GET api/course
// @desc GET list registered courses of tutor (for tutor ONLY) => chosen
// @access Public
router.get('/tutor/registered/:id', getRegisteredCourseByTutorId) //tutorID

// @route GET api/course
// @desc GET List courses of user (for user ONLY)
// @access Public
router.get('/user/:id',getCourseByUserId) //userID



module.exports = router;
