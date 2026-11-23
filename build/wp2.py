import json,urllib.request,sys,time
sys.stdout.reconfigure(encoding='utf-8')
T={'ephoron':'Ephoron_(mayfly)','asellus':'Asellus_aquaticus','radix':'Lymnaea_stagnalis','egel':'Leech','hexagenia':'Hexagenia_limbata'}
for k,t in T.items():
    time.sleep(4)
    try:
        req=urllib.request.Request('https://en.wikipedia.org/api/rest_v1/page/summary/'+t,headers={'User-Agent':'flyento-site-build/1.0'})
        j=json.load(urllib.request.urlopen(req,timeout=30))
        src=(j.get('thumbnail') or {}).get('source')
        if not src: print(k,'no thumb');continue
        data=urllib.request.urlopen(urllib.request.Request(src,headers={'User-Agent':'flyento-site-build/1.0'}),timeout=30).read()
        open(f'../site/fotos/ins_{k}.jpg','wb').write(data); print(k,len(data))
    except Exception as e: print(k,'ERR',e)
