const {verifyToken} = require('./verifyToken');
const { createError } = require('./createError');

const verifyTutor = (req, res, next) => {
  verifyToken(req, res, () => {
    // if(req.user === null || req.user === "")
    //   return next(createError(401, "Bạn cần đăng nhập để vào trang này!"));

    if((req.user.accountID) && (req.user.accountType === "TUTOR")){
      next();
    }
    else {
      return next(createError(401, "Bạn không có quyền để vào trang này!"));
    }
  })
}

module.exports = {verifyTutor}