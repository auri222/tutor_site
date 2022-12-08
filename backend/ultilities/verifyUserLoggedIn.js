const {verifyToken} = require('./verifyToken');
const { createError } = require('./createError');

const verifyUserLoggedIn = (req, res, next) => {
  verifyToken(req, res, () => {
    if((req.user.accountID) && (req.user.accountType))
      next();
    else {
      return next(createError(401, "Bạn không có quyền để vào trang này!"));
    }
  })
}

module.exports = {verifyUserLoggedIn};
