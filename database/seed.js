/**
 * database/seed.js
 * รัน seeds ทั้งหมดที่ยังไม่ได้รัน
 * เรียกด้วย: npm run seed
 */

const fs = require('fs');
const path = require('path');
const dbManager = require('./index');
const logger = require('../utils/logger');

async function runSeeds() {
  const db = dbManager.connect();
  dbManager.ensureSeedsTable();

  const seedsDir = path.join(__dirname, 'seeds');
  const files = fs.readdirSync(seedsDir)
    .filter((f) => f.endsWith('.js'))
    .sort();

  // ดึงรายชื่อ seed ที่รันไปแล้ว
  const ranRows = db.prepare('SELECT name FROM _seeds').all();
  const ranSet = new Set(ranRows.map((r) => r.name));

  let applied = 0;
  for (const file of files) {
    if (ranSet.has(file)) {
      logger.debug('ข้าม seed (รันไปแล้ว)', { name: file });
      continue;
    }

    logger.info('กำลังรัน seed', { name: file });
    const seed = require(path.join(seedsDir, file));

    const tx = db.transaction(() => {
      seed.up(db);
      db.prepare('INSERT INTO _seeds (name) VALUES (?)').run(file);
    });
    tx();

    logger.info('รัน seed สำเร็จ', { name: file });
    applied += 1;
  }

  logger.info('รัน seeds เสร็จสิ้น', { total: applied });
  return applied;
}

// ถ้าเรียกตรงๆ (node database/seed.js)
if (require.main === module) {
  try {
    runSeeds();
    process.exit(0);
  } catch (err) {
    logger.error('รัน seed ล้มเหลว', { error: err.message, stack: err.stack });
    process.exit(1);
  }
}

module.exports = runSeeds;