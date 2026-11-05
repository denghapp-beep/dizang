(() => {
  'use strict';
  const I=window.I18N||{lang:'zh',t:(z)=>z,cat:c=>c};const T=I.t;const EN=(I.foreign||I.lang==='en')&&window.ARCHIVE_EN;const VI=I.lang==='vi';const JA=I.lang==='ja';const READ_KEY='ksitigarbha-read';const readSet=()=>{try{return new Set(JSON.parse(localStorage.getItem(READ_KEY)||'[]'))}catch{return new Set()}};
  const {categories} = window.ARCHIVE;
  const articles = EN ? window.ARCHIVE.articles.map(a=>{const e=EN.articles[a.id];if(!e)return a;return Object.assign({},a,{title:e.title,summary:e.summary,blocks:a.blocks.map((b,i)=>Object.assign({},b,{text:e.blocks[i]??b.text})),body:e.blocks.join('\n'),minutes:JA?a.minutes:Math.max(1,Math.round(e.blocks.join(' ').split(/\s+/).length/200))});}) : window.ARCHIVE.articles;
  const $ = (s,root=document) => root.querySelector(s);
  const $$ = (s,root=document) => [...root.querySelectorAll(s)];
  const esc = text => String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const key='ksitigarbha-bookmarks-v1';
  let storageWorks=true;
  let saved=new Set();
  try { const value=JSON.parse(localStorage.getItem(key)||'[]'); if(Array.isArray(value)) saved=new Set(value.filter(v=>articles.some(a=>a.id===v))); } catch {storageWorks=false;}
  let toastTimer;
  function toast(message){const t=$('.toast');if(!t)return;t.textContent=message;t.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('visible'),2400);}
  function toggleSave(id){saved.has(id)?saved.delete(id):saved.add(id);try{localStorage.setItem(key,JSON.stringify([...saved]));}catch{storageWorks=false;} updateSaves();toast(storageWorks?(saved.has(id)?T('已加入本機收藏','Saved on this device'):T('已移除收藏','Removed from saved')):T('此瀏覽器無法儲存；收藏僅保留在這次閱讀','This browser cannot store data; saved items last only for this visit'));}
  function updateSaves(){if($('#saved-count'))$('#saved-count').textContent=saved.size;$$('[data-save]').forEach(b=>{const active=saved.has(b.dataset.save);b.setAttribute('aria-pressed',String(active));b.textContent=active?'◆':'◇';b.setAttribute('aria-label',(active?T('取消收藏：','Unsave: '):T('收藏：','Save: '))+articles.find(a=>a.id===b.dataset.save).title);});}
  const reEsc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  function highlight(text,q){if(!q)return esc(text);const re=new RegExp('('+reEsc(q)+')','gi');return String(text).split(re).map((part,i)=>i%2?'<mark>'+esc(part)+'</mark>':esc(part)).join('');}
  if(document.body.dataset.page==='home'){
    const stateKey='ksitigarbha-home-'+(document.body.dataset.theme||'');
    let category='全部',onlySaved=false,query='',limit=12,sort='source',restoreScroll=null;
    try{const s=JSON.parse(sessionStorage.getItem(stateKey)||'null');if(s){if(s.category==='全部'||categories.includes(s.category))category=s.category;onlySaved=!!s.onlySaved;query=String(s.query||'');limit=Math.max(12,Number(s.limit)||12);if(s.sort==='short')sort='short';if(s.returning)restoreScroll={y:Number(s.scrollY)||0,id:s.anchorId};}}catch{}
    function saveState(returning,anchorId){try{sessionStorage.setItem(stateKey,JSON.stringify({category,onlySaved,query,limit,sort,returning:!!returning,scrollY:scrollY,anchorId:anchorId||null}));}catch{}}
    $('#search').value=query;$('#sort').value=sort;$('#saved-filter').setAttribute('aria-pressed',String(onlySaved));
    function snippet(a,q){const text=a.blocks.map(b=>b.text).join(' ').replace(/\*\*/g,'').replace(/\s+/g,' ');const i=text.toLocaleLowerCase().indexOf(q);if(i<0)return null;const start=Math.max(0,i-30),end=Math.min(text.length,i+q.length+40);return (start>0?'…':'')+highlight(text.slice(start,end),q)+(end<text.length?'…':'');}
    function render(){
      const raw=query.trim(),q=raw.toLocaleLowerCase();
      const base=articles.filter(a=>(!onlySaved||saved.has(a.id))&&(!q||(a.title+' '+a.body).toLocaleLowerCase().includes(q)));
      $('#categories').innerHTML=['全部',...categories].map(c=>{const n=c==='全部'?base.length:base.filter(a=>a.category===c).length;return `<button data-category="${esc(c)}" aria-pressed="${c===category}">${esc(I.cat(c))}<span class="count">${n}</span></button>`;}).join('');
      let found=base.filter(a=>category==='全部'||a.category===category);
      if(sort==='short')found.sort((a,b)=>a.minutes-b.minutes||a.number-b.number);
      $('#result-count').textContent=T(`共 ${found.length} 篇${raw?' · 搜尋「'+raw+'」':''}`,`${found.length} ${found.length===1?'article':'articles'}${raw?' · search "'+raw+'"':''}`,`${found.length} bài${raw?' · tìm “'+raw+'”':''}`,`全 ${found.length} 篇${raw?'・検索「'+raw+'」':''}`);{const n=readSet().size;if(n)$('#result-count').textContent+=T(` · 已靜心閱讀 ${n} / 56 篇`,` · ${n} of 56 read`,` · đã đọc ${n} / 56 bài`,`・読了 ${n} / 56 篇`);};
      const qs=raw?'&q='+encodeURIComponent(raw):'';
      const RS=readSet();$('#article-list').innerHTML=found.slice(0,limit).map(a=>{const hit=q?snippet(a,q):null;return `<article class="article-card${RS.has(a.id)?' is-read':''}" id="card-${a.id}">${RS.has(a.id)?`<span class="read-seal" title="${T('已讀','Read','Đã đọc','既読')}">${T('已讀','Read','Đã đọc','既読')}</span>`:''}<span class="article-num">${a.id}</span><div class="article-main"><div class="card-meta"><span>${esc(I.cat(a.category))}</span><span class="dot">●</span><span>${T('約 '+a.minutes+' 分鐘','about '+a.minutes+' min','khoảng '+a.minutes+' phút','約 '+a.minutes+' 分')}</span></div><h3><a class="card-link" href="reader.html?id=${a.id}${qs}">${highlight(a.title,raw)}</a></h3><p${hit?' class="hit"':''}>${hit||esc(a.summary)}</p><div class="card-bottom"><span>${a.hasTranslation?T('原文 · 既有白話','Teaching · Plain rendering'):T('原稿全文','Full original text')}</span><span class="arrow" aria-hidden="true">↗</span></div></div><button class="save" data-save="${a.id}" aria-pressed="false" aria-label="${T('收藏：','Save: ')}${esc(a.title)}">◇</button></article>`;}).join('');
      $('#load-more').hidden=limit>=found.length;$('#empty').hidden=found.length!==0;updateSaves();saveState(false);
    }
    $('#categories').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;category=b.dataset.category;limit=12;render();});
    $('#search').addEventListener('input',e=>{query=e.target.value;limit=12;render();});
    $('#sort').addEventListener('change',e=>{sort=e.target.value;limit=12;render();});
    $('#saved-filter').addEventListener('click',e=>{onlySaved=!onlySaved;e.currentTarget.setAttribute('aria-pressed',String(onlySaved));limit=12;render();});
    $('#article-list').addEventListener('click',e=>{const b=e.target.closest('[data-save]');if(b){toggleSave(b.dataset.save);if(onlySaved)render();return;}const card=e.target.closest('.article-card');if(card)saveState(true,card.id);});
    $('#load-more').addEventListener('click',()=>{limit+=12;render();});
    $('#reset-filter').addEventListener('click',()=>{query='';category='全部';onlySaved=false;limit=12;$('#search').value='';$('#saved-filter').setAttribute('aria-pressed','false');render();});
    document.addEventListener('keydown',e=>{if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){e.preventDefault();$('#search').focus();}});
    render();
    if(restoreScroll){if('scrollRestoration' in history)history.scrollRestoration='manual';const run=()=>setTimeout(doRestore,30);document.readyState==='complete'?run():window.addEventListener('load',run,{once:true});}
    function doRestore(){const el=restoreScroll.id&&document.getElementById(restoreScroll.id);{window.scrollTo({top:restoreScroll.y,behavior:'instant'});if(el){const r=el.getBoundingClientRect();if(r.top<0||r.bottom>innerHeight)el.scrollIntoView({block:'center',behavior:'instant'});}}}
  }
  if(document.body.dataset.page==='reader'){
    const params=new URLSearchParams(location.search);
    const article=articles.find(a=>a.id===params.get('id'));if(article){try{const r=readSet();r.add(article.id);localStorage.setItem(READ_KEY,JSON.stringify([...r]));}catch{}}
    if(!article){$('.reader-article').innerHTML=T('<h1>找不到這篇文章</h1><p>請回到文集選擇篇章。</p><a class="primary" href="index.html#collection">返回文集 →</a>','<h1>Article not found</h1><p>Please return to the collection and choose an article.</p><a class="primary" href="index.html#collection">Back to the collection →</a>');return;}
    document.title=article.title+T(' · 地藏菩薩感應文集',' · Ksitigarbha: Collected Teachings');
    $('#article-title').textContent=article.title;if(article.sourceUrl&&/^https:\/\//.test(article.sourceUrl)){const cap=$('.source-caption');if(cap){const a=document.createElement('a');a.href=article.sourceUrl;a.target='_blank';a.rel='noopener noreferrer';a.className='source-link';a.textContent=T('原文出處 ↗','Original source ↗');cap.append(' · ',a);}}$('#article-summary').textContent=article.summary;
    $('#article-meta').textContent=I.cat(article.category)+' · '+article.id+' / '+String(articles.length).padStart(3,'0')+T(' · 約 '+article.minutes+' 分鐘',' · about '+article.minutes+' min',' · khoảng '+article.minutes+' phút','・約 '+article.minutes+' 分');
    const notices={
      '011':'<strong>閱讀提醒 · 身心危機</strong>本文為作者的感應記錄，其中「地獄之門，便已關半」是比喻，並非醫學數據，也不能單憑一個人的平靜或悲傷判斷風險。若擔心有人可能自傷，可直接關心並詢問、陪伴、協助確保安全及連結專業協助。若有立即危險，請立即聯絡當地緊急救援。<br><a href="https://www.nimh.nih.gov/health/publications/5-action-steps-to-help-someone-having-thoughts-of-suicide" target="_blank" rel="noopener noreferrer">參考 NIMH：協助有自殺想法者的五項行動 ↗</a>',
      '013':'<strong>閱讀提醒 · 醫療決策</strong>此篇記錄信仰層面的生死觀，並非醫療判定。是否屬於生命末期、意識狀況及維生治療的選擇，應與醫療團隊依病人意願、臨床狀況及適用程序討論；不宜由感應文字認定患者已無意識，或判斷應否停止治療。<br><a href="https://www.hpa.gov.tw/EngPages/List.aspx?nodeid=210" target="_blank" rel="noopener noreferrer">國民健康署：安寧療護 ↗</a>',
      '017':'<strong>閱讀提醒 · 照顧者支持</strong>此篇涉及長照壓力、自傷與傷害他人的討論。感應記錄不能代替實際的醫療、心理或照護協助。若已擔心自己或家人安全，請先尋求能到場協助的人與專業支援；有立即危險時聯絡當地緊急救援。',
      '030':'<strong>閱讀說明 · 個人經驗</strong>本文依許姓道友的自述保留。身心改善與信仰之間的因果關係未經醫學驗證，個人經驗不代表療效保證；身體不適仍應尋求醫療協助。',
      '033':'<strong>閱讀說明 · 個人經驗</strong>本文依許姓道友的自述保留，夢境、身心感受與事件之間的因果解釋屬於當事人的理解。',
      '019':'<strong>閱讀說明 · 年度感應記錄</strong>依原稿收錄二〇二六年的請示文字，內容不作為災難或未來事件的預測。來稿此篇未附白話，並有未閉合引號，網站保留原有文字。',
      '037':'<strong>閱讀說明 · 個人因緣</strong>此篇為作者自身十年感情經歷的請示與附註。原稿亦提醒：「緣有萬端，不可執一例而概天下。」'
    };
    if(EN&&EN.notices)Object.assign(notices,EN.notices);
    if(notices[article.id])$('#reading-notice').innerHTML='<div class="notice">'+notices[article.id]+'</div>';
    const hq=(params.get('q')||'').trim();
    let mode='all',fontSize=window.innerWidth<760?18:19;
    try{const v=Number(localStorage.getItem('ksitigarbha-font-size'));if(v>=16&&v<=30)fontSize=v;}catch{}
    function setFont(delta){fontSize=Math.min(30,Math.max(16,fontSize+delta));$('#article-body').style.setProperty('--reading-size',fontSize+'px');$('#font-down').disabled=fontSize<=16;$('#font-up').disabled=fontSize>=30;try{localStorage.setItem('ksitigarbha-font-size',fontSize);}catch{}}
    setFont(0);$('#font-down').onclick=()=>setFont(-2);$('#font-up').onclick=()=>setFont(2);
    const shareBtn=$('#share');if(shareBtn)shareBtn.addEventListener('click',async()=>{const url=new URL('../s/'+article.id+'.html',location.href).href;const title=article.title;
      if(navigator.share){try{await navigator.share({title,url});}catch{}return;}
      try{await navigator.clipboard.writeText(title+'\n'+url);toast(T('已複製本篇連結，可貼到 LINE 分享','Link copied — paste it anywhere to share','Đã sao chép liên kết, có thể dán để chia sẻ','この記事のリンクをコピーしました。LINE などに貼り付けて共有できます'));}
      catch{window.prompt(T('複製這個連結分享：','Copy this link to share:','Sao chép liên kết này để chia sẻ:','このリンクをコピーして共有してください：'),url);}});
    const modeLabels=EN?(JA?{context:'地蔵菩薩へのお伺い',original:'菩薩の説示',translation:'現代語訳',note:'作者の附記',account:'体験談'}:VI?{context:'Thỉnh hỏi Bồ Tát Địa Tạng',original:'Lời khai thị của Bồ Tát',translation:'Bản diễn nghĩa',note:'Ghi chú của tác giả',account:'Trải nghiệm bản thân'}:{context:'Inquiry to Ksitigarbha Bodhisattva',original:'The Bodhisattva\'s Teaching',translation:'Plain Rendering',note:'Author\'s Note',account:'Personal Account'}):{context:'請示地藏王菩薩',original:'菩薩開示',translation:'白話翻譯',note:'原稿附註',account:'親身經歷 · 原稿'};
    const navLabels=EN?(JA?{context:'お伺い',original:'説示',translation:'現代語訳',note:'附記',account:'体験'}:VI?{context:'Thỉnh hỏi',original:'Khai thị',translation:'Diễn nghĩa',note:'Ghi chú',account:'Trải nghiệm'}:{context:'Inquiry',original:'Teaching',translation:'Plain rendering',note:'Note',account:'Account'}):{context:'請示',original:'菩薩開示',translation:'白話翻譯',note:'原稿附註',account:'親身經歷'};
    const diamond={context:true,original:true,translation:true};
    const headerTokens=['實際法義以原文開示為準','請示地藏王菩薩','請示地藏菩薩','弟子請示','貼近原文翻譯','原文逐句翻譯','解釋菩薩意旨','第一段','白話翻譯','白話解說','白話','翻譯','菩薩開示','開示原文','感應原文','原文轉述','菩薩感應示語','菩薩感應文','菩薩感應','菩薩原意','感應地藏王菩薩','地藏王菩薩','夢中感應','感應','轉述','轉示','慈示','示語','原文','開示','菩薩','原意','意','文'];
    function isHeader(line){if(line.length>32)return false;let t=line.replace(/🔶/g,'').replace(/^\s*(?:[一二三四五六七八九十]+、|[（(][一二三四五六七八九十0-9]+[）)])/,'').replace(/[\s（）()【】《》「」『』:：;；,，.。、]/g,'');if(!t)return false;for(const k of headerTokens)t=t.split(k).join('');return t==='';}
    function cleanBlock(b){const lines=b.text.split('\n');let note='';
      if(diamond[b.kind]){
        while(lines.length&&!lines[0].trim())lines.shift();
        if(lines.length>1&&isHeader(lines[0].trim())){if(/實際法義/.test(lines[0]))note=T('實際法義以原文開示為準','the original teaching is authoritative');lines.shift();}
        if(b.kind==='context'&&lines.length){lines[0]=lines[0].replace(/^\s*🔶?\s*請示地藏(?:王)?菩薩\s*[:：;；]\s*(?=\S)/,'');}
      }
      return {text:lines.join('\n'),note};}
    function bodyHTML(text){
      const lines=text.replace(/\*\*/g,'').split('\n');let chunks=[],buffer=[];
      function flush(){if(!buffer.length)return;let joiner=buffer.every(l=>l.trim().length<(EN?72:32))?'<br>':' ';chunks.push('<p>'+buffer.map(l=>highlight(l,hq)).join(joiner)+'</p>');buffer=[];}
      for(const line of lines){const t=line.trim();if(!t){flush();continue;}if(/^[*═=—⸻-]{3,}$/.test(t)){flush();chunks.push('<hr>');continue;}if(t.length>(EN?110:45)){flush();buffer.push(t);flush();continue;}buffer.push(t);if(buffer.length>=8&&/[.?!"。？！」「]$/.test(t))flush();}
      flush();return chunks.join('');
    }
    const searchNote=document.createElement('p');searchNote.id='search-note';searchNote.className='search-note';searchNote.hidden=true;
    $('#article-body').before(searchNote);
    searchNote.addEventListener('click',e=>{if(e.target.id!=='clear-mark')return;const u=new URL(location.href);u.searchParams.delete('q');history.replaceState(null,'',u);location.reload();});
    const numerals=EN?['1','2','3','4','5','6','7','8','9','10']:'一二三四五六七八九十';
    const jump=document.createElement('label');jump.className='section-jump';
    jump.innerHTML=T('<span>段落</span><select id="section-jump" aria-label="跳至本篇段落"></select>','<span>Section</span><select id="section-jump" aria-label="Jump to a section"></select>');
    $('.reader-toolbar').appendChild(jump);
    $('#section-jump').addEventListener('change',e=>{const target=document.getElementById(e.target.value);if(target)target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});e.target.value='';});
    function renderBody(){
      const filtered=article.blocks.filter(b=>mode==='all'||b.kind===mode||b.kind==='context'||b.kind==='note'||b.kind==='account');
      const totals={},seen={};filtered.forEach(b=>totals[b.kind]=(totals[b.kind]||0)+1);
      const nums=filtered.map(b=>{seen[b.kind]=(seen[b.kind]||0)+1;return totals[b.kind]>1?' '+(numerals[seen[b.kind]-1]||seen[b.kind]):'';});
      const labels=filtered.map((b,i)=>navLabels[b.kind]+nums[i]);
      $('#article-body').innerHTML=filtered.map((b,i)=>{const c=cleanBlock(b);return `<section class="text-section ${b.kind}" id="section-${i}"><span class="section-label">${diamond[b.kind]?'<span class="diamond" aria-hidden="true">🔶</span>':''}${modeLabels[b.kind]}${nums[i]}${c.note?'<small>（'+c.note+'）</small>':''}</span>${bodyHTML(c.text)}</section>`;}).join('');
      $('#section-nav').innerHTML=labels.map((l,i)=>`<a href="#section-${i}">${l}</a>`).join('');
      $('#section-jump').innerHTML=T('<option value="">跳至本篇段落…</option>','<option value="">Jump to a section…</option>')+labels.map((l,i)=>`<option value="section-${i}">${l}</option>`).join('');
      $('.section-jump').hidden=filtered.length<2;
      $('#mode-note').textContent=JA?(mode==='all'?'日本語訳。原稿の順序に沿って掲載しています。中国語の原文が基準です。':mode==='translation'?'お伺い・現代語訳・作者の附記を表示しています。':'お伺い・説示・作者の附記を表示しています。'):VI?(mode==='all'?'Bản dịch tiếng Việt, theo thứ tự bản thảo gốc. Nguyên văn tiếng Trung là chuẩn.':mode==='translation'?'Hiển thị lời thỉnh hỏi, bản diễn nghĩa và ghi chú của tác giả.':'Hiển thị lời thỉnh hỏi, lời khai thị và ghi chú của tác giả.'):EN?(mode==='all'?'English translation, in the order of the original manuscript. The Chinese original is authoritative.':mode==='translation'?'Showing the inquiry, the plain rendering and the author\'s notes.':'Showing the inquiry, the teaching and the author\'s notes.'):(mode==='all'?'依原稿順序閱讀；標籤與分段為編排輔助。':mode==='translation'?'以下保留提問、來稿已有白話與原稿附註。':'以下保留提問、感應原文與原稿附註。');
      if(!article.hasTranslation)$('#mode-note').textContent=T('此篇未附獨立白話譯文，依原稿全文收錄。','The original has no separate plain rendering; the full text is given as received.');
      const marks=$$('#article-body mark').length;
      $('#search-note').hidden=!hq;
      if(hq)$('#search-note').innerHTML=marks?T(`已標示「${esc(hq)}」共 ${marks} 處 <button type="button" id="clear-mark">清除標示</button>`,`Highlighted "${esc(hq)}" in ${marks} ${marks===1?'place':'places'} <button type="button" id="clear-mark">Clear highlights</button>`,`Đã đánh dấu “${esc(hq)}” tại ${marks} chỗ <button type="button" id="clear-mark">Xóa đánh dấu</button>`,`「${esc(hq)}」を本文中 ${marks} か所に表示しました <button type="button" id="clear-mark">表示を消す</button>`):T(`本篇的「${esc(hq)}」出現在篇名或跨行文字，正文未標示。 <button type="button" id="clear-mark">關閉</button>`,`"${esc(hq)}" appears in the title or across lines, so nothing is highlighted in the text. <button type="button" id="clear-mark">Close</button>`,`“${esc(hq)}” xuất hiện trong tiêu đề hoặc nằm vắt qua dòng, nên không được đánh dấu trong bài. <button type="button" id="clear-mark">Đóng</button>`,`「${esc(hq)}」は題名または行をまたいで現れるため、本文には表示していません。 <button type="button" id="clear-mark">閉じる</button>`);
      toolbarHeight();
    }
    function toolbarHeight(){document.documentElement.style.setProperty('--toolbar-h',$('.reader-toolbar').offsetHeight+'px');}
    window.addEventListener('resize',toolbarHeight);
    $('[data-mode="translation"]').disabled=!article.hasTranslation;
    if(!article.hasTranslation)$('[data-mode="translation"]').title=T('此篇原稿未附獨立白話','No plain rendering in the original');
    $$('.mode-buttons button').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;$$('.mode-buttons button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderBody();}));
    function updateBookmark(){const active=saved.has(article.id);$('#bookmark').setAttribute('aria-pressed',String(active));$('#bookmark').textContent=active?T('已收藏','Saved'):T('收藏','Save');}
    $('#bookmark').addEventListener('click',()=>{toggleSave(article.id);updateBookmark();});updateBookmark();
    const idx=articles.indexOf(article);
    $('#article-pagination').innerHTML=(idx>0?`<a href="reader.html?id=${articles[idx-1].id}"><span>${T('← 上一篇','← Previous')}</span><strong>${esc(articles[idx-1].title)}</strong></a>`:'<span></span>')+(idx<articles.length-1?`<a href="reader.html?id=${articles[idx+1].id}"><span>${T('下一篇 →','Next →')}</span><strong>${esc(articles[idx+1].title)}</strong></a>`:`<a href="index.html#collection"><span>${T('已讀至文集最後一篇','You have reached the last article')}</span><strong>${T('返回文集 →','Back to the collection →')}</strong></a>`);
    $('#related-list').innerHTML=articles.filter(a=>a.category===article.category&&a.id!==article.id).slice(0,3).map(a=>`<a href="reader.html?id=${a.id}">${esc(a.title)} <span>↗</span></a>`).join('');
    $('.to-top').onclick=()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    function progress(){const range=document.documentElement.scrollHeight-innerHeight;$('.reading-progress i').style.width=(range>0?Math.min(100,scrollY/range*100):100)+'%';}
    window.addEventListener('scroll',progress,{passive:true});window.addEventListener('resize',progress);renderBody();progress();
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;const target=e.key==='ArrowLeft'?articles[idx-1]:e.key==='ArrowRight'?articles[idx+1]:null;if(target){e.preventDefault();location.href='reader.html?id='+target.id;}});
    const posKey='ksitigarbha-reading-pos';let positions={};
    try{positions=JSON.parse(localStorage.getItem(posKey)||'{}')||{};}catch{}
    let posTimer;
    window.addEventListener('scroll',()=>{clearTimeout(posTimer);posTimer=setTimeout(()=>{const range=document.documentElement.scrollHeight-innerHeight;if(range<=0)return;positions[article.id]=Math.round(scrollY/range*1000)/1000;try{localStorage.setItem(posKey,JSON.stringify(positions));}catch{}},400);},{passive:true});
    const firstMark=$('#article-body mark');
    if(firstMark){requestAnimationFrame(()=>firstMark.scrollIntoView({block:'center',behavior:reduce?'auto':'smooth'}));}
    else if(!location.hash){const r=Number(positions[article.id]);if(r>0.03&&r<0.97){requestAnimationFrame(()=>{window.scrollTo({top:r*(document.documentElement.scrollHeight-innerHeight),behavior:'instant'});toast(T('已回到上次閱讀位置','Returned to where you left off'));});}}
  }
})();
