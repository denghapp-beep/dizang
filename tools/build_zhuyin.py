"""經文注音：pypinyin 產生注音，再以佛教專有讀音與台灣教育部讀音覆寫。輸出 assets/sutras/<id>_zhuyin.js。
用法：python3 tools/build_zhuyin.py dizang          產生並寫入
      python3 tools/build_zhuyin.py dizang --check  只比對，不寫入（與現有檔不同時回傳 1）
產生後依序套用校對紀錄（每筆 [品, 段, 字位置, 注音, 該字]；段 -1 表示品名）：
  tools/zhuyin_<id>_ref_overrides.json     依注音本／課誦本逐字校對的結果
  tools/zhuyin_<id>_manual_overrides.json  個別人工更正
若經文改字使「該字」對不上，會停止並列出，需先更新紀錄檔。
tools/zhuyin_<id>_ref_conflicts.json 為與現行注音不同、尚未確認的參考讀音，不會套用。"""
import json, re, sys
from pathlib import Path
from pypinyin import pinyin, Style, load_phrases_dict, load_single_dict
R = Path(__file__).resolve().parent.parent
sid = sys.argv[1] if len(sys.argv) > 1 else 'dizang'
# 佛教專有名詞讀音（依佛門通行讀法）
P = {'南無': 'ná mó', '硨磲': 'chē qú', '薄拘羅': 'bó jū luó', '阿㝹樓馱': 'ā nòu lóu tuó', '阿耨多羅三藐三菩提': 'ē nòu duō luó sān miǎo sān pú tí', '那由他': 'nuó yóu tuō', '阿僧祇': 'ā sēng qí',
     '波羅蜜': 'bō luó mì', '般若': 'bō rě', '伽藍': 'qié lán', '釋迦牟尼': 'shì jiā móu ní', '釋迦': 'shì jiā', '婆羅門': 'pó luó mén',
     '羅漢': 'luó hàn', '阿羅漢': 'ā luó hàn', '夜叉': 'yè chā', '乾闥婆': 'qián tà pó', '阿修羅': 'ā xiū luó', '迦樓羅': 'jiā lóu luó',
     '緊那羅': 'jǐn nà luó', '摩睺羅伽': 'mó hóu luó qié', '鳩槃荼': 'jiū pán tú', '閻羅': 'yán luó', '閻浮提': 'yán fú tí', '無間': 'wú jiàn',
     '優婆塞': 'yōu pó sài', '優婆夷': 'yōu pó yí', '比丘': 'bǐ qiū', '比丘尼': 'bǐ qiū ní', '摩訶': 'mó hē', '摩訶薩': 'mó hē sà',
     '菩薩': 'pú sà', '文殊師利': 'wén shū shī lì', '解脫': 'jiě tuō', '度脫': 'dù tuō', '三昧': 'sān mèi', '忉利': 'dāo lì',
     '恒河沙': 'héng hé shā', '娑婆': 'suō pó', '舍利': 'shè lì', '浮圖': 'fú tú', '剎土': 'chà tǔ', '佛剎': 'fó chà', '剎那': 'chà nà',
     '迦葉': 'jiā shè', '阿難': 'ē nán', '毗沙門': 'pí shā mén', '毗婆尸': 'pí pó shī', '拘留孫': 'jū liú sūn', '袈裟': 'jiā shā',
     '眾生': 'zhòng shēng', '供養': 'gòng yàng', '佛': 'fó', '地藏': 'dì zàng', '校量': 'jiào liáng', '號泣': 'háo qì', '布施': 'bù shī', '如是': 'rú shì', '世尊': 'shì zūn', '曼陀羅': 'màn tuó luó', '阿彌陀': 'ā mí tuó', '舍利弗': 'shè lì fú', '須菩提': 'xū pú tí', '阿逸多': 'ā yì duō', '給孤獨': 'jǐ gū dú', '彌勒': 'mí lè', '觀世音': 'guān shì yīn', '無盡意': 'wú jìn yì', '極樂': 'jí lè', '阿惟越致': 'ā wéi yuè zhì', '阿彌多婆夜': 'ā mí duō pó yè', '哆他伽哆夜': 'duō tā qié duō yè', '莎婆訶': 'suō pó hē', '阿僧祇劫': 'ā sēng qí jié', '恒河': 'héng hé', '那謨': 'ná mó', '頻婆': 'pín pó', '耆闍崛': 'qí shé jué', '說法': 'shuō fǎ', '應供': 'yìng gòng', '善逝': 'shàn shì', '調御丈夫': 'tiáo yù zhàng fū'}
