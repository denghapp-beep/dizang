# dizang 網站：Claude 工作規則

完整規則見 AGENTS.md（Codex 與 Claude 共用），開工前務必讀完。

## ⚠️ 防止舊檔覆蓋經文（必讀，曾發生 3 次：11/15、11/19、11/23）
經文、注音、字型是依紙本逐字校對的成果，被舊工作區蓋回去就要重做。每次都是「工作區沒先更新 + `git add -A`」造成。
1. **開工前、推送前都要** `git pull --rebase origin main`。對話若中斷超過一段時間（隔天、額度重置後），工作區一律視為過期，先 pull。
2. **只 `git add` 自己這次改的檔案**，不要用 `git add -A` / `git add .` / `git commit -a`。
3. **新增文章／開示／譯文**只會改到 `a/`、各語系目錄、`assets/data*.js`、`assets/i18n*.js`、`assets/verses.js`、`sitemap.xml` 與 html 版本號；**絕不應出現** `assets/sutras/`、`assets/fonts/sutra-*`、`assets/zangjing.js`。`git status` 若看到這些檔案有變動，代表工作區過期，停下來先 pull，不要推。
4. **推送前執行** `python3 tools/guard.py`（或一次設定 `git config core.hooksPath .githooks`，之後推送會自動檢查）。它會擋下把經文、注音、字型、閱讀程式換回舊版或刪除的提交。刻意還原時提交訊息寫明「還原」。
5. GitHub Actions 每次推送到 main 也會跑同一個檢查，失敗會寄信通知網站擁有者。
6. **經文修改要多一道程序**：只要動到 `assets/sutras/`（經文、注音、儀軌）或 `assets/fonts/sutra-400/700.woff2`，提交訊息**必須**另起一行寫「經文修改：<依據>」，例如「經文修改：依紙本 p.34 照片」「經文修改：使用者確認 p.21 華 ㄏㄨㄚ」。沒有這一行，`tools/guard.py` 會擋下；就算繞過推上去，GitHub Actions 會在一分鐘內**自動把經文檔還原成推送前版本**並寄信通知網站擁有者。

## 經文校對
- 經文、注音、儀軌一律以紙本為準，看不清標 UNKNOWN 問使用者，不同字類推。
- 進度與待確認項：docs/wuliangshou-proof.md。
