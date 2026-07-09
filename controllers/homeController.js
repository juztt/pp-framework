/**
 * controllers/homeController.js
 * จัดการหน้าแรก (/)
 */

exports.index = (req, res) => {
  // ถ้าล็อกอินแล้ว redirect ไป dashboard
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }
  return res.redirect('/login');
};