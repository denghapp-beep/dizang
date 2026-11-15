import sys
from PIL import Image
f,rot,x0,y0,x1,y1=sys.argv[1],int(sys.argv[2]),*map(float,sys.argv[3:7])
im=Image.open('/home/claude/rot/S__249%s_0.jpg'%f).rotate(rot,expand=True)
W,H=im.size
im.crop((int(x0*W),int(y0*H),int(x1*W),int(y1*H))).save('/tmp/v.jpg',quality=88)
