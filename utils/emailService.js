const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "ajeetrajbhar2504@gmail.com",
      pass: process.env.nodemailer_key,
    },
  });

function sendEmail(mailOption, callback) {
    transporter.sendMail(mailOption, function (err, info) {
        if (err) {
            callback(err); // Call the callback with the error
        } else {
            callback(null, info); // Call the callback with null error and info
        }
    });
}


module.exports = { sendEmail };
