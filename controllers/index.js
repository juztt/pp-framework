/**
 * controllers/index.js
 * รวม controllers ทั้งหมด
 */

const homeController = require('./homeController');
const authController = require('./authController');
const dashboardController = require('./dashboardController');

module.exports = {
  homeController,
  authController,
  dashboardController,
};