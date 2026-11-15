import sys,wl
S,Z=wl.load();c=int(sys.argv[1]);ctx=sys.argv[2];t=sys.argv[3]
h=[x for x in wl.find(S,ctx) if x[0]==c];assert len(h)==1,h
S['notes'].append({'c':c,'p':h[0][1],'t':t});wl.save(S,Z);print('note',h[0][:2],t)
