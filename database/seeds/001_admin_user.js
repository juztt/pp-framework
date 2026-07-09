/**
 * database/seeds/001_admin_user.js
 * สร้างผู้ดูแลระบบเริ่มต้น
 * - username: admin
 * - password: admin123 (หรือจาก .env)
 */

const bcrypt = require('bcryptjs');
const config = require('../../config');
const logger = require('../../utils/logger');

module.exports = {
  up(db) {
    // ตรวจสอบว่ามี admin อยู่แล้วหรือไม่
    const existing = db
      .prepare('SELECT id FROM users WHERE username = ?')
      .get(config.admin.username);

    if (existing) {
      logger.info('มีผู้ดูแลระบบอยู่แล้ว ข้าม seed', {
        username: config.admin.username,
      });
      return;
    }

    // hash password
    const hashedPassword = bcrypt.hashSync(config.admin.password, 10);

    db.prepare(`
      INSERT INTO users (username, password, full_name, email, role, is_active)
      VALUES (?, ?, ?, ?, 'admin', 1)
    `).run(
      config.admin.username,
      hashedPassword,
      config.admin.fullName,
      config.admin.email
    );

    logger.info('สร้างผู้ดูแลระบบเริ่มต้นสำเร็จ', {
      username: config.admin.username,
    });
  },

  down(db) {
    db.prepare('DELETE FROM users WHERE username = ?').run(config.admin.username);
  },
};