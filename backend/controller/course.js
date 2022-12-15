const { createError } = require("../ultilities/createError");
const Course = require("../models/Course");
const Account = require("../models/Account");
const Notification = require("../models/Notification");
const Subject = require("../models/Subject");
const Class = require("../models/Class");
const Tutor = require("../models/Tutor");
const mongoose = require("mongoose");
const { sendMail } = require("../ultilities/sendMail");
const { renameKeys } = require("../ultilities/renameKeys");

const createPublicCourse = async (req, res, next) => {
  const { user, course, classes, subjects, schedules, addrOption, address } =
    req.body;
  try {
    //Initial course
    const course_purpose = 1;
    let course_number = 0;
    let course_status = 0;
    let course_code = "";
    let newCourse = null;

    //Find last course_number
    const latestCourse = await Course.find({}).sort({ _id: -1 }).limit(1);
    // console.log(latestCourse);
    if (latestCourse.length === 0) {
      course_number = 1;
      course_code = "KH" + course_number;
    } else {
      // console.log(latestCourse[0].course_number);
      course_number = latestCourse[0].course_number + 1;
      course_code = "KH" + course_number;
    }

    //Choose existing address in account
    if (addrOption) {
      const userInfo = await Account.findById(user);
      if (!userInfo)
        return next(createError(400, "Không tìm thấy thông tin tài khoản!"));

      newCourse = new Course({
        course_name: course.course_name,
        course_classes: classes,
        course_subjects: subjects,
        course_schedule: schedules,
        course_requirement: course.course_requirement || "Không có",
        course_time: course.course_time || "Trống",
        course_address: {
          home_number: userInfo.address.home_number,
          street: userInfo.address.street,
          ward: userInfo.address.ward,
          district: userInfo.address.district,
          province: userInfo.address.province,
        },
        course_status: course_status,
        course_purpose: course_purpose,
        course_number: course_number,
        course_code: course_code,
        account: user,
      });
    }

    //Choose new address
    else {
      if (!address) return next(createError(400, "Thiếu địa chỉ!"));

      newCourse = new Course({
        course_name: course.course_name,
        course_classes: classes,
        course_subjects: subjects,
        course_schedule: schedules,
        course_requirement: course.course_requirement || "Không có",
        course_time: course.course_time || "Trống",
        course_address: {
          home_number: address.home_number,
          street: address.street,
          ward: address.ward,
          district: address.district,
          province: address.province,
        },
        course_status: course_status,
        course_purpose: course_purpose,
        course_number: course_number,
        course_code: course_code,
        account: user,
      });
    }

    await newCourse.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Tạo khóa học thành công!",
        course: newCourse._id,
      });
  } catch (error) {
    next(error);
  }
};

const createPrivateCourse = async (req, res, next) => {
  const {
    user,
    tutor,
    course,
    classes,
    subjects,
    schedules,
    addrOption,
    address,
  } = req.body;
  try {
    //Check data

    //Initial
    const course_purpose = 2;
    let course_number = 0;
    let course_status = 1;
    let course_code = "";
    let newCourse = null;

    //Find last course_number
    const latestCourse = await Course.find({}).sort({ _id: -1 }).limit(1);
    // console.log(latestCourse);
    if (latestCourse.length === 0) {
      course_number = 1;
      course_code = "KH" + course_number;
    } else {
      // console.log(latestCourse[0].course_number);
      course_number = latestCourse[0].course_number + 1;
      course_code = "KH" + course_number;
    }

    //Choose existing address in account
    const userInfo = await Account.findById(user);
    if (addrOption) {
      if (!userInfo)
        return next(createError(400, "Không tìm thấy thông tin tài khoản!"));

      newCourse = new Course({
        course_name: course.course_name,
        course_classes: classes,
        course_subjects: subjects,
        course_schedule: schedules,
        course_requirement: course.course_requirement || "Không có",
        course_time: course.course_time || "Trống",
        course_address: {
          home_number: userInfo.address.home_number,
          street: userInfo.address.street,
          ward: userInfo.address.ward,
          district: userInfo.address.district,
          province: userInfo.address.province,
        },
        course_registered_tutor: {
          registered_tutor: tutor,
        },
        course_status: course_status,
        course_purpose: course_purpose,
        course_number: course_number,
        course_code: course_code,
        account: user,
      });
    }

    //Choose new address
    else {
      if (!address) return next(createError(400, "Thiếu địa chỉ!"));

      newCourse = new Course({
        course_name: course.course_name,
        course_classes: classes,
        course_subjects: subjects,
        course_schedule: schedules,
        course_requirement: course.course_requirement || "Không có",
        course_time: course.course_time || "Trống",
        course_address: {
          home_number: address.home_number,
          street: address.street,
          ward: address.ward,
          district: address.district,
          province: address.province,
        },
        course_registered_tutor: {
          registered_tutor: tutor,
        },
        course_status: course_status,
        course_purpose: course_purpose,
        course_number: course_number,
        course_code: course_code,
        account: user,
      });
    }

    await newCourse.save();

    //Send notification to TUTOR
    const PHHS = userInfo.username;
    const message = `${PHHS} đã chọn bạn để dạy cho khóa ${newCourse.course_name} (${newCourse.course_code}) của họ. Click để xem chi tiết.`;
    const type = "COURSE";
    const isRead = false;
    const newNotification = new Notification({
      receiver: tutor,
      sender: PHHS,
      type: type,
      message: message,
      isRead: isRead,
      typeID: newCourse._id,
    });

    await newNotification.save();

    res.status(200).json({
      success: true,
      message: "Đăng ký thành công!",
      course: newCourse._id,
      newNotification,
    });
  } catch (error) {
    next(error);
  }
};

