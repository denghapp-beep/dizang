import wl,json,subprocess,difflib
P1,P2=wl.P1,wl.P2
g=lambda f:subprocess.check_output(['git','-C','/home/claude/dizang','show','origin/main:assets/sutras/'+f]).decode()
OS=json.loads(g('wuliangshou.js')[len(P1):].rstrip().rstrip(';'));OZ=json.loads(g('wuliangshou_zhuyin.js')[len(P2):].rstrip().rstrip(';'))
S,Z=wl.load()
VAR={'為':'爲','群':'羣','真':'眞','睹':'覩','饍':'膳','殖':'植','加':'跏','振':'震','遍':'徧','琉':'瑠','劫':'刼','栴':'旃','污':'汙','回':'迴','游':'遊','於':'于','鉢':'缽','麤':'粗','強':'彊','災':'灾','焰':'燄','歎':'嘆','衆':'眾','眾':'衆','裡':'裏','蓋':'葢','暖':'煖','慧':'惠','床':'牀','雕':'彫','剎':'刹','恒':'恆','卻':'却','崖':'涯','係':'繫','迴':'回','挍':'校','脩':'修','咨':'諮','薰':'熏','幡':'旛','缽':'鉢','偽':'僞','麁':'麤','惓':'倦'}
def stream(S,Z,c):
    t='¶'.join(S['chapters'][c]['paras']);k=[]
    for i,z in enumerate(Z[c]['p']):
        if i:k.append('¶')
        k+=z.split(' ')
    return t,k
n=0
for c in range(2):
    ot,ok=stream(OS,OZ,c);nt,nk=stream(S,Z,c)
    sm=difflib.SequenceMatcher(None,ot,nt,autojunk=False)
    for op,a1,a2,b1,b2 in sm.get_opcodes():
        if op=='replace' and a2-a1==b2-b1:
            for i in range(a2-a1):
                if (VAR.get(ot[a1+i])==nt[b1+i] or VAR.get(nt[b1+i])==ot[a1+i]) and nk[b1+i]!=ok[a1+i]: nk[b1+i]=ok[a1+i];n+=1
    Z[c]['p']=' '.join(nk).split(' ¶ ')
wl.save(S,Z);print('fixed',n)
