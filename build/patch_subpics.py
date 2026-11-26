import os, re
S = '../site/'
if not os.path.exists(S + 'subphotos.js'):
    open(S + 'subphotos.js', 'w', encoding='utf8').write('const SUBPHOTO = {};\n')

a = open(S + 'app.js', encoding='utf8').read()
if 'const subLi' not in a:
    helper = '''
/* Untergruppen-Eintrag mit Foto (Wikipedia/Commons) */
const subLi = s => { const p = typeof SUBPHOTO !== "undefined" ? SUBPHOTO[s[0]] : null;
  return `<li${p ? ' class="has-pic"' : ""}>${p ? `<figure class="sfig"><img loading="lazy" src="${photo(p.f)}" alt="${esc(s[0])}" data-credit="${esc(p.p || "")}"></figure>` : ""}<div class="sbody"><div><i class="mono">${esc(s[0])}</i><b>${esc(s[1])}</b></div><span>${esc(s[2])}</span></div></li>`; };
'''
    a = a.replace('/* ========== Dialog ========== */', helper + '\n/* ========== Dialog ========== */', 1)
    a = a.replace('<ul class="subs">${g.sub.map(s => `<li><div><i class="mono">${esc(s[0])}</i><b>${esc(s[1])}</b></div><span>${esc(s[2])}</span></li>`).join("")}</ul>',
                  '<ul class="subs">${g.sub.map(subLi).join("")}</ul>')
    # Lightbox mit Quellenangabe
    old = '''  $("img", lb).src = i.src; $("img", lb).alt = i.alt; $("p", lb).textContent = i.alt; lb.classList.add("on");'''
    new = '''  $("img", lb).src = i.src; $("img", lb).alt = i.alt;
  const cap = $("p", lb), cr = i.dataset.credit;
  cap.textContent = i.alt;
  if (cr) { cap.append(" · Foto: "); const l = document.createElement("a"); l.href = cr; l.target = "_blank"; l.rel = "noopener"; l.textContent = "Wikipedia / Commons"; l.style.color = "#fff"; l.addEventListener("click", ev => ev.stopPropagation()); cap.appendChild(l); }
  lb.classList.add("on");'''
    assert old in a
    a = a.replace(old, new)
open(S + 'app.js', 'w', encoding='utf8').write(a)

d = open(S + 'deep.js', encoding='utf8').read()
old = '<ul class="subs">${items.map(s => `<li><div><i class="mono">${esc2(s[0])}</i><b>${esc2(s[1])}</b></div><span>${esc2(s[2])}</span></li>`).join("")}</ul>'
assert old in d
d = d.replace(old, '<ul class="subs">${items.map(subLi).join("")}</ul>')
# Fotos in Artenliste anklickbar
d = d.replace('''const r = e.target.closest("tr[data-g]"); if (r) openGroup(r.dataset.g); });''', '''const r = e.target.closest("tr[data-g]"); if (r) openGroup(r.dataset.g); const f = e.target.closest(".sfig"); if (f) lightbox(f); });''')
open(S + 'deep.js', 'w', encoding='utf8').write(d)

h = open(S + 'index.html', encoding='utf8').read()
if 'subphotos.js' not in h:
    h = h.replace('<script src="data_extra.js"></script>', '<script src="data_extra.js"></script>\n<script src="subphotos.js"></script>')
open(S + 'index.html', 'w', encoding='utf8').write(h)

c = open(S + 'style.css', encoding='utf8').read()
if 'Untergruppen-Fotos' not in c:
    c += '''
/* Untergruppen-Fotos */
.subs li.has-pic{flex-direction:row;gap:12px;align-items:center}
.subs li .sbody{display:flex;flex-direction:column;gap:2px;min-width:0}
.sfig{margin:0;flex:none;width:72px;height:72px;border-radius:10px;overflow:hidden;background:#fff;border:1px solid var(--border);cursor:zoom-in}
.sfig img{width:100%;height:100%;object-fit:cover;display:block}
@media (max-width:700px){.sfig{width:64px;height:64px}}
'''
    open(S + 'style.css', 'w', encoding='utf8').write(c)

s = open('standalone.py', encoding='utf8').read()
s = s.replace("['data.js','data_extra.js','mapdata.js']", "['data.js','data_extra.js','subphotos.js','mapdata.js']")
s = s.replace('(?:ins|fly)_[a-z\\-_]+', '(?:ins|fly|sub)_[a-z0-9\\-_]+')
s = s.replace('<script src="data_extra.js"></script>\\s*<script src="mapdata.js"></script>', '<script src="data_extra.js"></script>\\s*<script src="subphotos.js"></script>\\s*<script src="mapdata.js"></script>')
open('standalone.py', 'w', encoding='utf8').write(s)

w = open('../.github/workflows/pages.yml', encoding='utf8').read()
if 'subphotos' not in w:
    w = w.replace('node --check site/data_extra.js', 'node --check site/data_extra.js\n          node --check site/subphotos.js')
    open('../.github/workflows/pages.yml', 'w', encoding='utf8').write(w)
print('ok')
