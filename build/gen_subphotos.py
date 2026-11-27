import json, os
H = os.path.dirname(os.path.abspath(__file__))
c = json.load(open(os.path.join(H, 'subphotos_cache.json'), encoding='utf8'))
out = {k: v for k, v in c.items() if v and os.path.exists(os.path.join(H, '..', 'site', 'fotos', v['f']))}
open(os.path.join(H, '..', 'site', 'subphotos.js'), 'w', encoding='utf8').write('/* Fotos der Untergruppen: Wikipedia / Wikimedia Commons (Seite verlinkt Urheber und Lizenz) */\nconst SUBPHOTO = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n')
print(len(c), 'verarbeitet,', len(out), 'mit Foto')
