/* 藏經閣：分頁「佛教漫畫」「經典」。經文為中文原典（CBETA），外語只連結海外既有譯本，不自行翻譯。 */
(() => {
  'use strict';
  const I = window.I18N || {t: z => z, lang: 'zh'};
  const L = (z, e, v, j, k) => I.t(z, e, v, j, k);
  const root = document.getElementById('zangjing-app'); if (!root) return;
  const S = window.SUTRAS || {};
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const TABS = [{id: 'comics', name: L('佛教漫畫', 'Buddhist Comics', 'Truyện tranh Phật giáo', '仏教マンガ', '불교 만화')},
    ...Object.entries(S).map(([id, s]) => ({id, name: s.title, sutra: s}))];
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
      <nav class="zj-toc"><h4>${L('目錄', 'Contents', 'Mục lục', '目次', '목차')}</h4><ol>${s.chapters.map((c, i) => `<li><a href="#ch${i + 1}">${esc(c.title)}</a></li>`).join('')}</ol></nav>
      <div class="zj-text" lang="zh-Hant">${s.chapters.map((c, i) => `${s.juan.findIndex(j => j[0] === i) >= 0 ? `<p class="zj-juan">${['卷上', '卷下'][s.juan.findIndex(j => j[0] === i)] || ''}</p>` : ''}<h4 id="ch${i + 1}">${esc(c.title)}</h4>${c.paras.map(p => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('')}`).join('')}</div>
      <p class="small zj-src">${L('經文來源：', 'Source: ', 'Nguồn: ', '出典：', '출처: ')}<a href="${s.sourceUrl}" target="_blank" rel="noopener">${esc(s.source)}</a></p></article>`;
  }
  function show(id) {
    const t = TABS.find(x => x.id === id) || TABS[0];
    root.querySelectorAll('[data-tab]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === t.id)));
    panel.innerHTML = t.sutra ? sutra(t.sutra) : comics();
  }
  root.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => { history.replaceState(null, '', '#' + b.dataset.tab); show(b.dataset.tab); }));
  const h = location.hash.slice(1); show(TABS.some(t => t.id === h) ? h : (h.startsWith('ch') ? 'dizang' : 'comics'));
  if (h.startsWith('ch')) setTimeout(() => { const el = document.getElementById(h); if (el) el.scrollIntoView(); }, 50);
})();
