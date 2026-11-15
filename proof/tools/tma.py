import json,sys;t=json.load(open('/home/claude/tools/tm.json'))
for a in sys.argv[1:]: k,v=a.split('='); t[k]=v
json.dump(t,open('/home/claude/tools/tm.json','w'),ensure_ascii=False)