const acceptPrivateCourse = async (req, res, next) => {
  const course_id = req.params.id;
  const { tutor_id } = req.body; // acount_id của tutor
  // console.log(course_id)
  // console.log(tutor_id)
  // res.send("OK");
  try {
    //Check course and tutor
    const course = await Course.findById(course_id);

    if (!course) return next(createError(400, "Khóa học không tồn tại!"));

    // console.log(course.course_registered_tutor.registered_tutor.toHexString());

    if (
      course.course_registered_tutor.registered_tutor.toHexString() !== tutor_id
    )
      return next(createError(401, "Bạn không được phép vào khóa học này!"));

    //OK
    const result = await Course.findByIdAndUpdate(
      course_id,
      {
        $set: {
          course_status: 2,
          "course_registered_tutor.registered_date_accepted": new Date(),
          "course_registered_tutor.registered_is_accepted": true,
        },
      },
      { new: true }
    );
    console.log(result);

    //Send notification to PHHS
    const tutorInfo = await Tutor.findOne({ account: tutor_id });
    const tutor_name = tutorInfo.tutor_name;
    const tutorAccountInfo = await Account.findById(tutor_id);
    const PHHSInfo = await Account.findById(course.account);
    const message = `${tutor_name} đã chấp nhận giảng dạy cho khóa ${course.course_name} (${course.course_code}). Click để xem chi tiết.`;
    const type = "COURSE";
    const isRead = false;
    const newNotification = new Notification({
      receiver: course.account,
      type: type,
      message: message,
      isRead: isRead,
      typeID: course_id,
    });

    await newNotification.save();

    let classString = "";
    let courseClassArray = course.course_classes;
    for (let [i, val] of courseClassArray.entries()) {
      if (i !== courseClassArray.length - 1) classString += val + ", ";
      else {
        classString += val;
      }
    }

    let subjectString = "";
    let courseSubjectArray = course.course_subjects;
    for (let [i, val] of courseSubjectArray.entries()) {
      if (i !== courseSubjectArray.length - 1) subjectString += val + ", ";
      else {
        subjectString += val;
      }
    }

    let scheduleString = "";
    let courseScheduleArray = course.course_schedule;
    for (let [i, val] of courseScheduleArray.entries()) {
      if (i !== courseScheduleArray.length - 1) scheduleString += val + ", ";
      else {
        scheduleString += val;
      }
    }
    console.log(subjectString);
    console.log(classString);
    console.log(scheduleString);
    //Send email
    const emailPHHS = PHHSInfo.email;
    const emailTutor = tutorAccountInfo.email;
    const subject_PHHS = `Khóa học ${course.course_code} đã được chấp nhận`;
    const subject_Tutor = `Nội dung khóa học ${course.course_code}`;
    const courseDetailsForTutor = `
    <table border="1" style='border-collapse:collapse;'>
    <tr>
      <td>Tên khóa học: </td>
      <td>${course.course_name}</td>
    </tr>
    <tr>
      <td>Lớp: </td>
      <td>${classString}</td>
    </tr>
    <tr>
      <td>Môn: </td>
      <td>${subjectString}</td>
    </tr>
    <tr>
      <td>Lịch học: </td>
      <td>${scheduleString}</td>
    </tr>
    <tr>
      <td>Giờ học: </td>
      <td>${course.course_time}</td>
    </tr>
    <tr>
      <td>Địa chỉ: </td>
      <td>${course.course_address.home_number}, ${course.course_address.street}, ${course.course_address.ward}, ${course.course_address.district}, ${course.course_address.province}</td>
    </tr>
    <tr>
      <td>Số điện thoại liên lạc của PHHS: </td>
      <td>${PHHSInfo.phone_number}</td>
    </tr>
    <tr>
      <td>Email liên lạc PHHS: </td>
      <td>${PHHSInfo.email}</td>
    </tr>

    </table>
    `;
    const courseDetailsForPHHS = `
    <table border="1" style='border-collapse:collapse;'>
    <tr>
      <td>Tên khóa học: </td>
      <td>${course.course_name}</td>
    </tr>
    <tr>
      <td>Lớp: </td>
      <td>${classString}</td>
    </tr>
    <tr>
      <td>Môn: </td>
      <td>${subjectString}</td>
    </tr>
    <tr>
      <td>Lịch học: </td>
      <td>${scheduleString}</td>
    </tr>
    <tr>
      <td>Giờ học: </td>
      <td>${course.course_time}</td>
    </tr>
    <tr>
      <td>Địa chỉ: </td>
      <td>${course.course_address.home_number}, ${course.course_address.street}, ${course.course_address.ward}, ${course.course_address.district}, ${course.course_address.province}</td>
    </tr>
    <tr>
      <td>Số điện thoại liên lạc của gia sư: </td>
      <td>${tutorAccountInfo.phone_number}</td>
    </tr>
    <tr>
      <td>Email liên lạc của gia sư: </td>
      <td>${tutorAccountInfo.email}</td>
    </tr>

    </table>
    `;

    const content_Tutor =
      `
    <span>Xin chào gia sư <b>${tutor_name}</b>,</span> <br>
    <p>Chi tiết khóa học ${course.course_code} đã được đăng ký từ tài khoản ${PHHSInfo.username}: </p>
    ` +
      courseDetailsForTutor +
      ` 
    <p>Cảm ơn vì đã tin tưởng sử dụng dịch vụ của chúng tôi.</p>
    `;

    const content_PHHS =
      `
    <span>Xin chào ${PHHSInfo.username}</span>,
    <p>Chi tiết khóa học ${course.course_code} của bạn đã đăng ký với gia sư ${tutor_name}: </p>

    ` +
      courseDetailsForPHHS +
      ` 
    <p>Cảm ơn vì đã tin tưởng sử dụng dịch vụ của chúng tôi.</p>
    `;

    await sendMail(emailTutor, subject_Tutor, content_Tutor);
    await sendMail(emailPHHS, subject_PHHS, content_PHHS);

    res.status(200).json({
      success: true,
      message: "Thực hiện thành công!",
    });
  } catch (error) {
    next(error);
  }
};

