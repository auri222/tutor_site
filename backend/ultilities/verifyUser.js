const {verifyToken} = require('./verifyToken');
const { createError } = require('./createError');

const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    // if(((req.user.accountID  === req.params.id) && (req.user.accountType === "USER")) || req.user.isAdmin){
    //   next();
    // }
    if(((req.user.accountID) && (req.user.accountType === "USER"))){
      next();
    }
    else {
      return next(createError(401, "Bạn không có quyền để vào trang này!"));
    }
  })
}

module.exports = {verifyUser};