"""重建經文合併字型 assets/fonts/sutra-400.woff2、sutra-700.woff2。
新增經文或藏經閣介面用字後執行：
    python tools/build_sutra_font.py            重建並寫入
    python tools/build_sutra_font.py --check    只檢查缺字，不寫入
    python tools/build_sutra_font.py --jp-400 NotoSerifJP-Regular.otf --jp-700 NotoSerifJP-Bold.otf
需要：pip install fonttools brotli

做法：
1. 掃描 assets/sutras/*.js、assets/zangjing.js、fusion/zangjing.html 用字（只取 U+2000 以上的中日文字與符號；
   拉丁字母、越南文、注音聲調不放進來，維持原本由後備字型顯示）。
2. 依序從 Noto Serif TC 切片（assets/fonts/nst/）取字；切片沒有的字，從現有 sutra-*.woff2 取
   （保留先前用 Noto Serif JP 補的 嘇嚩妷尫悋焭糺裓辠韈）；仍缺的字，若有給 --jp-* 字型就從那裡補。
3. 合併成單一 woff2（iOS 對多個 unicode-range 切片會部分退回系統字型，造成粗細不一）。
4. 最後仍缺的字列出來：需改用花園明朝補進 rare.woff2，並更新 sutra-serif.css 的 unicode-range。
重建後記得把 sutra-serif.css 內 sutra-400/700.woff2?v= 與引用 sutra-serif.css?v= 的版本號加 1。"""
import argparse, glob, io, json, os, re, sys
from fontTools.ttLib import TTFont
from fontTools import subset
from fontTools.merge import Merger

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.path.join(R, 'assets', 'fonts')
SUTRAS = glob.glob(os.path.join(R, 'assets', 'sutras', '*.js'))
UI = [os.path.join(R, 'assets', 'zangjing.js'), os.path.join(R, 'fusion', 'zangjing.html')]
ALWAYS = '○　'  # 句讀小圈（程式產生，不一定出現在原始檔）
RARE = {0x3779, 0x93EB, 0x28A8F}  # 由 rare.woff2 提供


def wanted(files, extra=''):
    s = set(extra)
    for f in files:
        s |= set(open(f, encoding='utf8').read())
    return {ord(c) for c in s if ord(c) >= 0x2000 and (c.isprintable() or c == '　')} - RARE


def cut(path, cps):
    f = TTFont(path)
    have = set(f.getBestCmap()) & cps
    if not have:
        return None, set()
    opt = subset.Options()
    opt.layout_features = ['*']
    opt.name_IDs = ['*']
    opt.hinting = False
    opt.desubroutinize = True
    opt.notdef_outline = True
    sub = subset.Subsetter(opt)
    sub.populate(unicodes=have)
    sub.subset(f)
    if 'CFF ' in f:  # JP 字型為 CFF，轉成 TrueType 才能和 TC 切片合併
        sys.exit(f'{os.path.basename(path)} 是 CFF 字型，請改用 TTF 版（如 Google Fonts 的 NotoSerifJP-*.ttf）')
    buf = io.BytesIO()
    f.flavor = None
    f.save(buf)
    p = os.path.join('/tmp' if os.name != 'nt' else os.environ.get('TEMP', '.'), f'_sub_{len(have)}_{os.path.basename(path)}.ttf')
    open(p, 'wb').write(buf.getvalue())
    return p, have


def build(weight, jp, need, write):
    left = set(need)
    parts = []
    for path in sorted(glob.glob(os.path.join(FONTS, 'nst', f'noto-serif-tc-*-{weight}-normal.woff2'))):
        p, got = cut(path, left)
        if p:
            parts.append(p)
            left -= got
    old = os.path.join(FONTS, f'sutra-{weight}.woff2')
    for path in [old] + ([jp] if jp else []):
        if left and os.path.exists(path):
            p, got = cut(path, left)
            if p:
                parts.append(p)
                left -= got
    if write:
        merged = Merger().merge(parts)
        merged.flavor = 'woff2'
        merged.save(old)
        print(f'sutra-{weight}.woff2', os.path.getsize(old), 'bytes,', len(need - left), '字')
    for p in parts:
        os.remove(p)
    return left


ap = argparse.ArgumentParser()
ap.add_argument('--check', action='store_true')
ap.add_argument('--jp-400')
ap.add_argument('--jp-700')
a = ap.parse_args()
def sutra_text():
    # 只取中文經文（略過 lang 不是中文的外文參考連結）
    out = []
    def walk(x):
        if isinstance(x, dict):
            if x.get('lang', 'zh') not in ('zh', 'zh-Hant'):
                return
            for v in x.values():
                walk(v)
        elif isinstance(x, list):
            for v in x:
                walk(v)
        elif isinstance(x, str):
            out.append(x)
    for f in SUTRAS:
        t = open(f, encoding='utf8').read()
        dec, i = json.JSONDecoder(), 0
        while (m := re.compile(r'=\s*(?=[\[{"])').search(t, i)):
            try:
                v, i = dec.raw_decode(t, m.end())
                walk(v)
            except ValueError:
                i = m.end()
    return ''.join(out)


core = {ord(c) for c in sutra_text() + ALWAYS if ord(c) >= 0x2000} - RARE  # 經文用字：缺字要處理
need = core | wanted(SUTRAS + UI)  # 介面用字：字型有就收，沒有（日韓介面文字）由後備字型顯示
print('經文用字', len(core), '字；介面合計', len(need), '字')
miss = set()
for w, jp in (('400', a.jp_400), ('700', a.jp_700)):
    miss |= build(w, jp, need, not a.check) & core
if miss:
    print('仍缺字（需補進 rare.woff2 或提供 --jp 字型）：', ''.join(chr(c) for c in sorted(miss)))
    sys.exit(1)
print('無缺字')
