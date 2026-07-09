/**
 * config/index.js
 * รวมค่าคอนฟิกทั้งหมดของแอป
 */

require('dotenv').config();

const path = require('path');

// ค่าเริ่มต้น (ใช้ถ้าไม่ได้ตั้งใน .env)
const defaults = {
  PORT: 3000,
  NODE_ENV: 'development',
  ALLOWED_HOSTS: '',

  DB_PATH: path.join(process.cwd(), 'data', 'database.sqlite'),

  SESSION_SECRET: 'pp-framework-change-this-secret-in-production',
  SESSION_MAX_AGE: 24 * 60 * 60 * 1000, // 1 วัน (มิลลิวินาที)

  ADMIN_USERNAME: 'admin',
  ADMIN_PASSWORD: 'admin123',
  ADMIN_EMAIL: 'admin@pp-framework.local',
  ADMIN_FULLNAME: 'ผู้ดูแลระบบ',

  LOG_LEVEL: 'info',
  LOG_DIR: path.join(process.cwd(), 'logs'),
};

// ดึงค่าจาก env ถ้ามี ไม่งั้นใช้ค่าเริ่มต้น
function envValue(key, fallback) {
  const value = process.env[key];
  if (value === undefined || value === '') return fallback;
  return value;
}

function envInt(key, fallback) {
  const value = process.env[key];
  if (value === undefined || value === '') return fallback;
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

const config = {
  // สภาพแวดล้อม
  nodeEnv: envValue('NODE_ENV', defaults.NODE_ENV),
  isProduction: envValue('NODE_ENV', defaults.NODE_ENV) === 'production',
  isDevelopment: envValue('NODE_ENV', defaults.NODE_ENV) === 'development',

  // เซิร์ฟเวอร์
  port: envInt('PORT', defaults.PORT),
  allowedHosts: envValue('ALLOWED_HOSTS', defaults.ALLOWED_HOSTS)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),

  // ฐานข้อมูล
  dbPath: envValue('DB_PATH', defaults.DB_PATH),

  // Session
  sessionSecret: envValue('SESSION_SECRET', defaults.SESSION_SECRET),
  sessionMaxAge: envInt('SESSION_MAX_AGE', defaults.SESSION_MAX_AGE),

  // ผู้ดูแลเริ่มต้น
  admin: {
    username: envValue('ADMIN_USERNAME', defaults.ADMIN_USERNAME),
    password: envValue('ADMIN_PASSWORD', defaults.ADMIN_PASSWORD),
    email: envValue('ADMIN_EMAIL', defaults.ADMIN_EMAIL),
    fullName: envValue('ADMIN_FULLNAME', defaults.ADMIN_FULLNAME),
  },

  // Logging
  logLevel: envValue('LOG_LEVEL', defaults.LOG_LEVEL),
  logDir: envValue('LOG_DIR', defaults.LOG_DIR),

  // Path ของโปรเจกต์
  paths: {
    root: process.cwd(),
    public: path.join(process.cwd(), 'public'),
    views: path.join(process.cwd(), 'views'),
    uploads: path.join(process.cwd(), 'uploads'),
    logs: envValue('LOG_DIR', defaults.LOG_DIR),
    data: path.join(process.cwd(), 'data'),
  },
};

module.exports = config;