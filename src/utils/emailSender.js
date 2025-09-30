const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ACCOUNT,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log('Gmail 連線失敗:', error);
  } else {
    console.log('Gmail 連線成功');
  }
});

/**
 * 寄送 email
 * @param {string} to - 收件者 email
 * @param {string} subject - 主旨
 * @param {string} html - HTML 內容
 */

async function sendEmail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: `"Tripfolio 通知中心" <${process.env.EMAIL_ACCOUNT}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.log('Email sending failed:', error);
    return { success: false, message: '郵件發送失敗', error };
  }
  return null;
}

module.exports = { sendEmail };
