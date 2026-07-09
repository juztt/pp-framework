# views/

EJS templates

- `layouts/` — แม่แบบเลย์เอาต์ (ใช้ผ่าน partials)
- `partials/` — ชิ้นส่วนที่ใช้ซ้ำ (header, footer, navbar, flash)
- `auth/` — หน้า authentication (login)
- `dashboard/` — หน้าแดชบอร์ด
- `errors/` — หน้า error (403, 404, 500)

กฎ:
- ใช้ EJS syntax เท่านั้น (`<%= %>`, `<%- %>`, `<% %>`)
- ห้ามมี business logic — รับค่ามาจาก controller เท่านั้น
- ทุกหน้าต้องใช้ `<%- include('../partials/header') %>` และ `<%- include('../partials/footer') %>`
- ภาษาไทยทั้งหมด