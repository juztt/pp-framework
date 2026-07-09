/**
 * middleware/auth.js
 * ตรวจสอบว่าผู้ใช้ล็อกอินอยู่หรือไม่
 */

const config = require('../config');

/**
 * ตรวจสอบว่าล็อกอินแล้ว ถ้าไม่ใช่ให้ redirect ไปหน้า login
 * ใช้กับ route ที่ต้องการ authentication
 */
function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }

  // ถ้าเป็น API request (รับ JSON) → ส่ง 401 JSON
  if (req.accepts(['html', 'json']) === 'json' || req.path.startsWith('/api/')) {
    return res.status(401).json({
      success: false,
      message: 'กรุณาเข้าสู่ระบบก่อน',
    });
  }

  // ถ้าเป็นหน้าเว็บ → redirect ไป login
  return res.redirect('/login');
}

/**
 * ตรวจสอบว่ายังไม่ได้ล็อกอิน
 * ใช้กับหน้า login/register — ถ้าล็อกอินแล้วให้ redirect ไป dashboard
 */
function requireGuest(req, res, next) {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }
  return next();
}

/**
 * ตรวจสอบ role (ตัวอย่าง)
 * ใช้: requireRole('admin')
 */
function requireRole(...allowedRoles) {
  return function (req, res, next) {
    if (!req.session || !req.session.user) {
      return res.redirect('/login');
    }
    const userRole = req.session.user.role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).render('errors/403', {
        title: '403 - ไม่มีสิทธิ์เข้าถึง',
        message: 'ไม่มีสิทธิ์เข้าถึงหน้านี้',
        description: 'หน้านี้สงวนไว้สำหรับผู้ใช้ที่มีสิทธิ์เท่านั้น',
      });
    }
    return next();
  };
}

/**
 * แนบข้อมูลผู้ใช้ปัจจุบันไปกับ res.locals (ใช้ในทุกหน้าผ่าน middleware)
 */
function attachUser(req, res, next) {
  res.locals.currentUser = (req.session && req.session.user) || null;
  res.locals.appName = 'PP Framework';
  res.locals.currentYear = new Date().getFullYear();
  next();
}

module.exports = {
  requireAuth,
  requireGuest,
  requireRole,
  attachUser,
};