const rejectPrivateCourse = async (req, res, next) => {
  const course_id = req.params.courseID;
  const tutor_id = req.params.tutorID;

  try {
    //Check course and tutor
    const course = await Course.findById(course_id);

    if (!course) return next(createError(400, "Khóa học không tồn tại!"));

    if (
      course.course_registered_tutor.registered_tutor.toHexString() !== tutor_id
    )
      return next(createError(401, "Bạn không được phép vào khóa học này!"));

    //Get some course details
    const courseCode = course.course_code;
    const courseName = course.course_name;
    const PHHSId = course.account;

    //Send notification to PHHS
    const tutorInfo = await Tutor.findOne({ account: tutor_id });
    const tutor_name = tutorInfo.tutor_name;
    const PHHSInfo = await Account.findById(PHHSId);
    const message = `${tutor_name} đã không đồng ý giảng dạy cho ${courseName}. Khóa đã bị hủy. Bạn không thể truy cập vào khóa này.`;
    const type = "SYSTEM";
    const isRead = false;
    const newNotification = new Notification({
      receiver: PHHSId,
      type: type,
      message: message,
      isRead: isRead,
    });
    await newNotification.save();

    //Send email to PHHS
    const subject = `Hủy ${courseName}`;
    const email = PHHSInfo.email;
    const content = `
    <p>Xin chào ${PHHSInfo.username},</p>
    <p>Gia sư ${tutor_name} đã <b>không đồng ý</b> giảng dạy cho <i>${courseName}</i> mà bạn đã chọn đăng ký. Bạn sẽ không thể truy cập vào nội dung lớp học mà bạn đã đăng ký.</p>
    <p>Bạn có thể chọn <u>tạo khóa học công khai</u. hoặc <u>tìm một gia sư khác</u> phù hợp với yêu cầu của mình trên website của chúng tôi.</p>
    
    <p>Chúng tôi xin lỗi vì sự bất tiện này và cảm ơn bạn đã tin dùng dịch vụ của chúng tôi.</p>
    `;

    await sendMail(email, subject, content);

    const result = await Course.findOneAndDelete({ _id: course_id });
    // console.log(result);
    res.status(200).json({ success: true, message: "Thực hiện thành công!" });
  } catch (error) {
    next(error);
  }
};

