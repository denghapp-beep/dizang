/* 十齋日行事曆：讀 zhai.js（國曆日期 → [農曆, 是否齋日, ...紀念日]），畫出月曆、今天狀態與近期齋日。 */
(() => {
  'use strict';
  const Z = window.ZHAI || {};
  const I = window.I18N || {lang: 'zh', t: z => z};
  const L = (z, e, v, j) => I.t(z, e, v, j);
  const root = document.getElementById('zhai-app');
  if (!root) return;
  const pad = n => String(n).padStart(2, '0');
  const key = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const FEST = {
    '彌勒菩薩聖誕': ['Maitreya Bodhisattva\'s birthday', 'Vía Bồ Tát Di Lặc', '弥勒菩薩聖誕'],
    '釋迦牟尼佛出家日': ['Śākyamuni Buddha\'s renunciation', 'Ngày Đức Phật Thích Ca xuất gia', '釈迦牟尼仏出家日'],
    '釋迦牟尼佛涅槃日': ['Śākyamuni Buddha\'s parinirvāṇa', 'Ngày Đức Phật Thích Ca nhập Niết-bàn', '釈迦牟尼仏涅槃日（涅槃会）'],
    '觀世音菩薩聖誕': ['Avalokiteśvara\'s birthday', 'Vía Bồ Tát Quán Thế Âm', '観世音菩薩聖誕'],
    '普賢菩薩聖誕': ['Samantabhadra\'s birthday', 'Vía Bồ Tát Phổ Hiền', '普賢菩薩聖誕'],
    '文殊菩薩聖誕': ['Mañjuśrī\'s birthday', 'Vía Bồ Tát Văn Thù', '文殊菩薩聖誕'],
    '釋迦牟尼佛聖誕（浴佛節）': ['Buddha\'s Birthday (Bathing the Buddha)', 'Phật Đản (lễ tắm Phật)', '釈迦牟尼仏聖誕（灌仏会）'],
    '觀世音菩薩成道日': ['Avalokiteśvara\'s enlightenment', 'Ngày Bồ Tát Quán Thế Âm thành đạo', '観世音菩薩成道日'],
    '大勢至菩薩聖誕': ['Mahāsthāmaprāpta\'s birthday', 'Vía Bồ Tát Đại Thế Chí', '勢至菩薩聖誕'],
    '盂蘭盆節（佛歡喜日）': ['Ullambana (Buddha\'s Joyful Day)', 'Lễ Vu Lan (ngày Phật hoan hỷ)', '盂蘭盆（仏歓喜日）'],
    '地藏菩薩聖誕': ['Kṣitigarbha Bodhisattva\'s birthday', 'Vía Bồ Tát Địa Tạng', '地蔵菩薩聖誕'],
    '觀世音菩薩出家日': ['Avalokiteśvara\'s renunciation', 'Ngày Bồ Tát Quán Thế Âm xuất gia', '観世音菩薩出家日'],
    '藥師佛聖誕': ['Medicine Buddha\'s birthday', 'Vía Đức Phật Dược Sư', '薬師如来聖誕'],
    '阿彌陀佛聖誕': ['Amitābha Buddha\'s birthday', 'Vía Đức Phật A Di Đà', '阿弥陀仏聖誕'],
    '釋迦牟尼佛成道日': ['Śākyamuni Buddha\'s enlightenment', 'Ngày Đức Phật Thích Ca thành đạo', '釈迦牟尼仏成道日（成道会）']
  };
  const fest = f => I.lang === 'zh' ? f : (FEST[f] ? FEST[f][I.lang === 'en' ? 0 : I.lang === 'ja' ? 2 : 1] : f);
  const WEEK = L('日一二三四五六', 'SMTWTFS', 'CN,T2,T3,T4,T5,T6,T7', '日月火水木金土');
  const week = I.lang === 'vi' ? WEEK.split(',') : [...WEEK];
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let view = new Date(today.getFullYear(), today.getMonth(), 1);

  function dayInfo(d) { return Z[key(d)]; }
  function nextZhai(from, n) {
    const out = []; const d = new Date(from);
    for (let i = 0; i < 400 && out.length < n; i++, d.setDate(d.getDate() + 1)) { const z = dayInfo(d); if (z && (z[1] || z.length > 2)) out.push([new Date(d), z]); }
    return out;
  }
  const fmt = d => (I.lang === 'zh' || I.lang === 'ja') ? `${d.getMonth() + 1} 月 ${d.getDate()} 日（${(I.lang === 'ja' ? '日月火水木金土' : '日一二三四五六')[d.getDay()]}）`
    : d.toLocaleDateString(I.lang === 'vi' ? 'vi-VN' : 'en-US', {weekday: 'short', month: 'short', day: 'numeric'});
  const lunar = z => I.lang === 'zh' ? '農曆' + z[0] : I.lang === 'ja' ? '旧暦' + z[0] : z[0];

  function renderToday() {
    const z = dayInfo(today), box = root.querySelector('.zhai-today');
    if (!z) { box.innerHTML = `<p>${L('此日期不在行事曆範圍內。', 'This date is outside the calendar range.', 'Ngày này nằm ngoài phạm vi lịch.', 'この日付は暦の範囲外です。')}</p>`; return; }
    const up = nextZhai(new Date(today.getTime() + 864e5), 1)[0];
    const diff = up ? Math.round((up[0] - today) / 864e5) : 0;
    box.innerHTML = `<span class="eyebrow">${L('今 日', 'TODAY', 'HÔM NAY', '今 日')}</span>
      <p class="zt-date">${fmt(today)} · <span lang="zh-Hant">${lunar(z)}</span></p>
      <p class="zt-state${z[1] ? ' is-zhai' : ''}">${z[1] ? L('今天是十齋日', 'Today is one of the Ten Fasting Days', 'Hôm nay là một trong Mười ngày trai', '今日は十斎日です') : L('今天不是齋日', 'Today is not a fasting day', 'Hôm nay không phải ngày trai', '今日は斎日ではありません')}</p>
      ${z.slice(2).map(f => `<p class="zt-fest">${fest(f)}</p>`).join('')}
      ${up ? `<p class="zt-next">${L('下一個', 'Next', 'Kế tiếp', '次の斎日')}：${fmt(up[0])}${up[1][1] ? '' : ''} · ${L(diff + ' 天後', 'in ' + diff + (diff === 1 ? ' day' : ' days'), 'còn ' + diff + ' ngày', diff + ' 日後')}${up[1].length > 2 ? ' · ' + up[1].slice(2).map(fest).join('、') : ''}</p>` : ''}`;
  }
  function renderMonth() {
    const y = view.getFullYear(), m = view.getMonth();
    const title = L(`${y} 年 ${m + 1} 月`, view.toLocaleDateString('en-US', {year: 'numeric', month: 'long'}), `Tháng ${m + 1} năm ${y}`, `${y} 年 ${m + 1} 月`);
    const first = new Date(y, m, 1), days = new Date(y, m + 1, 0).getDate();
    let cells = '';
    for (let i = 0; i < first.getDay(); i++) cells += '<div class="zc empty"></div>';
    for (let d = 1; d <= days; d++) {
      const dt = new Date(y, m, d), z = dayInfo(dt) || ['', 0];
      const cls = ['zc', z[1] ? 'zhai' : '', z.length > 2 ? 'fest' : '', +dt === +today ? 'today' : ''].filter(Boolean).join(' ');
      const lday = z[0].replace(/^.*月/, '');
      const label = z[0].endsWith('初一') || d === 1 ? z[0] : lday;
      cells += `<div class="${cls}" title="${z.slice(2).map(fest).join('、')}"><b>${d}</b><span lang="zh-Hant">${label}</span>${z.length > 2 ? `<i>${fest(z[2])}</i>` : ''}</div>`;
    }
    root.querySelector('.zm-title').textContent = title;
    root.querySelector('.zm-grid').innerHTML = week.map(w => `<div class="zw">${w}</div>`).join('') + cells;
    const list = [];
    for (let d = 1; d <= days; d++) { const dt = new Date(y, m, d), z = dayInfo(dt); if (z && (z[1] || z.length > 2)) list.push(`<li${+dt === +today ? ' class="today"' : ''}><span>${fmt(dt)}</span><span lang="zh-Hant">${lunar(z)}</span>${z.length > 2 ? `<em>${z.slice(2).map(fest).join('、')}</em>` : ''}</li>`); }
    root.querySelector('.zm-list').innerHTML = list.join('');
    root.querySelector('.zm-prev').disabled = !dayInfo(new Date(y, m, 0));
    root.querySelector('.zm-next').disabled = !dayInfo(new Date(y, m + 1, 1));
  }
  root.querySelector('.zm-prev').addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); renderMonth(); });
  root.querySelector('.zm-next').addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); renderMonth(); });
  root.querySelector('.zm-today').addEventListener('click', () => { view = new Date(today.getFullYear(), today.getMonth(), 1); renderMonth(); });
  renderToday(); renderMonth();
})();
