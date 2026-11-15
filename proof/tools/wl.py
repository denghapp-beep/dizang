import json,sys
D='/home/claude/dizang/assets/sutras/'
P1='window.SUTRAS=window.SUTRAS||{};window.SUTRAS.wuliangshou='
P2='window.SUTRA_ZHUYIN=window.SUTRA_ZHUYIN||{};window.SUTRA_ZHUYIN.wuliangshou='
def load():
    a=open(D+'wuliangshou.js').read();b=open(D+'wuliangshou_zhuyin.js').read()
    return json.loads(a[len(P1):].rstrip().rstrip(';')),json.loads(b[len(P2):].rstrip().rstrip(';'))
def save(S,Z):
    check(S,Z)
    open(D+'wuliangshou.js','w').write(P1+json.dumps(S,ensure_ascii=False)+';')
    open(D+'wuliangshou_zhuyin.js','w').write(P2+json.dumps(Z,ensure_ascii=False)+';')
def check(S,Z):
    bad=[]
    for c,ch in enumerate(S['chapters']):
        for p,t in enumerate(ch['paras']):
            n=len(Z[c]['p'][p].split(' '))
            if n!=len(t): bad.append((c,p,len(t),n))
    if bad: raise SystemExit('LEN MISMATCH %s'%bad)
def find(S,s):
    r=[]
    for c,ch in enumerate(S['chapters']):
        for p,t in enumerate(ch['paras']):
            i=t.find(s)
            while i>=0: r.append((c,p,i)); i=t.find(s,i+1)
    return r
def rep(S,Z,ctx,old,new,toks=None):
    """ctx unique; old within ctx; new tokens list (len(new)) or None: keep tokens if same length & only punct change"""
    hits=find(S,ctx)
    if len(hits)!=1: raise SystemExit('ctx %r hits %s'%(ctx,hits))
    c,p,i=hits[0]; k=ctx.index(old); i+=k
    t=S['chapters'][c]['paras'][p]; z=Z[c]['p'][p].split(' ')
    if toks is None:
        toks=[]
        for ch in new:
            toks.append('_' if not ch.isalnum() else None)
        # reuse tokens of old for same chars
        oz=z[i:i+len(old)]; om=list(old)
        for j,ch in enumerate(new):
            if toks[j] is None:
                if ch in om: idx=om.index(ch); toks[j]=oz[idx]; om[idx]=None
                else: raise SystemExit('need token for %r'%ch)
    assert len(toks)==len(new)
    S['chapters'][c]['paras'][p]=t[:i]+new+t[i+len(old):]
    Z[c]['p'][p]=' '.join(z[:i]+list(toks)+z[i+len(old):])
    return c,p
