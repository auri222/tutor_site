const Subject = require('../models/Subject');
const Course = require('../models/Course');
const Tutor = require('../models/Tutor');
const { createError } = require("../ultilities/createError");

const getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    next(error)
  }
}

const getSubject = async (req, res, next) => {
  const subjectID = req.params.id;
  try {
    const subject = await Subject.findById(subjectID);
    res.status(200).json(subject);
  } catch (error) {
    next(error)
  }
}

const createSubject = async (req, res, next) => {
  const {data} = req.body;

  try {
    if (data.name === "") return next(createError(400, "Thiếu tên môn"));

    if (data.code === "") return next(createError(400, "Thiếu mã môn"));

    //Check code
    const subject1 = await Subject.find({ name: data.name });
    const subject2 = await Subject.find({ code: data.code });

    if (subject1.length > 0) return next(createError(400, "Tên môn bị trùng!"));

    if (subject2.length > 0) return next(createError(400, "Mã môn bị trùng!"));

    //OK
    const newSubject = new Subject({
      name: data.name,
      code: data.code
    })
    await newSubject.save();

    res.status(200).json({success: true, message: "Thêm dữ liệu thành công!"});
  } catch (error) {
    next(error)
  }
}

const editSubject = async (req, res, next) => {
  const {data} = req.body;
  const subjectID = req.params.id;
  try {
    if (data.name === "") return next(createError(400, "Thiếu tên môn"));

    if (data.code === "") return next(createError(400, "Thiếu mã môn"));

    //Check code
    const subject = await Subject.findById(subjectID);

    if(!subject)
      return next(createError(404, "Không tìm thấy dữ liệu môn học!"));

    await Subject.findByIdAndUpdate(subjectID, {$set: {
      name: data.name,
      code: data.code
    }}, {new: true});
    let courses = {};
    let tutors = {};

    if(subject.name !== data.name){
      //Update subject name in course
      courses = await Course.updateMany({course_subjects: subject.name}, {
        $set: {"course_subjects.$": data.name}
      });
      //Update subject name in tutor profile
      tutors = await Tutor.updateMany({tutor_subjects: subject.name}, {
        $set: {"tutor_subjects.$": data.name}
      });
    }

    res.status(200).json({success: true, message: "Sửa dữ liệu thành công!", courses, tutors});
  } catch (error) {
    next(error)
  }
}


module.exports = {getSubjects, createSubject, editSubject, getSubject}