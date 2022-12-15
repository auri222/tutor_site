const Account = require("../models/Account");
const Tutor = require("../models/Tutor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const { createOTP } = require("../ultilities/createOTP");
const { sendMail } = require("../ultilities/sendMail");
const { createError } = require("../ultilities/createError");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const register_user = async (req, res, next) => {
  const {
    username,
    password,
    birthday,
    CCCD,
    home_number,
    street,
    ward,
    district,
    province,
    email,
    phone_number,
  } = req.body;

  const isVerify = false;
  const isActive = false;
  const isAdmin = false;
  const isLock = false;
  const OTP = await createOTP().toString();
  const accountType = "USER";
  const token = "trống";

  const salt = bcrypt.genSaltSync(10);

  //Simple validation
  if (!username || !password)
    return next(createError(400, "Thiếu tên đăng nhập hoặc mật khẩu!"));

  if (!email) return next(createError(400, "Thiếu tài khoản email!"));

  try {
    // Check for existed user
    const user = await Account.findOne({ username });
    if (user) return next(createError(400, "Tên đăng nhập bị trùng!"));

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Save account info
    const newAccount = new Account({
      username: username,
      password: hashedPassword,
      birthday: birthday,
      CCCD: CCCD,
      address: {
        home_number: home_number || "Trống",
        street: street || "Trống",
        ward: ward,
        district: district,
        province: province,
      },
      email: email,
      phone_number: phone_number,
      createdAt: new Date(),
      updatedAt: new Date(),
      isVerify: isVerify,
      isActive: isActive,
      isAdmin: isAdmin,
      OTP: OTP,
      accountType: accountType,
      token: token,
      isLock: isLock
    });
    await newAccount.save();

    // Create access token
    const accessToken = jwt.sign(
      {
        accountID: newAccount._id,
        username: username,
        accountType: accountType,
      },
      process.env.ACCESS_TOKEN_SECRET
    );

    //Update token
    await Account.findByIdAndUpdate(
      newAccount._id,
      {
        $set: { token: accessToken },
      },
      { new: true }
    );

    //Response data
    const accId = newAccount._id;

    const text = `
    <p>TutorSite xin chào ${newAccount.username},</p>
    <p>Đây là mã OTP <b>${OTP}</b>. </p> 
    <p>Để xác minh tài khoản hãy nhập mã này vào form xác nhận ở bước xác minh tài khoản</p>
    <p>Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi.</p>
    `;
    const subject = "Xác minh tài khoản";

    await sendMail(email, subject, text);

    res.status(200).json({
      success: true,
      message: "Tạo tài khoản thành công",
      account: accId,
    });
  } catch (error) {
    next(error);
  }
};

const register_admin = async (req, res, next) => {
  const {
    username,
    password,
    birthday,
    CCCD,
    home_number,
    street,
    ward,
    district,
    province,
    email,
    phone_number,
  } = req.body;

  const isVerify = true;
  const isActive = false;
  const isAdmin = true;
  const OTP = await createOTP().toString();
  const accountType = "ADMIN";
  const token = "trống";

  const salt = bcrypt.genSaltSync(10);

  //Simple validation
  if (!username || !password)
    return next(createError(400, "Thiếu tên đăng nhập hoặc mật khẩu!"));

  if (!email) return next(createError(400, "Thiếu tài khoản email!"));

  try {
    // Check for existed user
    const user = await Account.findOne({ username });
    if (user) return next(createError(400, "Tên đăng nhập bị trùng!"));

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Save account info
    const newAccount = new Account({
      username: username,
      password: hashedPassword,
      birthday: birthday,
      CCCD: CCCD,
      address: {
        home_number: home_number || "Trống",
        street: street || "Trống",
        ward: ward,
        district: district,
        province: province,
      },
      email: email,
      phone_number: phone_number,
      createdAt: new Date(),
      updatedAt: new Date(),
      isVerify: isVerify,
      isActive: isActive,
      isAdmin: isAdmin,
      OTP: OTP,
      accountType: accountType,
      token: token
    });
    await newAccount.save();

    // Create access token
    const accessToken = jwt.sign(
      {
        accountID: newAccount._id,
        username: username,
        accountType: accountType,
      },
      process.env.ACCESS_TOKEN_SECRET
    );

    //Update token
    await Account.findByIdAndUpdate(
      newAccount._id,
      {
        $set: { token: accessToken },
      },
      { new: true }
    );

    //Response data
    const accId = newAccount._id;

    // const text = `
    // <p>TutorSite xin chào,</p>
    // <p>Đây là mã OTP <b>${OTP}</b>. </p> 
    // <p>Để xác minh tài khoản hãy nhập mã này vào form xác nhận ở bước xác minh tài khoản</p>
    // <p>Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi.</p>
    // `;
    // const subject = "Xác minh tài khoản";

    // sendMail(email, subject, text);

    res.status(200).json({
      success: true,
      message: "Tạo tài khoản thành công",
      account: accId,
    });
  } catch (error) {
    next(error);
  }
};

const register_tutor = async (req, res, next) => {
  const { account, tutor, classes, subjects, schedule, profileImg, CCCDImg } = req.body;
  try {
    console.time("upload");
    const isVerify = false;
    const isActive = false;
    const isAdmin = false;
    const isLock = false;
    const OTP = await createOTP().toString();
    const accountType = "TUTOR";
    const token = "trống";

    const salt = bcrypt.genSaltSync(10);

    //Simple validation
    if (!account.username || !account.password)
      return next(createError(400, "Thiếu tên đăng nhập hoặc mật khẩu!"));

    if (!account.email) return next(createError(400, "Thiếu tài khoản email!"));

    // Check for existed user
    const user = await Account.findOne({ username: account.username });
    if (user) return next(createError(400, "Tên đăng nhập bị trùng!"));

    if(CCCDImg.length < 0)
      return next(createError(400, "Thiếu ảnh CCCD!"));

    if(profileImg === "")
      return next(createError(400, "Thiếu ảnh profile!"));

    // Hash password
    const hashedPassword = bcrypt.hashSync(account.password, salt);

    // Save account info
    const newAccount = new Account({
      username: account.username,
      password: hashedPassword,
      birthday: account.birthday,
      CCCD: account.CCCD,
      address: {
        home_number: account.home_number || "Trống",
        street: account.street || "Trống",
        ward: account.ward,
        district: account.district,
        province: account.province,
      },
      email: account.email,
      phone_number: account.phone_number,
      createdAt: new Date(),
      updatedAt: new Date(),
      isVerify: isVerify,
      isActive: isActive,
      isAdmin: isAdmin,
      OTP: OTP,
      accountType: accountType,
      token: token,
      isLock: isLock
    });
    await newAccount.save();

    // Create access token
    const accessToken = jwt.sign(
      {
        accountID: newAccount._id,
        username: newAccount.username,
        accountType: newAccount.accountType,
      },
      process.env.ACCESS_TOKEN_SECRET
    );

    //Update token
    await Account.findByIdAndUpdate(
      newAccount._id,
      {
        $set: { token: accessToken },
      },
      { new: true }
    );

    // //Response data
    const accId = newAccount._id;

    //UPLOAD IMAGES TO CLOUDINARY
    //Upload 1 image
    const res1 = await cloudinary.uploader.upload(profileImg, {
      upload_preset: "tutor_uploads",
      folder: "tutor",
    });
    // // console.log(res1);
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

    const res2 = await Promise.all(promises);

    const tutor_profile_image = res1.url;
    const tutor_CCCD_images = [];
    res2.forEach((item) => {
      tutor_CCCD_images.push(item.url);
    });

    const newTutor = new Tutor({
      tutor_name: tutor.tutor_name,
      tutor_title: tutor.tutor_title || "Trống",
      tutor_occupation: tutor.tutor_occupation,
      tutor_workplace_name: tutor.tutor_workplace_name || "Trống",
      tutor_workplace_address: tutor.tutor_workplace_address || "Trống",
      tutor_profile_image: tutor_profile_image,
      tutor_CCCD_image: tutor_CCCD_images,
      tutor_classes: classes,
      tutor_subjects: subjects,
      tutor_schedule: schedule,
      account: accId,
      createdAt: new Date(),
      UpdatedAt: new Date()
    });
    await newTutor.save();

    const text = `
    <p>TutorSite xin chào ${newAccount.username},</p>
    <p>Đây là mã OTP <b>${OTP}</b>. </p>
    <p>Để xác minh tài khoản hãy nhập mã này vào form xác nhận ở bước xác minh tài khoản</p>
    <p>Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi.</p>
    `;
    const subject = "Xác minh tài khoản";
    const email = newAccount.email;
    sendMail(email, subject, text);

    console.timeEnd("upload");
    res.status(200).json({
      success: true,
      message: "Tạo tài khoản thành công",
      account: accId,
    });
  } catch (error) {
    next(error);
  }
};

const verifyUserOTP = async (req, res, next) => {
  try {
    const user = await Account.findById(req.params.id);
    // console.log(user)
    if (!user)
      return next(
        createError(401, "Bạn không được phép vào trang này! Hãy quay lại")
      );

    if (user.isVerify)
      return next(createError(403, "Tài khoản của bạn đã được xác minh!"));

    res.status(200).json({
      success: true,
      message: "Người dùng hợp lệ",
    });
  } catch (error) {
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { otp } = req.body;

    if (!otp) return next(createError(400, "Thiếu mã OTP!"));

    const account = await Account.findById(id);
    if (!account)
      return next(
        createError(401, "Bạn không được phép vào trang này! Hãy quay lại")
      );

    //Check OTP
    if (otp !== account.OTP)
      return next(createError(400, "Mã OTP không chính xác!"));

    //OK
    await Account.findByIdAndUpdate(
      account._id,
      { $set: { isVerify: true } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Xác thực thành công",
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { data } = req.body;

  try {
    const usname = data.username;
    const pd = data.password;

    if (!usname)
      return res
        .status(400)
        .json({ success: false, message: "Thiếu tên đăng nhập" });

    if (!pd)
      return res
        .status(400)
        .json({ success: false, message: "Thiếu mật khẩu" });
    // Check for existing user
    const user = await Account.findOne({ username: usname });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu!" });

    // Username found
    const passwordValid = await bcrypt.compareSync(pd, user.password);

    if (!passwordValid)
      return res
        .status(400)
        .json({ status: false, message: "Sai tên đăng nhập hoặc mật khẩu!" });

    if(!user.isVerify)
      return res.status(403).json({success: false, message: "Tài khoản của bạn chưa được xác minh.", user: user._id});

    if(user.isLock)
      return next(createError(401, "Tài khoản của bạn hiện đã bị khóa. Vui lòng liên hệ để biết thêm chi tiết!"));
    // Username & password OK
    // Create token for login
    const accessToken = jwt.sign(
      { accountID: user._id, isAdmin: user.isAdmin, accountType: user.accountType },
      process.env.ACCESS_TOKEN_SECRET
    );

    await Account.findByIdAndUpdate(user._id, {isActive: true});

    const {
      password,
      isVerify,
      isActive,
      isAdmin,
      email,
      phone_number,
      address,
      OTP,
      token, 
      CCCD, 
      birthday,
      ...otherDetails
    } = user._doc;

    res.cookie("access_token", accessToken, {httpOnly: false, secure: false}).status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      details: { ...otherDetails },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

const logOut =  async (req, res, next) => {
  const accountID = req.params.id;
  try {
    await Account.findByIdAndUpdate(accountID, {isActive: false});
    res.clearCookie('access_token');
    res.status(200).json({ success: true, message: "Đăng xuất thành công!" });

  } catch (error) {
    next(error);
  }
}

module.exports = {
  register_user,
  register_tutor,
  verifyUserOTP,
  verifyOTP,
  login,
  register_admin,
  logOut,
};

