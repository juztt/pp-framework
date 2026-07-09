/**
 * utils/validation.js
 * ตัวช่วยตรวจสอบข้อมูลเบื้องต้น
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,32}$/;
const THAI_REGEX = /^[ก-๙\s]+$/;

/**
 * ตรวจสอบอีเมล
 */
function isEmail(value) {
  return typeof value === 'string' && EMAIL_REGEX.test(value.trim());
}

/**
 * ตรวจสอบชื่อผู้ใช้ (อนุญาต a-z, 0-9, underscore, ความยาว 3-32)
 */
function isUsername(value) {
  return typeof value === 'string' && USERNAME_REGEX.test(value);
}

/**
 * ตรวจสอบรหัสผ่าน (ความยาวขั้นต่ำ 6 ตัว)
 */
function isPassword(value, minLength = 6) {
  return typeof value === 'string' && value.length >= minLength;
}

/**
 * ตรวจสอบว่าค่าว่างหรือไม่ (รวม string ว่าง, null, undefined)
 */
function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return true;
  return false;
}

/**
 * ตรวจสอบข้อมูลที่ส่งมาจากฟอร์ม login
 * คืน array ของข้อความ error (ถ้าว่าง = ผ่าน)
 */
function validateLogin(data) {
  const errors = [];
  if (isEmpty(data.username)) {
    errors.push('กรุณากรอกชื่อผู้ใช้');
  } else if (!isUsername(data.username)) {
    errors.push('ชื่อผู้ใช้ต้องเป็นตัวอักษร a-z, A-Z, 0-9 หรือ _ ความยาว 3-32 ตัว');
  }
  if (isEmpty(data.password)) {
    errors.push('กรุณากรอกรหัสผ่าน');
  } else if (!isPassword(data.password)) {
    errors.push('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
  }
  return errors;
}

module.exports = {
  isEmail,
  isUsername,
  isPassword,
  isEmpty,
  validateLogin,
};