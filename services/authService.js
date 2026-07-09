/**
 * services/authService.js
 * Business logic สำหรับ authentication
 * - ตรวจสอบ username / password
 * - สร้าง / ลบ session
 * - hash password
 */

const bcrypt = require('bcryptjs');
const { User } = require('../models');
const logger = require('../utils/logger');

/**
 * ตรวจสอบ username + password
 * คืน user object ถ้าถูกต้อง, null ถ้าไม่ถูกต้อง
 */
async function authenticate(username, password) {
  if (!username || !password) return null;

  const user = User.findByUsername(username);
  if (!user) {
    logger.warn('เข้าสู่ระบบล้มเหลว: ไม่พบผู้ใช้', { username });
    return null;
  }

  if (!user.is_active) {
    logger.warn('เข้าสู่ระบบล้มเหลว: บัญชีถูกระงับ', { username });
    return null;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    logger.warn('เข้าสู่ระบบล้มเหลว: รหัสผ่านไม่ถูกต้อง', { username });
    return null;
  }

  // อัปเดตเวลา login ล่าสุด
  User.updateLastLogin(user.id);

  logger.info('เข้าสู่ระบบสำเร็จ', { username, userId: user.id });

  // คืนเฉพาะข้อมูลที่จำเป็น (ไม่เอา password)
  return sanitizeUser(user);
}

/**
 * ลบข้อมูลที่ไม่ควรส่งออกไป เช่น password
 */
function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}

/**
 * สร้าง session ให้ผู้ใช้
 */
function createSession(req, user) {
  req.session.user = sanitizeUser(user);
  // บันทึก session ทันที
  return new Promise((resolve, reject) => {
    req.session.save((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

/**
 * ลบ session (logout)
 */
function destroySession(req) {
  return new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

/**
 * Hash password (ใช้ตอนสร้างผู้ใช้ใหม่)
 */
async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

module.exports = {
  authenticate,
  sanitizeUser,
  createSession,
  destroySession,
  hashPassword,
};