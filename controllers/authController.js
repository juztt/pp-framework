/**
 * controllers/authController.js
 * จัดการ authentication: login, logout
 */

const { authService } = require('../services');
const { validation } = require('../utils');

/**
 * แสดงหน้า login (GET /login)
 */
exports.showLogin = (req, res) => {
  return res.render('auth/login', {
    title: 'เข้าสู่ระบบ',
    error: null,
    username: '',
  });
};

/**
 * รับข้อมูล login (POST /login)
 */
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body || {};

    // ตรวจสอบข้อมูลเบื้องต้น
    const errors = validation.validateLogin({ username, password });
    if (errors.length > 0) {
      return res.status(400).render('auth/login', {
        title: 'เข้าสู่ระบบ',
        error: errors.join(', '),
        username: username || '',
      });
    }

    // ตรวจสอบ username / password
    const user = await authService.authenticate(
      String(username).trim(),
      String(password)
    );

    if (!user) {
      return res.status(401).render('auth/login', {
        title: 'เข้าสู่ระบบ',
        error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
        username: username || '',
      });
    }

    // สร้าง session
    await authService.createSession(req, user);

    // redirect ไป dashboard (หรือกลับไปหน้าที่ตั้งใจจะเข้า)
    const redirectTo = req.session.returnTo || '/dashboard';
    delete req.session.returnTo;
    return res.redirect(redirectTo);
  } catch (err) {
    return next(err);
  }
};

/**
 * ออกจากระบบ (POST /logout หรือ GET /logout)
 */
exports.logout = async (req, res, next) => {
  try {
    await authService.destroySession(req);
    return res.redirect('/login');
  } catch (err) {
    return next(err);
  }
};