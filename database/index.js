/**
 * database/index.js
 * เชื่อมต่อฐานข้อมูล SQLite (better-sqlite3)
 * - สร้างไฟล์ฐานข้อมูลอัตโนมัติถ้ายังไม่มี
 * - เปิด WAL mode เพื่อ performance
 * - ตั้ง foreign_keys = ON
 */

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const config = require('../config');
const logger = require('../utils/logger');

let db = null;

/**
 * ตรวจสอบว่าโฟลเดอร์สำหรับเก็บฐานข้อมูลมีอยู่หรือไม่ ถ้าไม่มีให้สร้าง
 */
function ensureDataDir() {
  const dataDir = path.dirname(config.dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    logger.info('สร้างโฟลเดอร์ data ใหม่', { path: dataDir });
  }
}

/**
 * เปิดการเชื่อมต่อฐานข้อมูล
 * เรียกครั้งเดียวตอนเริ่มแอป
 */
function connect() {
  if (db) return db;

  ensureDataDir();

  try {
    db = new Database(config.dbPath);

    // เปิด WAL mode — เร็วขึ้นและ concurrent read ได้
    db.pragma('journal_mode = WAL');

    // เปิด foreign keys
    db.pragma('foreign_keys = ON');

    // ตั้ง busy timeout
    db.pragma('busy_timeout = 5000');

    logger.info('เชื่อมต่อฐานข้อมูลสำเร็จ', { path: config.dbPath });
    return db;
  } catch (err) {
    logger.error('เชื่อมต่อฐานข้อมูลล้มเหลว', { error: err.message });
    throw err;
  }
}

/**
 * ดึง instance ของฐานข้อมูล (ต้อง connect ก่อน)
 */
function getDb() {
  if (!db) {
    return connect();
  }
  return db;
}

/**
 * ปิดการเชื่อมต่อ
 */
function close() {
  if (db) {
    db.close();
    db = null;
    logger.info('ปิดการเชื่อมต่อฐานข้อมูล');
  }
}

/**
 * สร้างตาราง migrations สำหรับเก็บประวัติว่า migration ไหนรันไปแล้ว
 */
function ensureMigrationsTable() {
  const database = getDb();
  database.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      run_at TEXT DEFAULT (datetime('now'))
    )
  `);
}

/**
 * สร้างตาราง seeds สำหรับเก็บประวัติว่า seed ไหนรันไปแล้ว
 */
function ensureSeedsTable() {
  const database = getDb();
  database.exec(`
    CREATE TABLE IF NOT EXISTS _seeds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      run_at TEXT DEFAULT (datetime('now'))
    )
  `);
}

module.exports = {
  connect,
  getDb,
  close,
  ensureMigrationsTable,
  ensureSeedsTable,
};