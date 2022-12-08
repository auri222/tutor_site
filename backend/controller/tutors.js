const { createError } = require("../ultilities/createError");
const { renameKeys } = require("../ultilities/renameKeys");
const { getPublicId } = require("../ultilities/cloudinaryUltils");
const Tutor = require("../models/Tutor");
const Class = require("../models/Class");
const Subject = require("../models/Subject");
const Schedule = require("../models/Schedule");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const getTutors = async (req, res, next) => {
  const { classes, subjects, tutor_name, province, district, ward } = req.query;
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
      query.tutor_classes = { $in: listClassName };
    }

    if (listSubjectName.length !== 0) {
      query.tutor_subjects = { $in: listSubjectName };
    }

    if (tutor_name !== "" || tutor_name !== null || tutor_name !== undefined) {
      query.tutor_name = new RegExp(tutor_name, "i");
    }

    console.log(query);

    let populate = {};
    populate.path = "account";
    populate.match = {};
    let address = {};
    if (province !== "" || province !== null || province !== undefined) {
      address.province = new RegExp(province, "i");
    }

    if (district !== "" || district !== null || district !== undefined) {
      address.district = new RegExp(district, "i");
    }

    if (ward !== "" || ward !== null || ward !== undefined) {
      address.ward = new RegExp(ward, "i");
    }

    const replacements = {
      province: "address.province",
      district: "address.district",
      ward: "address.ward",
    };

    if (Object.keys(address).length > 0) {
      const newAddress = renameKeys(replacements, address);
      populate.match = newAddress;
      populate.select = "address";
    }

    console.log(address);

    console.log(populate);

    const tutorsList = await Tutor.find(query).populate(populate);

    const newTutorList = tutorsList.filter((elem) => {
      return elem.account !== null;
    });

    const count = newTutorList.length;
    // res.status(200).send('ok');
    res.status(200).json({
      total: count,
      tutorsList: newTutorList,
    });
  } catch (error) {
    next(error);
  }
};

const editProfile = async (req, res, next) => {
  const accountID = req.params.id;
  const { tutor, classes, subjects, schedules, profileImg, CCCDImg } = req.body;
  try {
    //check account
    const tutorInfo = await Tutor.findOne({ account: accountID });

    if (!tutorInfo)
      return next(
        createError(401, "Bạn không có quyền thực hiện hành động này!")
      );

    if (classes.length <= 0)
      return next(createError(400, "Hãy chọn lớp giảng dạy!"));

    if (subjects.length <= 0)
      return next(createError(400, "Hãy chọn môn giảng dạy!"));

    if (schedules.length <= 0)
      return next(createError(400, "Hãy chọn môn giảng dạy!"));

    if (tutor.tutor_name === "" || tutor.tutor_occupation === "")
      return next(createError(400, "Hãy điền họ tên và nghề nghiệp!"));

    const tutor_title = tutor.tutor_title || "Trống";
    const tutor_workplace_name = tutor.tutor_workplace_name || "Trống";
    const tutor_workplace_address = tutor.tutor_workplace_address || "Trống";

    console.log('Check upload images: ');
    console.log(profileImg);
    console.log(CCCDImg);

    //Upload CCCD error when register account
    if (tutorInfo.tutor_CCCD_image.length === 0) {
      if (CCCDImg.length > 0) {
        // //Upload 2 image
        let promises = [];
        CCCDImg.forEach(async (image) => {
          
          promises.push(
            cloudinary.uploader.upload(image, {
              upload_preset: "tutor_uploads",
              folder: "tutor_CCCD",
            })
          );
        });

        let tutor_CCCD_images = [];
        const res2 = await Promise.all(promises);
        res2.forEach((item) => {
          tutor_CCCD_images.push(item.url);
        });

        //Update CCCD
        await Tutor.findByIdAndUpdate(tutorInfo._id, {$set: {
          tutor_CCCD_image: tutor_CCCD_images
        }}, {new: true});
      }
    }

    //Change Image profile
    if (profileImg !== "") {
      //Delete image on Cloudinary
      const publicID = getPublicId(tutorInfo.tutor_profile_image);
      await cloudinary.uploader
        .destroy(publicID)
        .then((response) => console.log(response))
        .catch((err) => console.log(err));

      //Upload new Tutor's profile image
      //Upload image to CLOUDINARY
      const result = await cloudinary.uploader.upload(profileImg, {
        upload_preset: "tutor_uploads",
        folder: "tutor",
      });

      const tutor_profile_img = result.url;

      await Tutor.findByIdAndUpdate(
        tutorInfo._id,
        {
          $set: {
            tutor_name: tutor.tutor_name,
            tutor_title: tutor_title,
            tutor_occupation: tutor.tutor_occupation,
            tutor_workplace_name: tutor_workplace_name,
            tutor_workplace_address: tutor_workplace_address,
            tutor_profile_image: tutor_profile_img,
            tutor_classes: classes,
            tutor_subjects: subjects,
            tutor_schedule: schedules,
            UpdatedAt: new Date(),
          },
        },
        { new: true }
      );
    } else {
      await Tutor.findByIdAndUpdate(
        tutorInfo._id,
        {
          $set: {
            tutor_name: tutor.tutor_name,
            tutor_title: tutor_title,
            tutor_occupation: tutor.tutor_occupation,
            tutor_workplace_name: tutor_workplace_name,
            tutor_workplace_address: tutor_workplace_address,
            tutor_classes: classes,
            tutor_subjects: subjects,
            tutor_schedule: schedules,
            UpdatedAt: new Date(),
          },
        },
        { new: true }
      );
    }

    res.status(200).json({ success: true, message: "Cập nhật thành công!" });
  } catch (error) {
    next(error);
  }
};

const getTutor = async (req, res, next) => {
  const tutorID = req.params.id;
  try {
    const tutor = await Tutor.findOne({ account: tutorID });
    // console.log(tutor);
    if (!tutor) return next(createError(404, "Không tìm thấy thông tin!"));

    res.status(200).json(tutor);
  } catch (error) {
    next(error);
  }
};

const randomTutors = async (req, res, next) => {
  try {
    const tutors = await Tutor.aggregate([{$sample: {size: 4}}]);
    
    res.status(200).json({tutors: tutors});
  } catch (error) {
    next(error);
  }
}

module.exports = { getTutors, editProfile, getTutor, randomTutors };
