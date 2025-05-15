const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: "digitologies2024@gmail.com",
      pass: "wzbo hxiy sdtr wfcc",
    },
});

module.exports = { transporter };