import sys
from PIL import Image
f,rot=sys.argv[1],int(sys.argv[2]); x0,y0,x1,y1=map(float,sys.argv[3:7]); out=sys.argv[7] if len(sys.argv)>7 else '/tmp/v.jpg'
im=Image.open('/home/claude/photos/S__249%s_0.jpg'%f).rotate(rot,expand=True)
W,H=im.size; im=im.crop((int(x0*W),int(y0*H),int(x1*W),int(y1*H))); im.thumbnail((1350,1350)); im.save(out,quality=88)
print(W,H)
