S = '../site/'
f = open(S + 'features.js', encoding='utf8').read()

def rep(a, b):
    global f
    assert a in f, a[:60]
    f = f.replace(a, b, 1)

# Finder-Karten: Box-Status, Rezept, Tippet
rep('''      <p>Haken <b>${esc(hookTxt(g))}</b> · Tippet ~${xFor(hookMid(g))}X · Muster: ${g.flies.map(esc).join(", ")}</p><p class="tp">${esc(g.tip)}</p>
      <button class="btn" type="button" data-open="${g.id}">Details &amp; Untergruppen</button></div></article>`; }).join("");''',
'''      <p>Haken <b>${esc(hookTxt(g))}</b> · Tippet ~${xFor(hookMid(g))}X · Muster: ${g.flies.map(esc).join(", ")}</p>${boxChip(g)}<p class="tp">${esc(g.tip)}</p>
      <div class="pillrow"><button class="btn" type="button" data-open="${g.id}">Details &amp; Untergruppen</button><button class="btn" type="button" data-tipcalc="${hookMid(g) % 2 ? hookMid(g) + 1 : hookMid(g)}">Tippet berechnen</button>${(RECIPE_BY_GROUP[g.id] || []).slice(0, 2).map(r => `<button class="btn" type="button" data-rec="${r.id}">Rezept: ${esc(r.name)}</button>`).join("")}</div></div></article>`; }).join("");''')
rep('''  function render() {
    f.tv.textContent = f.temp.value + " °C";''', '''  const boxChip = g => { const has = window._boxHas ? g.flies.filter(n => _boxHas(n)) : []; return has.length ? `<p><span class="chip">in deiner Box: ${has.map(esc).join(", ")}</span></p>` : `<p><span class="chip warn">nichts davon in deiner Box</span></p>`; };
  function render() {
    f.tv.textContent = f.temp.value + " °C";''')
rep('''  $("#nowGrid").addEventListener("click", e => { const b = e.target.closest("[data-open]"); if (b) openGroup(b.dataset.open); });''',
'''  $("#nowGrid").addEventListener("click", e => { const b = e.target.closest("[data-open]"); if (b) return openGroup(b.dataset.open);
    const t = e.target.closest("[data-tipcalc]"); if (t) { $("#tcHook").value = t.dataset.tipcalc; $("#tcHook").dispatchEvent(new Event("input", {bubbles: true})); showTab("tip"); } });''')

# Rezept-Sprung global
rep('''  $("#dlg").addEventListener("click", e => {
    const b = e.target.closest("[data-rec]"); if (!b) return;
    closeDlg(); cur = "Alle"; showTab("rec");
    const el = document.getElementById("r-" + b.dataset.rec); if (el) { el.scrollIntoView({block: "start"}); el.classList.add("flash"); setTimeout(() => el.classList.remove("flash"), 1800); }
  });''', '''  document.addEventListener("click", e => {
    const b = e.target.closest("[data-rec]"); if (!b) return;
    if (!$("#dlg").classList.contains("hidden")) closeDlg();
    cur = "Alle"; draw(); showTab("rec");
    const el = document.getElementById("r-" + b.dataset.rec); if (el) { el.scrollIntoView({block: "start"}); el.classList.add("flash"); setTimeout(() => el.classList.remove("flash"), 1800); }
  });''')

# Box-Status nach außen
rep("  window._drawBox = () => { drawBox(); drawLog(); }; drawBox(); drawLog();", "  window._boxHas = n => inBox.has(n);\n  window._drawBox = () => { drawBox(); drawLog(); }; drawBox(); drawLog();")

# Temperatur synchron + Link im Bedingungen-Ergebnis
rep('''<p class="hint">Richtwerte für Bachforelle/Regenbogenforelle; einzelne Gewässer und Arten weichen ab.</p>`;''', '''<p class="hint">Richtwerte für Bachforelle/Regenbogenforelle; einzelne Gewässer und Arten weichen ab.</p><button class="btn" type="button" data-go="now">Passende Insekten für diese Temperatur →</button>`;''')
rep('''  $("#condCalc").addEventListener("input", render); render();''', '''  $("#condCalc").addEventListener("input", render); render();
  // Temperatur mit „Jetzt am Wasser“ teilen
  const FT = $("#fTemp");
  T.addEventListener("input", () => { if (FT.value !== T.value) { FT.value = T.value; FT.dispatchEvent(new Event("input", {bubbles: true})); } });
  FT.addEventListener("input", () => { if (T.value !== FT.value) { T.value = FT.value; render(); } });''')

rep('''window.onTab = id => { if (id === "now" && window._renderFinder) _renderFinder(); if (id === "box" && window._drawBox) _drawBox(); };''',
    '''window.onTab = id => { if (id === "now" && window._renderFinder) _renderFinder(); if (id === "box" && window._drawBox) _drawBox(); };''')
open(S + 'features.js', 'w', encoding='utf8').write(f)

c = open(S + 'style.css', encoding='utf8').read()
c += '''
/* Navigation neu */
.tabs{margin-left:auto;gap:6px}
.tabs button{font-size:15px}
.subnav{position:sticky;top:var(--hh,64px);z-index:15;background:var(--bg);border-bottom:1px solid var(--border);display:flex;gap:6px;padding:8px max(20px,calc((100% - 1320px)/2));overflow-x:auto}
.subnav button{border:1px solid var(--border);background:#fff;border-radius:999px;padding:8px 16px;font-size:14.5px;font-weight:600;cursor:pointer;white-space:nowrap}
.subnav button:hover{background:#F5F7F4}
.subnav button[aria-selected=true]{background:var(--water);border-color:var(--water);color:#fff}
.homesearch{display:flex;gap:8px;width:min(680px,100%);margin-top:6px}
.homesearch input{flex:1;min-width:0;min-height:48px;border:1px solid var(--border);border-radius:12px;padding:0 16px;background:#fff;font-size:16px}
.homesearch .btn.pri{grid-column:auto;min-width:96px}
.home-now{margin:6px 0 18px;background:#fff;border:1px solid var(--border);border-radius:16px;padding:16px 20px}
.home-now h2{margin:0 0 10px;font-size:20px}
.linkbtn{background:none;border:0;padding:0;color:var(--water);font-weight:700;cursor:pointer;font-size:inherit}
.linkbtn:hover{text-decoration:underline}
.home-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;margin-bottom:18px}
.hcard{background:#fff;border:1px solid var(--border);border-top:5px solid var(--water);border-radius:16px;padding:18px 20px}
.hcard.ins{border-top-color:var(--land)}.hcard.tie{border-top-color:var(--other)}
.hcard h2{margin:0 0 4px;font-size:21px}.hcard p{margin:0 0 12px;color:var(--soft);font-size:14.5px}
.site-foot details{max-width:900px;margin:0 auto 10px;text-align:left}
.site-foot summary{cursor:pointer;font-weight:600;text-align:center}
.site-foot .foot{margin:8px 0 0}
.tabs button[aria-selected=true]{background:#EEF1EC;color:var(--ink)}
@media (max-width:640px){.tabs{width:100%;justify-content:space-between}.tabs button{flex:1;padding:9px 6px;font-size:13.5px}.subnav{padding-left:14px;padding-right:14px}.hero{padding-top:28px}}
'''
open(S + 'style.css', 'w', encoding='utf8').write(c)
print('ok')
