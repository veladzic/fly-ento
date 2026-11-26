import base64,json,re,os
S='../site/'
html=open(S+'index.html',encoding='utf8').read()
css=open(S+'style.css',encoding='utf8').read()
js=''.join(open(S+f,encoding='utf8').read()+'\n' for f in ['data.js','data_extra.js','subphotos.js','mapdata.js'])
app=open(S+'app.js',encoding='utf8').read()+chr(10)+open(S+'features.js',encoding='utf8').read()+chr(10)+open(S+'deep.js',encoding='utf8').read()
used=set(re.findall(r'"((?:ins|fly|sub)_[a-z0-9\-_]+\.jpg)"',js+open(S+'deep.js',encoding='utf8').read()))
img={f:'data:image/jpeg;base64,'+base64.b64encode(open(S+'fotos/'+f,'rb').read()).decode() for f in sorted(used)}
app=app.replace('const photo = f => "fotos/" + f;','const photo = f => __IMG[f];')
pre='const __IMG='+json.dumps(img,separators=(',',':'))+';\n'
html=html.replace('<link rel="stylesheet" href="style.css">','<style>\n'+css+'\n</style>')
html=re.sub(r'<script src="data.js"></script>\s*<script src="data_extra.js"></script>\s*<script src="subphotos.js"></script>\s*<script src="mapdata.js"></script>\s*<script src="app.js"></script>\s*<script src="features.js"></script>\s*<script src="deep.js"></script>',lambda m:'<script>\n'+pre+js+app+'\n</script>',html)
out='../Entomologie_Fliegenfischer.html'
open(out,'w',encoding='utf8').write(html)
print(len(img),'imgs',os.path.getsize(out)//1024,'KB')
