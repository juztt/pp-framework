/**
 * models/User.js
 * จัดการ query ตาราง users
 * ห้ามมี business logic ที่นี่ — ใช้แค่ query ดิบ
 */

const dbManager = require('../database');

function getDb() {
  return dbManager.getDb();
}

/**
 * หา user จาก id
 */
function findById(id) {
  return getDb()
    .prepare('SELECT * FROM users WHERE id = ?')
    .get(id);
}

/**
 * หา user จาก username
 */
function findByUsername(username) {
  return getDb()
    .prepare('SELECT * FROM users WHERE username = ?')
    .get(username);
}

/**
 * หา user จาก email
 */
function findByEmail(email) {
  if (!email) return null;
  return getDb()
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(email);
}

/**
 * ดึงข้อมูลผู้ใช้ทั้งหมด (ไม่รวม password)
 */
function findAll() {
  return getDb()
    .prepare('SELECT id, username, full_name, email, role, is_active, last_login_at, created_at, updated_at FROM users ORDER BY id ASC')
    .all();
}

/**
 * นับจำนวนผู้ใช้ทั้งหมด
 */
function count() {
  const row = getDb()
    .prepare('SELECT COUNT(*) as total FROM users')
    .get();
  return row.total;
}

/**
 * อัปเดตเวลา login ล่าสุด
 */
function updateLastLogin(id) {
  return getDb()
    .prepare(`UPDATE users SET last_login_at = datetime('now'), updated_at = datetime('now') WHERE id = ?`)
    .run(id);
}

/**
 * สร้าง user ใหม่ (hash password มาก่อนแล้ว)
 */
function create({ username, password, fullName = null, email = null, role = 'user' }) {
  const result = getDb()
    .prepare(`
      INSERT INTO users (username, password, full_name, email, role, is_active)
      VALUES (?, ?, ?, ?, ?, 1)
    `)
    .run(username, password, fullName, email, role);
  return findById(result.lastInsertRowid);
}

module.exports = {
  findById,
  findByUsername,
  findByEmail,
  findAll,
  count,
  updateLastLogin,
  create,
};