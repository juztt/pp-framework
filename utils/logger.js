/**
 * utils/logger.js
 * ระบบ log กลาง — แยกตามระดับ (error, warn, info, debug)
 * เขียนลงไฟล์ในโฟลเดอร์ logs/ และแสดงผลบน console
 *
 * หมายเหตุ: ใช้ path คำนวณเอง (ไม่ require config) เพื่อหลีกเลี่ยง circular dependency
 */

const fs = require('fs');
const path = require('path');

// กำหนด path ของ logs ตรงนี้ (ไม่ต้องพึ่ง config)
const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// ระดับ log เรียงตามความรุนแรง
const LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const currentLevel = LEVELS[LOG_LEVEL] ?? LEVELS.info;

// ตรวจสอบว่าโฟลเดอร์ logs มีอยู่หรือไม่ ถ้าไม่มีให้สร้าง
function ensureLogDir() {
  try {
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }
  } catch (err) {
    // ถ้าสร้างไม่ได้ ให้ใช้ console อย่างเดียว
    console.error('ไม่สามารถสร้างโฟลเดอร์ logs:', err.message);
  }
}

ensureLogDir();

// จัดรูปแบบข้อความ log
function format(level, message, meta) {
  const timestamp = new Date().toISOString();
  let line = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  if (meta !== undefined) {
    if (typeof meta === 'object') {
      try {
        line += ' ' + JSON.stringify(meta);
      } catch (e) {
        line += ' ' + String(meta);
      }
    } else {
      line += ' ' + String(meta);
    }
  }
  return line;
}

// เขียนลงไฟล์
function writeToFile(filename, line) {
  try {
    const filepath = path.join(LOG_DIR, filename);
    fs.appendFileSync(filepath, line + '\n', 'utf8');
  } catch (err) {
    // ถ้าเขียนไฟล์ไม่ได้ ก็ไม่ทำอะไร — log สำคัญที่ console พอ
  }
}

// ฟังก์ชันหลักสำหรับบันทึก log
function log(level, message, meta) {
  if (LEVELS[level] > currentLevel) return;

  const line = format(level, message, meta);
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // แสดงผลบน console
  const consoleMethod =
    level === 'error'
      ? console.error
      : level === 'warn'
      ? console.warn
      : console.log;
  consoleMethod(line);

  // เขียนลงไฟล์ (เฉพาะ error, warn, info — debug ไม่เขียน)
  if (level !== 'debug') {
    writeToFile(`app-${today}.log`, line);
  }

  // error เขียนลงไฟล์แยก
  if (level === 'error') {
    writeToFile(`error-${today}.log`, line);
  }
}

module.exports = {
  error: (message, meta) => log('error', message, meta),
  warn: (message, meta) => log('warn', message, meta),
  info: (message, meta) => log('info', message, meta),
  debug: (message, meta) => log('debug', message, meta),
};