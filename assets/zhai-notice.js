/* 首頁／文章頁：若今天是十齋日或佛菩薩紀念日，在頁首下方顯示一行提醒。資料延後載入，不影響開頁速度。 */
(() => {
  'use strict';
  const me = document.currentScript, src = me && me.dataset.src;
  if (!src) return;
  const run = () => {
    const Z = window.ZHAI, I = window.I18N || {lang: 'zh', t: z => z};
    if (!Z) return;
    const d = new Date(), p = n => String(n).padStart(2, '0');
    const z = Z[`${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`];
    if (!z || !(z[1] || z.length > 2)) return;
    const head = document.querySelector('.site-header'); if (!head) return;
    const fest = z.slice(2).join('、');
    const bar = document.createElement('a');
    bar.className = 'zhai-bar'; bar.href = 'zhai.html';
    bar.innerHTML = I.t(
      `今日農曆${z[0]}${z[1] ? '，為十齋日' : ''}${fest ? '・' + fest : ''}，宜靜心讀誦 <span>十齋日行事曆 →</span>`,
      `Today is lunar <b lang="zh-Hant">${z[0]}</b>${z[1] ? ', one of the Ten Fasting Days' : ''} — a good day for quiet recitation <span>Calendar →</span>`,
      `Hôm nay là ngày âm lịch <b lang="zh-Hant">${z[0]}</b>${z[1] ? ', một trong Mười ngày trai' : ''} — nên tĩnh tâm tụng đọc <span>Xem lịch →</span>`);
    head.after(bar);
  };
  const go = () => { const s = document.createElement('script'); s.src = src; s.onload = run; document.body.appendChild(s); };
  document.readyState === 'complete' ? go() : window.addEventListener('load', go);
})();
