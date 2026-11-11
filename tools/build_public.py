"""產生要公開上線的網站到 dist/：python tools/build_public.py
只收「玄金合璧」正式版與必要資源；首頁直接導向 fusion/index.html。"""
import os, re, shutil
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dist = os.path.join(root, 'dist')
if os.path.exists(dist):
    for name in os.listdir(dist):
        if name == '.git': continue
        p = os.path.join(dist, name)
        shutil.rmtree(p) if os.path.isdir(p) else os.remove(p)
else:
    os.makedirs(dist)
os.makedirs(os.path.join(dist, 'assets'), exist_ok=True)
os.makedirs(os.path.join(dist, 'fusion'), exist_ok=True)
os.makedirs(os.path.join(dist, 'assets', 'sutras'), exist_ok=True)
ASSETS = ['style.css', 'app.js', 'data.js', 'data_en.js', 'data_vi.js', 'i18n_vi.js', 'data_ja.js', 'i18n_ja.js', 'data_sc.js', 'data_ko.js', 'i18n_ko.js', 'sc_map.js', 'i18n.js', 'music.js', 'counter.js', 'verses.js', 'zhai.js', 'zhai-page.js', 'zhai-notice.js', 'contact.js', 'zangjing.js', 'sutras/dizang.js', 'sutras/dizang_zhuyin.js', 'sutras/liturgy.js', 'sutras/pumen.js', 'sutras/pumen_zhuyin.js', 'sutras/jingang.js', 'sutras/jingang_zhuyin.js', 'sutras/amituo.js', 'sutras/amituo_zhuyin.js', 'sutras/wuliangshou.js', 'sutras/wuliangshou_zhuyin.js', 'og.jpg',
          'serif.woff2', 'gold.webp', 'paper.webp', 'mountain.webp', 'lotus.svg', 'FONT-LICENSE.txt']
for a in ASSETS:
    src = os.path.join(root, 'assets', a)
    if os.path.exists(src): shutil.copy2(src, os.path.join(dist, 'assets', a))
shutil.copytree(os.path.join(root, 'assets', 'fonts'), os.path.join(dist, 'assets', 'fonts'), dirs_exist_ok=True)
shutil.copy2(os.path.join(root, '原始文本.txt'), os.path.join(dist, '原始文本.txt'))
shutil.copy2(os.path.join(root, 'sitemap.xml'), os.path.join(dist, 'sitemap.xml'))
shutil.copy2(os.path.join(root, 'google502a86ca615780e4.html'), os.path.join(dist, 'google502a86ca615780e4.html'))
for page in ['index.html', 'reader.html', 'zhai.html', 'contact.html', 'zangjing.html']:
    h = open(os.path.join(root, 'fusion', page), encoding='utf-8').read()
    h = re.sub(r'<a class="edition" href="\.\./index\.html">.*?</a>', '', h)          # 頁首「三款範本」
    h = re.sub(r'<a href="\.\./index\.html">比較三款範本 ↗</a>', '', h)                 # 頁尾比較連結
    if page == 'index.html':
        h = h.replace('<title>地藏菩薩感應文集 · 玄金合璧</title>', '<title>地藏菩薩感應文集</title>')
    h = h.replace('<head>', '<head><meta property="og:title" content="地藏菩薩感應文集"><meta property="og:description" content="五十六篇地藏菩薩感應紀錄、提問、白話翻譯與修行體會。"><meta property="og:image" content="https://denghapp-beep.github.io/dizang/assets/og.jpg"><meta property="og:url" content="https://denghapp-beep.github.io/dizang/"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:type" content="website">', 1)
    open(os.path.join(dist, 'fusion', page), 'w', encoding='utf-8').write(h)
redirect = '''<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>地藏菩薩感應文集</title><meta name="description" content="地藏菩薩感應文集：五十六篇感應紀錄、提問、白話翻譯與修行體會。">
<meta property="og:title" content="地藏菩薩感應文集"><meta property="og:image" content="https://denghapp-beep.github.io/dizang/assets/og.jpg"><meta property="og:url" content="https://denghapp-beep.github.io/dizang/">
<link rel="icon" href="assets/lotus.svg" type="image/svg+xml"><meta http-equiv="refresh" content="0; url=fusion/index.html">
<script>location.replace('fusion/index.html' + location.search + location.hash);</script></head>
<body style="background:#141813;color:#e6dbc4;font-family:serif;text-align:center;padding-top:20vh"><a href="fusion/index.html" style="color:#d9b56a">地藏菩薩感應文集 →</a></body></html>'''
open(os.path.join(dist, 'index.html'), 'w', encoding='utf-8').write(redirect)
open(os.path.join(dist, '.nojekyll'), 'w').write('')
# 每篇的分享頁：LINE／Facebook 不執行 JavaScript，靠這些靜態頁顯示篇名與摘要，再轉到文章。
import json, html as H
src = open(os.path.join(root, 'assets', 'data.js'), encoding='utf-8').read()
data = json.loads(src[src.index('{'):src.rindex('}') + 1])
os.makedirs(os.path.join(dist, 's'), exist_ok=True)
BASE = 'https://denghapp-beep.github.io/dizang/'
for a in data['articles']:
    t, d, i = H.escape(a['title']), H.escape(a['summary']), a['id']
    open(os.path.join(dist, 's', i + '.html'), 'w', encoding='utf-8').write(
        f'<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        f'<title>{t} · 地藏菩薩感應文集</title><meta name="description" content="{d}">'
        f'<meta property="og:title" content="{t}"><meta property="og:description" content="{d}"><meta property="og:site_name" content="地藏菩薩感應文集">'
        f'<meta property="og:image" content="{BASE}assets/og.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">'
        f'<meta property="og:url" content="{BASE}s/{i}.html"><meta property="og:type" content="article">'
        f'<meta http-equiv="refresh" content="0; url=../fusion/reader.html?id={i}"><link rel="canonical" href="{BASE}fusion/reader.html?id={i}">'
        f'<script>location.replace("../fusion/reader.html?id={i}")</script></head>'
        f'<body style="background:#141813;color:#e6dbc4;font-family:serif;text-align:center;padding-top:20vh"><a href="../fusion/reader.html?id={i}" style="color:#d9b56a">{t} →</a></body></html>')

total = sum(os.path.getsize(os.path.join(d, f)) for d, _, fs in os.walk(dist) if '.git' not in d for f in fs)
print('dist ready:', round(total / 1e6, 2), 'MB')
