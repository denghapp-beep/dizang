"""內容或 HTML 有新增文字時重跑：python tools/subset_font.py
需要：pip install fonttools brotli
讀取 assets/serif.otf（完整字型，保留不刪），輸出只含網站用字的 assets/serif.woff2。"""
import glob, os, subprocess, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(root)
chars = set(chr(c) for c in range(0x20, 0x7f))
chars |= set('，。、；：？！「」『』（）《》〈〉—…·・　一二三四五六七八九十百')
for f in glob.glob('**/*.html', recursive=True) + ['assets/data.js', 'assets/data_en.js', 'assets/app.js', 'assets/i18n.js', 'assets/verses.js', 'assets/music.js', 'assets/counter.js', 'assets/style.css']:
    chars |= set(open(f, encoding='utf-8').read())
text = ''.join(sorted(c for c in chars if c.isprintable()))
with open('tools/_chars.txt', 'w', encoding='utf-8') as fh:
    fh.write(text)
subprocess.run([sys.executable, '-m', 'fontTools.subset', 'assets/serif.otf',
                '--text-file=tools/_chars.txt', '--flavor=woff2',
                '--output-file=assets/serif.woff2', '--layout-features=*',
                '--no-hinting', '--desubroutinize'], check=True)
os.remove('tools/_chars.txt')
print('assets/serif.woff2', os.path.getsize('assets/serif.woff2'), 'bytes,', len(text), 'chars')
