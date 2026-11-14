# 地藏菩薩感應文集｜Opus 網頁修改 交接說明（2026-11-12 更新）

> 新對話（Opus＋中思考）開頭請貼上全文，或說「讀 source 分支的 交接_Opus.md」。
> 簡單的新增感應文、改錯字、改連結，用 Sonnet 那個對話。

---

## 1. 這個對話負責什麼

**Opus 才做：** 經書模式（直排）、藏經閣、注音排版、音樂播放、語言切換、跨裝置問題、經文／真言／注音正確性、多頁改版與架構調整。

**不在這裡做：** 新增感應文、錯字、連結、單一 CSS 微調 → Sonnet。外語翻譯 → 另開對話，經 DeepSeek 與人工審閱才上線。

**鐵則：**
- 只推 GitHub，不寫入使用者電腦，除非使用者說「同步到電腦」。
- 修完要截圖驗證才回報；跨裝置問題用相同條件驗證。
- 經文、注音必須有依據（注音本、課誦本、PDF 或可信網頁）才改；改完列出依據。
- 不改寫作者或菩薩開示原文。
- 使用者希望 Claude 自己上網查證、自己比對，查不到才請他提供資料，並說清楚哪一句、哪一頁。

---

## 2. 網站基本資料

- 網址：https://denghapp-beep.github.io/dizang/
- GitHub `denghapp-beep/dizang`：`source` 分支＝原始檔；`main`＝發布成品（GitHub Pages，1～10 分鐘）。
- 主站 `fusion/`：index、reader、zangjing（藏經閣）、zhai、contact。
- 語言：zh、sc、en、vi、ja、ko。
- 主要程式：`assets/app.js`、`zangjing.js`、`music.js`、`i18n*.js`、`zhai*.js`、`style.css`；經文與注音在 `assets/sutras/`。
- Commit：user.name `denghapp-beep`、user.email `denghapp@gmail.com`，訊息結尾加 Co-Authored-By 行。

## 3. 開工流程

```
git clone -b source https://github.com/denghapp-beep/dizang src
git clone -b main   https://github.com/denghapp-beep/dizang site
```
1. 在 `src` 改 → `python tools/build_public.py` 產生 `dist/`（含每篇靜態頁與 sitemap）。
2. 清空 `site/`（保留 `.git`）→ 複製 `dist/` 內容 → commit、push main。
3. 原始檔也要 commit、push `source`。
4. 改了 JS/CSS/字型/經文資料，要把引用處的 `?v=` 加 1：
   - `style.css`、`music.js`、`app.js`、`zangjing.js` 在各 HTML；`tools/build_about.py` 也有 style/music 版本號要同步。
   - 經文：`fusion/zangjing.html` 的 `{經}.js?v=`、`liturgy.js?v=`；注音檔版本在 `assets/zangjing.js` 內 `_zhuyin.js?v=`。
   - 字型：`assets/fonts/sutra-serif.css?v=` 與檔內 `sutra-400/700.woff2?v=`、`rare.woff2?v=`。
5. 驗證：本機 `python -m http.server` ＋ Playwright，手機 390px、桌面 1440px 截圖。

---

## 4. 本次（11/12）已完成並上線

**經書模式／注音排版**
- 直排注音改為法鼓山經本排法：字緊排、注音貼字右上、聲調在末符號右上、句讀改小圈放在注音欄獨立小格。
- 每頁最後一屏不再重覆前一屏經文（`zangjing.js` measure() 加尾端留白 `.zr-tail`）。已用程式逐屏比對五部經×開關注音×多種螢幕：0 重覆 0 漏字。
- 橫排長品名（往生咒全名）可換行置中。

**字型**
- 經文用字合併為 `assets/fonts/sutra-400.woff2`、`sutra-700.woff2`（Noto Serif TC 子集＋Noto Serif JP 補 嘇嚩妷尫悋焭糺裓辠韈），解決 iPhone 粗細不一。
- 罕用字 㝹、𨪏、鏫 用花園明朝補在 `rare.woff2`。原切片 `nst/` 仍保留作後備。
- 重建字型：`python tools/build_sutra_font.py`（`--check` 只查缺字）。已驗證重建結果與線上字形逐一相同。缺字會列出；Noto TC 切片沒有的字會從現有 sutra-*.woff2 沿用，仍缺可加 `--jp-400/--jp-700` 指定 Noto Serif JP（TTF），罕用字則補進 rare.woff2。