load_phrases_dict({k: [[x] for x in v.split()] for k, v in P.items()})
# 台灣教育部標準讀音（與大陸不同、經文中會出現的字）
TW = {'寂': 'jí', '息': 'xí', '惜': 'xí', '昔': 'xí', '擊': 'jí', '危': 'wéi', '微': 'wéi', '暫': 'zhàn', '液': 'yì', '跡': 'jī',
      '擁': 'yǒng', '迄': 'qì', '卓': 'zhuó', '剎': 'chà', '祇': 'qí', '伽': 'qié', '毗': 'pí', '耨': 'nòu'}
load_single_dict({ord(k): v for k, v in TW.items()})
S = json.loads(re.search(r'=(\{.*\});', (R / 'assets' / 'sutras' / f'{sid}.js').read_text(encoding='utf8'), re.S).group(1))
han = re.compile(r'[一-鿿\U00020000-\U0002ffff]')
def zy(text):
    out = []
    for ch, py in zip(text, pinyin(text, style=Style.BOPOMOFO, errors=lambda x: [[''] for _ in x])):
        out.append(py[0] if han.match(ch) else '')
    # 「不」作疑問句尾或答語「不也」時通「否」，讀 ㄈㄡˇ（依中台禪寺金剛經注音本）
    if sid != 'dizang':
        for i, ch in enumerate(text):
            if ch == '不' and i + 1 < len(text) and (text[i + 1] == '也' or text[i + 1] in '。？?」'):
                out[i] = 'ㄈㄡˇ'
            # 名詞「相」（我相、人相、諸相…）讀 ㄒㄧㄤˋ；「互相、相應、相續…」才讀 ㄒㄧㄤ
            if ch == '相' and out[i] == 'ㄒㄧㄤ' and not (i + 1 < len(text) and text[i + 1] in '應續似違逢傳隨對待繼與續') and not (i and text[i - 1] in '互共'):
                out[i] = 'ㄒㄧㄤˋ'
            # 動詞「量」（思量、稱量、不可量）讀 ㄌㄧㄤˊ；「無量」仍讀 ㄌㄧㄤˋ
            if ch == '量' and i and text[i - 1] in '思稱可測較商':
                out[i] = 'ㄌㄧㄤˊ'
    return out
res = []
for c in S['chapters']:
    paras = [zy(p.replace('\n', '　')) for p in c['paras']]  # 保持字數對齊
    res.append({'t': zy(c['title']), 'p': paras})
# 套用校對紀錄
bad = []
for kind in ('ref', 'manual'):
    f = R / 'tools' / f'zhuyin_{sid}_{kind}_overrides.json'
    if not f.exists():
        continue
    for c, p, i, z, ch in json.loads(f.read_text(encoding='utf8')):
        chap = S['chapters'][c]
        src = chap['title'] if p == -1 else chap['paras'][p].replace('\n', '　')
        if i >= len(src) or src[i] != ch:
            bad.append(f'{f.name}: [{c},{p},{i}] 應為「{ch}」，現為「{src[i] if i < len(src) else "（超出）"}」')
            continue
        (res[c]['t'] if p == -1 else res[c]['p'][p])[i] = z
if bad:
    sys.exit('校對紀錄與經文對不上（經文可能改過字），請先更新紀錄檔：\n' + '\n'.join(bad))
j = lambda a: ' '.join(x or '_' for x in a)
res = [{'t': j(c['t']), 'p': [j(p) for p in c['p']]} for c in res]
out = R / 'assets' / 'sutras' / f'{sid}_zhuyin.js'
txt = f'window.SUTRA_ZHUYIN=window.SUTRA_ZHUYIN||{{}};window.SUTRA_ZHUYIN.{sid}=' + json.dumps(res, ensure_ascii=False, separators=(',', ':')) + ';\n'
if '--check' in sys.argv:
    same = out.exists() and out.read_text(encoding='utf8') == txt
    print('一致' if same else '不一致：重新產生的注音與現有檔不同')
    sys.exit(0 if same else 1)
out.write_text(txt, encoding='utf8')
print('ok', sum(len(p.split()) for c in res for p in c['p']))
