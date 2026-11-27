#!/usr/bin/env python3
"""防止舊檔覆蓋經文：檢查一段提交（預設 origin/main..HEAD）。

擋下的情況（任一提交）：
  1. 受保護檔案被刪除
  2. 受保護檔案的新內容等於它在歷史上的某個舊版本（＝被舊檔蓋回去）
  3. 經文資料（assets/sutras/）或經文字型（assets/fonts/sutra-*.woff2）有變動，
     但提交訊息沒有「經文修改：<依據>」這一行（例：經文修改：依紙本 p.34 照片）
例外：提交訊息含「還原」或「修復」時允許 1、2（刻意的還原）；含「移除」「合併」時允許刪除。
--paths：只輸出違規提交動到的受保護檔案路徑（給自動還原用）。

用法：python3 tools/guard.py [起點 [終點]]
"""
import subprocess, sys

PROTECTED = ('assets/sutras/', 'assets/fonts/', 'assets/zangjing.js', 'assets/style.css',
             'AGENTS.md', 'CLAUDE.md', 'docs/wuliangshou-proof.md', 'tools/guard.py')
ALLOW = ('還原', '修復')
ALLOW_DELETE = ('移除', '合併')
SUTRA = ('assets/sutras/', 'assets/fonts/sutra-400', 'assets/fonts/sutra-700')
MARK = '經文修改：'
IGNORE = ('assets/fonts/sutra-serif.css',)  # 只放快取版本號，號碼重複不代表舊檔
Z = '0' * 40

def git(*a):
    return subprocess.run(('git',) + a, capture_output=True, text=True, check=True).stdout

def history_blobs(rev, path):
    """path 在 rev（含）之前出現過的所有內容版本。"""
    out = git('log', '--format=', '--raw', '--no-abbrev', '--no-renames', rev, '--', path)
    return {L.split()[3] for L in out.splitlines() if L.startswith(':')}

def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    only_paths = '--paths' in sys.argv
    base = args[0] if args else 'origin/main'
    head = args[1] if len(args) > 1 else 'HEAD'
    bad = []; paths = set()
    for c in git('rev-list', '--reverse', f'{base}..{head}').split():
        msg = git('log', '-1', '--format=%s%n%b', c)
        restore = any(k in msg for k in ALLOW)
        marked = any(L.strip().startswith(MARK) and len(L.strip()) > len(MARK) + 1 for L in msg.splitlines())
        parents = git('log', '-1', '--format=%P', c).split()
        if not parents:
            continue
        p = parents[0]
        for L in git('diff-tree', '-r', '--no-commit-id', '--no-renames', p, c).splitlines():
            meta, path = L.split('\t', 1)
            old, new = meta.split()[2:4]
            if not path.startswith(PROTECTED) or path in IGNORE:
                continue
            title = msg.splitlines()[0][:60]
            if path.startswith(SUTRA) and not marked and not restore:
                bad.append(f'{c[:7]} 修改經文 {path}，但提交訊息沒有「{MARK}<依據>」（{title}）'); paths.add(path)
                continue
            if restore:
                continue
            if new == Z and any(k in msg for k in ALLOW_DELETE):
                continue
            if new == Z:
                bad.append(f'{c[:7]} 刪除了 {path}（{title}）'); paths.add(path)
            elif new != old and new in history_blobs(p, path):
                bad.append(f'{c[:7]} 把 {path} 換回舊版本（{title}）'); paths.add(path)
    if only_paths:
        print('\n'.join(sorted(paths))); return
    if bad:
        print('✗ 偵測到疑似用舊檔覆蓋經文／網站核心檔案：')
        for b in bad: print('  -', b)
        print('\n多半是工作區太舊。請先 git pull --rebase origin main，只 git add 自己改的檔案再推。')
        print('若確定是刻意還原，提交訊息請寫明「還原」。')
        print(f'修改經文時，提交訊息要加一行「{MARK}依據」，例如「{MARK}依紙本 p.34 照片」或「{MARK}使用者確認」。')
        sys.exit(1)
    print('✓ 沒有舊檔覆蓋')

if __name__ == '__main__':
    main()
