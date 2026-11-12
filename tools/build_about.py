"""把「閱讀與製作說明.md」轉成 about.html：python tools/build_about.py
需要：pip install markdown"""
import os, re, markdown
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(root, '閱讀與製作說明.md'), encoding='utf-8').read()
body = markdown.markdown(src, extensions=['tables'])
src_en_path = os.path.join(root, '閱讀與製作說明_en.md')
body_en = markdown.markdown(open(src_en_path, encoding='utf-8').read(), extensions=['tables']) if os.path.exists(src_en_path) else ''
body = body.replace('<table>', '<div class="table-wrap"><table>').replace('</table>', '</table></div>')
body_en = body_en.replace('<table>', '<div class="table-wrap"><table>').replace('</table>', '</table></div>')
body = re.sub(r'<a href="(https?://[^"]+)">', r'<a href="\1" target="_blank" rel="noopener noreferrer">', body)
body = '<div class="only-zh">' + body + '</div>' + ('<div class="only-en" lang="en">' + body_en + '</div>' if body_en else '')
logo = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 37C11 36 5 29 5 19c10 0 16 6 19 18Zm0 0c13-1 19-8 19-18-10 0-16 6-19 18Zm0-1C14 27 14 16 24 6c10 10 10 21 0 30Z"/><path d="M10 40h28"/></svg>'
html = f'''<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="地藏菩薩感應文集網站的閱讀與製作說明。"><title>閱讀與製作說明 · 地藏菩薩感應文集</title><link rel="icon" href="assets/lotus.svg" type="image/svg+xml"><link rel="stylesheet" href="assets/style.css?v=16"></head><body class="showcase"><header class="showcase-header"><a class="brand" href="index.html">{logo}<span>地藏菩薩<span class="brand-sub">感 應 網 站 · 設 計 提 案</span></span></a><a href="index.html"><span class="only-zh">← 回到三款範本</span><span class="only-en">← Back to the designs</span></a></header><main id="main" class="doc-page"><span class="eyebrow">ABOUT · 閱讀與製作說明</span>{body}</main><footer><div class="footer-brand">願文字成為一盞燈。</div><div class="footer-bottom"><a href="原始文本.txt" download>下載原始文本 ↓</a><a href="index.html">比較三款範本 ↗</a></div></footer><script src="assets/i18n.js?v=1"></script><script src="assets/music.js?v=24"></script><script src="assets/counter.js?v=3"></script></body></html>'''
open(os.path.join(root, 'about.html'), 'w', encoding='utf-8').write(html)
print('about.html written')
