"""每篇感應文產生獨立靜態頁（給 Google 收錄）＋ sitemap.xml。由 build_public.py 呼叫：build(root, dist)
輸出：dist/a/{id}.html（繁中）、dist/a/{sc,en,vi,ja,ko}/{id}.html；內容由 Python 直接排好，不靠 JavaScript。"""
import os, re, json, html as H
from datetime import date

BASE = 'https://denghapp-beep.github.io/dizang/'
LANGS = ['zh', 'sc', 'en', 'vi', 'ja', 'ko']
HL = {'zh': 'zh-Hant', 'sc': 'zh-Hans', 'en': 'en', 'vi': 'vi', 'ja': 'ja', 'ko': 'ko'}
SITE = {'zh': '地藏菩薩感應文集', 'sc': '地藏菩萨感应文集', 'en': 'Ksitigarbha Bodhisattva: Collected Responses',
        'vi': 'Tuyển tập cảm ứng Bồ Tát Địa Tạng', 'ja': '地蔵菩薩感応文集', 'ko': '지장보살 감응문집'}
LABEL = {
    'zh': {'context': '請示地藏王菩薩', 'original': '菩薩開示', 'translation': '白話翻譯', 'note': '原稿附註', 'account': '親身經歷 · 原稿'},
    'en': {'context': 'Inquiry to Ksitigarbha Bodhisattva', 'original': "The Bodhisattva's Teaching", 'translation': 'Plain Rendering', 'note': "Author's Note", 'account': 'Personal Account'},
    'vi': {'context': 'Thỉnh hỏi Bồ Tát Địa Tạng', 'original': 'Lời khai thị của Bồ Tát', 'translation': 'Bản diễn nghĩa', 'note': 'Ghi chú của tác giả', 'account': 'Trải nghiệm bản thân'},
    'ja': {'context': '地蔵菩薩へのお伺い', 'original': '菩薩の説示', 'translation': '現代語訳', 'note': '作者の附記', 'account': '体験談'},
    'ko': {'context': '지장보살님께 여쭘', 'original': '보살님의 법문', 'translation': '쉬운 풀이', 'note': '지은이의 덧붙임', 'account': '체험담'},
}
LABEL['sc'] = {'context': '请示地藏王菩萨', 'original': '菩萨开示', 'translation': '白话翻译', 'note': '原稿附注', 'account': '亲身经历 · 原稿'}
UI = {  # 返回文集, 在閱讀器開啟, 上一篇, 下一篇, 說明
    'zh': ('← 返回文集', '在閱讀模式開啟（可切換原文／白話、大字）', '上一篇', '下一篇', '作者感應紀錄 · 依提供原稿收錄'),
    'sc': ('← 返回文集', '在阅读模式开启（可切换原文／白话、大字）', '上一篇', '下一篇', '作者感应纪录 · 依提供原稿收录'),
    'en': ('← Back to the collection', 'Open in reading mode', 'Previous', 'Next', "Author's record · translated; the Chinese original is authoritative"),
    'vi': ('← Về tuyển tập', 'Mở ở chế độ đọc', 'Bài trước', 'Bài sau', 'Bản dịch; nguyên văn tiếng Trung là chuẩn'),
    'ja': ('← 文集に戻る', '読書モードで開く', '前の篇', '次の篇', '日本語訳。中国語の原文が基準です'),
    'ko': ('← 문집으로', '읽기 모드로 열기', '이전 글', '다음 글', '한국어 번역. 중국어 원문이 기준입니다'),
}
HEADER_TOKENS = ['實際法義以原文開示為準', '請示地藏王菩薩', '請示地藏菩薩', '弟子請示', '貼近原文翻譯', '原文逐句翻譯', '解釋菩薩意旨', '第一段', '白話翻譯', '白話解說', '白話', '翻譯', '菩薩開示', '開示原文', '感應原文', '原文轉述', '菩薩感應示語', '菩薩感應文', '菩薩感應', '菩薩原意', '感應地藏王菩薩', '地藏王菩薩', '夢中感應', '感應', '轉述', '轉示', '慈示', '示語', '原文', '開示', '菩薩', '原意', '意', '文']
DIAMOND = {'context', 'original', 'translation'}


