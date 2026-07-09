/**
 * utils/response.js
 * ตัวช่วยส่ง response ให้สอดคล้องกันทั้งโปรเจกต์
 * - success() : ส่ง JSON success
 * - error()   : ส่ง JSON error
 * - redirectBack() : กลับไปหน้าก่อนหน้า
 */

/**
 * ส่ง JSON success
 * @param {object} res - Express response
 * @param {*} data - ข้อมูลที่จะส่งกลับ
 * @param {string} message - ข้อความ (default: 'สำเร็จ')
 * @param {number} status - HTTP status code (default: 200)
 */
function success(res, data = null, message = 'สำเร็จ', status = 200) {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}

/**
 * ส่ง JSON error
 * @param {object} res - Express response
 * @param {string} message - ข้อความ error
 * @param {number} status - HTTP status code (default: 400)
 * @param {*} errors - รายละเอียด error เพิ่มเติม
 */
function error(res, message = 'เกิดข้อผิดพลาด', status = 400, errors = null) {
  return res.status(status).json({
    success: false,
    message,
    errors,
  });
}

/**
 * redirect กลับไปหน้าก่อนหน้า ถ้าไม่มีให้ไปที่ fallback
 */
function redirectBack(req, res, fallback = '/') {
  const referer = req.get('referer') || req.get('referrer');
  if (referer && referer !== req.originalUrl) {
    return res.redirect(referer);
  }
  return res.redirect(fallback);
}

/**
 * แสดงหน้า error พร้อมข้อความ
 */
function renderError(res, status, message, description = '') {
  return res.status(status).render(`errors/${status}`, {
    title: `${status} - ${message}`,
    message,
    description,
  });
}

module.exports = {
  success,
  error,
  redirectBack,
  renderError,
};