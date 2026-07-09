/**
 * middleware/errorHandler.js
 * จัดการ error ทั้งหมดในแอป — ตัวสุดท้ายในห่วงโซ่ middleware
 */

const logger = require('../utils/logger');
const config = require('../config');

/**
 * 404 Not Found handler
 */
function notFoundHandler(req, res, next) {
  // ถ้าเป็น API request → JSON
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: 'ไม่พบ API endpoint ที่เรียก',
    });
  }

  // ถ้าเป็นหน้าเว็บ → render หน้า 404
  return res.status(404).render('errors/404', {
    title: '404 - ไม่พบหน้าที่ต้องการ',
    message: 'ไม่พบหน้าที่คุณต้องการ',
    description: 'ลิงก์อาจเสียหาย หรือหน้านี้ถูกย้ายไปแล้ว',
  });
}

/**
 * Error handler หลัก — รับ error ที่ส่งมาจาก next(err)
 * ต้องมี 4 parameters เพื่อให้ Express รู้ว่าเป็น error handler
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // log error ทั้งหมดลงไฟล์
  logger.error('เกิดข้อผิดพลาดในแอป', {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  // ถ้า headers ถูกส่งไปแล้ว ให้ส่งต่อให้ Express default handler
  if (res.headersSent) {
    return next(err);
  }

  // กำหนด status code
  const status = err.status || err.statusCode || 500;

  // ถ้าเป็น API request → JSON
  if (req.path.startsWith('/api/')) {
    return res.status(status).json({
      success: false,
      message: err.message || 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
      // แสดง stack เฉพาะตอน development
      ...(config.isDevelopment && { stack: err.stack }),
    });
  }

  // ถ้าเป็นหน้าเว็บ → render หน้า error
  return res.status(status).render('errors/500', {
    title: `${status} - เกิดข้อผิดพลาด`,
    message: err.message || 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
    description: 'กรุณาลองใหม่อีกครั้ง หรือติดต่อผู้ดูแลระบบ',
    // แสดง stack เฉพาะตอน development
    ...(config.isDevelopment && { stack: err.stack }),
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};