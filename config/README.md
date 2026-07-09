# config/

เก็บค่าคอนฟิกทั้งหมดของแอป

- `index.js` — โหลดค่าจาก `.env` และ export config object

กฎ:
- ห้ามเขียน logic ในไฟล์ config
- ค่าที่เปลี่ยนได้ตาม environment ต้องมาจาก `.env`
- ค่าคงที่ใส่ในไฟล์ config ได้เลย