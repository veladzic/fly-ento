import re, os
a = open('../site/app.js', encoding='utf8').read()
a = a.replace('data-page="${esc(p.t || "")}"', 'data-page="${esc(p.t || "")}" data-by="${esc(p.b || "")}" data-lic="${esc(p.l || "")}"', 1)
old = a[a.index('  cap.textContent = i.alt'):a.index('  lb.classList.add("on");')]
new = '''  const by = i.dataset.by, lic = i.dataset.lic;
  cap.textContent = i.alt + (by ? "" : (i.dataset.page ? " · Wikipedia-Seite: " + i.dataset.page : ""));
  if (by) cap.append(" · Foto: " + by + (lic ? " (" + lic + ")" : "") + " · ");
  else if (cr) cap.append(" · Foto: ");
  if (cr) { const l = document.createElement("a"); l.href = cr; l.target = "_blank"; l.rel = "noopener"; l.textContent = by ? "GBIF" : "Wikipedia / Commons"; l.style.color = "#fff"; l.addEventListener("click", ev => ev.stopPropagation()); cap.appendChild(l); }
'''
a = a.replace(old, new, 1)
open('../site/app.js', 'w', encoding='utf8').write(a)

g = '''import json, os, re, sys
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
open(os.path.join(H, '..', 'site', 'subphotos.js'), 'w', encoding='utf8').write('/* Fotos der Untergruppen: Wikipedia/Commons und GBIF (Urheber und Lizenz je Foto angegeben) */\\nconst SUBPHOTO = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\\n')
used = {v['f'] for v in out.values()}
n = 0
for f in os.listdir(FOT):
    if f.startswith('sub_') and f not in used: os.remove(os.path.join(FOT, f)); n += 1
print(len(out), 'Fotos referenziert,', n, 'ungenutzte entfernt;', sum(1 for v in out.values() if v.get('b')), 'aus GBIF')
'''
open('gen_subphotos.py', 'w', encoding='utf8').write(g)

s = open('sheets.py', encoding='utf8').read()
if 'gbif_cache' not in s:
    s = s.replace("items = [(k, v) for k, v in cache.items() if keep(k, v) and k not in rejected() and os.path.exists(os.path.join(FOT, v['f']))]",
"""if len(sys.argv) > 1 and sys.argv[1] == 'gbif':
    gb = json.load(open(os.path.join(H, 'gbif_cache.json'), encoding='utf8'))
    items = [(k, {'f': v['f'], 't': v['gn'] or '', 'd': 'Foto: ' + v['by']}) for k, v in gb.items() if v and os.path.exists(os.path.join(FOT, v['f']))]
else:
    items = [(k, v) for k, v in cache.items() if keep(k, v) and k not in rejected() and os.path.exists(os.path.join(FOT, v['f']))]""")
    open('sheets.py', 'w', encoding='utf8').write(s)
print('ok')
