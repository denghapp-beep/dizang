python3 /home/claude/tools/sync.py $1 "$2" "$(cat /home/claude/tools/tm.json)" 2>&1 | grep -v "CHAR.*[為爲琉]"; true
