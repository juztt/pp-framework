/**
 * PP Framework - Main JavaScript
 * โหลดเมื่อ DOM พร้อม
 */

(function () {
  'use strict';

  // รอให้ DOM โหลดเสร็จก่อนเริ่มทำงาน
  document.addEventListener('DOMContentLoaded', function () {
    initNavbar();
  });

  /**
   * จัดการเมนู navbar ในมือถือ (เปิด/ปิด)
   */
  function initNavbar() {
    var toggle = document.querySelector('[data-navbar-toggle]');
    var menu = document.querySelector('[data-navbar-menu]');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // ปิดเมนูเมื่อคลิกลิงก์
    var links = menu.querySelectorAll('a');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        if (menu.classList.contains('is-open')) {
          menu.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }
})();