import re
S = '../site/'
d = open(S + 'deep.js', encoding='utf8').read()
old = d[d.index('    const pill = n =>'):d.index('    return `<article class="stage-card">')]
new = '''    const pill = n => { const l = n.toLowerCase(); const r = rec.find(x => { const m = x.name.toLowerCase(); return m === l || m.startsWith(l) || l.startsWith(m); }); return r ? `<button type="button" class="pill" data-rec="${r.id}">${esc2(n)}</button>` : `<span class="pill plain">${esc2(n)}</span>`; };
'''
d = d.replace(old, new)
open(S + 'deep.js', 'w', encoding='utf8').write(d)

a = open(S + 'app.js', encoding='utf8').read()
a = a.replace('tabs: [["tree", "Organigramm"], ["cal", "Schlupfkalender"], ["map", "Weltkarte"], ["life", "Lebenszyklen"]]',
              'tabs: [["tree", "Organigramm"], ["mayfly", "Eintagsfliegen"], ["caddis", "Köcherfliegen"], ["stone", "Steinfliegen"], ["cal", "Schlupfkalender"], ["map", "Weltkarte"], ["life", "Lebenszyklen"]]')
a = a.replace('d: "Alle Gruppen, Untergruppen, Saison, Verbreitung und Lebenszyklen."', 'd: "Eintags-, Köcher- und Steinfliegen im Detail, alle Gruppen, Saison und Verbreitung."')
open(S + 'app.js', 'w', encoding='utf8').write(a)

h = open(S + 'index.html', encoding='utf8').read()
secs = ''.join(f'<section class="panel-sec hidden" id="tab-{k}" role="tabpanel"></section>\n' for k in ['mayfly', 'caddis', 'stone'])
if 'id="tab-mayfly"' not in h:
    h = h.replace('<!-- ===== Organigramm ===== -->', secs + '\n<!-- ===== Organigramm ===== -->', 1)
    h = h.replace('  <div class="home-cards" id="homeCards"></div>', '  <h2 class="h2s">Die großen Drei</h2>\n  <div class="big3" id="big3"></div>\n  <div class="home-cards" id="homeCards"></div>', 1)
    h = h.replace('<script src="features.js"></script>', '<script src="features.js"></script>\n<script src="deep.js"></script>')
open(S + 'index.html', 'w', encoding='utf8').write(h)

s = open('standalone.py', encoding='utf8').read()
s = s.replace("+chr(10)+open(S+'features.js',encoding='utf8').read()", "+chr(10)+open(S+'features.js',encoding='utf8').read()+chr(10)+open(S+'deep.js',encoding='utf8').read()")
s = s.replace("used=set(re.findall(r'\"((?:ins|fly)_[a-z\\-_]+\\.jpg)\"',js))", "used=set(re.findall(r'\"((?:ins|fly)_[a-z\\-_]+\\.jpg)\"',js+open(S+'deep.js',encoding='utf8').read()))")
s = s.replace('<script src="features.js"></script>', '<script src="features.js"></script>\\s*<script src="deep.js"></script>')
open('standalone.py', 'w', encoding='utf8').write(s)

w = open('../.github/workflows/pages.yml', encoding='utf8').read()
if 'deep.js' not in w:
    w = w.replace('node --check site/features.js', 'node --check site/features.js\n          node --check site/deep.js')
    open('../.github/workflows/pages.yml', 'w', encoding='utf8').write(w)

c = open(S + 'style.css', encoding='utf8').read()
if 'Tiefenseiten' not in c:
    c += open('deep.css', encoding='utf8').read()
    open(S + 'style.css', 'w', encoding='utf8').write(c)
print('ok')
