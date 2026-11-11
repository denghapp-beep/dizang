"""產出日文審閱稿：DeepSeek 分段貼上用的 .txt，以及給校對者的中日對照 .docx。"""
import json
from pathlib import Path
from docx import Document
from docx.shared import Pt, Cm

ROOT = Path(__file__).resolve().parent.parent
TR = ROOT / 'translations' / 'ja'
OUT = ROOT / '日文審閱'
OUT.mkdir(exist_ok=True)
s = (ROOT / 'assets' / 'data.js').read_text(encoding='utf8')
zh = {a['id']: a for a in json.loads(s[s.index('{'):s.rindex('}') + 1])['articles']}
ja = {}
for f in sorted(TR.glob('ja0*.json')):
    ja.update(json.loads(f.read_text(encoding='utf8'))['articles'])
ids = sorted(ja)
glossary = (TR / 'glossary.md').read_text(encoding='utf8')
PROMPT = """你是精通中文與日文、熟悉日本佛教用語的審稿人。以下是「地藏菩薩感應文集」的日文譯稿（第 {n}/{total} 部分），每篇附中文原稿。請逐篇審閱：
1. 意思是否忠實（有無漏譯、誤譯、增譯）；
2. 佛教用語是否符合日本佛教慣用說法（參考下方用語集，若用語集本身不妥也請指出）；
3. 日文是否自然，日本讀者讀得懂；有沒有直接照搬中文字面、在日文裡意思不同的詞（例如「開示」「用心」「我慢」）。
【全站既定體例，請不要再提】
- 原稿的「一、原文」「白話翻譯」等小標題刻意不放進譯文，網站會自動在每段上方顯示統一標籤。
- 引號照中文原稿，原稿沒有的不補。
- 菩薩原文用文語體（自稱「われ」，稱作者「汝」）；現代語訳是菩薩開示的白話轉述，用常體、稱作者「あなた」；作者的敘述與提問用です・ます調。
沒有問題的篇章只要寫「無問題」。有問題請用表格回覆，欄位：篇號｜日文現譯（原句）｜問題｜建議譯文。只列真正需要改的地方。

【用語集】
{glossary}
"""
KIND = {'context': '問題', 'original': '原文', 'translation': '白話', 'note': '附註', 'account': '經歷'}
size = lambda a: len(''.join(b['text'] for b in zh[a]['blocks'])) * 2 + len(''.join(ja[a]['blocks']))
parts, cur, tot = [], [], 0
for a in ids:
    if cur and tot + size(a) > 55000: parts.append(cur); cur, tot = [], 0
    cur.append(a); tot += size(a)
parts.append(cur)
for n, group in enumerate(parts, 1):
    L = [PROMPT.format(n=n, total=len(parts), glossary=glossary)]
    for a in group:
        z, j = zh[a], ja[a]
        L.append(f'\n==================== 第 {a} 篇 ====================')
        L.append(f'【中文標題】{z["title"]}\n【日文標題】{j["title"]}\n【中文摘要】{z["summary"]}\n【日文摘要】{j["summary"]}')
        for i, (b, t) in enumerate(zip(z['blocks'], j['blocks'])):
            L.append(f'【中文・{KIND.get(b["kind"], b["kind"])}】\n{b["text"]}\n【日文】\n{t}')
    (OUT / f'DeepSeek審閱_日文_第{n}部分（共{len(parts)}部分）.txt').write_text('\n'.join(L), encoding='utf8')
doc = Document()
doc.styles['Normal'].font.size = Pt(11)
for sec in doc.sections: sec.left_margin = sec.right_margin = Cm(1.8)
doc.add_heading('地藏菩薩感應文集 · 中日對照校對稿', 0)
doc.add_paragraph('地蔵菩薩感応集・中日対照校正稿。右欄（日本語）を直接修正するか、コメントを付けてください。左欄は中国語の原稿です。')
for a in ids:
    z, j = zh[a], ja[a]
    doc.add_heading(f'{a}　{z["title"]}', level=1)
    doc.add_paragraph(j['title']).runs[0].bold = True
    t = doc.add_table(rows=1, cols=2); t.style = 'Table Grid'
    t.rows[0].cells[0].text, t.rows[0].cells[1].text = '中文原稿', '日本語訳'
    for x, y in [(z['summary'], j['summary'])] + [(b['text'], v) for b, v in zip(z['blocks'], j['blocks'])]:
        r = t.add_row().cells; r[0].text, r[1].text = x, y
doc.save(OUT / '中日對照校對稿.docx')
print(len(ids), '篇；DeepSeek 稿', len(parts), '份')
for f in sorted(OUT.iterdir()): print(f.name, f.stat().st_size)
