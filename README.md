# PP Framework

> ฐาน (Foundation) สำหรับ Web App ทุกโปรเจกต์ในอนาคต — ออกแบบให้ Mobile First, Responsive, ใช้ภาษาไทยทั้งหมด

---

## สิ่งที่ได้

- **Tech Stack**: HTML5, CSS3, Vanilla JavaScript (ES6+), Node.js, Express, SQLite (`better-sqlite3`)
- **MVC Architecture**: แยกชัดเจนระหว่าง Model / View / Controller
- **Mobile First + Responsive**: ออกแบบมาให้ใช้งานบนมือถือเป็นหลัก
- **ภาษาไทยทั้งหมด**: ทั้ง UI, เอกสาร, คอมเมนต์ในโค้ด
- **พร้อม Deploy**: Nixpacks → GitHub → Coolify
- **ไม่พึ่ง Frontend Framework**: ไม่มี React / Vue / Angular / Bootstrap / Tailwind / jQuery / TypeScript

---

## โครงสร้างโปรเจกต์

```
pp-framework/
├── app.js                  # Entry point ของ Express
├── package.json
├── .gitignore
├── .env.example
├── README.md
├── AI_RULES.md
│
├── config/                 # ค่าคอนฟิกทั้งหมด
├── controllers/            # รับ request / ส่ง response
├── database/               # เชื่อมต่อ, migrations, seeds
│   ├── migrations/
│   └── seeds/
├── middleware/             # ตัวกลางจัดการ request
├── models/                 # โครงสร้างข้อมูล / query
├── routes/                 # กำหนด URL
├── services/               # business logic
├── utils/                  # ฟังก์ชันช่วยเหลือ
│
├── public/                 # static assets
│   ├── css/
│   ├── js/
│   ├── img/
│   └── icons/
│
├── views/                  # EJS templates
│   ├── layouts/
│   ├── partials/
│   ├── auth/
│   ├── dashboard/
│   └── errors/
│
├── uploads/                # ไฟล์ที่ผู้ใช้อัปโหลด
├── logs/                   # log ไฟล์
└── data/                   # ไฟล์ฐานข้อมูล SQLite
```

---

## เริ่มต้นใช้งาน

### 1. ติดตั้ง

```bash
npm install
```

### 2. ตั้งค่า environment

```bash
# คัดลอกไฟล์ตัวอย่าง
cp .env.example .env

# แก้ไขค่าใน .env ตามต้องการ (เช่น SESSION_SECRET, ADMIN_PASSWORD)
```

### 3. รัน

```bash
# Production
npm start

# Development (auto-reload เมื่อแก้ไขไฟล์)
npm run dev
```

เปิดเบราว์เซอร์ที่ `http://localhost:3000`

> เมื่อรันครั้งแรก ระบบจะสร้างไฟล์ฐานข้อมูล `data/database.sqlite` และ seed ผู้ดูแลระบบอัตโนมัติ

---

## ผู้ดูแลระบบเริ่มต้น

| รายการ | ค่า |
|--------|-----|
| ชื่อผู้ใช้ | `admin` |
| รหัสผ่าน | `admin123` |
| อีเมล | `admin@pp-framework.local` |

> **สำคัญ**: เปลี่ยนรหัสผ่านทันทีหลังเข้าสู่ระบบครั้งแรกเมื่อใช้งานจริง

---

## คำสั่งที่มีให้

| คำสั่ง | คำอธิบาย |
|--------|---------|
| `npm install` | ติดตั้ง dependencies |
| `npm start` | รันเซิร์ฟเวอร์ (production) |
| `npm run dev` | รันเซิร์ฟเวอร์พร้อม auto-reload |
| `npm run migrate` | รัน migrations ทั้งหมดที่ยังไม่ได้รัน |
| `npm run seed` | รัน seeders ทั้งหมดที่ยังไม่ได้รัน |

---

## กฎการเขียนโค้ด

อ่านรายละเอียดทั้งหมดได้ที่ [`AI_RULES.md`](./AI_RULES.md)

สรุปสั้นๆ:

- **ห้ามใช้**: React, Next.js, Vue, Angular, Bootstrap, Tailwind, jQuery, TypeScript
- **ใช้แทน**: EJS + Vanilla CSS + Vanilla JS
- **ภาษาไทย**: ทั้ง UI, คอมเมนต์, ชื่อตัวแปรเชิงธุรกิจ
- **โครงสร้างชัดเจน**: ห้ามยุ่งไฟล์นอกขอบเขตที่รับผิดชอบ
- **Mobile First**: เขียน CSS เริ่มจากมือถือก่อน แล้วค่อยขยาย
- **Extend only**: ไม่ลบ/แก้ไขส่วนที่ทำงานได้ดีอยู่แล้ว เพิ่มใหม่เข้าไป

---

## Deploy บน Coolify

1. Push โค้ดขึ้น **GitHub**
2. ใน **Coolify** สร้าง Application ใหม่:
   - **Build Pack**: `Nixpacks`
   - **Repository**: เลือก repo ที่ push ไว้
   - **Port**: `3000`
3. ตั้งค่า **Environment Variables** ตาม `.env.example` (อย่างน้อย `SESSION_SECRET`, `NODE_ENV=production`)
4. ตั้ง **Persistent Storage** ที่ path `/app/data` (เก็บฐานข้อมูล)
5. Deploy

---

## License

MIT