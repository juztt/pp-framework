/**
 * database/migrations/001_create_users.js
 * สร้างตาราง users สำหรับเก็บข้อมูลผู้ใช้
 */

module.exports = {
  up(db) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT,
        email TEXT UNIQUE,
        role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('user','admin')),
        is_active INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0,1)),
        last_login_at TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    // index สำหรับค้นหาเร็วขึ้น
    db.exec(`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
  },

  down(db) {
    db.exec(`DROP INDEX IF EXISTS idx_users_email`);
    db.exec(`DROP INDEX IF EXISTS idx_users_username`);
    db.exec(`DROP TABLE IF EXISTS users`);
  },
};