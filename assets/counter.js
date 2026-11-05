/* 來訪計數器（GoatCounter，免費、不放廣告、不追蹤個人身分）。
   啟用步驟：
   1. 到 https://www.goatcounter.com/signup 註冊，取一個代號，例如 dizang。
   2. 登入後到 Settings，勾選「Allow adding visitor counts on your website」，存檔。
   3. 把下面 CODE 改成你的代號，例如 const CODE = 'dizang';
   未填代號時不計數、不顯示。GoatCounter 預設不計算 localhost 的本機預覽。 */
(() => {
  'use strict';
  const CODE = 'denghapp';
  if (!/^[a-z0-9-]{2,50}$/.test(CODE)) return;
  const base = `https://${CODE}.goatcounter.com`;

  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  s.dataset.goatcounter = base + '/count';
  document.head.appendChild(s);

  const host = document.querySelector('.footer-bottom') || document.body;
  const el = document.createElement('span');
  el.className = 'visit-counter';
  el.setAttribute('aria-label', (window.I18N ? window.I18N.t('網站來訪人次', 'Site visits', 'Lượt truy cập') : '網站來訪人次'));
  host.appendChild(el);
  fetch(base + '/counter/TOTAL.json')
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(d => { if (d && d.count) el.textContent = (window.I18N ? window.I18N.t('來訪 ' + d.count + ' 人次', d.count + ' visits', d.count + ' lượt truy cập') : '來訪 ' + d.count + ' 人次'); })
    .catch(() => { el.textContent = ""; });
})();
