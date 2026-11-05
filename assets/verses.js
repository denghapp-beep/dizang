/* 青山靜境主視覺：隨機顯示一句菩薩開示精華。
   每句皆逐字取自該篇「菩薩開示」原文，並經人工挑選；新增時請同樣核對原文。 */
(() => {
  'use strict';
  const isEN = !!(window.I18N && window.I18N.foreign);
  const L = (z, e, v, j, k) => window.I18N ? window.I18N.t(z, e, v, j, k) : z;
  const VERSES = [
{
"id": "001",
"title": "修行真諦",
"text": "莫問幾經幾拜，問心有無塵染；莫求福報速至，求念念無愧、無愚。",
"en": "Ask not how many sutras or how many bows; ask whether your heart is stained with dust. Seek not swift blessings; seek that every thought leave nothing to be ashamed of and be free of folly.",
"title_en": "The True Meaning of Practice"
},
{
"id": "002",
"title": "外在條件與內心調適的智慧",
"text": "富貴與貧賤，皆是緣影；唯心中光明，為不壞之寶。",
"en": "Wealth and poverty are shadows cast by conditions; only the light within the heart is an indestructible treasure.",
"title_en": "Wisdom for Outer Circumstances and Inner Peace"
},
{
"id": "003",
"title": "世人「放不下」的真相",
"text": "若能愛而不縛，護而不控，則情即慈，縛即解。",
"en": "If you can love without binding and protect without controlling, affection becomes compassion and the bond is released.",
"title_en": "The Truth About \"Not Being Able to Let Go\""
},
{
"id": "005",
"title": "人生意義為何？",
"text": "修行非棄世離俗，乃於俗中識心、於苦中生智、於亂中守定。",
"en": "Practice is not leaving the world; it is knowing the mind amid the ordinary, growing wisdom amid suffering, keeping steady amid chaos.",
"title_en": "What Is the Meaning of Life?"
},
{
"id": "006",
"title": "發菩提心＝需要很偉大善良？",
"text": "非必大誓宏願，方名菩提；一念願善，一行利人，皆是發心。",
"en": "It need not be a great vow to be called bodhi; a single thought wishing good, a single act that helps another — this is arousing the mind.",
"title_en": "Does Bodhicitta Require Being Great and Saintly?"
},
{
"id": "007",
"title": "【金剛經精髓】「享受人生而不執」與「覺受人生而不迷」",
"text": "金剛之義，非斷一切法，乃不為法所縛。",
"en": "The meaning of the Diamond is not to cut off all things, but not to be bound by them.",
"title_en": "[The Essence of the Diamond Sutra] \"Enjoying Life Without Clinging\" and \"Experiencing Life Without Delusion\""
},
{
"id": "009",
"title": "如何看待高房價與不快樂？",
"text": "若心只向外求，終無安日；若心能返內觀，處處皆路。",
"en": "If the heart only seeks outward, there will never be a day of peace; if the heart can turn and look within, every place is a path.",
"title_en": "How to View High Housing Prices and Unhappiness?"
},
{
"id": "014",
"title": "何謂空間",
"text": "心若廣，則十方皆通；心若狹，則一室為牢。",
"en": "If the mind is broad, the ten directions all open; if the mind is narrow, a single room becomes a prison.",
"title_en": "What Is Space?"
},
{
"id": "015",
"title": "何謂時間",
"text": "若心逐念起，則見為線；若心入一如，則見無際。",
"en": "If the mind chases thoughts as they arise, it sees time as a line; if the mind enters oneness, it sees no boundary.",
"title_en": "What Is Time?"
},
{
"id": "016",
"title": "破除現代價值困境的自性覺察",
"text": "安其心者，雖處貧賤亦樂；失其心者，雖擁天下亦枯。",
"en": "Those whose hearts are at peace are joyful even in poverty; those who have lost their hearts are withered even if they hold all under heaven.",
"title_en": "Awareness of Our True Nature Beyond Modern Value Traps"
},
{
"id": "017",
"title": "長照路上的自我和解",
"text": "力有盡時，非失慈悲；財有窮處，非捨親情。",
"en": "When strength runs out, compassion is not lost; when money comes to an end, family love is not abandoned.",
"title_en": "Making Peace With Oneself on the Long Road of Caregiving"
},
{
"id": "018",
"title": "知易行難 莫作岸邊觀舟人",
"text": "夫理者，橋也；行者，渡也。",
"en": "Principle is the bridge; practice is the crossing.",
"title_en": "Knowing Is Easy, Doing Is Hard: Do Not Be One Who Watches the Boat From the Shore"
},
{
"id": "020",
"title": "天災人禍是否命中注定？",
"text": "懼者，見果而退；覺者，見因而轉。",
"en": "The fearful see the effect and retreat; the awakened see the cause and turn.",
"title_en": "Are Natural Disasters and Human Calamities Predestined?"
},
{
"id": "021",
"title": "菩薩怎麼看待世間的善惡與邪正",
"text": "執善為我，已落偏見；見惡能轉，方名正見。",
"en": "To cling to goodness as \"mine\" is already bias; to see evil and be able to turn it is right view.",
"title_en": "How the Bodhisattva Views Good and Evil, Right and Wrong in the World"
},
{
"id": "023",
"title": "相貌的真相",
"text": "善念久養，氣色自和；惡習長存，神情自變。",
"en": "Nourish good thoughts long, and the face grows gentle; let bad habits remain, and the expression changes of itself.",
"title_en": "The Truth About Appearance"
},
{
"id": "024",
"title": "地藏王菩薩說：你不是沒善根，你只是敗在這件事",
"text": "心若如炬，萬訊自熄；心若如塵，風來即亂。",
"en": "If the mind is like a torch, ten thousand messages are stilled of themselves; if the mind is like dust, any wind scatters it.",
"title_en": "Ksitigarbha Bodhisattva Says: You Do Not Lack Good Roots — You Are Only Defeated by This One Thing"
},
{
"id": "025",
"title": "地藏菩薩開示如何往生極樂淨土",
"text": "不在多門，在於專一；不在急速，在於恆久。",
"en": "It lies not in many gates, but in single-mindedness; not in speed, but in constancy.",
"title_en": "Ksitigarbha Bodhisattva Teaches How to Be Reborn in the Pure Land of Ultimate Bliss"
},
{
"id": "026",
"title": "人身難得到底多難得呢",
"text": "得而不知，乃為大失；知而能用，方為不負。",
"en": "To gain it and not know it is a great loss; to know it and use it well is not to fail it.",
"title_en": "How Rare Is a Human Birth, Really?"
},
{
"id": "028",
"title": "非清淨之地誦經是否福德比較少?",
"text": "若心淨，一字一偈皆光；若心染，殿宇香花亦虛。",
"en": "If the heart is pure, every word and verse shines; if the heart is stained, even temples, incense and flowers are empty.",
"title_en": "Is There Less Merit in Reciting Sutras in a Place That Is Not Pure?"
},
{
"id": "031",
"title": "憤怒時少傷一人，低谷時不放棄自己——這才是真正的改命",
"text": "若見他人苦，願多一分理解；若見自己苦，願少一分怨恨。",
"en": "When you see another's suffering, may you have a little more understanding; when you see your own, a little less resentment.",
"title_en": "Hurt One Less Person When Angry, Do Not Give Up on Yourself When Low — This Is How Fate Truly Changes"
},
{
"id": "032",
"title": "「求緣不如修心，求得不求明，終究一場空」",
"text": "若欲改命，先改其心；若欲得安，先減執著。",
"en": "If you wish to change your fate, first change your heart; if you wish to find peace, first lessen your attachments.",
"title_en": "\"Seeking Affinity Is Not as Good as Cultivating the Heart; Seeking Gain Without Seeking Clarity Ends in Emptiness\""
},
{
"id": "034",
"title": "命、運、風水、陰德、讀書——地藏菩薩的終極答案",
"text": "命非鐵鑄，運非永定；善念一起，即轉微因；善行久積，則移大勢。",
"en": "Fate is not cast in iron, fortune is not forever fixed; a good thought turns subtle causes, and good deeds long gathered shift the great current.",
"title_en": "Fate, Fortune, Feng Shui, Hidden Virtue and Study — Ksitigarbha Bodhisattva's Ultimate Answer"
},
{
"id": "036",
"title": "既然佛教講求不執著是否就無需拜佛?",
"text": "佛不在殿中，亦不離殿中；心為主，行為證。",
"en": "The Buddha is not in the hall, nor apart from the hall; the heart is the master, conduct is the proof.",
"title_en": "Since Buddhism Teaches Non-Attachment, Is There No Need to Bow to the Buddha?"
},
{
"id": "038",
"title": "若因果業力早已注定,那麼眾生此刻的一念向善、精進修行,究竟還能改變什麼?",
"text": "一念慈悲，不滅舊因；卻能增長新因。",
"en": "A single thought of compassion does not erase old causes, but it can grow new ones.",
"title_en": "If Cause, Effect and Karma Are Already Fixed, What Can a Good Thought and Diligent Practice Still Change?"
},
{
"id": "039",
"title": "向地藏王菩薩詢問諸佛菩薩如何成就正等正覺",
"text": "見苦而發願，見迷而生悲，見性而破執，見空而不住空。",
"en": "Seeing suffering, make vows; seeing delusion, feel compassion; seeing your nature, break attachment; seeing emptiness, do not dwell in emptiness.",
"title_en": "Asking Ksitigarbha Bodhisattva How the Buddhas and Bodhisattvas Attain Perfect, Complete Awakening"
},
{
"id": "040",
"title": "未經他人苦 莫勸他人善 你若經我苦 未必有我善。是否不符合佛教思想",
"text": "見苦而止勸，乃自保之智；知苦而發悲，乃菩薩之行。",
"en": "To see suffering and hold back is the wisdom of self-protection; to know suffering and feel compassion is the practice of a Bodhisattva.",
"title_en": "\"Without Living Through Another's Pain, Do Not Urge Them to Be Good; Had You Lived Through Mine, You Might Not Be as Good as Me\" — Is This Against Buddhist Thought?"
},
{
"id": "043",
"title": "何謂空",
"text": "花開非常，花謝非斷；雲聚成雨，雨盡還空。",
"en": "A flower blooming is not permanent; a flower falling is not annihilation. Clouds gather into rain; when the rain is spent, it returns to emptiness.",
"title_en": "What Is Emptiness?"
},
{
"id": "044",
"title": "至親離世後,思念算不算一種執著?",
"text": "讓思念來，讓眼淚流；流過之後，仍向前行。",
"en": "Let the longing come, let the tears flow; when they have flowed, still walk on.",
"title_en": "After a Loved One Passes, Is Missing Them a Form of Attachment?"
},
{
"id": "045",
"title": "菩薩想度眾生算不算一種欲望?蔡康永靈魂發問",
"text": "真正無求，不是什麼都不願；乃是願而不縛，行而不著。",
"en": "True non-seeking is not wishing for nothing; it is vowing without being bound, acting without clinging.",
"title_en": "Is the Bodhisattva's Wish to Save Beings a Kind of Desire? A Soul-Searching Question From Kevin Tsai"
},
{
"id": "046",
"title": "說真話,不一定是善;說謊,不一定是惡",
"text": "真語而無慈，易成利刃；慈悲而無智慧，亦可能成愚行。",
"en": "Truth without compassion easily becomes a sharp blade; compassion without wisdom can also become foolishness.",
"title_en": "Telling the Truth Is Not Always Good; a Lie Is Not Always Evil"
},
{
"id": "047",
"title": "一直行善,為什麼苦難還是找上我?",
"text": "有些苦，非因汝不善；有些難，亦非用來懲罰汝。",
"en": "Some suffering is not because you are not good; some hardship is not sent to punish you.",
"title_en": "I Keep Doing Good — Why Does Suffering Still Find Me?"
},
{
"id": "048",
"title": "看過人性最黑暗的一面後，還應不應該相信人？",
"text": "知惡而防惡，見苦而憐苦；不縱容，亦不仇恨。",
"en": "Know evil and guard against it, see suffering and pity it; do not indulge, nor hate.",
"title_en": "After Seeing the Darkest Side of Human Nature, Should We Still Trust People?"
},
{
"id": "049",
"title": "人性是本善還是本惡意或是隨因緣而轉?",
"text": "知人能惡，故有智慧防護；知人能善，故不捨慈悲。",
"en": "Knowing people can do evil, you have the wisdom to protect; knowing people can do good, you do not abandon compassion.",
"title_en": "Is Human Nature Originally Good, Originally Evil, or Does It Turn With Conditions?"
},
{
"id": "050",
"title": "何謂因果何謂業力?",
"text": "今日一念，似甚微小；日日重之，便成習氣。",
"en": "A thought today seems very small; repeated day after day, it becomes habit.",
"title_en": "What Is Cause and Effect? What Is Karmic Force?"
},
{
"id": "051",
"title": "慈悲可以不靠近，孝順可以有界線」",
"text": "有恩，不表示傷害不存在；有傷，亦不必抹去所有曾有之恩。",
"en": "That there was kindness does not mean the harm did not exist; that there was harm need not erase all the kindness that once was.",
"title_en": "Compassion Need Not Mean Closeness; Filial Piety Can Have Boundaries"
},
{
"id": "052",
"title": "活在當下，是不是只是一句安慰人的話？",
"text": "今日有苦，便處理今日之苦；今日有樂，亦知此樂無常。",
"en": "If there is suffering today, deal with today's suffering; if there is joy today, know that this joy too is impermanent.",
"title_en": "Is \"Living in the Present\" Just a Comforting Phrase?"
},
{
"id": "053",
"title": "經沒誦完就白讀？菩薩一句話，讓無數人放下自責",
"text": "經可以暫停，善心不可忘；文字可以放下，法義仍可奉行。",
"en": "The sutra can pause, but the good heart must not be forgotten; the words can be set down, but the Dharma can still be lived.",
"title_en": "Is Reciting a Sutra in Vain If You Don't Finish It? One Teaching That Freed Countless People From Self-Blame"
},
{
"id": "054",
"title": "見惡不勸，是慈悲還是怯懦？",
"text": "不助其惡，亦不棄其善；不縱其行，亦不恨其人。",
"en": "Do not aid their evil, nor abandon their good; do not indulge their conduct, nor hate the person.",
"title_en": "Not Speaking Up When You See Wrong — Compassion or Cowardice?"
},
{
"id": "055",
"title": "佛陀反對咒語嗎？",
"text": "持咒不等於證悟，感應不等於解脫。",
"en": "Reciting mantras is not awakening; spiritual responses are not liberation.",
"title_en": "Did the Buddha Oppose Mantras?"
},
{
"id": "056",
"title": "甚麼是用心?",
"text": "用心不是心很用力，而是心真正到場。",
"en": "Using the heart is not the heart straining hard, but the heart truly being present.",
"title_en": "What Does It Mean to Learn \"With Heart\"?"
}
];
  if (window.I18N && (window.I18N.lang === 'vi' || window.I18N.lang === 'ja' || window.I18N.lang === 'ko')) {
    const VV = (window.I18N.lang === 'ja' ? window.JA_VERSES : window.I18N.lang === 'ko' ? window.KO_VERSES : window.VI_VERSES) || {}, AR = (window.ARCHIVE_EN && window.ARCHIVE_EN.articles) || {};
    VERSES.forEach((v, i) => { if (VV[i]) v.en = VV[i]; if (AR[v.id]) v.title_en = AR[v.id].title; });
  }
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const shareVerse = async (text, title, id) => {
    const url = new URL('../s/' + id + '.html', location.href).href;
    const msg = '「' + text + '」\n' + L('——摘自〈' + title + '〉', '— from “' + title + '”', '— trích từ “' + title + '”', '——〈' + title + '〉より', '— 「' + title + '」에서') + '\n' + url;
    if (navigator.share) { try { await navigator.share({text: msg}); } catch {} return; }
    try { await navigator.clipboard.writeText(msg); const t = document.querySelector('.toast'); if (t) { t.textContent = L('已複製這句法語，可貼到 LINE', 'Line copied — paste it anywhere', 'Đã sao chép câu này', 'この一句をコピーしました', '이 구절을 복사했습니다'); t.classList.add('visible'); setTimeout(() => t.classList.remove('visible'), 2400); } }
    catch { window.prompt(L('複製這段分享：', 'Copy to share:', 'Sao chép để chia sẻ:', 'コピーして共有してください：', '복사해서 공유하세요:'), msg); }
  };
  let curMq = null, curEnd = null;
  // 玄金合璧：青山圖帶，隨機替換引句（所有螢幕寬度都顯示）
  const mq = document.querySelector('.mountain-quote .mq-inner');
  if (mq && VERSES.length) {
    const bq = mq.querySelector('blockquote'), src = mq.querySelector('a');
    let prev = null;
    try { prev = sessionStorage.getItem('ksitigarbha-verse'); } catch {}
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'mq-next';
    src.after(btn);
    const pick = () => {
      const pool = VERSES.filter(v => v.text !== prev);
      const v = pool[Math.floor(Math.random() * pool.length)];
      prev = v.text; curMq = v;
      try { sessionStorage.setItem('ksitigarbha-verse', v.text); } catch {}
      bq.textContent = isEN ? v.en : v.text;
      src.href = 'reader.html?id=' + v.id;
      src.textContent = L('摘自〈' + v.title + '〉 →', 'From “' + v.title_en + '” →', 'Trích từ “' + v.title_en + '” →', '〈' + v.title_en + '〉より →', '「' + v.title_en + '」에서 →');
      btn.textContent = L('換一句 ↻', 'Another line ↻', 'Câu khác ↻', '別の一句 ↻', '다른 구절 ↻');
    };
    const sh = document.createElement('button'); sh.type = 'button'; sh.className = 'mq-next mq-share'; sh.textContent = L('分享此句', 'Share this line', 'Chia sẻ câu này', 'この一句を共有', '이 구절 공유'); btn.after(sh);
    sh.addEventListener('click', () => curMq && shareVerse(isEN ? curMq.en : curMq.text, isEN ? curMq.title_en : curMq.title, curMq.id));
    btn.addEventListener('click', pick);
    pick();
  }
  // 文章頁結尾青山圖：隨機一句（排除本篇）
  const endP = document.querySelector('.fusion-end p');
  if (endP && VERSES.length) {
    const cur = new URLSearchParams(location.search).get('id');
    const wrap = endP.parentNode;
    const src = document.createElement('a'); src.className = 'end-src';
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'mq-next';
    endP.after(src, btn);
    let prevEnd = null;
    const pickEnd = () => {
      const pool = VERSES.filter(v => v.id !== cur && v.text !== prevEnd);
      const v = pool[Math.floor(Math.random() * pool.length)];
      prevEnd = v.text; curEnd = v;
      endP.textContent = isEN ? v.en : v.text;
      src.href = 'reader.html?id=' + v.id;
      src.textContent = L('摘自〈' + v.title + '〉 →', 'From “' + v.title_en + '” →', 'Trích từ “' + v.title_en + '” →', '〈' + v.title_en + '〉より →', '「' + v.title_en + '」에서 →');
      btn.textContent = L('換一句 ↻', 'Another line ↻', 'Câu khác ↻', '別の一句 ↻', '다른 구절 ↻');
    };
    const sh2 = document.createElement('button'); sh2.type = 'button'; sh2.className = 'mq-next mq-share'; sh2.textContent = L('分享此句', 'Share this line', 'Chia sẻ câu này', 'この一句を共有', '이 구절 공유'); btn.after(sh2);
    sh2.addEventListener('click', () => curEnd && shareVerse(isEN ? curEnd.en : curEnd.text, isEN ? curEnd.title_en : curEnd.title, curEnd.id));
    btn.addEventListener('click', pickEnd);
    pickEnd();
    wrap.classList.add('has-verse');
  }
  const host = document.querySelector('.mountain-hero');
  if (!host || !VERSES.length) return;
  const box = document.createElement('figure');
  box.className = 'hero-verse';
  host.appendChild(box);
  let last = null;
  try { last = sessionStorage.getItem('ksitigarbha-verse'); } catch {}
  let show = function () {
    let pool = VERSES.filter(v => v.text !== last);
    const v = pool[Math.floor(Math.random() * pool.length)];
    last = v.text;
    try { sessionStorage.setItem('ksitigarbha-verse', v.text); } catch {}
    const text = isEN ? v.en : v.text, title = isEN ? v.title_en : v.title;
    const cols = isEN ? [text] : v.text.replace(/。$/, '').split('；');
    box.classList.toggle('en', isEN);
    box.innerHTML = `<a class="verse-text" href="reader.html?id=${v.id}" aria-label="${esc(text)}${isEN ? ' (from "' + esc(title) + '")' : '（出自〈' + esc(title) + '〉）'}">${cols.map(c => `<span>${esc(c)}</span>`).join('')}</a>`
      + `<figcaption><a href="reader.html?id=${v.id}">${isEN ? 'From article ' + v.id : '出自第 ' + v.id + ' 篇'}</a><button type="button" class="verse-next" aria-label="${isEN ? 'Another line' : '換一句'}">${isEN ? 'Another line ↻' : '換一句 ↻'}</button></figcaption>`;
    box.querySelector('.verse-next').addEventListener('click', () => show());
  };
  // 依圖片實際裁切位置，把句子放在「左側文字」與「菩薩像」之間的空白處；放不下就放在文字下方。
  function place() {
    const img = host.querySelector('img'); if (!img.naturalWidth) return;
    const H = host.getBoundingClientRect(), r = img.getBoundingClientRect(), cs = getComputedStyle(img);
    const s = Math.max(r.width / img.naturalWidth, r.height / img.naturalHeight);
    const rw = img.naturalWidth * s, rh = img.naturalHeight * s;
    const pos = cs.objectPosition.split(' ').map(v => parseFloat(v) / 100);
    const ox = r.left + (r.width - rw) * pos[0], oy = r.top + (r.height - rh) * pos[1];
    const statueLeft = ox + 0.72 * rw - H.left;            // 錫杖左緣
    const imgTop = Math.max(r.top, oy) - H.top;
    const copyEls = [...host.querySelectorAll('.hero-copy > *')];
    const copyRight = Math.max(...copyEls.map(e => e.getBoundingClientRect().right)) - H.left;
    const copyBottom = Math.max(...copyEls.map(e => e.getBoundingClientRect().bottom)) - H.top;
    const footTop = (host.querySelector('.hero-foot')?.getBoundingClientRect().top ?? H.bottom) - H.top;
    box.style.cssText = 'left:auto;right:auto;top:auto;bottom:auto';
    box.classList.remove('below');
    const w = box.offsetWidth, h = box.offsetHeight;
    const gap = Math.max(20, H.width * 0.03);
    const mobile = innerWidth <= 760;
    const topSide = mobile ? Math.max(imgTop + 24, copyBottom + 24) : Math.max(64, imgTop + 40);
    if (statueLeft - gap - w >= (mobile ? 16 : copyRight + gap) && topSide + h <= footTop - 12) {
      box.style.left = (statueLeft - gap - w) + 'px';
      box.style.top = (mobile ? Math.max(topSide, footTop - 12 - h) : topSide) + 'px';
    } else {
      box.classList.add('below');
      const left = copyEls[0].getBoundingClientRect().left - H.left;
      box.style.left = left + 'px';
      box.style.top = (copyBottom + 28) + 'px';
      if (copyBottom + 28 + box.offsetHeight > footTop - 12 || left + box.offsetWidth > statueLeft - gap) box.classList.add('hidden-verse');
      else box.classList.remove('hidden-verse');
    }
  }
  const relayout = () => requestAnimationFrame(place);
  const origShow = show;
  show = function () { origShow(); relayout(); };
  show();
  window.addEventListener('resize', relayout);
  host.querySelector('img').addEventListener('load', relayout);
  document.fonts && document.fonts.ready.then(relayout);
})();
