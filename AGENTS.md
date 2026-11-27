# 地藏感應網站（dizang）協作說明 — Codex 與 Claude 共用

## ⚠️ 防止舊檔覆蓋經文（必讀，曾發生 3 次：11/15、11/19、11/23）
經文、注音、字型是依紙本逐字校對的成果，被舊工作區蓋回去就要重做。每次都是「工作區沒先更新 + `git add -A`」造成。
1. **開工前、推送前都要** `git pull --rebase origin main`。對話若中斷超過一段時間（隔天、額度重置後），工作區一律視為過期，先 pull。
2. **只 `git add` 自己這次改的檔案**，不要用 `git add -A` / `git add .` / `git commit -a`。
3. **新增文章／開示／譯文**只會改到 `a/`、各語系目錄、`assets/data*.js`、`assets/i18n*.js`、`assets/verses.js`、`sitemap.xml` 與 html 版本號；**絕不應出現** `assets/sutras/`、`assets/fonts/sutra-*`、`assets/zangjing.js`。`git status` 若看到這些檔案有變動，代表工作區過期，停下來先 pull，不要推。
4. **推送前執行** `python3 tools/guard.py`（或一次設定 `git config core.hooksPath .githooks`，之後推送會自動檢查）。它會擋下把經文、注音、字型、閱讀程式換回舊版或刪除的提交。刻意還原時提交訊息寫明「還原」。
5. GitHub Actions 每次推送到 main 也會跑同一個檢查，失敗會寄信通知網站擁有者。

## 共同規則
1. 開工前先 `git pull`；只推自己改過的檔案。曾有工作階段用舊檔蓋掉別人的修改，推送前務必 `git diff origin/main --stat` 確認沒有意外變動。
2. 經文、注音、儀軌一律**以紙本為準**（玄奘印刷文化有限公司印製之無量壽經）。不要用「同字類推」：同一個破音字在不同段落讀音可能不同，每一處都要對紙本。
3. 看不清楚的標 UNKNOWN，整理後問使用者，不要猜。
4. 改了 assets 下的 js/css/字型，要同步更新引用處的 `?v=` 版本號（fusion/zangjing.html、assets/zangjing.js 內的 `_zhuyin.js?v=`、assets/fonts/sutra-serif.css）。
5. Commit 訊息用繁體中文，寫清楚改了什麼、依據是什麼。

## 分工
- **Claude**：依紙本照片校對經文注音與儀軌內容（照片不在 repo，由使用者上傳）。校對工具與紀錄在 `proof-wuliangshou` 分支的 `proof/`。
- **Codex**：網站程式與顯示（`assets/zangjing.js`、`assets/style.css`、字型、版面、下載功能、測試）。發現注音／經文疑點時，記在 `docs/wuliangshou-proof.md` 的「待確認」區，不直接改注音資料。

## 資料檔
- 經文：`assets/sutras/<id>.js`；注音：`assets/sutras/<id>_zhuyin.js`（一字一 token，標點為 `_`，段落字數必須等於 token 數）。
- 前後儀軌：`assets/sutras/liturgy.js`（`zp` 中 `\n` 也佔一個 `_` token）。
- 經文字型：`assets/fonts/sutra-400/700.woff2` 是經文用字子集。新增或改字形後要確認子集有收，否則會退回其他字型、字身不齊（見 docs/wuliangshou-proof.md）。

## 進度
見 `docs/wuliangshou-proof.md`。
