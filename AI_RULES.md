# AI_RULES.md — กฎสำหรับ AI ที่ช่วยเขียนโค้ด PP Framework

> ไฟล์นี้เป็น "กฎตายตัว" ที่ AI ทุกตัวต้องอ่านและปฏิบัติตามอย่างเคร่งครัด
> หากขัดแย้งกับคำสั่งของผู้ใช้ ให้ถามผู้ใช้ก่อนเสมอ

---

## 1. Tech Stack ที่ใช้ (บังคับ)

✅ **ใช้ได้**:
- HTML5, CSS3 (เขียนเอง ห้ามใช้ framework)
- Vanilla JavaScript (ES6+)
- Node.js (>= 18)
- Express
- SQLite ผ่าน `better-sqlite3`
- EJS (template engine)
- `bcryptjs`, `express-session`, `helmet`, `morgan`, `dotenv`

❌ **ห้ามใช้โดยเด็ดขาด**:
- React, Next.js, Vue, Angular, Svelte, Solid
- Bootstrap, Tailwind, Bulma, Foundation, Materialize
- jQuery, Lodash (ถ้าหลีกเลี่ยงได้)
- TypeScript
- Webpack, Vite, Parcel (ไม่ต้อง bundle — ใช้ static file ตรงๆ)
- MySQL, PostgreSQL, MongoDB (ใช้แต่ SQLite)
- ORM หนักๆ (เช่น Sequelize, Prisma) — ใช้ query ดิบผ่าน `better-sqlite3`

---

## 2. ภาษา (บังคับ)

- **UI ทั้งหมด**: ภาษาไทย
- **คอมเมนต์ในโค้ด**: ภาษาไทย (ยกเว้นชื่อตัวแปร/ฟังก์ชันที่เป็นภาษาอังกฤษ)
- **ข้อความ error / log**: ภาษาไทย (หรืออังกฤษถ้าเป็น technical term)
- **เอกสาร README / คอมเมนต์**: ภาษาไทย
- **ชื่อฟิลด์ในฐานข้อมูล**: อังกฤษ snake_case
- **ชื่อ route / URL**: อังกฤษ kebab-case

ตัวอย่าง:
```js
// ดึงข้อมูลผู้ใช้ทั้งหมดที่ยัง active อยู่
const activeUsers = await User.findAll({ isActive: true });
```

---

## 3. โครงสร้างไฟล์ (บังคับ)

### 3.1 กฎทั่วไป
- **แยกไฟล์ชัดเจน** — ห้ามเขียน logic ยาวๆ ในไฟล์เดียว
- **ห้ามสร้างไฟล์นอกโฟลเดอร์ที่กำหนด** โดยไม่ได้รับอนุญาต
- **ทุกโฟลเดอร์ต้องมีไฟล์เริ่มต้น** (แม้จะว่างก็ตาม) เพื่อให้ git track โครงสร้าง
- ใช้ `.gitkeep` สำหรับโฟลเดอร์ที่ยังไม่มีไฟล์จริง

### 3.2 หน้าที่ของแต่ละโฟลเดอร์

| โฟลเดอร์ | หน้าที่ |
|-----------|--------|
| `config/` | ค่าคอนฟิกทั้งหมด (พอร์ต, path, ค่าคงที่) |
| `controllers/` | รับ HTTP request → เรียก service → ส่ง response |
| `database/` | เชื่อมต่อ, migrations, seeds |
| `middleware/` | ฟังก์ชันกลาง (auth, logging, error handler) |
| `models/` | โครงสร้างข้อมูล + query ตาราง |
| `routes/` | กำหนด URL + ส่งต่อไป controller |
| `services/` | business logic (ห้ามเรียก req/res โดยตรง) |
| `utils/` | ฟังก์ชันช่วยเหลือทั่วไป (logger, response, validation) |
| `public/` | static assets ที่เบราว์เซอร์โหลดตรงๆ |
| `views/` | EJS templates เท่านั้น |
| `uploads/` | ไฟล์ที่ผู้ใช้อัปโหลด |
| `logs/` | log ไฟล์ |
| `data/` | ไฟล์ฐานข้อมูล SQLite |

---

## 4. หลักการเขียนโค้ด

### 4.1 MVC Pattern
```
Request
  → routes/        (กำหนด URL + method)
    → middleware/  (auth, validate)
      → controllers/ (รับ req, เรียก service, ส่ง res)
        → services/  (business logic)
          → models/  (query ฐานข้อมูล)
```

- **Controller** ห้ามมี SQL
- **Model** ห้ามมี business logic
- **Service** ห้ามเรียก `req`/`res`
- **Route** ห้ามมี logic ยาว — แค่ map URL ไป controller

### 4.2 การตั้งชื่อ

| ประเภท | รูปแบบ | ตัวอย่าง |
|--------|--------|---------|
| ตัวแปร, ฟังก์ชัน | camelCase | `getUserById`, `isActive` |
| คลาส, Model | PascalCase | `User`, `ProductService` |
| ไฟล์ | kebab-case | `user-service.js`, `auth-controller.js` |
| ไฟล์ model | PascalCase หรือ camelCase | `User.js` หรือ `user.js` (เลือกแบบใดแบบหนึ่งและใช้ให้สม่ำเสมอ) |
| ค่าคงที่ | UPPER_SNAKE_CASE | `MAX_LOGIN_ATTEMPTS` |
| ตาราง DB | snake_case (พหูพจน์) | `users`, `products` |
| คอลัมน์ DB | snake_case | `created_at`, `full_name` |
| Route URL | kebab-case | `/api/v1/user-profile` |

