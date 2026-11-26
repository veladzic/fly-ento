import re
S = '../site/'
f = open(S + 'features.js', encoding='utf8').read()
i = f.index('/* ---------- Haken & Vorfach ---------- */')
j = f.index('/* ---------- Bedingungen ---------- */')
f = f[:i] + open('leader_new.js', encoding='utf8').read() + f[j:]
open(S + 'features.js', 'w', encoding='utf8').write(f)

h = open(S + 'index.html', encoding='utf8').read()
old = re.search(r'<div class="fld"><span class="fl">Vorfachlänge.*?<input type="hidden" id="tcMat" value="ny"></div>', h, flags=re.S)
assert old
new = '''<div class="fld"><span class="fl">Vorfach-Typ</span>
        <div class="seg" data-input="leaderType"><button type="button" data-v="dry" class="on">Trockenfliege</button><button type="button" data-v="ind">Indikator</button><button type="button" data-v="euro">Euronymphe</button></div><input type="hidden" id="leaderType" value="dry"></div>
      <div class="fld" id="fldLen"><span class="fl">Vorfachlänge <b id="tcLenV">2,7 m</b></span><input type="range" id="tcLen" min="1.5" max="5.5" step="0.1" value="2.7" aria-label="Vorfachlänge"></div>
      <div class="fld hidden" id="fldDepth"><span class="fl">Wassertiefe <b id="tcDepthV">0,8 m</b></span><input type="range" id="tcDepth" min="0.2" max="3" step="0.1" value="0.8" aria-label="Wassertiefe"></div>
      <div class="fld hidden" id="fldFlies"><span class="fl">Anzahl Fliegen</span>
        <div class="seg" data-input="tcFlies"><button type="button" data-v="1" class="on">1</button><button type="button" data-v="2">2</button><button type="button" data-v="3">3</button></div><input type="hidden" id="tcFlies" value="1"></div>
      <div class="fld"><span class="fl">Material Tippet</span>
        <div class="seg" data-input="tcMat"><button type="button" data-v="ny" class="on">Nylon</button><button type="button" data-v="fc">Fluorocarbon</button></div><input type="hidden" id="tcMat" value="ny"></div>'''
h = h.replace(old.group(0), new)
h = h.replace('<p>Hakengröße wählen – Tippet, Vorfachaufbau und passende Gruppen siehst du sofort.</p>', '<p>Hakengröße und Vorfach-Typ wählen: Tippet, Aufbau, Längen und Material siehst du sofort.</p>')
open(S + 'index.html', 'w', encoding='utf8').write(h)
print('ok')
