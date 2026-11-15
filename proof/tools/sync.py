# usage: python3 sync.py C "paper text" [tokmap json] [--dry]
# paper text: ¶ = paragraph start; ❶❷ markers; full punctuation
import sys,json,difflib,wl
PUN=set('，。、；：？！「」『』（）　 ¶❶❷❸❹❺❻…—')
def isp(ch): return ch in PUN or not ch.isalnum()
VAR={'為':'爲','群':'羣','真':'眞','睹':'覩','饍':'膳','殖':'植','加':'跏','振':'震','遍':'徧','琉':'瑠','劫':'刼','栴':'旃','污':'汙','回':'迴','游':'遊','於':'于','鉢':'缽','麤':'粗','強':'彊','災':'灾','焰':'燄','歎':'嘆','衆':'眾','眾':'衆','裡':'裏','蓋':'葢','暖':'煖','慧':'惠','床':'牀','雕':'彫','剎':'刹','恒':'恆','卻':'却','崖':'涯','係':'繫','迴':'回','挍':'校','脩':'修','咨':'諮','薰':'熏','幡':'旛','缽':'鉢','偽':'僞','麁':'麤','惓':'倦'}
def VARPOS(old,a1,a2,new,b1,b2,ch,otok):
    for k in range(a1,a2):
        if VAR.get(old[k])==ch or VAR.get(ch)==old[k]: return otok[k]
    return None
st=json.load(open('/home/claude/tools/cursor.json'))
c=int(sys.argv[1]); new=sys.argv[2]; tm=json.loads(sys.argv[3]) if len(sys.argv)>3 and sys.argv[3]!='--dry' else {}
dry='--dry' in sys.argv
S,Z=wl.load()
paras=S['chapters'][c]['paras']; zp=[z.split(' ') for z in Z[c]['p']]
text='¶'.join(paras); toks=[]
for i,z in enumerate(zp):
    if i: toks.append('¶')
    toks+=z
assert len(text)==len(toks)
cur=st[str(c)]
# window
nc=[x for x in new if not isp(x)]
w=text[cur:cur+len(new)*2+60]
wc=[(i,x) for i,x in enumerate(w) if not isp(x)]
sm=difflib.SequenceMatcher(None,nc,[x for _,x in wc],autojunk=False)
bl=[b for b in sm.get_matching_blocks() if b.size]
lastnew=bl[-1].a+bl[-1].size; lastold=bl[-1].b+bl[-1].size
k=len(nc)-lastnew
if k: print('WARN tail unmatched, extending',k)
end=wc[lastold-1+k][0]+1
# absorb trailing punct in old if new ends in punct
j=end
while j<len(w) and isp(w[j]) and w[j]!='¶': j+=1
end=j if isp(new[-1]) else end
old=w[:end]
if len(old)>len(new)*1.25+8: raise SystemExit('ABORT old too long %d vs %d'%(len(old),len(new)))
# start: if new starts with ¶ and old starts with punct before? keep
otok=toks[cur:cur+end]
sm=difflib.SequenceMatcher(None,old,new,autojunk=False)
ntok=[];rep=[]
for op,a1,a2,b1,b2 in sm.get_opcodes():
    if op=='equal': ntok+=otok[a1:a2]; continue
    pool=list(zip(old[a1:a2],otok[a1:a2]))
    for ch in new[b1:b2]:
        if ch=='¶': ntok.append('¶')
        elif isp(ch): ntok.append('_')
        else:
            m=[k for k,(o,t) in enumerate(pool) if o==ch]
            if m: ntok.append(pool.pop(m[0])[1])
            elif (lambda r:r>=0 and r<a2-a1 and VAR.get(old[a1+r])==ch)(b2-b1==a2-a1 and new[b1:b2].index(ch) or -1) and False: pass
            elif VARPOS(old,a1,a2,new,b1,b2,ch,otok) is not None: ntok.append(VARPOS(old,a1,a2,new,b1,b2,ch,otok))
            elif ch in tm: ntok.append(tm[ch])
            else: ntok.append('??')
    oc=''.join(x for x in old[a1:a2] if not isp(x)); ncc=''.join(x for x in new[b1:b2] if not isp(x))
    if oc!=ncc: rep.append((old[max(0,a1-4):a2+4],'→',new[max(0,b1-4):b2+4]))
for r in rep: print('CHAR',*r)
if '??' in ntok:
    print('NEED TOKENS for:',[new[i] for i,t in enumerate(ntok) if t=='??']); sys.exit(1)
if dry: print('OLD:',old);sys.exit()
text2=text[:cur]+new+text[cur+end:]; toks2=toks[:cur]+ntok+toks[cur+end:]
# rebuild paras; map old para idx
oldstart=[0]
for i,ch in enumerate(text):
    if ch=='¶': oldstart.append(i+1)
NP=text2.split('¶'); NZ=[];acc=[]
for ch,t in zip(text2,toks2):
    if ch=='¶': NZ.append(' '.join(acc));acc=[]
    else: acc.append(t)
NZ.append(' '.join(acc))
# old para k -> new para containing old start pos (shifted)
delta=len(new)-end
def newpos(p): return p if p<cur else (p+delta if p>=cur+end else cur)
newstart=[0]+[i+1 for i,ch in enumerate(text2) if ch=='¶']
import bisect
mp={k:bisect.bisect_right(newstart,newpos(s))-1 for k,s in enumerate(oldstart)}
S['chapters'][c]['paras']=NP; Z[c]['p']=NZ
for n in S['notes']:
    if n['c']==c: n['p']=mp[n['p']]
v=S['vows']
if c==0:
    k=[i for i,p in enumerate(NP) if p.lstrip('「『').startswith('設我得佛，國有地獄')]
    assert len(k)==1; v['from']=k[0]
wl.save(S,Z)
st[str(c)]=cur+len(new); json.dump(st,open('/home/claude/tools/cursor.json','w'))
print('OK paras',len(paras),'->',len(NP),'| next:',text2[cur+len(new):cur+len(new)+30])
