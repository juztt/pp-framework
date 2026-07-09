/**
 * routes/index.js
 * รวม routes ทั้งหมด — เป็นจุดเดียวที่ app.js เรียกใช้
 */

const express = require('express');
const router = express.Router();

const { homeController, authController, dashboardController } = require('../controllers');
const { requireAuth, requireGuest } = require('../middleware/auth');

/**
 * หน้าแรก — ถ้าล็อกอินแล้วไป dashboard, ถ้ายังไม่ล็อกอินไป login
 */
router.get('/', homeController.index);

/**
 * Authentication
 * - GET  /login    : แสดงหน้า login (guest เท่านั้น)
 * - POST /login    : รับข้อมูล login
 * - POST /logout   : ออกจากระบบ
 */
router.get('/login', requireGuest, authController.showLogin);
router.post('/login', requireGuest, authController.login);
router.post('/logout', authController.logout);
// รองรับ GET /logout ด้วย (เผื่อลิงก์ธรรมดา)
router.get('/logout', authController.logout);

/**
 * Dashboard (ต้องล็อกอิน)
 */
router.get('/dashboard', requireAuth, dashboardController.index);

module.exports = router;