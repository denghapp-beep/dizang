#!/usr/bin/env python3
"""防止舊檔覆蓋經文：檢查一段提交（預設 origin/main..HEAD）。

擋下的情況（任一提交）：
  1. 受保護檔案被刪除
  2. 受保護檔案的新內容等於它在歷史上的某個舊版本（＝被舊檔蓋回去）
例外：提交訊息含「還原」或「修復」時允許（刻意的還原）；含「移除」「合併」時允許刪除。

用法：python3 tools/guard.py [起點 [終點]]
"""
import subprocess, sys

PROTECTED = ('assets/sutras/', 'assets/fonts/', 'assets/zangjing.js', 'assets/style.css',
             'AGENTS.md', 'CLAUDE.md', 'docs/wuliangshou-proof.md', 'tools/guard.py')
ALLOW = ('還原', '修復')
ALLOW_DELETE = ('移除', '合併')
IGNORE = ('assets/fonts/sutra-serif.css',)  # 只放快取版本號，號碼重複不代表舊檔
Z = '0' * 40

def git(*a):
    return subprocess.run(('git',) + a, capture_output=True, text=True, check=True).stdout

def history_blobs(rev, path):
    """path 在 rev（含）之前出現過的所有內容版本。"""
    out = git('log', '--format=', '--raw', '--no-abbrev', '--no-renames', rev, '--', path)
    return {L.split()[3] for L in out.splitlines() if L.startswith(':')}

def main():
    base = sys.argv[1] if len(sys.argv) > 1 else 'origin/main'
    head = sys.argv[2] if len(sys.argv) > 2 else 'HEAD'
    bad = []
    for c in git('rev-list', '--reverse', f'{base}..{head}').split():
        msg = git('log', '-1', '--format=%s%n%b', c)
        if any(k in msg for k in ALLOW):
            continue
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
            if new == Z and any(k in msg for k in ALLOW_DELETE):
                continue
            if new == Z:
                bad.append(f'{c[:7]} 刪除了 {path}（{title}）')
            elif new != old and new in history_blobs(p, path):
                bad.append(f'{c[:7]} 把 {path} 換回舊版本（{title}）')
    if bad:
        print('✗ 偵測到疑似用舊檔覆蓋經文／網站核心檔案：')
        for b in bad: print('  -', b)
        print('\n多半是工作區太舊。請先 git pull --rebase origin main，只 git add 自己改的檔案再推。')
        print('若確定是刻意還原，提交訊息請寫明「還原」。')
        sys.exit(1)
    print('✓ 沒有舊檔覆蓋')

if __name__ == '__main__':
    main()