**經文與注音更正**（依據已記在 commit 訊息）
- 普門品、阿彌陀經、無量壽經「車𤦲」→「硨磲」ㄔㄜ ㄑㄩˊ。
- 阿彌陀經：依使用者錄影的課誦本（第 3～41 頁）修正 48 處注音；改字：俱絺羅、周利槃陀伽、目犍連、名為極樂、玻瓈、經前真言「薩婆訶」、「韈日囉斛」、「薄拘羅」。紀錄 `tools/zhuyin_amituo_ref_overrides.json`。
- 無量壽經：依使用者提供《淨土五經》（佛陀教育基金會 2010 重排，難字注音）程式逐字比對，更正 287 處注音；罕用字 䗍→螺、㒋→斯、妷→佚、焭→煢。紀錄 `tools/zhuyin_wuliangshou_ref_overrides.json`。
- 大悲咒：嘇 ㄙㄥ、罰闍 ㄕㄜˊ。
- `build_zhuyin.py` 現在會自動套用 `tools/zhuyin_{經}_ref_overrides.json`（注音本校對）與 `_manual_overrides.json`（個別人工更正），每筆含「該字」，經文改字造成位置錯開會停止並列出。`--check` 可比對不寫入。五部經重新產生後與線上注音完全一致。
- 11/14 依使用者提供注音本 PDF（`地藏菩薩本願經 注音版 1118ok`、`金剛般若波羅蜜經 注音版 0920`，Word 用王漢宗楷書注音字型 ChuIn／PoIn1～3 排版）逐字比對：從 PDF 內嵌字型字形讀出注音（OCR 抽查 100% 正確），更正地藏經 202 處、金剛經 123 處，寫入 `tools/zhuyin_{dizang,jingang}_ref_overrides.json`。比對涵蓋率：地藏經 15542/17036 字、金剛經 4727/5386 字（其餘為版本用字不同未對上）。舊 120 筆衝突已由 PDF 判定 113 筆，剩 7 筆在 `zhuyin_dizang_ref_conflicts.json`。
- 未套用、待使用者決定：(1) PDF 標「一」「不」變調（一ˊ/ˋ 174 處、不ˊ 63 處），網站目前標本調；(2) 經前經後儀軌（liturgy.js）目前依法鼓山課誦本，PDF 讀法不同處（如南無ㄋㄢˊ）未改；(3) 大悲咒 PDF `0914ok` 尚未套用。

**換頁音樂不中斷（架構改版）**
- `music.js`：最外層頁面當「外框」保留 YouTube 播放器，站內連結改在全螢幕 iframe（`.shell-frame`）載入；網址、標題、上一頁／下一頁同步；內層頁面不建播放器、首次點擊轉給外框解除靜音；經書模式時收起音樂鈕（`shell-lock`）。
- 以假 YouTube 播放器測試：多次換頁播放器只建立 1 次、0 錯誤。尚待使用者 iPhone 實機確認。

**每篇感應文獨立靜態頁**
- `tools/build_static.py`（由 build_public.py 呼叫）產生 `a/{id}.html` 與 `a/{sc,en,vi,ja,ko}/{id}.html` 共 336 頁：全文靜態 HTML、canonical、hreflang、JSON-LD、上一篇／下一篇、閱讀模式連結。
- `dist/sitemap.xml` 改為自動產生（346 網址）；`src/sitemap.xml` 舊檔已不使用。
- reader.html 會把 canonical 指向對應靜態頁；`/s/{id}.html` 分享頁 canonical 也改指向靜態頁。
- 靜態頁不顯示入口畫面（`body.static-article`）。

---

## 5. 待辦（建議順序）

**使用者要做：**
1. iPhone 實機確認：換頁音樂不中斷、經書模式翻頁、罕用字顯示、字體粗細。
2. Google Search Console 重新提交 sitemap。
3. 白名單加入 `sutra.ddm.org.tw`（claude.ai Settings → Capabilities），或錄法鼓山翻頁影片。

**經文校對（需資料）：**
4. 普門品、地藏經、金剛經逐字注音 → 法鼓山 ebook/22、09、10（頁面是圖片，要白名單或錄影）。
5. 阿彌陀經：課誦本第 1～2 頁（爐香讚）與經後（往生咒、讚佛偈、迴向）；「遍覆」應為「偏」或「徧」待確認。
6. 無量壽經常用字（PDF 只標難字，且約兩千字 PDF 無法抽字）。
7. 大悲咒整體讀法：目前用國語讀法（南無ㄋㄚˊㄇㄛˊ、囉ㄌㄚ）；若使用者要傳統口誦（囉ㄌㄚˋ、耶ㄧㄝˇ），需整首換。

**經文校對（11/14 新增）：** 見第 4 節「未套用、待使用者決定」三項。

**技術：**
8. ~~注音 overrides 自動套用~~、~~字型重建腳本入庫~~（11/12 完成）。
9. 地藏經 120 筆參考讀音衝突待確認（`tools/zhuyin_dizang_ref_conflicts.json`）。

## 6. 開始時請先問使用者

- 第 1 項實機確認結果（有問題附裝置、瀏覽器、截圖）。
- 這次要處理哪一項。
