const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dev@lancaster.com.pe",
    pass: "tQ/SU.pCv3",
  },
});

const fromObject = {
  name: "Lancaster ADMIN",
  address: "dev@lancaster.com.pe",
};

async function sendMail(to, subject, html) {
  const mailData = {
    from: fromObject,
    to: to,
    subject: subject,
    html: html,
  };

  const info = await transporter.sendMail(mailData);
  return info;
}

async function sendMailWithCC(to, subject, html, cc) {
  const mailData = {
    from: fromObject,
    to: to,
    cc: cc,
    subject: subject,
    html: html,
  };

  const info = await transporter.sendMail(mailData);
  return info;
}

exports.sendMail = sendMail;
exports.sendMailWithCC = sendMailWithCC;
