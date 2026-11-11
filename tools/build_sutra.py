"""CBETA XML (P5, github.com/cbeta-org/xml-p5) → assets/sutras/<id>.js
用法：python3 tools/build_sutra.py <cbeta_xml_dir>"""
import json, re, sys
from pathlib import Path
from lxml import etree
R = Path(__file__).resolve().parent.parent
SRC = Path(sys.argv[1])
NS = {'t': 'http://www.tei-c.org/ns/1.0', 'cb': 'http://www.cbeta.org/ns/1.0'}
T, CB = '{%s}' % NS['t'], '{%s}' % NS['cb']
SKIP = {T + 'note', T + 'rdg', T + 'lb', T + 'pb', T + 'anchor', CB + 'mulu', T + 'head', CB + 'docNumber', T + 'byline', CB + 'juan', CB + 'jhead', T + 'milestone', T + 'figure'}

def gaiji(root):
    m = {}
    for c in root.iter(T + 'char'):
        cid = c.get('{http://www.w3.org/XML/1998/namespace}id'); v = None
        for mp in c.iter(T + 'mapping'):
            if mp.get('type') in ('unicode', 'normal_unicode') and not v: v = mp.text
        if not v:
            for cn in c.iter(T + 'charName'): pass
            for vv in c.iter(T + 'value'): v = v or vv.text
        if v and v.startswith('U+'): v = chr(int(v[2:], 16))
        m[cid] = v or '□'
    return m

def text(el, G):
    out = []
    def walk(e):
        if e.tag in SKIP:
            if e.tail: out.append(e.tail)
            return
        if e.tag == T + 'g': out.append(G.get(e.get('ref', '#')[1:], '□'))
        elif e.tag == T + 'caesura': out.append('　')
        else:
            if e.text: out.append(e.text)
            for c in e: walk(c)
        if e.tail: out.append(e.tail)
    if el.text: out.append(el.text)
    for c in el: walk(c)
    return re.sub(r'[\s]+', '', ''.join(out)).replace('　', '　')

def paras(container, G):
    res = []
    for e in container.iter(T + 'p', T + 'lg'):
        if any(a.tag in (T + 'note', T + 'lg') and a is not e for a in e.iterancestors()) and e.tag == T + 'p': continue
        if e.tag == T + 'lg':
            ls = [text(l, G) for l in e.iter(T + 'l')]
            ls = [x for x in ls if x]
            if ls: res.append('\n'.join(ls))
        else:
            if e.getparent().tag == T + 'lg': continue
            t = text(e, G)
            if t: res.append(t)
    return res

def load(n):
    root = etree.parse(str(SRC / f'{n}.xml')).getroot(); return root, gaiji(root), root.find('.//t:body', NS)

def juan_split(n, labels):
    """按卷切分（以 cb:juan fun=open 為界）"""
    root, G, body = load(n)
    chunks, cur = [], []
    marks = []
    for e in body.iter():
        if e.tag == CB + 'juan' and e.get('fun') == 'open': marks.append(e)
    # 以每卷 open 之後到下一個 open 之前的 p/lg
    allp = [e for e in body.iter(T + 'p', T + 'lg', CB + 'juan')]
    out, k = [], -1
    for e in allp:
        if e.tag == CB + 'juan':
            if e.get('fun') == 'open': k += 1; out.append([])
            continue
        if k < 0: continue
        if e.tag == T + 'p' and e.getparent().tag == T + 'lg': continue
        if any(a.tag == T + 'note' for a in e.iterancestors()): continue
        if e.tag == T + 'lg':
            ls = [x for x in (text(l, G) for l in e.iter(T + 'l')) if x]
            if ls: out[k].append('\n'.join(ls))
        else:
            t = text(e, G)
            if t: out[k].append(t)
    return [{'title': labels[i], 'paras': p} for i, p in enumerate(out)]

def pumen():
    root, G, body = load('T09n0262')
    for d in body.iter(CB + 'div'):
        m = d.find('cb:mulu', NS)
        if m is not None and m.text and '普門品' in m.text and m.get('type') == '品':
            return [{'title': '觀世音菩薩普門品第二十五', 'paras': paras(d, G)}]

