/**
 * controllers/dashboardController.js
 * จัดการหน้า dashboard
 */

const { User } = require('../models');

/**
 * แสดงหน้า dashboard หลัก (GET /dashboard)
 */
exports.index = (req, res) => {
  // ดึงสถิติเบื้องต้น
  const stats = {
    totalUsers: User.count(),
    currentUser: req.session.user,
  };

  return res.render('dashboard/index', {
    title: 'แดชบอร์ด',
    stats,
    flash: null,
  });
};