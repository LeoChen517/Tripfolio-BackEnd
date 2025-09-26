const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_ACCOUNT,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 60000, // 60 seconds
  greetingTimeout: 30000, // 30 seconds
  socketTimeout: 60000, // 60 seconds
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  rateLimit: 10, // max 10 messages per second
});

// 延遲驗證連線，避免在應用啟動時立即驗證
setTimeout(() => {
  transporter.verify((error, success) => {
    if (error) {
      console.log('Gmail 連線驗證失敗:', error.message);
      console.log('這不會影響應用啟動，但可能影響郵件發送功能');
    } else {
      console.log('Gmail 連線驗證成功');
    }
  });
}, 5000); // 5秒後驗證

/**
 * 寄送 email
 * @param {string} to - 收件者 email
 * @param {string} subject - 主旨
 * @param {string} html - HTML 內容
 */

async function sendEmail(to, subject, html, retryCount = 0) {
  const maxRetries = 3;
  const retryDelay = 2000; // 2 seconds

  try {
    await transporter.sendMail({
      from: `"Tripfolio 通知中心" <${process.env.EMAIL_ACCOUNT}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent successfully to ${to}`);
    return { success: true, message: '郵件發送成功' };
  } catch (error) {
    console.log(`Email sending failed (attempt ${retryCount + 1}):`, error.message);

    // 如果是連線超時錯誤且還有重試次數，則重試
    if ((error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET') && retryCount < maxRetries) {
      console.log(`Retrying email send in ${retryDelay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, retryDelay * (retryCount + 1)));
      return sendEmail(to, subject, html, retryCount + 1);
    }

    return { success: false, message: '郵件發送失敗', error: error.message };
  }
}

module.exports = { sendEmail };
