# 地藏感應網站（dizang）協作說明 — Codex 與 Claude 共用

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
