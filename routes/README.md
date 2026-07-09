# routes/

กำหนด URL + method → ส่งต่อไป controller

กฎ:
- ห้ามมี logic ยาวในไฟล์ route — แค่ map URL ไป controller
- ใช้ middleware ที่จำเป็น (requireAuth, validate)
- รวม routes ทั้งหมดไว้ที่ `routes/index.js`

ตัวอย่าง:
```js
router.get('/login', requireGuest, authController.showLogin);
router.post('/login', requireGuest, authController.login);
```