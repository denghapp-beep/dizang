"""簡體中文：用 OpenCC（tw2s）把文章資料整份轉成簡體 → assets/data_sc.js；
另產生網站所有固定文字用到的繁→簡字表 → assets/sc_map.js（網頁載入時即時轉換介面文字）。"""
import json, glob, re
from pathlib import Path
import opencc
cc = opencc.OpenCC('tw2s')
R = Path(__file__).resolve().parent.parent
A = R / 'assets'
s = (A / 'data.js').read_text(encoding='utf8')
data = json.loads(cc.convert(s[s.index('{'):s.rindex('}') + 1]))
(A / 'data_sc.js').write_text(
    '/* 簡體版文章資料：攔截 data.js 對 window.ARCHIVE 的設定，改用簡體 */\n'
    '(function(){var SC=' + json.dumps(data, ensure_ascii=False) + ';'
    'Object.defineProperty(window,"ARCHIVE",{configurable:true,get:function(){return SC},set:function(){}});})();\n', encoding='utf8')
text = ''.join(Path(p).read_text(encoding='utf8') for p in
               [*glob.glob(str(A / '*.js')), *glob.glob(str(R / 'fusion' / '*.html'))] if 'data_' not in p and 'sc_map' not in p and 'zhai.js' not in p)
text += (A / 'zhai.js').read_text(encoding='utf8')
chars = sorted(set(re.findall(r'[一-鿿]', text)))
m = {c: cc.convert(c) for c in chars if cc.convert(c) != c}
(A / 'sc_map.js').write_text('window.SC_MAP=' + json.dumps(m, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf8')
print('articles', len(data['articles']), 'map', len(m))
