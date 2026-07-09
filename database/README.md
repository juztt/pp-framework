# database/

เชื่อมต่อ, migrations, seeds

- `index.js` — เปิด/ปิดการเชื่อมต่อฐานข้อมูล
- `migrate.js` — รัน migrations
- `seed.js` — รัน seeds
- `migrations/` — ไฟล์ migration แต่ละตาราง (เรียงตามลำดับตัวเลข)
- `seeds/` — ไฟล์ seed ข้อมูลเริ่มต้น (เรียงตามลำดับตัวเลข)

## Migration

```js
// database/migrations/001_create_users.js
module.exports = {
  up(db) { db.exec(`CREATE TABLE ...`) },
  down(db) { db.exec(`DROP TABLE ...`) },
};
```

## Seed

```js
// database/seeds/001_admin_user.js
module.exports = {
  up(db) { db.prepare(`INSERT INTO ...`).run(...) },
  down(db) { db.prepare(`DELETE FROM ...`).run(...) },
};
```

## คำสั่ง

```bash
npm run migrate   # รัน migration ใหม่
npm run seed      # รัน seed ใหม่
```