/* 背景音樂：以 YouTube 官方嵌入播放器播放，不下載、不另存音檔。
   新增曲目：在 TRACKS 加一筆 {id:'YouTube 影片 ID', title:'顯示名稱', start:起始秒數}。 */
(() => {
  'use strict';
  // 換頁不中斷音樂：播放器只放在最外層頁面（外框），站內換頁改在內層 iframe 進行，
  // 外框不重新載入，YouTube 播放器就一直在。內層頁面不另建播放器，只把第一次點擊轉給外框解除靜音。
  let shellTop = null;
  try { if (window.top !== window && window.top.__KSHELL) shellTop = window.top.__KSHELL; } catch {}
  if (shellTop) {
    const first = () => { ['pointerup', 'keydown'].forEach(t => document.removeEventListener(t, first, true)); try { shellTop.unmute(); } catch {} };
    ['pointerup', 'keydown'].forEach(t => document.addEventListener(t, first, true));
    // 經書模式（全螢幕直排）時，外框的音樂按鈕先收起，避免蓋住經文
    const sync = () => { try { shellTop.lock(document.documentElement.classList.contains('zr-lock')); } catch {} };
    new MutationObserver(sync).observe(document.documentElement, {attributes: true, attributeFilter: ['class']});
    addEventListener('pagehide', () => { try { shellTop.lock(false); } catch {} });
    // 站外連結開在最外層（或新分頁），不要卡在內框裡
    document.addEventListener('click', e => {
      const a = e.target.closest && e.target.closest('a[href]'); if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      let u; try { u = new URL(a.href, location.href); } catch { return; }
      if (u.origin !== location.origin) a.target = '_top';
    }, true);
    return;
  }
  const T = (z, e, v) => window.I18N ? window.I18N.t(z, e, v) : z;
  const TRACKS = [
    {id:'180E05O2xWk', title:T('南無地藏王菩薩聖號','Namo Ksitigarbha Bodhisattva (chant)'), credit:'TheCYH99', start:73},
    {id:'8E6H7neQt8I', title:T('佛光山梵唄《普門品》','Fo Guang Shan chant: Universal Gate Chapter'), credit:T('佛光山梵唄讚頌團－如是我聞','Fo Guang Shan Buddhist Hymn Choir'), start:0},
    {id:'OHE3cQ1rW7Y', title:T('《地藏王菩薩》路勇演唱','“Ksitigarbha Bodhisattva” sung by Lu Yong','“Địa Tạng Vương Bồ Tát” – Lộ Dũng trình bày'), credit:'佛弟子', start:0}
  ];
  const DEFAULT_VOLUME = 5;            // 0–100；預設最低、有聲音即可
  const KEY = 'ksitigarbha-music-v1';  // 偏好（開關、曲目、音量）存於本機
  const POS = 'ksitigarbha-music-pos'; // 播放位置存於本分頁，換頁後接續

  const read = (store, k, fallback) => { try { return JSON.parse(store.getItem(k)) ?? fallback; } catch { return fallback; } };
  const write = (store, k, v) => { try { store.setItem(k, JSON.stringify(v)); } catch {} };
  const pref = Object.assign({on:true, track:TRACKS[0].id, volume:DEFAULT_VOLUME}, read(localStorage, KEY, {}));
  if (!TRACKS.some(t => t.id === pref.track)) pref.track = TRACKS[0].id;
  const savePref = () => write(localStorage, KEY, pref);
  const track = () => TRACKS.find(t => t.id === pref.track);

  const root = document.createElement('div');
  root.className = 'music';
  root.innerHTML = `
    <button type="button" class="music-toggle" aria-expanded="false" aria-controls="music-panel"><span class="music-icon" aria-hidden="true">♪</span><span class="music-state">${T('背景音樂','Background music')}</span></button>
    <div class="music-panel" id="music-panel" hidden>
      <div class="music-head"><strong>${T('背景音樂','Background music')}</strong><button type="button" class="music-close" aria-label="${T('收合','Close')}">×</button></div>
      <label class="music-row"><span>${T('播放','Play')}</span><button type="button" class="music-play" aria-pressed="false">${T('開啟','Play')}</button></label>
      <label class="music-row"><span>${T('曲目','Track')}</span><select class="music-track" aria-label="${T('選擇背景音樂','Choose background music')}">${TRACKS.map(t => `<option value="${t.id}">${t.title}</option>`).join('')}</select></label>
      <label class="music-row"><span>${T('音量','Volume')}</span><input class="music-volume" type="range" min="1" max="40" step="1" aria-label="${T('背景音樂音量','Music volume')}"><output class="music-vol-out"></output></label>
      <div class="music-player-wrap"><div id="music-player"></div></div>
      <p class="music-note">${T('音源：YouTube · ','Source: YouTube · ')}<span class="music-credit"></span>${T('。若瀏覽器先以靜音開始，點一下頁面即可聽到。','. If the browser starts muted, tap the page once to hear it.')}</p>
    </div>`;
  document.body.appendChild(root);
  const $ = s => root.querySelector(s);
  $('.music-track').value = pref.track;
  $('.music-volume').value = pref.volume;
  $('.music-vol-out').textContent = pref.volume;
  $('.music-credit').textContent = track().credit || '';

  let player = null, ready = false, wantPlay = false, apiLoading = false, playing = false, mutedAuto = false;

  function setState(text, active) {
    $('.music-state').textContent = text;
    root.classList.toggle('is-playing', !!active);
    root.classList.toggle('show-text', !active && text !== T('背景音樂','Background music'));
    $('.music-toggle').setAttribute('aria-label', text);
    $('.music-play').setAttribute('aria-pressed', String(!!active));
    $('.music-play').textContent = active ? T('暫停','Pause') : T('開啟','Play');
  }
  function loadApi() {
    if (apiLoading) return; apiLoading = true;
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { if (prev) prev(); createPlayer(); };
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.onerror = () => setState(T('音樂無法載入','Music could not load'), false);
    document.head.appendChild(s);
  }
  function startAt() {
    const p = read(sessionStorage, POS, null);
    return p && p.id === pref.track && p.t > 0 ? Math.floor(p.t) : (track().start || 0);
  }
  function createPlayer() {
    player = new YT.Player('music-player', {
      width: 240, height: 135, videoId: pref.track,
      playerVars: {start: startAt(), playsinline: 1, rel: 0, modestbranding: 1, controls: 1},
      events: {
        onReady: () => {
          ready = true; player.setVolume(0);
          if (!wantPlay) return;
          if (entered || document.querySelector('.enter-gate.leaving')) { player.unMute(); }
          player.unMute(); player.playVideo();
          // 瀏覽器若擋下有聲自動播放，改為靜音先播，訪客一互動就恢復聲音。
          setTimeout(() => {
            if (!wantPlay || player.getPlayerState() === YT.PlayerState.PLAYING && !player.isMuted()) return;
            mutedAuto = true; player.mute(); player.playVideo();
            setState(T('點一下頁面即可聆聽聖號','Tap the page to hear the chant'), false);
          }, 1500);
        },
        onStateChange: e => {
          playing = e.data === YT.PlayerState.PLAYING;
          if (playing && !mutedAuto) { setState(T('聖號播放中','Chant playing'), true); fadeTo(pref.volume, 2000); }
          else if (e.data === YT.PlayerState.PAUSED) setState(T('背景音樂','Background music'), false);
          else if (e.data === YT.PlayerState.ENDED) { player.seekTo(0); player.playVideo(); }
        },
        onError: () => setState(T('此曲目無法嵌入播放','This track cannot be embedded'), false)
      }
    });
  }
  // 淡入淡出：誦經音樂不突然出聲、不突然中斷
  let fadeTimer = null;
  function fadeTo(target, ms, done) {
    clearInterval(fadeTimer);
    if (!ready) { done && done(); return; }
    let v = player.getVolume ? player.getVolume() : 0; const steps = Math.max(1, Math.round(ms / 50)), step = (target - v) / steps; let i = 0;
    fadeTimer = setInterval(() => { i++; v += step; player.setVolume(Math.max(0, Math.round(i >= steps ? target : v))); if (i >= steps) { clearInterval(fadeTimer); done && done(); } }, 50);
  }
  function play() {
    wantPlay = true; pref.on = true; savePref();
    if (!player) { setState(T('載入中…','Loading…'), false); loadApi(); return; }
    if (ready) { unmuteNow(); player.playVideo(); }
  }
  function unmuteNow() {
    if (!ready) return;
    player.unMute(); if (player.getPlayerState() === YT.PlayerState.PLAYING) { player.setVolume(0); fadeTo(pref.volume, 2000); }
    if (mutedAuto) { mutedAuto = false; if (player.getPlayerState() === YT.PlayerState.PLAYING) setState(T('聖號播放中','Chant playing'), true); }
  }
  function pause() {
    wantPlay = false; pref.on = false; savePref();
    if (ready) fadeTo(0, 1200, () => { if (!wantPlay) player.pauseVideo(); });
    setState(T('背景音樂','Background music'), false);
  }
  function savePos() {
    if (ready && player.getCurrentTime) write(sessionStorage, POS, {id: pref.track, t: player.getCurrentTime()});
  }
  setInterval(savePos, 5000);
  window.addEventListener('pagehide', savePos);

  $('.music-toggle').addEventListener('click', () => {
    const open = $('.music-panel').hidden;
    $('.music-panel').hidden = !open;
    $('.music-toggle').setAttribute('aria-expanded', String(open));
  });
  $('.music-close').addEventListener('click', () => { $('.music-panel').hidden = true; $('.music-toggle').setAttribute('aria-expanded', 'false'); });
  $('.music-play').addEventListener('click', e => { e.preventDefault(); playing || wantPlay && !ready ? pause() : play(); });
  $('.music-volume').addEventListener('input', e => {
    pref.volume = Number(e.target.value); $('.music-vol-out').textContent = pref.volume; savePref();
    if (ready) { clearInterval(fadeTimer); player.setVolume(pref.volume); }
  });
  $('.music-track').addEventListener('change', e => {
    pref.track = e.target.value; savePref(); $('.music-credit').textContent = track().credit || '';
    if (ready) { player.loadVideoById({videoId: pref.track, startSeconds: track().start || 0}); player.setVolume(0); }
    else play();
  });

  // 預設開啟：瀏覽器禁止未經點擊就出聲，所以每次開啟網站先顯示入口畫面，
  // 訪客點「進入」的同一下就開始播放聖號（只出現一次，同一分頁內換頁不再出現）。
  const ENTER = 'ksitigarbha-entered';
  let entered = false;
  // 手機瀏覽器會把分頁保留很久，sessionStorage 不會清空；改成離開超過 30 分鐘就視為重新進站。
  // 入口畫面不再受「上次選靜音」影響，每次進站都會出現。
  const TTL = 30 * 60 * 1000;
  try { entered = Date.now() - (+sessionStorage.getItem(ENTER) || 0) < TTL; } catch {}
  function markEntered() { try { sessionStorage.setItem(ENTER, String(Date.now())); } catch {} }
  const touch = () => { if (entered) markEntered(); };
  addEventListener('pagehide', touch); document.addEventListener('visibilitychange', () => { if (document.hidden) touch(); });
  {
    if (pref.on) play();
    // 獨立文章頁（搜尋引擎進來的讀者）不擋入口畫面，直接讀文章；音樂按鈕仍在
    if (!entered && !document.body.classList.contains('static-article')) {
      const gate = document.createElement('div');
      gate.className = 'enter-gate';
      gate.setAttribute('role', 'dialog');
      gate.setAttribute('aria-label', T('進入網站', 'Enter the site'));
      gate.innerHTML = `<div class="enter-inner">
        <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 37C11 36 5 29 5 19c10 0 16 6 19 18Zm0 0c13-1 19-8 19-18-10 0-16 6-19 18Zm0-1C14 27 14 16 24 6c10 10 10 21 0 30Z"/><path d="M10 40h28"/></svg>
        <p class="enter-title">${T('南無地藏王菩薩', 'Namo Ksitigarbha Bodhisattva')}</p>
        <p class="enter-sub">${T('地藏菩薩感應文集', 'Collected Teachings')}</p>
        <button type="button" class="enter-go">${T('點擊進入 · 聆聽聖號', 'Enter · with the chant')}</button>
        <button type="button" class="enter-quiet">${T('靜音進入', 'Enter without sound')}</button></div>`;
      document.body.appendChild(gate);
      document.documentElement.classList.add('gate-open');
      const close = () => { entered = true; gate.classList.add('leaving'); document.documentElement.classList.remove('gate-open'); markEntered(); setTimeout(() => gate.remove(), 600); };
      gate.querySelector('.enter-go').addEventListener('click', () => { play(); unmuteNow(); if (ready) player.playVideo(); close(); });
      gate.querySelector('.enter-quiet').addEventListener('click', () => { pause(); close(); });
      gate.querySelector('.enter-go').focus();
    }
    const first = e => {
      if (root.contains(e.target) || e.target.closest('.enter-gate')) return;
      ['pointerup', 'keydown'].forEach(t => document.removeEventListener(t, first, true));
      if (wantPlay) { unmuteNow(); if (ready && player.getPlayerState() !== YT.PlayerState.PLAYING) player.playVideo(); }
    };
    ['pointerup', 'keydown'].forEach(t => document.addEventListener(t, first, true));
  }

  // ── 外框：攔截站內換頁，改在全螢幕 iframe 內載入 ──
  window.__KSHELL = { lock: on => root.classList.toggle('shell-lock', !!on), unmute: () => { if (wantPlay) { unmuteNow(); if (ready && player.getPlayerState() !== YT.PlayerState.PLAYING) player.playVideo(); } } };
  let frame = null; const homeTitle = document.title;
  const isPage = u => u.origin === location.origin && /(\.html?|\/)$/i.test(u.pathname);
  function showFrame(on) { document.documentElement.classList.toggle('shell-on', on); if (frame) frame.hidden = !on; }
  function openInFrame(url, push) {
    if (!frame) {
      frame = document.createElement('iframe');
      frame.className = 'shell-frame'; frame.title = document.title;
      frame.setAttribute('allow', 'fullscreen; autoplay'); frame.setAttribute('allowfullscreen', '');
      frame.addEventListener('load', () => {
        try {
          const w = frame.contentWindow, d = w.document;
          if (!/^https?:/.test(w.location.href)) return;
          document.title = d.title; frame.title = d.title;
          if (location.href !== w.location.href) history.replaceState({shell: true}, d.title, w.location.href);
        } catch {}
      });
      document.body.insertBefore(frame, root);
    }
    if (push) history.pushState({shell: true}, '', url);
    showFrame(true);
    frame.src = url;
  }
  document.addEventListener('click', e => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download') || root.contains(a)) return;
    let u; try { u = new URL(a.href, location.href); } catch { return; }
    if (!isPage(u)) return;
    if (u.pathname === location.pathname && u.search === location.search && u.hash) return; // 同頁錨點照常捲動
    e.preventDefault();
    openInFrame(u.href, true);
  });
  // 返回鍵回到最初那一頁時，收起內框；再按前進則重新顯示
  addEventListener('popstate', e => {
    if (e.state && e.state.shell) { if (frame) { showFrame(true); document.title = frame.title; } else openInFrame(location.href, false); }
    else { showFrame(false); document.title = homeTitle; }
  });
})();
