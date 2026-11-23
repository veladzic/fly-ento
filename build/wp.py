import json,urllib.request,urllib.parse,sys,os
sys.stdout.reconfigure(encoding='utf-8')
T={'siphlonurus':'Siphlonurus','ephoron':'Ephoron_virgo','palingenia':'Palingenia_longicauda','tricorythodes':'Tricorythodes','phryganea':'Phryganeidae','leptoceridae':'Leptoceridae','taeniopterygidae':'Taeniopterygidae','notonecta':'Notonecta','aphididae':'Aphid','syrphidae':'Hoverfly','gammarus':'Gammarus_pulex','asellus':'Asellus_aquaticus','radix':'Lymnaea_stagnalis','egel':'Erpobdella_octoculata','hexagenia':'Hexagenia_limbata','nemoura':'Nemoura','deleatidium':'Deleatidium','salmo':'Ephemera_danica','sedge':'Anabolia_nervosa'}
out={}
for k,t in T.items():
    try:
        req=urllib.request.Request('https://en.wikipedia.org/api/rest_v1/page/summary/'+t,headers={'User-Agent':'flyento-site-build/1.0'})
        j=json.load(urllib.request.urlopen(req,timeout=30))
        src=(j.get('thumbnail') or {}).get('source')
        if not src: print(k,'no thumb');continue
        src=src.replace(src.split('/')[-1].split('px-')[0]+'px-','500px-') if 'px-' in src.split('/')[-1] else src
        data=urllib.request.urlopen(urllib.request.Request(src,headers={'User-Agent':'flyento-site-build/1.0'}),timeout=30).read()
        open(f'../site/fotos/ins_{k}.jpg','wb').write(data); out[k]=j.get('content_urls',{}).get('desktop',{}).get('page')
        print(k,len(data))
    except Exception as e: print(k,'ERR',e)
json.dump(out,open('wp_sources.json','w'))
