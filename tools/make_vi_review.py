"""產出越南文審閱稿：DeepSeek 分段貼上用的 .txt，以及給校對者的中越對照 .docx。"""
import json, re
from pathlib import Path
from docx import Document
from docx.shared import Pt, Cm
from docx.oxml.ns import qn

ROOT = Path(__file__).resolve().parent.parent
import sys
LANG = sys.argv[1] if len(sys.argv) > 1 else 'vi'
NAME = {'vi': '越南文', 'ja': '日文'}[LANG]
TR = ROOT / 'translations' / LANG
OUT = ROOT / (NAME + '審閱')
OUT.mkdir(exist_ok=True)
SRC = Path('/home/claude/ja') if LANG == 'ja' else Path('/home/claude/tr')

# 中文原稿：### 編號 | 標題 | 分類 | 摘要，接 [k:種類] 區塊
zh = {}
for f in sorted(SRC.glob('src0*.txt')):
    for part in re.split(r'^### ', f.read_text(encoding='utf8'), flags=re.M)[1:]:
        head, *rest = part.split('\n', 1)
        aid, title, cat, summary = [x.strip() for x in head.split('|')]
        blocks = re.split(r'^\[\d+:[a-z]+\]\n', rest[0] if rest else '', flags=re.M)[1:]
        zh[aid] = {'title': title, 'summary': summary, 'blocks': [b.strip().rstrip('-').strip() for b in blocks]}

vi = {}
for f in sorted(TR.glob(LANG + '0*.json')):
    vi.update(json.loads(f.read_text(encoding='utf8'))['articles'])
ids = sorted(vi)

glossary = (TR / 'glossary.md').read_text(encoding='utf8')
PROMPT = """你是精通中文與越南文、熟悉越南佛教用語的審稿人。以下是「地藏菩薩感應文集」的越南文譯稿（第 {n}/{total} 部分），每篇附中文原稿。請逐篇審閱：
1. 意思是否忠實（有無漏譯、誤譯、增譯）；
2. 佛教用語是否符合越南佛教慣用的漢越詞（參考下方譯名表，若譯名表本身不妥也請指出）；
3. 越南文是否自然通順，越南佛友讀得懂；稱謂（菩薩稱 con／Thiện nam tử，作者自稱 tôi 或 đệ tử）是否恰當。
【這是修正後的第二輪審閱，以下幾點是全站既定體例，請不要再提】
- 原稿的「一、原文」「白話翻譯」「菩薩開示」等小標題刻意不放進譯文，網站會自動在每段上方顯示統一標籤。
- 原文段的引號照中文原稿，原稿沒有的引號不補。
- 「白話翻譯」是菩薩開示的白話轉述，對作者一律稱 con；只有作者自己寫給讀者的解說才用 bạn。
- 作者向菩薩自稱用 đệ tử，原稿沒寫主詞時不加。
沒有問題的篇章只要寫「無問題」。有問題請用表格回覆，欄位：篇號｜越南文現譯（原句）｜問題｜建議譯文。只列真正需要改的地方。

【譯名表】
{glossary}
"""

def chunk(ids, size):
    for i in range(0, len(ids), size):
        yield ids[i:i + size]

size = lambda a: len(''.join(zh[a]['blocks'])) * 3 + len(''.join(vi[a]['blocks']))
parts, cur, tot = [], [], 0
for a in ids:
    if cur and tot + size(a) > 90000: parts.append(cur); cur, tot = [], 0
    cur.append(a); tot += size(a)
parts.append(cur)
for n, group in enumerate(parts, 1):
    lines = [PROMPT.format(n=n, total=len(parts), glossary=glossary)]
    for aid in group:
        z, v = zh[aid], vi[aid]
        lines.append(f'\n==================== 第 {aid} 篇 ====================')
        lines.append(f'【中文標題】{z["title"]}\n【越南文標題】{v["title"]}')
        lines.append(f'【中文摘要】{z["summary"]}\n【越南文摘要】{v["summary"]}')
        lines.append('【中文原稿】\n' + '\n\n'.join(z['blocks']))
        lines.append('【越南文譯稿】\n' + '\n\n'.join(v['blocks']))
    (OUT / f'DeepSeek審閱_第{n}部分（共{len(parts)}部分）.txt').write_text('\n'.join(lines), encoding='utf8')

# 中越對照稿
doc = Document()
st = doc.styles['Normal']; st.font.name = 'Times New Roman'; st.font.size = Pt(11)
st.element.rPr.rFonts.set(qn('w:eastAsia'), '新細明體')
for s in doc.sections:
    s.left_margin = s.right_margin = Cm(1.8)
doc.add_heading('地藏菩薩感應文集 · 中越對照校對稿', 0)
doc.add_paragraph('Tuyển tập Cảm ứng Bồ Tát Địa Tạng · Bản đối chiếu Trung – Việt để hiệu đính')
doc.add_paragraph('請校對者直接在右欄修改，或用「插入註解」標出問題。左欄為中文原稿，僅供對照。\n'
                  'Xin người hiệu đính sửa trực tiếp ở cột phải hoặc dùng “Chèn chú thích”. Cột trái là nguyên văn tiếng Trung để đối chiếu.')
for aid in ids:
    z, v = zh[aid], vi[aid]
    doc.add_heading(f'{aid}　{z["title"]}', level=1)
    doc.add_paragraph(v['title']).runs[0].bold = True
    t = doc.add_table(rows=1, cols=2); t.style = 'Table Grid'
    t.rows[0].cells[0].text, t.rows[0].cells[1].text = '中文原稿', 'Bản dịch tiếng Việt'
    pairs = [(z['summary'], v['summary'])]
    # 中文區塊數可能多於越南文（英文版刪去標籤行），以越南文區塊為準依序對照
    zb = z['blocks'] + [''] * max(0, len(v['blocks']) - len(z['blocks']))
    if len(z['blocks']) == len(v['blocks']):
        pairs += list(zip(zb, v['blocks']))
    else:
        pairs.append(('\n\n'.join(z['blocks']), '\n\n'.join(v['blocks'])))
    for a, b in pairs:
        r = t.add_row().cells; r[0].text, r[1].text = a, b
doc.save(OUT / '中越對照校對稿.docx')
print(len(ids), '篇；DeepSeek 稿', len(parts), '份')
for f in sorted(OUT.iterdir()): print(f.name, f.stat().st_size)