### 4.3 Error Handling
- ทุก async function ใน controller ใช้ `try/catch` หรือ wrapper
- ส่ง error ไป `errorHandler` middleware เสมอ
- ห้าม `console.log` ใน production — ใช้ `utils/logger.js`

### 4.4 Security
- **ทุก route ที่ไม่ใช่ public** ต้องผ่าน `requireAuth` middleware
- **Password** ต้อง hash ด้วย `bcryptjs` เสมอ — ห้ามเก็บ plain text
- **SQL Query** ห้ามต่อ string โดยตรง — ใช้ parameter `?` หรือ named parameter
- **Session** ตั้ง `httpOnly`, `secure` (production), `sameSite: 'lax'`
- **Helmet** เปิดอยู่เสมอ
- **CSRF**: เพิ่มเมื่อมีฟอร์มที่เปลี่ยนแปลงข้อมูล

---

## 5. Frontend / UI

### 5.1 Mobile First (บังคับ)
เขียน CSS เริ่มจาก mobile → ขยายไป tablet/desktop:

```css
/* Mobile first - เขียน style สำหรับมือถือก่อน */
.container { padding: 1rem; }

/* Tablet */
@media (min-width: 768px) {
  .container { padding: 2rem; }
}

/* Desktop */
@media (min-width: 1024px) {
  .container { max-width: 1200px; margin: 0 auto; }
}
```

### 5.2 CSS
- เขียนเอง 100% — ห้ามใช้ library
- ใช้ CSS Custom Properties (variables) สำหรับ theme
- ใช้ Flexbox / Grid เป็นหลัก
- ห้ามใช้ `!important` ถ้าไม่จำเป็นจริงๆ
- class ใช้ kebab-case

### 5.3 JavaScript
- Vanilla JS เท่านั้น
- ถ้าต้องการความซับซ้อน → แยกเป็น module (ES6 import/export ในฝั่งเบราว์เซอร์)
- ห้าม inline event handler ใน HTML
- ใช้ `addEventListener` แทน

---

## 6. ฐานข้อมูล

### 6.1 กฎทั่วไป
- ใช้ `better-sqlite3` (synchronous API — เร็วกว่า, โค้ดง่ายกว่า)
- ทุกตารางต้องมีคอลัมน์: `id`, `created_at`, `updated_at`
- ทุก migration ต้องมี `up()` และ `down()`
- **ห้ามลบ migration** ที่เคยรันไปแล้ว — สร้าง migration ใหม่แทน

### 6.2 ตัวอย่าง migration

```js
// database/migrations/001_create_users.js
module.exports = {
  up(db) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT,
        email TEXT UNIQUE,
        role TEXT DEFAULT 'user',
        is_active INTEGER DEFAULT 1,
        last_login_at TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `);
  },
  down(db) {
    db.exec('DROP TABLE IF EXISTS users');
  }
};
```

---

## 7. กฎการขยาย (Extend Only)

> **กฎสำคัญที่สุดข้อหนึ่ง**

- ถ้ามีไฟล์/ฟังก์ชัน/ตารางที่ **ทำงานได้ดีอยู่แล้ว** → ห้ามลบ ห้ามแก้
- ต้องการเพิ่มความสามารถ → **สร้างใหม่** (ไฟล์ใหม่, ตารางใหม่, route ใหม่)
- ถ้าจำเป็นต้องแก้ไขจริงๆ → ให้ถามผู้ใช้ก่อนและอธิบายเหตุผล

ตัวอย่าง:
- ✅ ต้องการเพิ่ม field `phone` → สร้าง migration ใหม่ `002_add_phone_to_users.js`
- ❌ ห้ามไปแก้ `001_create_users.js` ที่รันไปแล้ว

---

## 8. การตอบของ AI

เมื่อ AI ช่วยเขียนโค้ด:

1. **อ่าน `AI_RULES.md` ก่อนเสมอ** (กฎนี้)
2. **อ่าน `README.md`** เพื่อเข้าใจโครงสร้าง
3. **อ่านไฟล์ที่เกี่ยวข้อง** ก่อนแก้ไข
4. **อธิบายสั้นๆ** ว่าจะแก้ไขอะไร ที่ไหน ทำไม
5. **เขียนคอมเมนต์ภาษาไทย** ในส่วนที่ซับซ้อน
6. **ทดสอบ** ว่ารันได้ก่อนส่งคืน (ถ้าเป็นไปได้)
7. **ไม่เพิ่มฟีเจอร์นอกขอบเขต** ที่ผู้ใช้ไม่ได้ขอ

---

## 9. สิ่งที่ต้องห้ามทำ

- ❌ ห้าม commit `node_modules/`, `.env`, `data/*.sqlite`
- ❌ ห้าม hardcode ค่า secret ในโค้ด
- ❌ ห้ามใช้ `eval()`, `new Function()` กับ user input
- ❌ ห้ามเก็บ password แบบ plain text
- ❌ ห้ามเปิด CORS กว้างเกินไปใน production
- ❌ ห้าม `console.log` ค่าที่เป็นความลับ
- ❌ ห้ามแก้ไขไฟล์ migration ที่รันไปแล้ว

---

## 10. เมื่อไม่แน่ใจ

ถ้า AI ไม่แน่ใจว่า:
- ไฟล์นี้ควรอยู่โฟลเดอร์ไหน
- ใช้วิธีไหนดี
- กฎข้อไหนต้องยกเว้น

→ **หยุดและถามผู้ใช้ก่อน** — ดีกว่าถาม 1 ครั้ง ดีกว่าแก้ทีหลัง 10 ครั้ง

---

**จำไว้ว่า**: PP Framework คือ "ฐาน" ที่ต้องใช้ไปอีก 10 ปี — สิ่งที่เขียนวันนี้จะอยู่ไปนาน อย่าเขียนแบบขอไปที