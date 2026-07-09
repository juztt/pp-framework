/**
 * models/index.js
 * รวม models ทั้งหมดไว้ที่เดียวเพื่อให้ import ง่าย
 */

const User = require('./User');

module.exports = {
  User,
};