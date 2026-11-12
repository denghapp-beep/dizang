/* 藏經閣：分頁「佛教漫畫」「經典」。經文為中文原典（CBETA），外語只連結海外既有譯本，不自行翻譯。 */
(() => {
  'use strict';
  const I = window.I18N || {t: z => z, lang: 'zh'};
  const L = (z, e, v, j, k) => I.t(z, e, v, j, k);
  const root = document.getElementById('zangjing-app'); if (!root) return;
  const S = window.SUTRAS || {};
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const SHORT = {dizang: '地藏經', pumen: '普門品', jingang: '金剛經', amituo: '阿彌陀經', wuliangshou: '無量壽經'};
  const ORDER = ['dizang', 'pumen', 'jingang', 'amituo', 'wuliangshou'];
  const TABS = [...Object.entries(S).sort((a, b) => (ORDER.indexOf(a[0]) + 99) % 99 - (ORDER.indexOf(b[0]) + 99) % 99).map(([id, s]) => ({id, name: SHORT[id] || s.title, sutra: s})),
    {id: 'comics', name: L('佛教漫畫', 'Buddhist Comics', 'Truyện tranh Phật giáo', '仏教マンガ', '불교 만화')}];
  const LN = {en: 'English', vi: 'Tiếng Việt', ja: '日本語', ko: '한국어'};
  root.innerHTML = `
    <div class="section-top"><div><span class="eyebrow">${L('藏 經 閣 · LIBRARY', 'SUTRA LIBRARY', 'TÀNG KINH CÁC', '蔵 経 閣', '장 경 각')}</span>
      <h2>${L('藏經閣', 'Sutra Library', 'Tàng Kinh Các', '蔵経閣', '장경각')}</h2></div>
      <p>${L('收錄經典原文與佛教漫畫，供大家隨喜閱讀。', 'Sutra texts and Buddhist comics, offered for everyone to read.', 'Kinh văn và truyện tranh Phật giáo, xin mời mọi người tùy hỷ đọc.', '経典の原文と仏教マンガを収めています。どうぞご自由にお読みください。', '경전 원문과 불교 만화를 모았습니다. 기쁜 마음으로 읽어 주세요.')}</p></div>
    <div class="zj-tabs" role="tablist">${TABS.map(t => `<button type="button" role="tab" data-tab="${t.id}">${esc(t.name)}</button>`).join('')}</div>
    <div class="zj-panel"></div>`;
  const panel = root.querySelector('.zj-panel');
  function comics() {
    return `<article class="zj-card"><h3>${L('林鉅晴佛教漫畫專頁', 'Lin Juqing Buddhist Comics', 'Truyện tranh Phật giáo của Lâm Cự Tình', '林鉅晴 仏教マンガ', '임거청 불교 만화')}</h3>
      <p>${L('馬來西亞漫畫家林鉅晴的佛教漫畫，包括《了凡四訓》《阿彌陀佛傳》《藥師經》等經典與故事改編，可線上閱讀，也提供列印檔下載。', 'Buddhist comics by Malaysian artist Lin Juqing — adaptations such as Liaofan’s Four Lessons, the life of Amitabha Buddha and the Medicine Buddha Sutra — readable online, with print files to download.', 'Truyện tranh Phật giáo của họa sĩ Malaysia Lâm Cự Tình, chuyển thể từ các kinh điển và câu chuyện như Liễu Phàm Tứ Huấn, Truyện Phật A Di Đà, Kinh Dược Sư; có thể đọc trực tuyến và tải bản in.', 'マレーシアの漫画家・林鉅晴による仏教マンガ。『了凡四訓』『阿弥陀仏伝』『薬師経』などの経典や物語を描いた作品をオンラインで読め、印刷用データも公開されています。', '말레이시아 만화가 임거청의 불교 만화입니다. 『요범사훈』『아미타불전』『약사경』 등 경전과 이야기를 만화로 옮긴 작품을 온라인으로 읽고 인쇄용 파일도 받을 수 있습니다.')}</p>
      <a class="zj-go" href="https://sites.google.com/view/budduhacomics/%E9%A6%96%E9%A0%81" target="_blank" rel="noopener">${L('前往漫畫專頁', 'Open the comics site', 'Đến trang truyện tranh', 'マンガのページへ', '만화 페이지로')} ↗</a>
      <p class="small">${L('外部網站，內容與著作權屬原作者所有。', 'External site; content and copyright belong to the original author.', 'Trang bên ngoài; nội dung và bản quyền thuộc tác giả.', '外部サイトです。内容と著作権は原作者に帰属します。', '외부 사이트이며 내용과 저작권은 원작자에게 있습니다.')}</p></article>`;
  }
  function sutra(s) {
    const tr = s.translations.filter(t => I.lang === 'zh' || I.lang === 'sc' || t.lang === I.lang || true);
    const own = s.translations.filter(t => t.lang === I.lang);
    const order = own.length ? [...own, ...s.translations.filter(t => t.lang !== I.lang)] : tr;
    return `<article class="zj-sutra">
      <header class="zj-head"><h3>${esc(s.title)}</h3><p class="zj-by">${esc(s.translator)}</p></header>
      <section class="zj-trans"><h4>${L('海外譯本', 'Translations', 'Bản dịch', '各国語の訳', '번역본')}</h4>
        <p class="small">${L('經文不自行翻譯，以下為海外道場與譯經團體已出版的譯本，點選前往原網站閱讀。', 'We do not translate the sutra ourselves. These are translations published by monasteries and translation groups; each link opens the original site.', 'Chúng tôi không tự dịch kinh. Dưới đây là các bản dịch đã được các đạo tràng và nhóm dịch kinh công bố; bấm để đọc tại trang gốc.', '経典は当サイトで翻訳していません。各地の寺院や翻訳団体が公開している訳を、元のサイトでお読みください。', '경전은 자체 번역하지 않습니다. 사찰과 역경 단체가 펴낸 번역본이며, 원래 사이트에서 읽으실 수 있습니다.')}</p>
        <ul>${order.map(t => `<li><span class="zj-lang">${LN[t.lang] || t.lang}</span><a href="${t.url}" target="_blank" rel="noopener">${esc(t.name)} ↗</a><span class="zj-tby">${esc(t.by)}</span></li>`).join('')}</ul></section>
      <div class="zj-reader"></div>
      <p class="small zj-src">${L('經文來源：', 'Source: ', 'Nguồn: ', '出典：', '출처: ')}<a href="${s.sourceUrl}" target="_blank" rel="noopener">${esc(s.source)}</a></p></article>`;
  }

  /* 經文閱讀器：分頁或捲動、記住讀到哪頁、書籤、字級。全部存在讀者自己的瀏覽器。 */
  function reader(id, s, box) {
    const KEY = 'ksitigarbha-sutra-' + id;
    let st = {page: 0, mode: 'page', size: (innerWidth >= 700 ? 30 : 26), bg: 'parch', marks: [], zy: false};
    try { st = Object.assign(st, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch {}
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch {} };
    // 前後儀軌（依法鼓山課誦本）＋經文合成一份目錄；經文每品從新頁開始，儀軌短段落可併頁
    const LT = (window.SUTRA_LITURGY || {})[id] || {pre: [], post: []};
    const C = [...LT.pre, ...s.chapters.map((c, oi) => Object.assign({oi}, c)), ...LT.post];
    const OFF = LT.pre.length;
    // 分頁：橫排每頁約 700 字；經書模式（直排）每品一頁、儀軌合為一頁，頁內再依螢幕分屏，畫面才不會留白
    let pages = [], N = 0;
    function buildPages(V) { const out = []; let cur = null;
      const newPage = () => { cur = {items: [], len: 0}; out.push(cur); };
      C.forEach((c, ci) => {
        const prevLit = C[ci - 1] && C[ci - 1].lit;
        if (!cur || (V ? !(c.lit && prevLit) : (c.lit && prevLit ? cur.len >= 450 : (c.lit !== !!prevLit) || cur.len >= 380))) newPage();
        const juan = c.lit ? -1 : s.juan.findIndex(j => j[0] === c.oi);
        cur.items.push({ci, head: true, juan: juan >= 0 ? ((s.juanLabel || ['卷上', '卷下'])[juan] || '') : ''});
        c.paras.forEach((p, pi) => { if (!V && cur.len && cur.items[cur.items.length - 1].pi !== undefined && cur.len + p.length > 700) newPage();
          cur.items.push({ci, pi, p}); cur.len += p.length; });
      });
      out.forEach(pg => { pg.ci = pg.items[0].ci; }); return out; }
    pages = buildPages(st.dir === 'v'); N = pages.length;
    // 舊版沒有前置儀軌，頁碼往後移
    if (st.v !== 2) { const add = pages.findIndex(pg => pg.ci === OFF); if (st.page > 0) st.page += add; st.marks = st.marks.map(m => m + add); st.v = 2; }
    if (st.v === 2) { st.v = 3; }
    if (st.v === 3) { if (st.size < 24) st.size = 24; st.v = 4; }
    if (st.v === 4) { st.size = Math.max(st.size, (innerWidth >= 700 ? 30 : 26)); st.v = 5; }
    st.mode = 'page'; if (!st.bg) st.bg = 'parch';
    st.page = Math.min(Math.max(0, st.page | 0), N - 1);
    const T = (z, e, v, j, k) => L(z, e, v, j, k);
    box.innerHTML = `
      <div class="zr-bar">
        <select class="zr-ch" aria-label="${T('跳到品', 'Go to chapter', 'Đến phẩm', '品へ移動', '품으로 이동')}">${C.map((c, i) => `<option value="${i}">${c.lit ? '· ' : ''}${esc(c.title)}</option>`).join('')}</select>
        <div class="zr-tools">
          <button type="button" class="zr-mode"></button>
          <button type="button" class="zr-zy" aria-pressed="false">注音</button>
          <button type="button" class="zr-dir" aria-pressed="false">📖 經書模式<span>（直排全螢幕）</span></button>
          <button type="button" class="zr-exit">✕ 返回網頁</button>
          <select class="zr-bg" aria-label="背景顏色"><option value="site">背景：網站原色</option><option value="parch">背景：羊皮紙</option><option value="rice">背景：米白</option><option value="white">背景：白紙</option><option value="night">背景：夜間</option></select>
          <select class="zr-fg" aria-label="字的亮度"><option value="0">字：標準</option><option value="1">字：加亮</option><option value="2">字：最亮</option></select>
          <button type="button" class="zr-sm" aria-label="${T('縮小字級', 'Smaller text', 'Chữ nhỏ hơn', '文字を小さく', '글자 작게')}">字－</button>
          <button type="button" class="zr-lg" aria-label="${T('放大字級', 'Larger text', 'Chữ lớn hơn', '文字を大きく', '글자 크게')}">字＋</button>
          <button type="button" class="zr-mark" aria-pressed="false"></button>
          <button type="button" class="zr-list">${T('書籤', 'Bookmarks', 'Dấu trang', 'しおり', '책갈피')}</button>
        </div>
      </div>
      <div class="zr-resume" hidden></div>
      <div class="zr-marks" hidden></div>
      <div class="zr-page" lang="zh-Hant" tabindex="0"></div>
      <div class="zb-head" aria-hidden="true"><span class="zb-title"></span><span class="zb-no"></span></div>
      <div class="zb-orn zb-t" aria-hidden="true"></div><div class="zb-orn zb-b" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M24 37C11 36 5 29 5 19c10 0 16 6 19 18Zm0 0c13-1 19-8 19-18-10 0-16 6-19 18Zm0-1C14 27 14 16 24 6c10 10 10 21 0 30Z"/></svg></div>
      <p class="zb-hint">輕點畫面：顯示／隱藏工具列　·　左右滑動翻頁</p>
      <div class="zr-nav">
        <button type="button" class="zr-prev">← ${T('上一頁', 'Previous', 'Trang trước', '前へ', '이전')}</button>
        <span class="zr-num"></span>
        <button type="button" class="zr-next">${T('下一頁', 'Next', 'Trang sau', '次へ', '다음')} →</button>
      </div>
      <input class="zr-range" type="range" min="1" max="${N}" aria-label="${T('頁碼', 'Page', 'Trang', 'ページ', '쪽')}">`;
    const $ = q => box.querySelector(q), page = $('.zr-page');
    const pageHTML = pg => (pg.items[0].head ? '' : `<p class="zr-runhead">${esc(C[pg.ci].title)}</p>`) + pg.items.map(x => {
      const c = C[x.ci], cls = c.lit ? ' class="lit"' : '';
      if (x.head) return `${x.juan ? `<p class="zj-juan" data-t="${esc(s.title)}">${x.juan}</p>` : ''}<h4${cls}>${ruby(c.title, zyOf(x.ci, -1))}</h4>`;
      return `<p${cls}>${ruby(x.p, zyOf(x.ci, x.pi))}</p>`; }).join('');
    function zyOf(ci, pi) { if (!st.zy) return null; const c = C[ci];
      if (c.lit) return (pi < 0 ? c.zt : c.zp[pi]).split(' ');
      const Z = window.SUTRA_ZHUYIN && window.SUTRA_ZHUYIN[id]; if (!Z) return null; return (pi < 0 ? Z[c.oi].t : Z[c.oi].p[pi]).split(' '); }
    // 注音直排在字的右側（同法鼓山課誦本）；聲調標在注音右側，輕聲點在最上方
    // 注音模式：每個字（含標點）都放進同尺寸的格子，字與注音位置一致，不會歪斜
    function zc(c, z) { const t = (z.match(/[ˊˇˋ˙]/) || [''])[0], b = z.replace(/[ˊˇˋ˙]/g, '');
      return `<span class="zw-c"><span class="zw-h">${esc(c)}</span><span class="zw-z n${b.length}">${t === '˙' ? '<em>˙</em>' : ''}${[...b].map(x => `<b>${x}</b>`).join('')}${t && t !== '˙' ? `<i>${t}</i>` : ''}</span></span>`; }
    const PUNC = /[，。、；：？！「」『』（）《》〈〉—…·．　]/;
    function ruby(text, z) { const cs = Array.from(text); if (!z) return st.dir === 'v' ? cs.map(c => c === '\n' ? '<br>' : `<span class="k${/[，。、；：？！]/.test(c) ? ' pc' : /[（）「」『』《》〈〉—…〔〕【】]/.test(c) ? ' br' : ''}">${esc(c)}</span>`).join('') : esc(text).replace(/\n/g, '<br>');
      const cell = (c, i) => (z[i] && z[i] !== '_') ? zc(c, z[i]) : `<span class="zw-c zw-p${/[，。、；：？！]/.test(c) ? ' pc' : /[（）「」『』《》〈〉—…〔〕【】]/.test(c) ? ' br' : ''}"><span class="zw-h">${esc(c)}</span></span>`;
      // 偈頌、真言以全形空格分句：每句不拆行
      let out = '', seg = '', n = 0;
      const flush = () => { out += n && n <= 14 ? `<span class="zw-g">${seg}</span>` : seg; seg = ''; n = 0; };
      cs.forEach((c, i) => { if (c === '\n') { flush(); out += '<br>'; } else if (c === '　') { flush(); out += '<span class="zw-sp"></span>'; } else { seg += cell(c, i); n++; } });
      flush(); return out; }
    // 量測實際字形位置：不同電腦／字型的漢字與注音在字框內高低不同，用 canvas 算出偏移後補正，讓字與注音中心對齊
    function calib() { try {
      const cv = calib.cv || (calib.cv = document.createElement('canvas').getContext('2d'));
      const off = (el, ch) => { if (!el) return 0; const cs = getComputedStyle(el), fs = parseFloat(cs.fontSize);
        cv.font = `${cs.fontWeight} ${fs}px ${cs.fontFamily}`; const m = cv.measureText(ch);
        const fa = m.fontBoundingBoxAscent, fd = m.fontBoundingBoxDescent; if (!(fa + fd)) return 0;
        const lh = parseFloat(cs.lineHeight) || fs, base = (lh - (fa + fd)) / 2 + fa;
        const mid = base - (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2; return (lh / 2 - mid) / fs; };
      const h = page.querySelector('.zw-c:not(.zw-p) .zw-h'), z = page.querySelector('.zw-z b');
      box.style.setProperty('--zh-dy', off(h, '國').toFixed(3) + 'em'); box.style.setProperty('--zz-dy', off(z, 'ㄨ').toFixed(3) + 'em');
    } catch {} }
    if (document.fonts) document.fonts.addEventListener('loadingdone', () => calib());
    let toEnd = false;
    const cnum = n => { const d = '〇一二三四五六七八九'; return String(n).split('').map(x => d[x]).join(''); };
    const fs = on => { try { const el = document.documentElement; if (on) { (el.requestFullscreen || el.webkitRequestFullscreen || (() => {})).call(el); }
      else if (document.fullscreenElement || document.webkitFullscreenElement) (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch {} };
    // 直排全螢幕：寬度取整數行距，每次翻一屏剛好不切字
    function fitV() { const pitch = Math.round(st.size * (st.zy ? 1.9 : 2.05)); page.style.setProperty('--pitch', pitch + 'px');
      page.style.width = ''; const avail = box.clientWidth - 92; page.style.width = Math.max(pitch, Math.floor(avail / pitch) * pitch) + 'px'; }
    let offs = [0], ends = [], scr = 0;
    // 量出每一行的實際位置，算出每一屏從哪一行開始；畫面左邊放不完整的行用裁切藏起來，不會出現被切掉的字
    function measure() { page.style.clipPath = ''; page.scrollLeft = 0; let sp = page.querySelector('.zr-tail'); if (!sp) { sp = document.createElement('div'); sp.className = 'zr-tail'; sp.setAttribute('aria-hidden', 'true'); page.appendChild(sp); } sp.style.width = page.clientWidth + 'px'; const R = page.getBoundingClientRect(), W = page.clientWidth, raw = [];
      // 以每個字的格子位置分行（同一行的字右緣對齊），不受注音、聲調小框影響
      const tol = 3, cols = [];
      page.querySelectorAll('.zw-c,.k').forEach(el => { const q = el.getBoundingClientRect(); if (q.width < 1) return;
        const a = R.right - q.right, b = R.right - q.left, h = !!el.closest('h4,.zj-juan'); let c = cols.find(x => Math.abs(x[0] - a) < tol);
        if (c) { c[1] = Math.max(c[1], b); c[2] = c[2] && h; } else cols.push([a, b, h]); });
      cols.sort((x, y) => x[0] - y[0]); const ln = [];
      for (const c of cols) { const l = ln[ln.length - 1]; if (l && c[0] < l[1] - 1) { l[1] = Math.max(l[1], c[1]); l[2] = l[2] && c[2]; } else ln.push(c); }
      // 分屏；品名（標題行）不留在一屏最後，跟著下一屏的內文
      offs = [0]; ends = []; let st0 = 0, e = 0, k0 = 0;
      for (let k = 0; k < ln.length; k++) { const l = ln[k]; if (l[1] - st0 > W - 1) {
          let j = k; while (j - 1 > k0 && ln[j - 1][2]) j--;
          ends.push(j > k0 ? ln[j - 1][1] : e); st0 = ln[j][0]; offs.push(st0); k0 = j; k = j; e = ln[j][1]; continue; }
        e = l[1]; }
      ends.push(e); }
    function showScr() { const W = page.clientWidth, o = offs[scr] || 0, e = ends[scr] || W;
      page.scrollLeft = -o; const real = Math.abs(page.scrollLeft); const nx = offs[scr + 1]; page.style.clipPath = `inset(0 0 0 ${Math.max(0, W - ((nx !== undefined ? (e + nx) / 2 : e + 2) - real))}px)`;
      const k = offs.length; $('.zr-num').textContent = `${st.page + 1} / ${N}` + (k > 1 ? `（本頁 ${scr + 1}/${k}）` : '');
      $('.zr-prev').disabled = st.page === 0 && scr === 0; $('.zr-next').disabled = st.page === N - 1 && scr >= k - 1; }
    function screenV(dir) { // dir 1＝往後讀（往左），-1＝往前
      if (dir > 0) { if (scr < offs.length - 1) { scr++; showScr(); } else if (st.page < N - 1) { toEnd = false; go(st.page + 1, false); } }
      else { if (scr > 0) { scr--; showScr(); } else if (st.page > 0) { toEnd = true; go(st.page - 1, false); toEnd = false; } } }
    function render(scrollTop) {
      const V = st.dir === 'v'; box.classList.toggle('is-v', V); document.documentElement.classList.toggle('zr-lock', V); box.dataset.bg = st.bg; $('.zr-bg').value = st.bg; box.dataset.fg = st.fg || 0; $('.zr-fg').value = st.fg || 0; $('.zr-dir').setAttribute('aria-pressed', String(V)); $('.zr-mode').hidden = V;
      box.classList.toggle('is-scroll', st.mode === 'scroll' && !V);
      box.classList.toggle('is-zy', !!st.zy); $('.zr-zy').setAttribute('aria-pressed', String(!!st.zy));
      page.style.setProperty('--zr-size', st.size + 'px');
      $('.zr-mode').textContent = st.mode === 'page' ? T('改為捲動閱讀', 'Scroll mode', 'Chế độ cuộn', 'スクロール表示', '스크롤 보기') : T('改為翻頁閱讀', 'Page mode', 'Chế độ lật trang', 'ページ表示', '쪽 넘김 보기');
      if (st.mode === 'scroll' && !V) {
        page.innerHTML = pages.map((pg, i) => `<section data-p="${i}">${pageHTML(pg, i)}</section>`).join('');
        const el = page.querySelector(`[data-p="${st.page}"]`); if (el && scrollTop !== false) el.scrollIntoView();
      } else {
        page.innerHTML = pageHTML(pages[st.page], st.page);
        calib();
        if (V) { fitV(); const c = C[pages[st.page].ci], up = s.juan.length < 2 ? null : c.lit ? !LT.post.includes(c) : c.oi < s.juan[1][0];
          $('.zb-title').textContent = `《${s.title}${up === null ? '' : up ? '卷上' : '卷下'}》`; $('.zb-no').textContent = cnum(st.page + 1); } else page.style.width = '';
        if (scrollTop !== false && !V) box.scrollIntoView({block: 'start'});
        if (V) { measure(); scr = toEnd ? offs.length - 1 : 0; showScr(); } else page.style.clipPath = '';
      }
      sync();
    }
    function sync() {
      const pg = pages[st.page];
      $('.zr-ch').value = pg.ci;
      $('.zr-num').textContent = `${st.page + 1} / ${N}`;
      $('.zr-range').value = st.page + 1;
      $('.zr-prev').disabled = st.page === 0; $('.zr-next').disabled = st.page === N - 1;
      const on = st.marks.includes(st.page);
      $('.zr-mark').setAttribute('aria-pressed', String(on));
      $('.zr-mark').textContent = on ? T('已加書籤', 'Bookmarked', 'Đã đánh dấu', 'しおり済み', '책갈피 됨') : T('加書籤', 'Bookmark', 'Đánh dấu', 'しおりを挟む', '책갈피');
      save();
    }
    function go(i, scrollTop) { st.page = Math.min(Math.max(0, i), N - 1); $('.zr-resume').hidden = true; render(scrollTop); }
    function marks() {
      const m = $('.zr-marks');
      if (!m.hidden) { m.hidden = true; return; }
      st.marks.sort((a, b) => a - b);
      m.innerHTML = st.marks.length ? `<ul>${st.marks.map(i => `<li><button type="button" data-go="${i}">${esc(C[pages[i].ci].title)} · ${T('第', 'p. ', 'tr. ', '', '')}${i + 1}${T(' 頁', '', '', ' ページ', '쪽')}</button><button type="button" class="zr-del" data-del="${i}" aria-label="${T('刪除書籤', 'Remove bookmark', 'Xóa dấu trang', 'しおりを外す', '책갈피 삭제')}">×</button></li>`).join('')}</ul>`
        : `<p>${T('還沒有書籤。讀到想記住的地方，按「加書籤」。', 'No bookmarks yet. Tap “Bookmark” on any page you want to keep.', 'Chưa có dấu trang. Bấm “Đánh dấu” ở trang muốn ghi nhớ.', 'しおりはまだありません。残したいページで「しおりを挟む」を押してください。', '아직 책갈피가 없습니다. 기억하고 싶은 쪽에서 「책갈피」를 누르세요.')}</p>`;
      m.hidden = false;
    }
    $('.zr-prev').onclick = () => st.dir === 'v' ? screenV(-1) : go(st.page - 1); $('.zr-next').onclick = () => st.dir === 'v' ? screenV(1) : go(st.page + 1);
    $('.zr-range').oninput = e => go(e.target.value - 1);
    $('.zr-ch').onchange = e => go(pages.findIndex(pg => pg.items.some(x => x.ci === +e.target.value)));
    $('.zr-mode').onclick = () => { st.mode = st.mode === 'page' ? 'scroll' : 'page'; render(); };
    $('.zr-sm').onclick = () => { st.size = Math.max(15, st.size - 2); render(st.dir !== 'v' ? undefined : false); };
    $('.zr-lg').onclick = () => { st.size = Math.min(44, st.size + 2); render(st.dir !== 'v' ? undefined : false); };
    $('.zr-mark').onclick = () => { const i = st.marks.indexOf(st.page); i >= 0 ? st.marks.splice(i, 1) : st.marks.push(st.page); sync(); if (!$('.zr-marks').hidden) { $('.zr-marks').hidden = true; marks(); } };
    $('.zr-list').onclick = marks;
    const remap = V => { const ci = pages[st.page].ci; pages = buildPages(V); N = pages.length; st.page = Math.max(0, pages.findIndex(pg => pg.items.some(x => x.ci === ci))); st.marks = []; $('.zr-range').max = N; };
    $('.zr-dir').onclick = () => { if (st.dir !== 'v') remap(true); st.dir = 'v'; fs(true); box.classList.remove('show-ui'); render(); };
    $('.zr-exit').onclick = () => { box.classList.remove('show-ui'); if (st.dir === 'v') remap(false); st.dir = 'h'; fs(false); render(); };
    $('.zr-bg').onchange = e => { st.bg = e.target.value; box.dataset.bg = st.bg; save(); };
    $('.zr-fg').onchange = e => { st.fg = +e.target.value; box.dataset.fg = st.fg; save(); };
    const zyLoad = cb => { if (window.SUTRA_ZHUYIN && window.SUTRA_ZHUYIN[id]) return cb(); const sc = document.createElement('script'); sc.src = '../assets/sutras/' + id + '_zhuyin.js?v=9'; sc.onload = cb; sc.onerror = () => { st.zy = false; render(false); }; document.body.appendChild(sc); };
    $('.zr-zy').onclick = () => { st.zy = !st.zy; st.zy ? zyLoad(() => render(false)) : render(false); };
    $('.zr-marks').onclick = e => { const g = e.target.closest('[data-go]'), d = e.target.closest('[data-del]');
      if (d) { st.marks = st.marks.filter(x => x !== +d.dataset.del); save(); $('.zr-marks').hidden = true; marks(); sync(); }
      else if (g) { $('.zr-marks').hidden = true; go(+g.dataset.go); } };
    // 捲動模式：記住目前捲到的頁
    let tick = 0;
    window.addEventListener('scroll', () => { if (st.mode !== 'scroll' || st.dir === 'v' || tick) return; tick = requestAnimationFrame(() => { tick = 0;
      const secs = page.querySelectorAll('section'); let cur = st.page;
      for (const el of secs) { if (el.getBoundingClientRect().top < innerHeight * 0.35) cur = +el.dataset.p; else break; }
      if (cur !== st.page) { st.page = cur; sync(); } }); }, {passive: true});
    // 翻頁模式：左右滑動、鍵盤方向鍵
    let x0 = null, y0 = null;
    // 橫排：閱讀區在畫面內時，工具列固定在底部
    const bar = $('.zr-bar'), barHome = document.createElement('div'); bar.before(barHome);
    if ('IntersectionObserver' in window) new IntersectionObserver(es => { const on = es[0].isIntersecting && st.dir !== 'v';
      bar.classList.toggle('is-float', on); box.classList.toggle('has-float', on); document.documentElement.classList.toggle('zr-floating', on); }, {rootMargin: '-80px 0px -30% 0px'}).observe(page);
    const inUI = t => t.closest('.zr-bar,.zr-nav,.zr-marks');
    box.addEventListener('touchstart', e => { if (st.dir !== 'v' && !e.target.closest('.zr-page')) return; x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, {passive: true});
    box.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
      if (st.dir === 'v') {
        if (inUI(e.target)) return;
        // 經書模式：左右滑動翻頁；輕點畫面任何地方（工具列以外）叫出／收起工具列
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) return screenV(dx > 0 ? 1 : -1);
        if (Math.abs(dx) < 15 && Math.abs(dy) < 15) box.classList.toggle('show-ui');
        return; }
      if (st.mode !== 'page') return;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(st.page + (dx < 0 ? 1 : -1)); }, {passive: true});
    box.addEventListener('click', e => { if (st.dir !== 'v' || inUI(e.target) || matchMedia('(pointer:coarse)').matches) return; const t = e.clientX / innerWidth; if (t < .25) screenV(1); else if (t > .75) screenV(-1); else box.classList.toggle('show-ui'); });
    let rz = 0; window.addEventListener('resize', () => { if (st.dir !== 'v') return; clearTimeout(rz); rz = setTimeout(() => { fitV(); measure(); scr = Math.min(scr, offs.length - 1); showScr(); }, 150); });
    if (document.fonts) document.fonts.ready.then(() => { if (st.dir === 'v') { measure(); scr = Math.min(scr, offs.length - 1); showScr(); } });
    document.addEventListener('keydown', e => { if ((st.mode !== 'page' && st.dir !== 'v') || /input|select|textarea/i.test(e.target.tagName)) return;
      if (st.dir === 'v') { if (e.key === 'ArrowLeft') screenV(1); else if (e.key === 'ArrowRight') screenV(-1); else if (e.key === 'Escape') { st.dir = 'h'; render(); } return; }
      if (e.key === 'ArrowRight') go(st.page + 1); else if (e.key === 'ArrowLeft') go(st.page - 1); });
    // 上次讀到哪
    if (st.page > 0) { const r = $('.zr-resume'); r.hidden = false;
      r.innerHTML = `${T('上次讀到', 'Last read: ', 'Lần trước đọc đến ', '前回の続き：', '지난번 읽은 곳: ')}${esc(C[pages[st.page].ci].title)} · ${st.page + 1} / ${N} <button type="button">${T('從頭開始', 'Start over', 'Đọc từ đầu', '最初から', '처음부터')}</button>`;
      r.querySelector('button').onclick = () => go(0); }
    st.zy ? zyLoad(() => render(false)) : render(false);
  }
  function show(id) {
    const t = TABS.find(x => x.id === id) || TABS[0];
    root.querySelectorAll('[data-tab]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === t.id)));
    panel.innerHTML = t.sutra ? sutra(t.sutra) : comics();
    if (t.sutra) reader(t.id, t.sutra, panel.querySelector('.zj-reader'));
  }
  root.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => { history.replaceState(null, '', '#' + b.dataset.tab); show(b.dataset.tab); }));
  const h = location.hash.slice(1); show(TABS.some(t => t.id === h) ? h : TABS[0].id);
})();
