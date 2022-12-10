const Class = require("../models/Class");
const Tutor = require("../models/Tutor");
const Notification = require("../models/Notification");
const Course = require("../models/Course");
const { createError } = require("../ultilities/createError");

const getClasses = async (req, res, next) => {
  try {
    const classes = await Class.find();
    res.status(200).json(classes);
  } catch (error) {
    next(error);
  }
};

const createClass = async (req, res, next) => {
  const { data } = req.body;
  try {
    if (data.name === "") return next(createError(400, "Thiếu tên lớp"));

    if (data.code === "") return next(createError(400, "Thiếu mã lớp"));

    //Check code
    const classes1 = await Class.find({ name: data.name });
    const classes2 = await Class.find({ code: data.code });

    if (classes1.length > 0) return next(createError(400, "Tên lớp bị trùng!"));

    if (classes2.length > 0) return next(createError(400, "Mã lớp bị trùng!"));

    //OK
    const newClass = new Class({
      name: data.name,
      code: data.code
    })
    await newClass.save();

    res.status(200).json({success: true, message: "Thêm dữ liệu thành công!"});

  } catch (error) {
    next(error);
  }
};

const countCourses = async (req, res, next) => {
  const classID = req.params.id;
  try {
    const classInfo = await Class.findById(classID);

    if(!classInfo)
      return next(createError(404, "Dữ liệu lớp không tồn tại!"));

    let arr =[];
    arr.push(classInfo.name);

    const count = await Course.count({course_classes: {$in: arr}});

    res.status(200).json(count);
  } catch (error) {
    next(error);
  }
};

const editClass = async (req, res, next) => {
  const classID = req.params.id; //classID
  const {data} = req.body; // data {name, code}
  try {
    
    if(data.name === "" || data.code === "")
      return next(createError(400, "Thiếu dữ liệu!"));

    const classInfo = await Class.findById(classID);

    if(!classInfo)
      return next(createError(404, "Không tìm thấy dữ liệu lớp học!"));

    //Update class
    await Class.findByIdAndUpdate(classID, {$set: {
      name: data.name,
      code: data.code
    }}, {new: true});
    let courses = {};
    let tutors = {};

    if(classInfo.name !== data.name){
      //Update class name in course
      courses = await Course.updateMany({course_classes: classInfo.name}, {
        $set: {"course_classes.$": data.name}
      });

      //Update class name in tutor profile
      tutors = await Tutor.updateMany({tutor_classes: classInfo.name}, {
        $set: {"tutor_classes.$": data.name}
      });
    }

    res.status(200).json({success: true, message: "Sửa thành công!", courses, tutors});

  } catch (error) {
    next(error)
  }
}

const getClass = async (req, res, next) => {
  const classID = req.params.id;
  try {
    const classInfo = await Class.findById(classID);

    if(!classInfo)
      next(createError(404, "Không tìm thấy dữ liệu lớp!"));
    
    res.status(200).json(classInfo);

  } catch (error) {
    next(error); 
  }
}

// const deleteClass = async (req, res, next) => {
//   const classID = req.params.id;
//   try {
    
//     const classInfo = await Class.findById(classID);
    
//     if(!classInfo)
//       return next(createError(404, "Dữ liệu lớp không tồn tại!"));

//     let arr = [];
//     arr.push(classInfo.name);

//     //Find tutors have this class
//     const tutors = await Tutor.find({tutor_classes: {$in: arr}});

//     //Find course have this class
//     const course = await Course.find({course_classes: {$in: arr}});

//   } catch (error) {
//     next(error);
//   }

// }

module.exports = { getClasses, createClass, editClass, getClass };
