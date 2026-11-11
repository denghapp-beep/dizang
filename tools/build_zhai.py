"""產生十齋日與佛菩薩紀念日資料 → assets/zhai.js（國曆 2025–2035）。
十齋日：農曆每月 初一、初八、十四、十五、十八、廿三、廿四、廿八、廿九、三十；小月無三十，以廿七補。"""
import datetime, json
from pathlib import Path
from lunar_python import Solar, LunarMonth

FEST = {(1,1):'彌勒菩薩聖誕',(2,8):'釋迦牟尼佛出家日',(2,15):'釋迦牟尼佛涅槃日',(2,19):'觀世音菩薩聖誕',
        (2,21):'普賢菩薩聖誕',(4,4):'文殊菩薩聖誕',(4,8):'釋迦牟尼佛聖誕（浴佛節）',(6,19):'觀世音菩薩成道日',
        (7,13):'大勢至菩薩聖誕',(7,15):'盂蘭盆節（佛歡喜日）',(7,30):'地藏菩薩聖誕',(9,19):'觀世音菩薩出家日',
        (9,30):'藥師佛聖誕',(11,17):'阿彌陀佛聖誕',(12,8):'釋迦牟尼佛成道日'}
TEN = {1,8,14,15,18,23,24,28,29,30}
out = {}
d = datetime.date(2025,1,1)
while d.year < 2036:
    L = Solar.fromYmd(d.year, d.month, d.day).getLunar()
    m, day = L.getMonth(), L.getDay()   # 閏月 m 為負
    cnt = LunarMonth.fromYm(L.getYear(), m).getDayCount()
    zhai = day in TEN or (cnt == 29 and day == 27)
    fest = []
    if m > 0:
        key = (m, day)
        if key in FEST: fest.append(FEST[key])
        if cnt == 29 and day == 29 and (m, 30) in FEST: fest.append(FEST[(m, 30)])  # 小月無三十，提前一日
    out[d.isoformat()] = [('閏' if m < 0 else '') + L.getMonthInChinese() + '月' + L.getDayInChinese(), 1 if zhai else 0] + fest
    d += datetime.timedelta(1)
root = Path(__file__).resolve().parent.parent
(root/'assets'/'zhai.js').write_text('window.ZHAI=' + json.dumps(out, ensure_ascii=False, separators=(',',':')) + ';\n', encoding='utf8')
print(len(out), sum(v[1] for v in out.values()))