SUTRAS = {
    'pumen': {'title': '妙法蓮華經觀世音菩薩普門品', 'translator': '姚秦 三藏法師 鳩摩羅什 譯', 'cb': 'T09n0262', 'url': 'https://cbetaonline.dila.edu.tw/zh/T0262_007',
              'chapters': pumen,
              'translations': [{'lang': 'en', 'name': 'Universal Door Chapter — BTTS 英譯經典（站內查經名）', 'by': 'Buddhist Text Translation Society', 'url': 'https://www.cttbusa.org/'}, {'lang': 'vi', 'name': 'Phẩm Phổ Môn — Thư Viện Hoa Sen（站內查經名）', 'by': 'Thư Viện Hoa Sen', 'url': 'https://thuvienhoasen.org/'}, {'lang': 'ja', 'name': '観音経（普門品） — SAT大正蔵データベース（経名で検索）', 'by': '東京大学 SAT', 'url': 'https://21dzk.l.u-tokyo.ac.jp/SAT/'}, {'lang': 'ko', 'name': '관세음보살보문품 — 한글대장경（경명 검색）', 'by': '동국대학교', 'url': 'https://abc.dongguk.edu/ebti/'}]},
    'jingang': {'title': '金剛般若波羅蜜經', 'translator': '姚秦 三藏法師 鳩摩羅什 譯', 'cb': 'T08n0235', 'note': '三十二分品名依梁昭明太子分科（後人所加，非經文原有）。', 'url': 'https://cbetaonline.dila.edu.tw/zh/T0235',
                'chapters': lambda: juan_split('T08n0235', ['金剛般若波羅蜜經']),
                'translations': [{'lang': 'en', 'name': 'Vajra Sutra — BTTS 英譯經典（站內查經名）', 'by': 'Buddhist Text Translation Society', 'url': 'https://www.cttbusa.org/'}, {'lang': 'vi', 'name': 'Kinh Kim Cang — Thư Viện Hoa Sen（站內查經名）', 'by': 'Thư Viện Hoa Sen', 'url': 'https://thuvienhoasen.org/'}, {'lang': 'ja', 'name': '金剛般若経 — SAT大正蔵データベース（経名で検索）', 'by': '東京大学 SAT', 'url': 'https://21dzk.l.u-tokyo.ac.jp/SAT/'}, {'lang': 'ko', 'name': '금강반야바라밀경 — 한글대장경（경명 검색）', 'by': '동국대학교', 'url': 'https://abc.dongguk.edu/ebti/'}]},
    'amituo': {'title': '佛說阿彌陀經', 'translator': '姚秦 三藏法師 鳩摩羅什 譯', 'cb': 'T12n0366', 'url': 'https://cbetaonline.dila.edu.tw/zh/T0366',
               'chapters': lambda: juan_split('T12n0366', ['佛說阿彌陀經']),
               'translations': [{'lang': 'en', 'name': 'Amitabha Sutra — BTTS 英譯經典（站內查經名）', 'by': 'Buddhist Text Translation Society', 'url': 'https://www.cttbusa.org/'}, {'lang': 'vi', 'name': 'Kinh A Di Đà — Thư Viện Hoa Sen（站內查經名）', 'by': 'Thư Viện Hoa Sen', 'url': 'https://thuvienhoasen.org/'}, {'lang': 'ja', 'name': '阿弥陀経 — SAT大正蔵データベース（経名で検索）', 'by': '東京大学 SAT', 'url': 'https://21dzk.l.u-tokyo.ac.jp/SAT/'}, {'lang': 'ko', 'name': '불설아미타경 — 한글대장경（경명 검색）', 'by': '동국대학교', 'url': 'https://abc.dongguk.edu/ebti/'}]},
    'wuliangshou': {'title': '佛說無量壽經', 'translator': '曹魏 天竺三藏 康僧鎧 譯', 'cb': 'T12n0360', 'url': 'https://cbetaonline.dila.edu.tw/zh/T0360',
                    'chapters': lambda: juan_split('T12n0360', ['佛說無量壽經卷上', '佛說無量壽經卷下']),
                    'translations': [{'lang': 'en', 'name': 'Larger Sutra of Immeasurable Life — BTTS 英譯經典（站內查經名）', 'by': 'Buddhist Text Translation Society', 'url': 'https://www.cttbusa.org/'}, {'lang': 'vi', 'name': 'Kinh Vô Lượng Thọ — Thư Viện Hoa Sen（站內查經名）', 'by': 'Thư Viện Hoa Sen', 'url': 'https://thuvienhoasen.org/'}, {'lang': 'ja', 'name': '無量寿経 — SAT大正蔵データベース（経名で検索）', 'by': '東京大学 SAT', 'url': 'https://21dzk.l.u-tokyo.ac.jp/SAT/'}, {'lang': 'ko', 'name': '불설무량수경 — 한글대장경（경명 검색）', 'by': '동국대학교', 'url': 'https://abc.dongguk.edu/ebti/'}]},
}

