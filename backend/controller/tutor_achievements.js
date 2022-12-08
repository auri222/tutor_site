const Account = require("../models/Account");
const Tutor = require("../models/Tutor");
const { getPublicId } = require("../ultilities/cloudinaryUltils");
const TutorAchievement = require("../models/TutorAchievement");
const { createError } = require("../ultilities/createError");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const createTA = async (req, res, next) => {
  const { accountID, achievement, achievementImg } = req.body;
  try {
    //check account
    const accountInfo = await Account.findById(accountID);

    if (!accountInfo) return next(createError(400, "Tài khoản không tồn tại!"));

    if (accountInfo.accountType !== "TUTOR")
      return next(
        createError(401, "Bạn không có quyền để thực hiện hành động này!")
      );

    const tutorInfo = await Tutor.findOne({ account: accountID });

    if (!tutorInfo) return next(createError(400, "Tài khoản không tồn tại!"));

    //Check data
    if (Object.keys(achievement).length < 0)
      return next(createError(400, "Hãy điền đầy đủ thông tin!"));

    if (achievementImg === "") return next(createError(400, "Hãy chọn hình!"));

    //Upload image to CLOUDINARY
    const result = await cloudinary.uploader.upload(achievementImg, {
      upload_preset: "tutor_uploads",
      folder: "tutor_achievements",
    });

    const tutor_achievement_img = result.url;

    //Save data
    const newAchievement = new TutorAchievement({
      achievement_name: achievement.achievement_name,
      achievement_accomplished_date: achievement.achievement_accomplished_date,
      achievement_from: achievement.achievement_from,
      achievement_image: tutor_achievement_img,
      createdAt: new Date(),
      updatedAt: new Date(),
      tutor: tutorInfo._id,
    });

    await newAchievement.save();

    res.status(200).json({ success: true, message: "Thêm thành công!" });
  } catch (error) {
    next(error);
  }
};

const editTA = async (req, res, next) => {
  const achievementID = req.params.id;
  const { accountID, achievement, achievementImg } = req.body;
  try {
    //check account
    const accountInfo = await Account.findById(accountID);

    if (!accountInfo) return next(createError(404, "Tài khoản không tồn tại!"));

    const tutorInfo = await Tutor.findOne({ account: accountID });

    if (!tutorInfo) return next(createError(400, "Tài khoản không tồn tại!"));

    //Check owner
    const achievementInfo = await TutorAchievement.findById(achievementID);

    if (!achievementInfo)
      return next(createError(404, "Thành tựu không tồn tại!"));

    // console.log(achievementInfo.tutor);
    // console.log(tutorInfo._id);
    if (!achievementInfo.tutor.equals(tutorInfo._id))
      return next(
        createError(401, "Bạn không có quyền để thực hiện hành động này!")
      );

    //Check data
    if (!achievement)
      return next(createError(400, "Hãy điền đầy đủ thông tin!"));

    //Change image
    if (achievementImg !== "") {
      //Delete image on Cloudinary
      const publicID = getPublicId(achievementInfo.achievement_image);
      await cloudinary.uploader
        .destroy(publicID)
        .then((response) => console.log(response))
        .catch((err) => console.log(err));

      //Upload new Achievement image
      //Upload image to CLOUDINARY
      const result = await cloudinary.uploader.upload(achievementImg, {
        upload_preset: "tutor_uploads",
        folder: "tutor_achievements",
      });

      const tutor_achievement_img = result.url;

      await TutorAchievement.findByIdAndUpdate(
        achievementID,
        {
          $set: {
            achievement_name: achievement.achievement_name,
            achievement_accomplished_date:
              achievement.achievement_accomplished_date,
            achievement_from: achievement.achievement_from,
            achievement_image: tutor_achievement_img,
            updatedAt: new Date(),
          },
        },
        { new: true }
      );
    } else {
      await TutorAchievement.findByIdAndUpdate(
        achievementID,
        {
          $set: {
            achievement_name: achievement.achievement_name,
            achievement_accomplished_date:
              achievement.achievement_accomplished_date,
            achievement_from: achievement.achievement_from,
            updatedAt: new Date(),
          },
        },
        { new: true }
      );
    }
    res.status(200).json({ success: true, message: "Cập nhật thành công!" });

    //Not change image
  } catch (error) {
    next(error);
  }
};

const deleteTA = async (req, res, next) => {
  const achievementID = req.params.achievementID;
  const accountID  = req.params.accountID;
  try {
    // console.log(req.params);
    // console.log(accountID);
    // console.log(achievementID);
    //check account
    const accountInfo = await Account.findById(accountID);

    if (!accountInfo) return next(createError(400, "Tài khoản không tồn tại!"));

    if (accountInfo.accountType !== "TUTOR")
      return next(
        createError(401, "Bạn không có quyền để thực hiện hành động này!")
      );

    const tutorInfo = await Tutor.findOne({ account: accountID });

    if (!tutorInfo) return next(createError(400, "Tài khoản không tồn tại!"));

    //Check owner
    const achievementInfo = await TutorAchievement.findById(achievementID);

    if (!achievementInfo)
      return next(createError(400, "Thành tựu không tồn tại!"));

    if (!achievementInfo.tutor.equals(tutorInfo._id))
      return next(
        createError(401, "Bạn không có quyền để thực hiện hành động này!")
      );

    //Delete image on Cloudinary
    const publicID = getPublicId(achievementInfo.achievement_image);
    await cloudinary.uploader
      .destroy(publicID)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));

    //Delete achievement
    await TutorAchievement.findByIdAndDelete(achievementID);
    res.status(200).json({ success: true, message: "Xóa thành công!" });
  } catch (error) {
    next(error);
  }
};

const getAchievementList = async (req, res, next) => {
  const accountID = req.params.id; 
  try {

    //check tutor
    const tutor = await Tutor.findOne({account: accountID});

    if(!tutor)
      return next(createError(401, "Không tìm thấy thông tin của gia sư!"));

    const achievements = await TutorAchievement.find({tutor: tutor._id});
    
    res.status(200).json(achievements);
    
  } catch (error) {
    next(error);
  }
}

const getAchievement = async (req, res, next) => {
  const achievementID = req.params.achievementID;
  try {
    //check achievement
    const achievement = await TutorAchievement.findById(achievementID);

    if(!achievement)
      return next(createError(404, "Không tìm thấy thông tin thành tựu!"));

    res.status(200).json(achievement);

  } catch (error) {
    next(error);
  }
}

module.exports = { createTA, editTA, deleteTA, getAchievementList, getAchievement};
