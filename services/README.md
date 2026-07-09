# services/

Business logic ทั้งหมด

กฎ:
- ห้ามเรียก `req` / `res` ใน service
- รับ input → ประมวลผล → return ผลลัพธ์
- เรียก model เพื่อ query ฐานข้อมูล
- ทำ hash password, ตรวจสอบสิทธิ์, คำนวณ logic ต่างๆ

ตัวอย่าง:
```js
async function authenticate(username, password) {
  const user = User.findByUsername(username);
  if (!user) return null;
  const match = await bcrypt.compare(password, user.password);
  return match ? sanitizeUser(user) : null;
}
```