import json, os, re, sys
H = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, H)
from subfilter import keep, rejected
wiki = json.load(open(os.path.join(H, 'subphotos_cache.json'), encoding='utf8'))
gb = json.load(open(os.path.join(H, 'gbif_cache.json'), encoding='utf8')) if os.path.exists(os.path.join(H, 'gbif_cache.json')) else {}
gbrej = set(json.load(open(os.path.join(H, 'gbif_reject.json'), encoding='utf8'))) if os.path.exists(os.path.join(H, 'gbif_reject.json')) else set()
FOT = os.path.join(H, '..', 'site', 'fotos'); rej = rejected(); out = {}
for k, v in wiki.items():
    if keep(k, v) and k not in rej and os.path.exists(os.path.join(FOT, v['f'])):
        out[k] = {'f': v['f'], 'p': v['p'], 't': v['t']}
for k, v in gb.items():
    if k in out or not v or k in gbrej or not os.path.exists(os.path.join(FOT, v['f'])): continue
    out[k] = {'f': v['f'], 'p': v['page'], 't': v['gn'], 'b': v['by'], 'l': v['lic']}
open(os.path.join(H, '..', 'site', 'subphotos.js'), 'w', encoding='utf8').write('/* Fotos der Untergruppen: Wikipedia/Commons und GBIF (Urheber und Lizenz je Foto angegeben) */\nconst SUBPHOTO = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n')
used = {v['f'] for v in out.values()}
n = 0
for f in os.listdir(FOT):
    if f.startswith('sub_') and f not in used: os.remove(os.path.join(FOT, f)); n += 1
print(len(out), 'Fotos referenziert,', n, 'ungenutzte entfernt;', sum(1 for v in out.values() if v.get('b')), 'aus GBIF')
