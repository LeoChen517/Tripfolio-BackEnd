const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

// Resend API 配置
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_API_URL = 'https://api.resend.com/emails';
const SENDER_EMAIL = process.env.RESEND_SENDER_EMAIL;

// 驗證 Resend 連線
async function verifyResendConnection() {
  try {
    if (!RESEND_API_KEY) {
      console.log('⚠️ Resend API Key 未設定');
      return;
    }
    console.log('✅ Resend API Key 已設定，寄件者: ' + SENDER_EMAIL);
  } catch (error) {
    console.log('❌ Resend 設定失敗:', error.message);
  }
}

verifyResendConnection();

/**
 * 寄送 email
 * @param {string} to - 收件者 email
 * @param {string} subject - 主旨
 * @param {string} html - HTML 內容
 */
async function sendEmail(to, subject, html) {
  try {
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY 未設定');
    }

    const response = await axios.post(
      RESEND_API_URL,
      {
        from: `Tripfolio 通知中心 <${SENDER_EMAIL}>`,
        to: [to],
        subject: subject,
        html: html,
      },
      {
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log(`✅ Email 發送成功至 ${to}`, response.data);
    return null;
  } catch (error) {
    console.log('❌ Email 發送失敗:', error.response?.data || error.message);
    return {
      success: false,
      message: '郵件發送失敗',
      error: error.response?.data || error.message,
    };
  }
}

module.exports = { sendEmail };