def load_json(path, start_marker='{'):
    s = open(path, encoding='utf-8').read()
    return json.loads(s[s.index(start_marker):s.rindex('}') + 1])


def is_header(line):
    if len(line) > 32: return False
    t = re.sub(r'^\s*(?:[一二三四五六七八九十]+、|[（(][一二三四五六七八九十0-9]+[）)])', '', line.replace('🔶', ''))
    t = re.sub(r'[\s（）()【】《》「」『』:：;；,，.。、]', '', t)
    if not t: return False
    for k in HEADER_TOKENS: t = t.replace(k, '')
    return t == ''


def clean(kind, text):
    lines = text.split('\n')
    if kind in DIAMOND:
        while lines and not lines[0].strip(): lines.pop(0)
        if len(lines) > 1 and is_header(lines[0].strip()): lines.pop(0)
        if kind == 'context' and lines:
            lines[0] = re.sub(r'^\s*🔶?\s*請示地藏(?:王)?菩薩\s*[:：;；]\s*(?=\S)', '', lines[0])
    return '\n'.join(lines)


def body_html(text, wide):
    out, buf = [], []
    lim, lim2 = (72, 110) if wide else (32, 45)
    def flush():
        if not buf: return
        joiner = '<br>' if all(len(l) < lim for l in buf) else ' '
        out.append('<p>' + joiner.join(H.escape(l) for l in buf) + '</p>'); buf.clear()
    for line in text.replace('**', '').split('\n'):
        t = line.strip()
        if not t: flush(); continue
        if re.fullmatch(r'[*═=—⸻-]{3,}', t): flush(); out.append('<hr>'); continue
        if len(t) > lim2: flush(); buf.append(t); flush(); continue
        buf.append(t)
        if len(buf) >= 8 and re.search(r'[.?!"。？！」「]$', t): flush()
    flush()
    return ''.join(out)


def url(lang, i):
    return f'{BASE}a/{i}.html' if lang == 'zh' else f'{BASE}a/{lang}/{i}.html'


def page(lang, a, prev, nxt, versions, css_v, music_v):
    wide = lang in ('en', 'vi')
    up = '../' if lang == 'zh' else '../../'
    t, d = H.escape(a['title']), H.escape(a['summary'])
    lab = LABEL[lang]; ui = UI[lang]
    secs = []
    for b in a['blocks']:
        txt = clean(b['kind'], b['text']) if lang in ('zh', 'sc') else b['text']
        if not txt.strip(): continue
        mark = '<span class="diamond" aria-hidden="true">🔶</span>' if b['kind'] in DIAMOND else ''
        secs.append(f'<section class="text-section {b["kind"]}"><span class="section-label">{mark}{lab[b["kind"]]}</span>{body_html(txt, wide)}</section>')
    alt = ''.join(f'<link rel="alternate" hreflang="{HL[l]}" href="{url(l, a["id"])}">' for l in versions)
    alt += f'<link rel="alternate" hreflang="x-default" href="{url("zh", a["id"])}">'
    qs = '' if lang == 'zh' else f'&lang={lang}'
    rd = f'{up}fusion/reader.html?id={a["id"]}{qs}'
    home = f'{up}fusion/index.html' + ('' if lang == 'zh' else f'?lang={lang}')
    def nav(x, label):
        if not x: return '<span></span>'
        return f'<a href="{x["id"]}.html"><small>{label}</small>{H.escape(x["title"])}</a>'
    ld = json.dumps({'@context': 'https://schema.org', '@type': 'Article', 'headline': a['title'], 'description': a['summary'],
                     'inLanguage': HL[lang], 'url': url(lang, a['id']), 'image': BASE + 'assets/og.jpg',
                     'isPartOf': {'@type': 'WebSite', 'name': SITE[lang], 'url': BASE}}, ensure_ascii=False)
    return f'''<!doctype html><html lang="{HL[lang]}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{t} · {SITE[lang]}</title><meta name="description" content="{d}"><link rel="canonical" href="{url(lang, a["id"])}">{alt}
<meta property="og:title" content="{t}"><meta property="og:description" content="{d}"><meta property="og:site_name" content="{SITE[lang]}"><meta property="og:type" content="article">
<meta property="og:url" content="{url(lang, a["id"])}"><meta property="og:image" content="{BASE}assets/og.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<link rel="icon" href="{up}assets/lotus.svg" type="image/svg+xml"><link rel="stylesheet" href="{up}assets/style.css?v={css_v}">
<script type="application/ld+json">{ld}</script></head>
<body data-theme="gold" data-page="reader" class="fusion static-article">
<header class="site-header"><a class="brand" href="{home}"><span>{SITE[lang]}</span></a></header>
<main id="main" class="wrap static-wrap"><article>
<a class="back-link" href="{home}#collection">{ui[0]}</a>
<header class="article-heading"><div class="eyebrow">{(H.escape(a.get("category", "")) + " · ") if lang in ("zh", "sc") else ""}No.{a["number"]:02d}</div><h1>{t}</h1><p>{d}</p><div class="source-caption">{ui[4]}</div></header>
<p class="static-open"><a href="{rd}">{ui[1]} →</a></p>
<div class="article-body">{"".join(secs)}</div>
<nav class="static-pn">{nav(prev, ui[2])}{nav(nxt, ui[3])}</nav>
</article></main>
<footer><div class="footer-brand">南無地藏菩薩摩訶薩</div></footer>
<script src="{up}assets/music.js?v={music_v}" defer></script>
</body></html>'''


