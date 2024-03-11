require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD_EMAIL,
  },
});

const mailOptions = {
  from: "diptyasoemantry@gmail.com",
  to: "d089606099884@gmail.com",
  subject: "Hello from Nodemailer",
  text: "This is a test email sent using Nodemailer.",
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Error sending email: ", error);
  } else {
    console.log("Email sent: ", info.response);
  }
});
