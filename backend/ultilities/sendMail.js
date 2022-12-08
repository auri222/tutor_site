const nodemailer = require("nodemailer");

const sendMail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.PORT),
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      },
      tls : { rejectUnauthorized: false }
    })

    await transporter.sendMail({
      from: `"TutorSite" ${process.env.USER}`,
      to: email,
      subject: subject,
      html: text
    });
    console.log("Gửi email thành công!");

  } catch (error) {
    console.log("Gửi email không thành công!");
    console.log(error);
  }
}

const receiveMail = async (sender, email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.PORT),
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      },
      tls : { rejectUnauthorized: false }
    })

    await transporter.sendMail({
      from: `"${sender}" ${email}`,
      to: `${process.env.USER}`,
      subject: subject,
      html: text
    });
    console.log("Gửi email thành công!");

  } catch (error) {
    console.log("Gửi email không thành công!");
    console.log(error);
  }
}

module.exports = {sendMail, receiveMail}