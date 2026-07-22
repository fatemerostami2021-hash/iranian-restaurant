import axios from 'axios';

export const sendTelegramMessage = async (text) => {
  // ✅ متغیرها را اینجا (داخل تابع) می‌خوانیم
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('Telegram credentials missing in .env');
    return;
  }
  
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: text,
      parse_mode: 'HTML'
    });
    console.log('✅ Telegram message sent successfully!');
  } catch (error) {
    console.error('❌ Telegram Error:', error.message);
  }
};