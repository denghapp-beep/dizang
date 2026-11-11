"""合併譯稿（越南文 vi／日文 ja） → assets/data_vi.js、assets/i18n_vi.js，並做結構檢查。
用法：python3 tools/build_vi.py <譯稿資料夾> [vi|ja]"""
import json, re, sys, unicodedata
from pathlib import Path

SRC = Path(sys.argv[1] if len(sys.argv) > 1 else 'translations/vi')
LANG = sys.argv[2] if len(sys.argv) > 2 else 'vi'
ROOT = Path(__file__).resolve().parent.parent
A = ROOT / 'assets'

def load_js(p, var):
    s = p.read_text(encoding='utf8')
    return json.loads(s[s.index('{'):s.rindex('}') + 1])

en = load_js(A / 'data_en.js', 'ARCHIVE_EN')
arts, verses = {}, {}
batches = json.loads((SRC / 'batches.json').read_text(encoding='utf8'))
for n, ids in enumerate(batches, 1):
    d = json.loads((SRC / f'{LANG}{n:02d}.json').read_text(encoding='utf8'))
    arts.update({k: v for k, v in d['articles'].items() if k in ids})  # 只取本批篇號，防止誤寫
    verses.update(d.get('verses', {}))
ui = json.loads((SRC / f'ui_{LANG}.json').read_text(encoding='utf8'))

errs = []
han = re.compile(r'[一-鿿]')
for k, e in en['articles'].items():
    v = arts.get(k)
    if not v: errs.append(f'{k} 缺篇'); continue
    if len(v['blocks']) != len(e['blocks']): errs.append(f'{k} 區塊數 {len(v["blocks"])}≠{len(e["blocks"])}')
    for i, (a, b) in enumerate(zip(v['blocks'], e['blocks'])):
        if a.count('\n') != b.count('\n'): errs.append(f'{k}[{i}] 換行數 {a.count(chr(10))}≠{b.count(chr(10))}')
    for s in [v['title'], v['summary'], *v['blocks']]:
        if LANG == 'vi' and han.search(s): errs.append(f'{k} 含中文字'); break
        if LANG == 'ko' and s.strip() and (not re.search(r'[\uac00-\ud7a3]', s) or han.search(s)): errs.append(f'{k} 段落缺韓文或含漢字'); break
        if LANG == 'ja' and s.strip() and not re.search(r'[\u3040-\u30ff]', s): errs.append(f'{k} 有段落沒有假名'); break
if len(verses) != 40: errs.append(f'語錄 {len(verses)}/40')

nfc = lambda o: json.loads(unicodedata.normalize('NFC', json.dumps(o, ensure_ascii=False)))
data = nfc({'articles': arts, 'notices': ui['notices']})
(A / f'data_{LANG}.js').write_text('window.ARCHIVE_EN = ' + json.dumps(data, ensure_ascii=False) + ';\n', encoding='utf8')
i18 = nfc({'ui': ui['ui'], 'cat': ui['cat'], 't': ui['t']})
(A / f'i18n_{LANG}.js').write_text(f'window.{LANG.upper()}_I18N = ' + json.dumps(i18, ensure_ascii=False) + f';\nwindow.{LANG.upper()}_VERSES = '
                              + json.dumps(nfc({int(k): v for k, v in verses.items()}), ensure_ascii=False) + ';\n', encoding='utf8')
print(f'篇數 {len(arts)}/{len(en["articles"])}，語錄 {len(verses)}')
print('檢查：' + ('全部通過' if not errs else '\n'.join(errs)))