FEN = [('法會因由分', '如是我聞'), ('善現啟請分', '時，長老須菩提在大眾中'), ('大乘正宗分', '佛告須菩提：「諸菩薩摩訶薩應如是降伏其心'),
 ('妙行無住分', '復次，須菩提！菩薩於法應無所住'), ('如理實見分', '須菩提！於意云何？可以身相見如來不'), ('正信希有分', '須菩提白佛言：「世尊！頗有眾生'),
 ('無得無說分', '須菩提！於意云何？如來得阿耨多羅三藐三菩提耶'), ('依法出生分', '須菩提！於意云何？若人滿三千大千世界七寶'), ('一相無相分', '須菩提！於意云何？須陀洹能作是念'),
 ('莊嚴淨土分', '佛告須菩提：「於意云何？如來昔在然燈佛所'), ('無為福勝分', '須菩提！如恒河中所有沙數'), ('尊重正教分', '復次，須菩提！隨說是經'),
 ('如法受持分', '爾時，須菩提白佛言：「世尊！當何名此經'), ('離相寂滅分', '爾時，須菩提聞說是經'), ('持經功德分', '須菩提！若有善男子、善女人，初日分'),
 ('能淨業障分', '復次，須菩提！善男子、善女人受持、讀誦此經，若為人輕賤'), ('究竟無我分', '爾時，須菩提白佛言：「世尊！善男子、善女人發阿耨多羅三藐三菩提心'),
 ('一體同觀分', '須菩提！於意云何？如來有肉眼不'), ('法界通化分', '須菩提！於意云何？若有人滿三千大千世界七寶以用布施，是人以是因緣'),
 ('離色離相分', '須菩提！於意云何？佛可以具足色身見不'), ('非說所說分', '須菩提！汝勿謂如來作是念'), ('無法可得分', '須菩提白佛言：「世尊！佛得阿耨多羅三藐三菩提，為無所得耶'),
 ('淨心行善分', '復次，須菩提！是法平等'), ('福智無比分', '須菩提！若三千大千世界中所有諸須彌山王'), ('化無所化分', '須菩提！於意云何？汝等勿謂如來作是念'),
 ('法身非相分', '須菩提！於意云何？可以三十二相觀如來不'), ('無斷無滅分', '須菩提！汝若作是念'), ('不受不貪分', '須菩提！若菩薩以滿恒河沙等世界七寶'),
 ('威儀寂靜分', '須菩提！若有人言『如來若來若去'), ('一合理相分', '須菩提！若善男子、善女人以三千大千世界碎為微塵'), ('知見不生分', '須菩提！若人言『佛說我見'),
 ('應化非真分', '須菩提！若有人以滿無量阿僧祇世界七寶')]
NUM = '一二三四五六七八九十'
def cn(n): return NUM[n - 1] if n <= 10 else ('十' if n < 20 else NUM[n // 10 - 1] + '十') + (NUM[n % 10 - 1] if n % 10 else '')
def split32(ps):
    """依梁昭明太子三十二分切品（分名為後人所加，CBETA 原典無）"""
    out, k = [], 0
    for p in ps:
        if k < len(FEN) and p.lstrip('「').startswith(FEN[k][1]):
            out.append({'title': f'{FEN[k][0]}第{cn(k + 1)}', 'paras': []}); k += 1
        out[-1]['paras'].append(p)
    assert k == 32, k
    return out

def clean(sid, ch):
    for c in ch: c['paras'] = [x for x in c['paras'] if not re.fullmatch(r'.{0,12}經卷第[一二三]', x)]
    if sid == 'jingang': ch = split32([x for x in ch[-1]['paras'] if not x.startswith('那謨婆伽跋帝')])
    if sid == 'amituo':
        ps = ch[0]['paras']; end = next(i for i, x in enumerate(ps) if '作禮而去' in x)
        dh = [x for x in ps[end + 1:] if x.startswith('南無阿彌多婆夜')]
        ch[0]['paras'] = ps[:end + 1]
    return ch
for sid, m in SUTRAS.items():
    ch = clean(sid, m['chapters']())
    juan = [[0, 1], [1, 2]] if sid == 'wuliangshou' else [[0, len(ch)]]
    d = {'title': m['title'], 'translator': m['translator'],
         'source': f'CBETA 中華電子佛典協會（大正新脩大藏經 {m["cb"]}），新式標點由中華佛教百科文獻基金會提供。依 CBETA 授權，非商業使用。',
         'sourceUrl': m['url'], 'juan': juan, 'juanLabel': ['卷上', '卷下'] if sid == 'wuliangshou' else [''], 'chapters': ch, 'translations': m['translations'], **({'note': m['note']} if m.get('note') else {})}
    (R / 'assets' / 'sutras' / f'{sid}.js').write_text(f'window.SUTRAS=window.SUTRAS||{{}};window.SUTRAS.{sid}=' + json.dumps(d, ensure_ascii=False) + ';\n', encoding='utf8')
    print(sid, len(ch), [len(c['paras']) for c in ch], sum(len(''.join(c['paras'])) for c in ch), ch[0]['paras'][0][:40], '…', ch[-1]['paras'][-1][-30:])
