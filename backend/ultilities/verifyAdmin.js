const {verifyToken} = require('./verifyToken');
const { createError } = require('./createError');

const verifyAdmin = (req,res, next) => {
  verifyToken(req, res, () => {
    if(req.user.isAdmin){
      next();
    }
    else {
      return next(createError(401, "Bạn không có quyền để vào trang này!"));
    }
  })
}

module.exports = {verifyAdmin}