# models/

โครงสร้างข้อมูล + query ฐานข้อมูล

กฎ:
- ห้ามมี business logic ที่นี่
- ใช้แค่ query ดิบผ่าน `better-sqlite3`
- ทุก model ต้อง return object หรือ array ของ row
- ใช้ parameter `?` ในการ bind ค่าเสมอ ห้ามต่อ string

ตัวอย่าง:
```js
function findById(id) {
  return getDb().prepare('SELECT * FROM users WHERE id = ?').get(id);
}
```