/**
 * database/migrate.js
 * รัน migrations ทั้งหมดที่ยังไม่ได้รัน
 * เรียกด้วย: npm run migrate
 */

const fs = require('fs');
const path = require('path');
const dbManager = require('./index');
const logger = require('../utils/logger');

async function runMigrations() {
  const db = dbManager.connect();
  dbManager.ensureMigrationsTable();

  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.js'))
    .sort(); // เรียงตามชื่อไฟล์

  // ดึงรายชื่อ migration ที่รันไปแล้ว
  const ranRows = db.prepare('SELECT name FROM _migrations').all();
  const ranSet = new Set(ranRows.map((r) => r.name));

  let applied = 0;
  for (const file of files) {
    if (ranSet.has(file)) {
      logger.debug('ข้าม migration (รันไปแล้ว)', { name: file });
      continue;
    }

    logger.info('กำลังรัน migration', { name: file });
    const migration = require(path.join(migrationsDir, file));

    const tx = db.transaction(() => {
      migration.up(db);
      db.prepare('INSERT INTO _migrations (name) VALUES (?)').run(file);
    });
    tx();

    logger.info('รัน migration สำเร็จ', { name: file });
    applied += 1;
  }

  logger.info('รัน migrations เสร็จสิ้น', { total: applied });
  return applied;
}

// ถ้าเรียกตรงๆ (node database/migrate.js)
if (require.main === module) {
  try {
    runMigrations();
    process.exit(0);
  } catch (err) {
    logger.error('รัน migration ล้มเหลว', { error: err.message, stack: err.stack });
    process.exit(1);
  }
}

module.exports = runMigrations;