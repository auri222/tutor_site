const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 5000;
const connectDB = require('./config/db');
const {createOTP} = require('./ultilities/createOTP');
const {sendMail} = require('./ultilities/sendMail');
connectDB();

const app = express();
app.use(cookieParser());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: 'http://localhost:3000', credentials:true }));


app.use('/api/auth', require('./routes/auth'))
app.use('/api/location', require('./routes/locations'))
app.use('/api/subject', require('./routes/subjects'))
app.use('/api/class', require('./routes/classes'))
app.use('/api/schedule', require('./routes/schedule'))
app.use('/api/tutors', require('./routes/tutors')) // *
app.use('/api/account', require('./routes/account')) // *
app.use('/api/tutor_achievement', require('./routes/tutor_achievements')) // *
app.use('/api/course', require('./routes/course')) // *
app.use('/api/notification', require('./routes/notifications')) // *
app.use('/api/comment', require('./routes/comment')) // *
app.use('/api/contact', require('./routes/contact'));

app.use((err, req, res, next) => {
  const errStatus = err.status || 500;
  const errMessage = err.message || "Có sự cố! Thử lại sau!";
  return res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMessage,
    stack: err.stack,
  });
});

app.use((req, res, next) => {
  res.header('Content-Type', 'application/json;charset=UTF-8')
  res.header('Access-Control-Allow-Credentials', true)
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.listen(port, () => console.log(`Server started on port ${port}`))

app.get("/otp", (req, res, next) => {
  const otp = createOTP().toString();
  res.send(otp);
})

// app.get("/sendmail" , async (req,res,next) => {
//   try {
//     const htmlText = "<p>Test send email from localhost</p>";
//     const subject = "Test send mail";
//     const email = "bleach2221998@gmail.com";
//     await sendMail(email, subject, htmlText);
//     res.status(200).send("Email sent!");
//   } catch (error) {
//     next(error);
//   }
// })
