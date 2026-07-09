# middleware/

ฟังก์ชันกลางที่ทำงานก่อน/หลัง controller

- `auth.js` — ตรวจสอบ authentication (requireAuth, requireGuest, requireRole, attachUser)
- `errorHandler.js` — จัดการ 404 และ error 500
- `requestLogger.js` — log ทุก HTTP request

วิธีใช้ใน app.js:
```js
const { requireAuth } = require('./middleware/auth');
app.use(requestLogger);
app.get('/dashboard', requireAuth, dashboardController.index);
```