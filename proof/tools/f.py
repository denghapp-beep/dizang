import sys
from PIL import Image
f=sys.argv[1];rot=int(sys.argv[2]) if len(sys.argv)>2 else 0
y0,y1=(float(sys.argv[3]),float(sys.argv[4])) if len(sys.argv)>4 else (0.1,0.9)
im=Image.open('/home/claude/rot/S__249%s_0.jpg'%f).rotate(rot,expand=True)
W,H=im.size;im=im.crop((0,int(y0*H),W,int(y1*H)))
im.thumbnail((1900,1900));im.save('/tmp/f.jpg',quality=85)