def build(root, dist):
    data = load_json(os.path.join(root, 'assets', 'data.js'))
    zh = data['articles']; byid = {a['id']: a for a in zh}
    sets = {'zh': zh}
    s = open(os.path.join(root, 'assets', 'data_sc.js'), encoding='utf-8').read()
    i0 = s.index('SC=') + 3; sc = json.JSONDecoder().raw_decode(s[i0:])[0]
    if sc and isinstance(sc.get('articles'), list): sets['sc'] = sc['articles']
    for l in ['en', 'vi', 'ja', 'ko']:
        p = os.path.join(root, 'assets', f'data_{l}.js')
        if not os.path.exists(p): continue
        fd = load_json(p)['articles']; arr = []
        for a in zh:
            e = fd.get(a['id'])
            if not e: continue
            arr.append(dict(a, title=e['title'], summary=e['summary'],
                            blocks=[dict(b, text=(e['blocks'][k] if k < len(e['blocks']) else b['text'])) for k, b in enumerate(a['blocks'])]))
        sets[l] = arr
    html_src = open(os.path.join(dist, 'fusion', 'reader.html'), encoding='utf-8').read()
    css_v = re.search(r'style\.css\?v=(\d+)', html_src).group(1); music_v = re.search(r'music\.js\?v=(\d+)', html_src).group(1)
    have = {l: {a['id'] for a in arr} for l, arr in sets.items()}
    n = 0
    for l, arr in sets.items():
        out = os.path.join(dist, 'a') if l == 'zh' else os.path.join(dist, 'a', l)
        os.makedirs(out, exist_ok=True)
        for k, a in enumerate(arr):
            versions = [x for x in LANGS if a['id'] in have.get(x, ())]
            open(os.path.join(out, a['id'] + '.html'), 'w', encoding='utf-8').write(
                page(l, a, arr[k - 1] if k else None, arr[k + 1] if k + 1 < len(arr) else None, versions, css_v, music_v))
            n += 1
    # sitemap：主要頁面＋每篇每語言靜態頁
    today = date.today().isoformat()
    locs = [BASE, BASE + 'fusion/index.html'] + [BASE + f'fusion/index.html?lang={l}' for l in LANGS[1:]] + \
           [BASE + 'fusion/' + p for p in ('zangjing.html', 'zhai.html', 'contact.html')]
    locs += [url(l, a['id']) for l, arr in sets.items() for a in arr]
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + \
          ''.join(f'  <url><loc>{H.escape(u)}</loc><lastmod>{today}</lastmod></url>\n' for u in locs) + '</urlset>\n'
    open(os.path.join(dist, 'sitemap.xml'), 'w', encoding='utf-8').write(xml)
    return n, len(locs), {l: len(v) for l, v in sets.items()}
