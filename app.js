/**
 * PP Framework - Entry Point
 *
 * เริ่มต้นแอป Express:
 *  1. โหลด config
 *  2. เชื่อมต่อฐานข้อมูล (สร้างไฟล์อัตโนมัติถ้ายังไม่มี)
 *  3. รัน migrations + seeds
 *  4. ตั้งค่า middleware
 *  5. ตั้งค่า view engine
 *  6. ลงทะเบียน routes
 *  7. เปิด error handler
 *  8. เริ่มฟังพอร์ต
 */

const path = require('path');
const express = require('express');

const config = require('./config');
const logger = require('./utils/logger');
const dbManager = require('./database');
const runMigrations = require('./database/migrate');
const runSeeds = require('./database/seed');

const routes = require('./routes');
const requestLogger = require('./middleware/requestLogger');
const { attachUser } = require('./middleware/auth');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

async function bootstrap() {
  logger.info('กำลังเริ่มต้น PP Framework', {
    env: config.nodeEnv,
    port: config.port,
    dbPath: config.dbPath,
  });

  // 1. เชื่อมต่อฐานข้อมูล
  dbManager.connect();

  // 2. รัน migrations (สร้างตาราง users และตารางอื่นๆ)
  await runMigrations();

  // 3. รัน seeds (สร้าง admin user)
  await runSeeds();

  // 4. สร้าง Express app
  const app = express();

  // ตั้งค่า trust proxy ถ้าใช้หลัง reverse proxy (เช่น Coolify)
  app.set('trust proxy', 1);

  // ตั้งค่า view engine
  app.set('views', config.paths.views);
  app.set('view engine', 'ejs');

  // ---------- Middleware ทั่วไป ----------
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Static files (public/)
  app.use(express.static(config.paths.public, { maxAge: '1d' }));

  // Request logger
  app.use(requestLogger);

  // แนบข้อมูลผู้ใช้ไปกับ res.locals (ใช้ในทุก view)
  app.use(attachUser);

  // ---------- Session ----------
  // เก็บ session ใน memory (พอสำหรับ foundation)
  // ถ้าต้องการ persistent ในอนาคต ใช้ better-sqlite3-session-store
  const session = require('express-session');
  app.use(
    session({
      name: 'pp.sid',
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        httpOnly: true,
        secure: config.isProduction,
        sameSite: 'lax',
        maxAge: config.sessionMaxAge,
      },
    })
  );

  // Security headers
  const helmet = require('helmet');
  app.use(
    helmet({
      contentSecurityPolicy: false, // ปิด CSP ชั่วคราวเพื่อความง่ายในการเริ่มต้น
      crossOriginEmbedderPolicy: false,
    })
  );

  // ---------- Routes ----------
  app.use('/', routes);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      success: true,
      message: 'PP Framework ทำงานปกติ',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      env: config.nodeEnv,
    });
  });

  // ---------- Error Handling ----------
  // 404 ต้องอยู่หลัง routes ทั้งหมด
  app.use(notFoundHandler);

  // error handler ตัวจริงต้องอยู่ท้ายสุด
  app.use(errorHandler);

  // ---------- เริ่มฟังพอร์ต ----------
  const server = app.listen(config.port, () => {
    logger.info(`เซิร์ฟเวอร์ทำงานแล้วที่ http://localhost:${config.port}`, {
      port: config.port,
      env: config.nodeEnv,
    });
  });

  // ---------- Graceful shutdown ----------
  function shutdown(signal) {
    logger.info(`ได้รับสัญญาณ ${signal} กำลังปิดเซิร์ฟเวอร์...`);
    server.close(() => {
      dbManager.close();
      logger.info('ปิดเซิร์ฟเวอร์เรียบร้อย');
      process.exit(0);
    });

    // บังคับปิดหลัง 10 วินาที
    setTimeout(() => {
      logger.error('บังคับปิดเซิร์ฟเวอร์หลัง timeout');
      process.exit(1);
    }, 10000);
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // จับ error ที่ไม่ได้ handle
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Promise Rejection', { reason: String(reason) });
  });
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception', { error: err.message, stack: err.stack });
    process.exit(1);
  });

  return app;
}

// เริ่มแอป
bootstrap().catch((err) => {
  logger.error('ไม่สามารถเริ่มแอปได้', { error: err.message, stack: err.stack });
  process.exit(1);
});