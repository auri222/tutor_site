const jwt = require("jsonwebtoken");
const {createError} = require("./createError");

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  // console.log(token);
  if(!token) {
    return next(createError(401, "Bạn cần đăng nhập để vào trang này!"));
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err)
      return next(createError(401, "Mã xác thực truy cập không đúng!"));
    req.user = user;
    // console.log(req.user);
    next();
  })
}

module.exports = {verifyToken};