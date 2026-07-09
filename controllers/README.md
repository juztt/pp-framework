# controllers/

รับ HTTP request → เรียก service → ส่ง response

กฎ:
- ห้ามมี SQL ใน controller
- ห้ามมี business logic ซับซ้อน — ย้ายไป service
- ใช้ async/await + try/catch เสมอ
- ใช้ `utils/response.js` ในการส่ง response

ตัวอย่าง:
```js
const { authService } = require('../services');

exports.login = async (req, res, next) => {
  try {
    const user = await authService.authenticate(req.body.username, req.body.password);
    if (!user) return res.status(401).render('auth/login', { error: 'ไม่ถูกต้อง' });
    return res.redirect('/dashboard');
  } catch (err) {
    return next(err);
  }
};
```