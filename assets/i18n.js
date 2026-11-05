/* 語系切換：中文（預設）／English。
   網頁上的固定文字以對照表替換；文章內容來自 data_en.js；選擇記在本機。
   必須放在 app.js、music.js、counter.js、verses.js 之前載入。 */
(() => {
  'use strict';
  const KEY = 'ksitigarbha-lang';
  let lang = 'zh';
  const LANGS = ['zh', 'sc', 'en', 'vi', 'ja', 'ko'];
  try { const q = new URLSearchParams(location.search).get('lang'); if (LANGS.includes(q)) { lang = q; localStorage.setItem(KEY, q); const u = new URL(location.href); u.searchParams.delete('lang'); history.replaceState(history.state, '', u.href); } else if (LANGS.includes(localStorage.getItem(KEY))) lang = localStorage.getItem(KEY); } catch {}

  const UI = {
    '一':'I','二':'II','三':'III','ABOUT · 閱讀與製作說明':'ABOUT','閱讀與製作說明 · 地藏菩薩感應文集':'About This Site · Ksitigarbha: Collected Teachings',
    '原文':'Original','白話':'Plain','收藏':'Save','排列':'Order','山靜，':'The mountains are still,',
    '照見歸途':'lighting the way home','我的收藏':'My saved','放大字級':'Larger text','靜心閱覽':'Begin reading',
    '願心如燈':'May the vow-heart be a lamp,','文章排列':'Order of articles','回到頁首':'Back to top','本篇段落':'Sections of this article',
    '玄金莊嚴':'Black & Gold','青山靜境':'Green Mountains','主要導覽':'Main navigation','三款範本':'All designs',
    '縮小字級':'Smaller text','展卷閱讀':'Open the scroll','完整閱讀':'Full text','地藏菩薩':'Ksitigarbha',
    '本篇閱讀':'In this article','短篇優先':'Shortest first','閱讀方式':'Reading mode','安頓此心':'let the heart settle',
    '玄金合璧':'Black & Gold Ensemble','原稿順序':'Original order','宋韻典藏':'Song Scroll','感應文集':'The Collection',
    '主題分類':'Topics','隨心而讀':'Read by question','一手錫杖，':'A staff in one hand,','一頁文字，':'One page of words,',
    '一直行善，':'I keep doing good —','前後篇文章':'Previous and next articles','緣起與說明':'About',
    '於字裡行間':'Between the lines','一手明珠。':'a bright pearl in the other.','如行山間靜院':'Like walking into a mountain retreat',
    '搜尋感應文章':'Search the articles','如入靜謐佛殿':'Like entering a quiet shrine hall','如展一卷好書':'Like opening a fine scroll',
    '選一種呈現。':'choose a way to present it.','四版共同收錄':'Included in all four designs','向下尋讀 ↓':'Scroll down ↓',
    '← 返回文集':'← Back to the collection','思念一個人，':'Missing someone —','慈悲與界線，':'Compassion and boundaries —',
    '閱讀更多篇章':'Show more articles','由此心出發。':'and set out from the heart.','感應文集 ↓':'The Collection ↓',
    '因文字相遇，':'We meet through words,','跳至主要內容':'Skip to main content','心也慢慢靜。':'and slowly the heart grows still.',
    '為何仍有苦難？':'why does suffering still come?','為心中的莊嚴，':'For the reverence in your heart,','清除搜尋與篩選':'Clear search and filters',
    '感 應 文 集':'COLLECTED TEACHINGS','算不算放不下？':'is that failing to let go?','閱讀這一篇 ↗':'Read this article ↗',
    '能否同時存在？':'can they exist together?','宋韻典藏版主視覺':'Song Scroll design — main image','青山靜境版主視覺':'Green Mountains design — main image',
    '一段安住的時間。':'one stretch of settled time.','下載原始文本 ↓':'Download original text (Chinese) ↓','比較三款範本 ↗':'Compare the designs ↗',
    '先處理眼前的苦，':'First tend to the suffering in front of you,','尋一篇此刻的文字':'Find words for this moment',
    '玄金莊嚴版主視覺':'Black & Gold design — main image','56 篇完整文本':'56 complete texts','地藏菩薩感應文集':'Ksitigarbha Bodhisattva: Collected Teachings',
    '進入完整範本 →':'Enter this design →','工筆 · 蓮臺坐像':'Fine-brush painting · Seated on the lotus','閱讀與製作說明 ↗':'About this site ↗',
    '願文字成為一盞燈。':'May these words become a lamp.','南無地藏菩薩摩訶薩':'Namo Ksitigarbha Bodhisattva Mahasattva',
    '卷一 · 五十六篇':'Volume I · 56 articles','再帶著愛，繼續生活。':'then carry love and go on living.','也為自己留一分慈悲。':'and keep some compassion for yourself.',
    '讀至此處，願心稍安。':'Having read this far, may your heart be a little more at peace.','讓思念來，讓眼淚流，':'Let the longing come, let the tears flow,',
    '暫時沒有符合的篇章。':'No matching articles yet.','坐於蓮臺，心不離眾生。':'Seated on the lotus, the heart never leaves beings.',
    '循此心意 · 延伸閱讀':'Further reading on this theme','地藏菩薩 · 感應文集':'Ksitigarbha · Collected Teachings','一字一念 · 觀照日常':'Each word, each thought · Seeing daily life',
    '靜心閱讀 · 宋韻典藏':'Reading · Song Scroll','五十六篇感應與生活記錄':'56 records of teachings and life','搜尋篇名、關鍵字或內文':'Search titles, keywords or text',
    '青山靜湖 · 菩薩立像':'Green mountains, still lake · Standing Bodhisattva','靜心閱讀 · 玄金合璧':'Reading · Black & Gold Ensemble',
    '在孝順與自我保護之間，':'between filial piety and protecting yourself,','帶著一個問題，慢慢讀。':'Bring one question, and read slowly.',
    '靜心閱讀 · 青山靜境':'Reading · Green Mountains','靜心閱讀 · 玄金莊嚴':'Reading · Black & Gold','尋找能長久相處的距離。':'finding a distance that can last.',
    '感應有記 · 閱讀有心':'Teachings recorded · Read with heart','四種意境 · 同一份初心':'Four moods · One intention',
    '留一頁清淨，讀人間悲歡。':'Keep one page pure, and read the joys and sorrows of the world.','玄金為底 · 融入三幅聖像':'Black & Gold base · Three sacred images',
    '從一個提問，走向一念明白。':'From one question toward one clear thought.','讓一段文字，陪你回到當下。':'Let a few words bring you back to the present.',
    '慢慢讀，也慢慢與自己相處。':'Read slowly, and slowly keep yourself company.','讓紛擾漸靜，讓心回到慈悲。':'Let the noise grow quiet, and the heart return to compassion.',
    '從生活的片刻，走進文字深處。':'From moments of daily life into the depth of the words.','在世間的起落裡，讀一段文字。':'Amid the ups and downs of the world, read a few words.',
    '修行不離世間，慈悲不離日用。':'Practice does not leave the world; compassion does not leave daily life.','殿堂金光 · 工筆 · 青山':'Golden hall · Fine brush · Green mountains',
    '書卷感 · 米白 · 工筆畫':'Scroll · Ivory · Fine-brush painting','個人感應紀錄 · 原文與白話':'Personal records · Original and plain rendering',
    '自然感 · 青綠 · 雲山靜湖':'Nature · Blue-green · Misty mountains and lake','地藏菩薩感應文集 · 宋韻典藏':'Ksitigarbha: Collected Teachings · Song Scroll',
    '地藏菩薩感應文集 · 青山靜境':'Ksitigarbha: Collected Teachings · Green Mountains','地藏菩薩感應文集 · 玄金合璧':'Ksitigarbha: Collected Teachings · Black & Gold Ensemble',
    '儀式感 · 深色 · 金色佛像':'Ritual · Dark · Golden statue','地藏菩薩感應文集 · 玄金莊嚴':'Ksitigarbha: Collected Teachings · Black & Gold',
    '同一份感應文集，四種閱讀風景。':'One collection of teachings, four reading landscapes.','三款範本 · 地藏菩薩感應文集':'Designs · Ksitigarbha: Collected Teachings',
    '作者感應紀錄 · 依提供原稿整理':'Author\'s record of teachings · Arranged from the original manuscript','感 應 網 站 · 設 計 提 案':'WEBSITE · DESIGN PROPOSAL',
    '悲 願 深 廣 · 一 念 光 明':'VAST COMPASSION · ONE THOUGHT OF LIGHT','錫杖振開地獄之門，明珠照破長夜之暗。':'The staff shakes open the gates of hell; the pearl lights up the long night.',
    '地藏菩薩感應文集 · 三款可瀏覽範本':'Ksitigarbha: Collected Teachings · Browsable designs','願每一次閱讀，都成為回觀自心的片刻。':'May every reading become a moment of looking back into your own heart.',
    '五十六篇記錄，讀一段與此刻相應的文字。':'56 records — read the words that answer this moment.','玄金合璧版主視覺：殿堂金光中的地藏菩薩':'Black & Gold Ensemble — Ksitigarbha in the golden light of the hall',
    '此刻的你 · READING PATHS':'WHERE YOU ARE NOW · READING PATHS','字裡行間 · THE COLLECTION':'BETWEEN THE LINES · THE COLLECTION',
    '摘自〈憤怒時少傷一人，低谷時不放棄自己〉 →':'From "Hurt One Less Person When Angry, Do Not Give Up on Yourself When Low" →',
    'AI 藝術示意：宣紙工筆風格的地藏菩薩蓮臺坐像':'AI artwork: Ksitigarbha seated on a lotus, in fine-brush style on rice paper','聖 像 長 卷 · SACRED SCROLL':'SACRED SCROLL',
    'AI 藝術示意：青山雲霧與靜湖之畔的地藏菩薩石像':'AI artwork: a stone statue of Ksitigarbha beside a still lake among misty green mountains','緣起 · ABOUT THIS COLLECTION':'ABOUT THIS COLLECTION',
    '在殿堂的金光之外，也以一卷工筆，靜靜展開菩薩的悲願。':'Beyond the golden light of the hall, a fine-brush scroll quietly unfolds the Bodhisattva\'s compassionate vow.',
    'AI 藝術示意：暖金光中，地藏菩薩持錫杖與寶珠，立於蓮臺':'AI artwork: in warm golden light, Ksitigarbha stands on a lotus holding a staff and a jewel',
    '原始文字依來稿保留，主視覺為 AI 藝術示意。網站可離線開啟。':'The original texts are kept as received; the main images are AI artwork. The site works offline.',
    '青綠山水與晨霧，配上舒展留白。用柔和的陪伴感，走進生活裡的提問。':'Blue-green landscape and morning mist, with open space. A gentle companion into the questions of daily life.',
    '墨黑與暖金，燈火與佛像。以沉穩的大幅主視覺，呈現最鮮明的莊嚴感。':'Ink black and warm gold, lamplight and statue. A steady, large main image gives the strongest sense of reverence.',
    '每一版皆可完整閱讀、搜尋與收藏，請走進其中，感受最合心意的一版。':'Every design can be fully read, searched and saved. Step inside and find the one that suits your heart.',
    '暖白宣紙、朱砂點印與工筆畫。讓文字成為主角，適合細讀與長久典藏。':'Warm rice paper, cinnabar seals and fine-brush painting. The words take center stage, for close reading and keeping.',
    '地藏菩薩感應文集：作者提供的五十六篇感應紀錄、提問、白話翻譯與修行體會。':'Ksitigarbha Bodhisattva: Collected Teachings — 56 records of inspired teachings, questions, plain renderings and reflections on practice.',
    'AI 藝術示意：工筆設色的地藏菩薩，持錫杖與寶珠，結跏趺坐於蓮臺，背景為雲山':'AI artwork: a colored fine-brush painting of Ksitigarbha holding a staff and jewel, seated cross-legged on a lotus before misty mountains',
    '以玄金的殿堂感為主，再收入宋韻的工筆坐像與青山的湖畔立像，一頁看見三種莊嚴。':'The golden hall of Black & Gold, joined by the seated fine-brush image of Song Scroll and the lakeside statue of Green Mountains — three kinds of reverence on one page.',
    '主題分類 ／ 全文搜尋 ／ 原文與既有白話 ／ 字級調整 ／ 本機收藏 ／ 手機版面':'Topics / Full-text search / Original and plain rendering / Text size / Saved articles / Mobile layout',
    '法義與人分享，本來就是希望勸人向善、喚醒人心。':'The Dharma is shared to encourage goodness and awaken the heart.',
    '無需讓天下人都承認這是菩薩說的話。':'There is no need for the whole world to accept these as the Bodhisattva\'s words.',
    '如果一句話能讓一個人少一分惡、多一分善；':'If a single line helps someone do a little less harm and a little more good,',
    '少一分怨，多一分慈悲，':'hold a little less resentment and a little more compassion,',
    '這句話就已經有它的利益了。':'then that line has already done its good.',
    '若其中有善的義理，希望大家取其善；':'Where there is wholesome meaning here, may you take what is good;',
    '若有不符合正法之處，也請依照經典來辨別。':'where anything departs from the true Dharma, please discern it by the sutras.',
    '十 齋 日 · TEN FASTING DAYS':'TEN FASTING DAYS',
    '十齋日行事曆':'Calendar of the Ten Fasting Days',
    '每月農曆十個日子，自動換算成國曆。':'Ten days of each lunar month, converted to the Western calendar.',
    '上個月':'Previous month',
    '下個月':'Next month',
    '回到本月':'This month',
    '本月齋日與紀念日':'Fasting days and observances this month',
    '什麼是十齋日':'What are the Ten Fasting Days?',
    '十齋日是農曆每月的初一、初八、十四、十五、十八、廿三、廿四、廿八、廿九、三十，共十天。遇到小月沒有三十日，習慣上以廿七日補足。':'The Ten Fasting Days fall on the 1st, 8th, 14th, 15th, 18th, 23rd, 24th, 28th, 29th and 30th of each lunar month. In a short month without a 30th, the 27th is customarily observed instead.',
    '《地藏菩薩本願經》〈如來讚歎品〉說，這些日子是眾生罪業結集、定其輕重的時候；若能在十齋日於佛菩薩像前讀誦此經，能得種種利益。許多佛弟子會在這些日子持齋茹素、誦經念佛，以此日日提醒自己少造惡、多行善。':'The Sutra of the Fundamental Vows of Kṣitigarbha Bodhisattva (chapter “The Tathāgata’s Praise”) says these are the days when beings’ offenses are gathered and weighed; reciting the sutra before images of Buddhas and Bodhisattvas on these days brings many benefits. Many Buddhists keep a vegetarian fast and recite sutras and the Buddha’s name on these days, as a regular reminder to do less harm and more good.',
    '經文':'The sutra text',
    '——《地藏菩薩本願經》卷中〈如來讚歎品第六〉':'— Sutra of the Fundamental Vows of Kṣitigarbha Bodhisattva, fascicle 2, chapter 6 “The Tathāgata’s Praise” (Chinese original)',
    '說明':'Notes',
    '農曆換算以天文曆法計算，涵蓋國曆 2025 至 2035 年。':'Lunar dates are computed astronomically and cover 2025 to 2035.',
    '佛菩薩紀念日依台灣佛教常見的日期標示；遇小月沒有三十日，三十日的紀念日（如地藏菩薩聖誕）提前一天，與各道場習慣可能略有不同。':'Observances follow dates common in Taiwanese Buddhism. When a month has no 30th, an observance on the 30th (such as Kṣitigarbha’s birthday) moves one day earlier; local temples may differ slightly.',
    '十齋日':'Fasting Days',
    '十齋日行事曆 · 地藏菩薩感應文集':'Ten Fasting Days · Ksitigarbha: Collected Teachings',
    '字－':'A−','字＋':'A+','分享本篇':'Share','大字':'Large text','標準字':'Normal text','放大全站文字':'Enlarge all text',
    '聯絡':'Contact','聯絡與建議 · 地藏菩薩感應文集':'Contact · Ksitigarbha: Collected Teachings',
    '本文集以個人信仰與經驗紀錄的身分呈現，並非佛典原文或經過認證的菩薩言說。閱讀時，亦請尊重每個人因緣與處境的不同。':'This collection is presented as a record of personal faith and experience. It is not canonical scripture, nor verified words of the Bodhisattva. Please also respect that each person\'s conditions and circumstances differ.',
    '這裡收錄作者提供的夢中感應、請示對話、白話翻譯與道友經歷。從修行的提問，到親情、失落與人間日常，留下一段段觀照自心的文字。':'Here are the author\'s dream teachings, dialogues of inquiry, plain renderings and the experiences of fellow practitioners. From questions of practice to family, loss and everyday life, they leave passages for looking into one\'s own heart.',
    '整理方式：保留來稿原文與提問，不作更動；既有白話僅在少數偏離原文之處依原文微調用詞，並調整排版、增加分類與導讀。未附白話的篇章不另造譯文。三幅主視覺為 AI 生成的宗教藝術示意，非實際感應現場照片。':'How this was arranged: the original teachings and questions are kept unchanged; the existing plain renderings were adjusted only in a few places where they departed from the original, and layout, topics and introductions were added. The English translation was prepared separately and the Chinese original remains authoritative. The three main images are AI-generated religious artwork, not photographs of actual events.'
  };
  const CAT = {'全部':'All','修心與日常':'Mind & Daily Life','因果與願行':'Karma & Vows','情感與關係':'Love & Relationships','生命與照護':'Life & Care','經典與修持':'Sutras & Practice','人間與世事':'Society & the World','親身經歷':'Personal Accounts'};

  // 越南文：對照表放在 i18n_vi.js（VI_I18N），文章在 data_vi.js（同樣掛在 ARCHIVE_EN，供 app.js 共用外文路徑）。
  const EMPTY = {ui: {}, cat: {}, t: {}};
  const VI = () => (lang === 'ja' ? window.JA_I18N : lang === 'ko' ? window.KO_I18N : window.VI_I18N) || EMPTY;  // 越南文／日文共用同一套結構
  const SC = lang === 'sc';  // 簡體：沿用中文邏輯，文字即時以字表轉換
  const sc = str => { const M = window.SC_MAP; return (M && typeof str === 'string') ? str.replace(/[\u4e00-\u9fff]/g, c => M[c] || c) : str; };
  const foreign = lang !== 'zh' && !SC;
  const t = (zh, en, vi, ja, ko) => SC ? sc(zh) : lang === 'zh' ? zh : lang === 'en' ? en : lang === 'ko' ? (ko != null ? ko : (VI().t[en] || en)) : lang === 'ja' ? (ja != null ? ja : (VI().t[en] || en)) : (vi != null ? vi : (VI().t[en] || en));
  const dict = () => (lang === 'vi' || lang === 'ja' || lang === 'ko') ? VI().ui : UI;
  // 外文模式才載入外文資料，中文訪客不多下載。
  const me = document.currentScript;
  if (me && SC) { [me.dataset.scMap, me.dataset.sc].filter(Boolean).forEach(x => document.write('<script src="' + x + '"><\/script>')); }
  else if (me && lang !== 'zh') {
    const src = lang === 'en' ? [me.dataset.en] : lang === 'ja' ? [me.dataset.jaUi, me.dataset.ja] : lang === 'ko' ? [me.dataset.koUi, me.dataset.ko] : [me.dataset.viUi, me.dataset.vi];
    src.filter(Boolean).forEach(s => document.write('<script src="' + s + '"><\/script>'));
  }
  window.I18N = { lang, foreign, t, cat: c => (lang === 'zh' || SC) ? sc(c) : ((lang === 'en' ? CAT : VI().cat)[c] || c) };

  function scDom(root) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); const ns = [];
    while (w.nextNode()) ns.push(w.currentNode);
    for (const n of ns) { if (n.parentElement && n.parentElement.closest('script,style,.lang-switch')) continue; const v = sc(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; }
    if (root.querySelectorAll) root.querySelectorAll('[alt],[aria-label],[placeholder],[title]').forEach(el => { for (const a of ['alt', 'aria-label', 'placeholder', 'title']) { const v = el.getAttribute(a); if (v) { const x = sc(v); if (x !== v) el.setAttribute(a, x); } } });
  }
  function translateDom(root) {
    if (SC) { scDom(root); return; }
    if (lang === 'zh') return;
    const UI = dict();
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (w.nextNode()) nodes.push(w.currentNode);
    for (const n of nodes) {
      if (n.parentElement && n.parentElement.closest('script,style,#article-body,.verse-text')) continue;
      const k = n.nodeValue.trim();
      if (UI[k]) n.nodeValue = n.nodeValue.replace(k, UI[k]);
    }
    root.querySelectorAll('[alt],[aria-label],[placeholder],[title]').forEach(el => {
      for (const a of ['alt', 'aria-label', 'placeholder', 'title']) { const v = el.getAttribute(a); if (v && UI[v.trim()]) el.setAttribute(a, UI[v.trim()]); }
    });
  }
  function applyStatic() {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : SC ? 'zh-Hans' : lang;
    if (SC) {
      document.title = sc(document.title);
      const m0 = document.querySelector('meta[name=description]'); if (m0) m0.content = sc(m0.content);
      scDom(document.body);
      // 之後由程式加入的文字（文章列表、語錄、提示）也即時轉換
      new MutationObserver(ms => { for (const r of ms) { if (r.type === 'characterData') { const v = sc(r.target.nodeValue); if (v !== r.target.nodeValue) r.target.nodeValue = v; } else r.addedNodes.forEach(n => n.nodeType === 3 ? (n.nodeValue = sc(n.nodeValue)) : n.nodeType === 1 && scDom(n)); } }).observe(document.body, {childList: true, subtree: true, characterData: true});
    }
    // 越南文沿用英文的拉丁字排版（lang-en），另加 lang-vi 供個別微調。
    document.documentElement.classList.toggle('lang-en', foreign && lang !== 'ja' && lang !== 'ko');  // 日文沿用中日文排版
    document.documentElement.classList.toggle('lang-ja', lang === 'ja');
    document.documentElement.classList.toggle('lang-ko', lang === 'ko');
    document.documentElement.classList.toggle('lang-vi', lang === 'vi');
    if (foreign) {
      const UI = dict();
      const m = document.querySelector('meta[name=description]'); if (m && UI[m.content]) m.content = UI[m.content];
      if (UI[document.title]) document.title = UI[document.title];
      translateDom(document.body);
    }
    const header = document.querySelector('.site-header, .showcase-header');
    if (header && !header.querySelector('.lang-switch')) {
      const sel = document.createElement('select');
      sel.className = 'lang-switch';
      sel.setAttribute('aria-label', '語言 · Language · Ngôn ngữ · 言語 · 언어');
      sel.innerHTML = [['zh', '繁中', 'zh-Hant'], ['sc', '简中', 'zh-Hans'], ['en', 'EN', 'en'], ['vi', 'VI', 'vi'], ['ja', '日本語', 'ja'], ['ko', '한국어', 'ko']]
        .map(([v, l, h]) => `<option value="${v}" lang="${h}"${v === lang ? ' selected' : ''}>${l}</option>`).join('');
      sel.addEventListener('change', () => {
        try { localStorage.setItem(KEY, sel.value); } catch {}
        if (window.__PV && window.__PV.reload) { window.__PV.reload(); return; }
        // 網址帶 lang 參數，確保一定觸發重新載入（只改 # 時瀏覽器不會重載，平板上常見「切了沒反應」）
        const u = new URL(location.href); u.searchParams.set('lang', sel.value); location.replace(u.href);
      });
      const edition = header.querySelector('.edition');
      edition ? header.insertBefore(sel, edition) : header.appendChild(sel);
      // 全站大字（長輩友善）：記在本機
      const BIG = 'ksitigarbha-big-text';
      let big = false; try { big = localStorage.getItem(BIG) === '1'; } catch {}
      const bt = document.createElement('button');
      bt.type = 'button'; bt.className = 'text-size';
      const paint = () => { document.documentElement.classList.toggle('big-text', big); bt.textContent = big ? t('標準字', 'A', 'Chữ thường', '標準の文字', '보통 글자') : t('大字', 'A+', 'Chữ lớn', '大きな文字', '큰 글자'); bt.setAttribute('aria-pressed', String(big)); };
      bt.setAttribute('aria-label', t('放大全站文字', 'Enlarge all text', 'Phóng to chữ toàn trang', 'サイト全体の文字を大きくする', '사이트 전체 글자 크게'));
      bt.addEventListener('click', () => { big = !big; try { localStorage.setItem(BIG, big ? '1' : '0'); } catch {} paint(); });
      paint();
      header.insertBefore(bt, sel);
    }
  }
  window.I18N.translateDom = translateDom;
  // 從上一頁返回時（瀏覽器快取頁面），若語言已在別頁改過，就重新載入
  window.addEventListener('pageshow', e => { try { const v = localStorage.getItem(KEY) || 'zh'; if (e.persisted && v !== lang) location.reload(); } catch {} });
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', applyStatic) : applyStatic();
})();
