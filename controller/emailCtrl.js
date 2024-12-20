const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendEmail = asyncHandler(async (data, req, res) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "support@ritzglobal.org", // generated ethereal user
      pass: "IMbest01!", // generated ethereal password
    },
    connectionTimeout: 10000, 
    socketTimeout: 10000,
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Ritz Global" <support@ritzglobal.org>', // sender address
    to: data.to, // list of receivers
    subject: data.subject, // Subject line
    text: data.text, // plain text body
    html: data.htm, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
});

module.exports = sendEmail;
