S = '../site/'
h = open(S + 'index.html', encoding='utf8').read()
h = h.replace('''<option value="S">Süd (Neuseeland, Patagonien …)</option></select></label>
        <label class="fld"><span class="fl">Region</span><select id="fRegion"></select></label></details>''',
 '''<option value="S">Süd (Neuseeland, Patagonien …)</option></select></label>
        <label class="fld"><span class="fl">Region</span><select id="fRegion"></select></label></details>
      <button type="button" class="btn pri jump" data-scroll="nowSum">Empfehlung anzeigen ↓</button>''')
h = h.replace('''<input type="hidden" id="cdWx" value=""></div>
    </div>''', '''<input type="hidden" id="cdWx" value=""></div>
      <button type="button" class="btn pri jump" data-scroll="cdOut">Ergebnis anzeigen ↓</button>
    </div>''')
open(S + 'index.html', 'w', encoding='utf8').write(h)
f = open(S + 'features.js', encoding='utf8').read()
f += '''
document.addEventListener("click", e => { const b = e.target.closest("[data-scroll]"); if (b) { const el = document.getElementById(b.dataset.scroll); if (el) el.scrollIntoView({behavior: "smooth", block: "start"}); } });
'''
open(S + 'features.js', 'w', encoding='utf8').write(f)
c = open(S + 'style.css', encoding='utf8').read()
c += '\n.jump{display:none}\n@media (max-width:900px){.jump{display:block}#nowSum,#cdOut{scroll-margin-top:120px}}\n'
open(S + 'style.css', 'w', encoding='utf8').write(c)
print(h.count('data-scroll'))