// Register course == Candidate (Public course)
const registerCourse = async (req, res, next) => {
  const course_id = req.params.id;
  const { tutor_id } = req.body; //account_id (tutor)
  try {
    const course = await Course.findById(course_id);

    if (!course) return next(createError(400, "Khóa học không tồn tại!"));

    const result = await Course.findByIdAndUpdate(course_id, {
      $addToSet: {
        course_candidates: tutor_id,
      },
    });
    // console.log(result);
    const PHHSId = course.account;

    //Send notification to PHHS
    const tutorInfo = await Tutor.findOne({ account: tutor_id });
    const tutor_name = tutorInfo.tutor_name;
    const PHHSInfo = await Account.findById(PHHSId);
    const message = `${tutor_name} đã đăng ký khóa học ${course.course_name}. `;
    const type = "COURSE";
    const isRead = false;
    const newNotification = new Notification({
      receiver: PHHSId,
      type: type,
      message: message,
      isRead: isRead,
      typeID: course_id,
    });
    await newNotification.save();

    res.status(200).json({ success: true, message: "Đăng ký thành công!" });
  } catch (error) {
    next(error);
  }
};

const unregisterCourse = async (req, res, next) => {
  const course_id = req.params.id;
  const { tutor_id } = req.body;
  try {
    const course = await Course.findById(course_id);

    if (!course) return next(createError(400, "Khóa học không tồn tại!"));

    let checkTutor = true;

    for (let elem of course.course_candidates) {
      if (elem.toHexString() === tutor_id) {
        checkTutor = true;
        break;
      } else {
        checkTutor = false;
      }
    }

    // console.log(checkTutor);
    if (!checkTutor)
      return next(
        createError(400, "Bạn không có quyền để thực hiện hành động này!")
      );

    await Course.updateOne(
      { _id: course_id },
      {
        $pull: {
          course_candidates: mongoose.Types.ObjectId(tutor_id),
        },
      }
    );

    const PHHSId = course.account;

    //Send notification to PHHS
    const tutorInfo = await Tutor.findOne({ account: tutor_id });
    const tutor_name = tutorInfo.tutor_name;
    const PHHSInfo = await Account.findById(PHHSId);
    const message = `${tutor_name} đã hủy đăng ký khóa học ${course.course_name}. `;
    const type = "COURSE";
    const isRead = false;
    const newNotification = new Notification({
      receiver: PHHSId,
      type: type,
      message: message,
      isRead: isRead,
      typeID: course_id,
    });
    await newNotification.save();

    res.status(200).json({ success: true, message: "Hủy đăng ký thành công!" });
  } catch (error) {
    next(error);
  }
};

