/* eslint-disable */
const nodemailer = require("nodemailer");
require("dotenv").config();

const sendMail = (email, mailBody) =>
  new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "aopoku255@gmail.com",
        pass: "jugoznzsmfbdzkza",
      },
    });

    // write a function to send the mail

    const mailOptions = {
      from: "DOUBLES <aopoku255@gmail.com>",
      to: email,
      subject: "DOUBLES",
      html: mailBody,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        reject(error);
      }
      resolve("ok");
      console.log("Email sent successfully");
    });
  });

module.exports = sendMail;