const chooseCandidate = async (req, res, next) => {
  const course_id = req.params.id;
  const { PHHS_id, tutor_id } = req.body;
  try {
    //Check course
    const course = await Course.findById(course_id);

    if (!course) return next(createError(400, "Khóa học không tồn tại!"));

    if (course.status === 2) return next(createError(400, "Khóa học đã đóng!"));

    //Check legal user
    if (course.account.toHexString() !== PHHS_id)
      return next(
        createError(401, "Bạn không có quyền để thực hiện hành động này!")
      );

    //Check is tutor in course candidates list
    let checkTutor = true;

    for (let elem of course.course_candidates) {
      if (elem.toHexString() === tutor_id) {
        checkTutor = true;
        break;
      } else {
        checkTutor = false;
      }
    }

    // console.log(checkTutor);
    if (!checkTutor)
      return next(createError(400, "Gia sư được chọn không hợp lệ!"));

    // Update course
    const result = await Course.findByIdAndUpdate(
      course_id,
      {
        $set: {
          course_status: 2,
          "course_registered_tutor.registered_tutor": tutor_id,
          "course_registered_tutor.registered_date_accepted": new Date(),
          "course_registered_tutor.registered_is_accepted": true,
        },
      },
      { new: true }
    );

    //pull tutor account id out of list candidates
    await Course.findByIdAndUpdate(course_id, {$pull: {
      course_candidates: mongoose.Types.ObjectId(tutor_id)
    }})
    console.log(result);

    //Send notification to Tutor
    const PHHSInfo = await Account.findById(PHHS_id);
    const TutorAccount = await Account.findById(tutor_id);
    const TutorInfo = await Tutor.findOne({ account: tutor_id });
    const message = `${PHHSInfo.username} đã chọn bạn để giảng dạy cho khóa ${course.course_code}. Click để xem chi tiết.`;
    const type = "COURSE";
    const isRead = false;
    const newNotification = new Notification({
      receiver: tutor_id,
      type: type,
      message: message,
      isRead: isRead,
      typeID: course_id,
    });

    await newNotification.save();

    const updatedCourse = await Course.findById(course_id);

    //Send notification for candidates
    if (updatedCourse.course_candidates.length !== 0) {
      for (let elem of updatedCourse.course_candidates) {
        //Send notification
        //Skip a step when meet the chosen tutor in the candidates list
        if (elem.toHexString() === tutor_id) {
          continue;
        }

        let message = `Khóa học ${updatedCourse.course_code} đã chọn được gia sư và đã đóng. Bạn có thể tìm và đăng ký khóa học khác trên hệ thống.`;
        let notifiyCandidates = new Notification({
          receiver: elem,
          sender: "System",
          type: "COURSE",
          message: message,
          isRead: false,
          typeID: course_id,
        });
        await notifiyCandidates.save();
      }
    }

    //Send email for tutor (the chosen one) and owner of the course
    let classString = "";
    let courseClassArray = course.course_classes;
    for (let [i, val] of courseClassArray.entries()) {
      if (i !== courseClassArray.length - 1) classString += val + ", ";
      else {
        classString += val;
      }
    }

    let subjectString = "";
    let courseSubjectArray = course.course_subjects;
    for (let [i, val] of courseSubjectArray.entries()) {
      if (i !== courseSubjectArray.length - 1) subjectString += val + ", ";
      else {
        subjectString += val;
      }
    }

    let scheduleString = "";
    let courseScheduleArray = course.course_schedule;
    for (let [i, val] of courseScheduleArray.entries()) {
      if (i !== courseScheduleArray.length - 1) scheduleString += val + ", ";
      else {
        scheduleString += val;
      }
    }

    //Send email
    const emailPHHS = PHHSInfo.email;
    const emailTutor = TutorAccount.email;
    const subject_PHHS = `Nội dung khóa học ${course.course_code} của bạn`;
    const subject_Tutor = `Nội dung khóa học ${course.course_code} của bạn và tài khoản ${PHHSInfo.username}`;
    const courseDetailsForTutor = `
    <table border="1" style='border-collapse:collapse;'>
    <tr>
      <td>Tên khóa học: </td>
      <td>${course.course_name}</td>
    </tr>
    <tr>
      <td>Lớp: </td>
      <td>${classString}</td>
    </tr>
    <tr>
      <td>Môn: </td>
      <td>${subjectString}</td>
    </tr>
    <tr>
      <td>Lịch học: </td>
      <td>${scheduleString}</td>
    </tr>
    <tr>
      <td>Giờ học: </td>
      <td>${course.course_time}</td>
    </tr>
    <tr>
      <td>Địa chỉ: </td>
      <td>${course.course_address.home_number}, ${course.course_address.street}, ${course.course_address.ward}, ${course.course_address.district}, ${course.course_address.province}</td>
    </tr>
    <tr>
      <td>Số điện thoại liên hệ của PHHS: </td>
      <td>${PHHSInfo.phone_number}/td>
    </tr>
    <tr>
      <td>Email liên hệ của PHHS: </td>
      <td>${PHHSInfo.email}}</td>
    </tr>

    </table>
    `;
    const courseDetailsForPHHS = `
    <table border="1" style='border-collapse:collapse;'>
    <tr>
      <td>Tên khóa học: </td>
      <td>${course.course_name}</td>
    </tr>
    <tr>
      <td>Lớp: </td>
      <td>${classString}</td>
    </tr>
    <tr>
      <td>Môn: </td>
      <td>${subjectString}</td>
    </tr>
    <tr>
      <td>Lịch học: </td>
      <td>${scheduleString}</td>
    </tr>
    <tr>
      <td>Giờ học: </td>
      <td>${course.course_time}</td>
    </tr>
    <tr>
      <td>Địa chỉ: </td>
      <td>${course.course_address.home_number}, ${course.course_address.street}, ${course.course_address.ward}, ${course.course_address.district}, ${course.course_address.province}</td>
    </tr>
    <tr>
      <td>Số điện thoại liên hệ của PHHS: </td>
      <td>${TutorAccount.phone_number}/td>
    </tr>
    <tr>
      <td>Email liên hệ của PHHS: </td>
      <td>${TutorAccount.email}}</td>
    </tr>

    </table>
    `;

    const content_Tutor =
      `
    <span>Xin chào gia sư <b>${TutorInfo.tutor_name}</b>,</span> <br>
    <p>Chi tiết khóa học ${course.course_code} đã được đăng ký từ tài khoản ${PHHSInfo.username}: </p>
    ` +
      courseDetailsForTutor +
      ` 
    <p>Cảm ơn vì đã tin tưởng sử dụng dịch vụ của chúng tôi.</p>
    `;

    const content_PHHS =
      `
    <span>Xin chào ${PHHSInfo.username}</span>,
    <p>Chi tiết khóa học ${course.course_code} của bạn đã đăng ký với gia sư ${TutorInfo.tutor_name}: </p>

    ` +
      courseDetailsForPHHS +
      ` 
    <p>Cảm ơn vì đã tin tưởng sử dụng dịch vụ của chúng tôi.</p>
    `;

    await sendMail(emailTutor, subject_Tutor, content_Tutor);
    await sendMail(emailPHHS, subject_PHHS, content_PHHS);

    res.status(200).json({ success: true, message: "Chọn gia sư thành công!" });
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  const course_id = req.params.courseID;
  const PHHS_id = req.params.PHHSID;
  try {
    //Check course
    const course = await Course.findById(course_id);

    if (!course) return next(createError(400, "Khóa học không tồn tại!"));

    if (course.status === 2) return next(createError(400, "Khóa học đã đóng!"));

    //Check legal user
    console.log(course.account);
    if (course.account.toHexString() !== PHHS_id)
      return next(
        createError(401, "Bạn không có quyền để thực hiện hành động này!")
      );

    //Get email of course candiates and then send email & send notification
    // let emailsArray = [];
    let subject = `Xóa khóa học ${course.course_code}`;
    if (course.course_candidates.length !== 0) {
      for (let elem of course.course_candidates) {
        let accountInfo = await Account.findById(elem);
        let tutorInfo = await Tutor.findOne({ account: elem });
        //console.log(`${tutorInfo.tutor_name} - ${accountInfo.email}`);
        //Send mail
        let email = accountInfo.email;
        let content = `
          <p>Xin chào gia sư ${tutorInfo.tutor_name}, </p>
          <p>Khóa học <b>${course.course_name}</b> (Mã ${course.course_code}) <b>đã bị xóa</b> bởi chủ khóa học.</p>
          <p>Bạn có thể tìm kiếm khóa học khác đang cần tuyển trên website của chúng tôi.</p>
          <p>Chúng tôi xin cảm ơn bạn đã tin dùng dịch vụ của chúng tôi.</p>
          `;
        await sendMail(email, subject, content);

        //Send notification
        let message = `Khóa học ${course.course_name} (Mã ${course.course_code}) đã bị xóa. Bạn sẽ không thể truy cập vào khóa học.`;
        let notifiyCandidates = new Notification({
          receiver: elem,
          type: "SYSTEM",
          message: message,
          isRead: false,
        });
        await notifiyCandidates.save();
      }
    }

    //Delete course
    const result = await Course.findByIdAndDelete(course_id);
    console.log(result);

    res
      .status(200)
      .json({ success: true, message: "Xóa khóa học thành công!" });
  } catch (error) {
    next(error);
  }
};

const editCourse = async (req, res, next) => {
  const course_id = req.params.id;
  const { PHHS_id, updatedCourse, addrOption } = req.body;
  try {
    //Check course
    const course = await Course.findById(course_id);

    if (!course) return next(createError(400, "Khóa học không tồn tại!"));

    if (course.status === 2)
      return next(createError(400, "Khóa học đã đóng, Không thể chỉnh sửa!"));

    //Check legal user
    console.log(course.account);
    if (course.account.toHexString() !== PHHS_id)
      return next(
        createError(401, "Bạn không có quyền để thực hiện hành động này!")
      );

    if(addrOption){
      await Course.findByIdAndUpdate(
      course_id,
      {
        $set: {
          course_name: updatedCourse.course_name,
          course_classes: updatedCourse.course_classes,
          course_subjects: updatedCourse.course_subjects,
          course_schedule: updatedCourse.course_schedule,
          course_requirement: updatedCourse.course_requirement,
          course_time: updatedCourse.course_time,
          "course_address.home_number": updatedCourse.home_number,
          "course_address.street": updatedCourse.street,
          "course_address.ward": updatedCourse.ward,
          "course_address.district": updatedCourse.district,
          "course_address.province": updatedCourse.province,
          course_updated_at: new Date(),
        },
      },
      { new: true }
    );
    }
    else{
      await Course.findByIdAndUpdate(
        course_id,
        {
          $set: {
            course_name: updatedCourse.course_name,
            course_classes: updatedCourse.course_classes,
            course_subjects: updatedCourse.course_subjects,
            course_schedule: updatedCourse.course_schedule,
            course_requirement: updatedCourse.course_requirement,
            course_time: updatedCourse.course_time,
            course_updated_at: new Date(),
          },
        },
        { new: true }
      );
    }
    

    if (course.course_purpose === 1) {
      //Notify for candidates
      if (course.course_candidates.length !== 0) {
        for (let elem of course.course_candidates) {
          //Send notification
          let message = `Khóa học ${course.course_name} (Mã ${course.course_code}) đã được chỉnh sửa. Click để xem chi tiết.`;
          let notifiyCandidates = new Notification({
            receiver: elem,
            type: "COURSE",
            message: message,
            isRead: false,
            typeID: course_id,
          });
          await notifiyCandidates.save();
        }
      }
    }

    if (course.course_purpose === 2) {
      let message = `Khóa học ${course.course_name} (Mã ${course.course_code}) đã được chỉnh sửa. Click để xem chi tiết.`;
      let notifiyChosenTutor = new Notification({
        receiver: course.course_registered_tutor.registered_tutor,
        type: "COURSE",
        message: message,
        isRead: false,
        typeID: course_id,
      });
      await notifiyChosenTutor.save();
    }

    res
      .status(200)
      .json({ success: true, message: "Sửa thông tin khóa học thành công!" });
  } catch (error) {
    next(error);
  }
};

const getCourses = async (req, res, next) => {
  const { classes, subjects, course_code, province, district, ward } =
    req.query;
  try {
    const classesList = classes ? classes.split(",") : [];
    const subjectsList = subjects ? subjects.split(",") : [];

    let listClassName = [];
    for (let elements of classesList) {
      let classItem = await Class.findOne({ code: elements });
      listClassName.push(classItem.name);
    }

    let listSubjectName = [];
    for (let elements of subjectsList) {
      let subjectItem = await Subject.findOne({ code: elements });
      listSubjectName.push(subjectItem.name);
    }

    let query = {};
    if (listClassName.length !== 0) {
      query.course_classes = { $in: listClassName };
    }

    if (listSubjectName.length !== 0) {
      query.course_subjects = { $in: listSubjectName };
    }

    // console.log(typeof course_code === 'string');
    // console.log(course_code === '""');
    if (
      course_code !== '""' &&
      course_code !== undefined &&
      course_code !== null
    )
      query.course_code = new RegExp(course_code, "i");

    if (province !== '""' && province !== null && province !== undefined) {
      const provinceKey = "course_address.province";
      query[provinceKey] = new RegExp(province, "i");
    }

    if (district !== '""' && district !== null && district !== undefined) {
      const districtKey = "course_address.district";
      query[districtKey] = new RegExp(district, "i");
    }

    if (ward !== '""' && ward !== null && ward !== undefined) {
      const wardKey = "course_address.ward";
      query[wardKey] = new RegExp(ward, "i");
    }

    query.course_purpose = 1;
    query.course_status = 0;

    console.log(query);

    const projection = {
      course_number: 0,
    };

    const courses = await Course.find(query, projection)
      .populate({ path: "account", select: "username" })
      .sort({ course_created_at: -1 });

    const count = courses.length;

    res.status(200).json({
      total: count,
      coursesList: courses,
    });
  } catch (error) {
    next(error);
  }
};

const getAllCourse = async (req, res, next) => {
  const { course_code, skip, limit } = req.query;
  try {
    let isLoadMore = false;
    let query = {};
    if (course_code !== '""' && course_code !== `''` && course_code !== undefined && course_code !== null)
      query.course_code = new RegExp(course_code, "i");

    const total_rows_query = await Course.count(query);

    let loadRecord = parseInt(skip) + parseInt(limit);
    if(loadRecord < total_rows_query){
      isLoadMore = true;
    }
   
    if(total_rows_query < loadRecord){
      isLoadMore = false
    }

    const projection = {
      course_number: 0,
    };

    const courses = await Course.find(query, projection)
      .populate({ path: "account", select: "username" })
      .sort({ course_created_at: -1 }).skip(skip).limit(limit);


    res.status(200).json({
      total: total_rows_query,
      coursesList: courses,
      isLoadMore: isLoadMore,
      skip: parseInt(skip)
    });
  } catch (error) {
    next(error);
  }
};

const getCourse = async (req, res, next) => {
  const courseID = req.params.id;
  try {
    let publicCourseTutor = {};
    let privateCourseTutor = {};
    //check course
    const course = await Course.findById(courseID);

    if (!course) return next(createError(404, "Khoá học không tồn tại!"));

    // console.log(course.course_registered_tutor.registered_tutor);

    if (course.course_purpose === 2) {
      let chosenTutorID = course.course_registered_tutor.registered_tutor;
      privateCourseTutor = await Tutor.findOne(
        { account: chosenTutorID },
        { tutor_CCCD_image: 0, createdAt: 0, UpdatedAt: 0, _id: 0 }
      );
      if(privateCourseTutor === null)
        privateCourseTutor = {};
    }

    let candidates = [];
    if (course.course_purpose === 1) {
      if (course.course_candidates.length > 0) {
        for (let item of course.course_candidates) {
          // console.log(item);
          let candidate = await Tutor.findOne(
            { account: item },
            { tutor_CCCD_image: 0, createdAt: 0, UpdatedAt: 0, _id: 0 }
          );
          candidates.push(candidate);
        }
      }
      // console.log(course);
      // console.log('course_registered_tutor' in course);
      if ("course_registered_tutor" in course) {
        // console.log(course.course_registered_tutor.registered_tutor);
        if (course.course_registered_tutor.registered_tutor !== undefined) {
          let chosenPublicCourseTutorID =
            course.course_registered_tutor.registered_tutor;
          publicCourseTutor = await Tutor.findOne(
            { account: chosenPublicCourseTutorID },
            { _id: 0, tutor_CCCD_image: 0, createdAt: 0, UpdatedAt: 0 }
          );
          if(publicCourseTutor === null)
            publicCourseTutor = {};
        }
      }
    }

    //OK
    res
      .status(200)
      .json({
        course: course,
        candidates: candidates,
        publicCourseTutor: publicCourseTutor,
        privateCourseTutor: privateCourseTutor,
      });
  } catch (error) {
    next(error);
  }
};

const getCourseByUserId = async (req, res, next) => {
  const userID = req.params.id;
  try {
    const courses = await Course.find({ account: userID }).sort({
      course_created_at: -1,
    });

    let total = 0;

    if (courses) {
      total = courses.length;
    }

    res.status(200).json({ courses: courses, total: total });
  } catch (error) {
    next(error);
  }
};
const getRegisteredCourseByTutorId = async (req, res, next) => {
  const tutorID = req.params.id; //account TUTOR
  try {
    const courses = await Course.find({
      "course_registered_tutor.registered_tutor": tutorID,
    });

    let total = 0;

    if (courses) {
      total = courses.length;
    }

    res.status(200).json({ courses: courses, total: total });
  } catch (error) {
    next(error);
  }
};

const getUnregistedCourseByTutorId = async (req, res, next) => {
  const tutorID = req.params.id; //account TUTOR
  try {
    const courses = await Course.find({
      course_candidates: { $in: [tutorID] },
    });

    let total = 0;

    if (courses) {
      total = courses.length;
    }

    res.status(200).json({ courses: courses, total: total });
  } catch (error) {
    next(error);
  }
};

const loadRandomCourses = async (req, res, next) => {
  try {
    
    const courses = await Course.aggregate([{$match: {course_status: 0, course_purpose: 1}},{$sample: {size: 2}}])


    res.status(200).json({courses: courses});
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createPublicCourse,
  createPrivateCourse,
  acceptPrivateCourse,
  rejectPrivateCourse,
  registerCourse,
  unregisterCourse,
  deleteCourse,
  chooseCandidate,
  editCourse,
  getCourses,
  getCourse,
  getCourseByUserId,
  getRegisteredCourseByTutorId,
  getUnregistedCourseByTutorId,
  getAllCourse,
  loadRandomCourses
};
