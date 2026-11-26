import re
S = '../site/'

# ------------------------------------------------------------ app.js
a = open(S + 'app.js', encoding='utf8').read()
i = a.index('function hookSvg(size, scale) {')
j = a.index('$("#hookTable").innerHTML')
a = a[:i] + a[j:]
# Start-Button für die mobile Leiste
a = a.replace('''$("#tabs").innerHTML = GROUPS.map(g => `<button role="tab" data-group="${g.k}" aria-selected="false">${esc(g.t)}</button>`).join("");''',
              '''$("#tabs").innerHTML = `<button role="tab" data-group="home" class="mob-only" aria-selected="false">Start</button>` + GROUPS.map(g => `<button role="tab" data-group="${g.k}" aria-selected="false">${esc(g.short || g.t)}</button>`).join("");''')
a = a.replace('{k: "ins", t: "Insekten nachschlagen",', '{k: "ins", t: "Insekten nachschlagen", short: "Insekten",')
a = a.replace('{k: "tie", t: "Binden & Box",', '{k: "tie", t: "Binden & Box", short: "Binden & Box",')
a = a.replace('{k: "water", t: "Am Wasser",', '{k: "water", t: "Am Wasser", short: "Am Wasser",')
a = a.replace('''$$("#tabs button").forEach(b => b.setAttribute("aria-selected", !!g && b.dataset.group === g.k));''',
              '''$$("#tabs button").forEach(b => b.setAttribute("aria-selected", g ? b.dataset.group === g.k : b.dataset.group === "home"));''')
a = a.replace('''if (b) { const g = GROUPS.find(x => x.k === b.dataset.group); showTab(lastTab[g.k] || g.tabs[0][0]); }''',
              '''if (b) { if (b.dataset.group === "home") return showTab("home"); const g = GROUPS.find(x => x.k === b.dataset.group); showTab(lastTab[g.k] || g.tabs[0][0]); }''')
# Bestimmung: Schrittzähler
a = a.replace('''${crumbs ? `<div class="crumbs">${crumbs}</div>` : ""}<h3>${esc(node.q)}</h3>''', '''<div class="stepn mono">Schritt ${keyState.labels.length + 1}</div>${crumbs ? `<div class="crumbs">${crumbs}</div>` : ""}<h3>${esc(node.q)}</h3>''')
open(S + 'app.js', 'w', encoding='utf8').write(a)

# ------------------------------------------------------------ index.html
h = open(S + 'index.html', encoding='utf8').read()

def sect(id_, new):
    global h
    m = re.search(r'<section class="panel-sec[^"]*" id="tab-%s".*?</section>\n' % id_, h, flags=re.S)
    assert m, id_
    h = h.replace(m.group(0), new)

hidden = lambda id_: f'<section class="panel-sec hidden" id="tab-{id_}" role="tabpanel">'

sect('home', '''<section class="panel-sec" id="tab-home" role="tabpanel">
  <div class="hero" id="start">
    <p class="eyebrow mono">Fly Fishing Entomology</p>
    <h1>Was frisst die Forelle?</h1>
    <p class="lead">Erst nachsehen, was gerade aktiv ist, dann Haken, Vorfach und Fliege wählen.</p>
    <div class="hero-actions">
      <button class="btn pri big" type="button" data-go="now">Jetzt am Wasser →</button>
      <form class="homesearch" id="homeSearch" role="search">
        <label class="sr" for="homeQ">Suche</label>
        <input id="homeQ" type="search" placeholder="Insekt oder Muster suchen: Baetis, Hopper, Elk Hair Caddis …" autocomplete="off">
        <button class="btn" type="submit">Suchen</button>
      </form>
    </div>
  </div>
  <div class="home-now"><h2>Jetzt aktiv im <span id="homeMonth"></span></h2>
    <div class="pillrow" id="homeActive"></div>
    <p class="hint">Hauptzeit in Mitteleuropa. <button class="linkbtn" data-go="now">Mit Wetter, Wassertemperatur und Tageszeit auswerten →</button></p></div>
  <div class="quick" aria-label="Schnellzugriff">
    <button class="qk" type="button" data-go="box"><b>Fang eintragen</b><span>Fangbuch</span></button>
    <button class="qk" type="button" data-go="tip"><b>Tippet berechnen</b><span>Haken → Vorfach</span></button>
    <button class="qk" type="button" data-go="key"><b>Tier bestimmen</b><span>Schritt für Schritt</span></button>
    <button class="qk" type="button" data-go="rec"><b>Muster binden</b><span>Rezepte</span></button>
  </div>
  <div class="home-cards" id="homeCards"></div>
  <ul class="stats" id="stats"></ul>
</section>
''')

# Organigramm: Werkzeugleiste in zwei Zeilen, Namenshilfe eingeklappt
h = re.sub(r'<div class="toolbar">\s*<label class="sr" for="q">.*?</div>\s*<details class="howto" open>',
'''<div class="filterbar">
    <div class="fb-row"><label class="sr" for="q">Suche</label>
      <input id="q" type="search" placeholder="Suchen: Baetidae, Hopper, Caddis, Salmonfly …" autocomplete="off">
      <label class="sel"><span>Aktiv im</span><select id="monthSel"><option value="">alle Monate</option></select></label>
      <label class="chk"><input type="checkbox" id="onlyActive"> nur aktive</label></div>
    <div class="fb-row"><div class="chips" id="branchFilter" role="group" aria-label="Bereich filtern">
      <button class="chip-btn on" data-f="all">Alle</button>
      <button class="chip-btn" data-f="water">Wasserinsekten</button>
      <button class="chip-btn" data-f="land">Landinsekten</button>
      <button class="chip-btn" data-f="other">Weitere Beute</button></div>
      <span class="grow"></span>
      <button class="btn sm2" type="button" id="all">Alle aufklappen</button>
      <button class="btn sm2" type="button" id="none">Alle zuklappen</button></div>
  </div>
  <details class="howto">''', h, flags=re.S)

sect('now', '''<section class="panel-sec hidden" id="tab-now" role="tabpanel">
  <div class="page-head"><h2>Jetzt am Wasser</h2><p>Bedingungen einstellen, Empfehlung ablesen.</p></div>
  <div class="tool-grid">
    <form class="panel finder" id="finder" onsubmit="return false">
      <div class="panel-h"><h3>Bedingungen</h3><button class="linkbtn" type="button" id="fReset">zurücksetzen</button></div>
      <div class="fld"><span class="fl">Gewässer</span>
        <div class="seg" data-input="fWater"><button type="button" data-v="" class="on">egal</button><button type="button" data-v="Fließgewässer">Fluss / Bach</button><button type="button" data-v="Stillwasser">See</button></div><input type="hidden" id="fWater" value=""></div>
      <div class="fld"><span class="fl">Tageszeit</span>
        <div class="seg wrap" data-input="fTime"><button type="button" data-v="" class="on">egal</button><button type="button" data-v="morgen">Morgen</button><button type="button" data-v="mittag">Mittag</button><button type="button" data-v="nachmittag">Nachmittag</button><button type="button" data-v="abend">Abend</button><button type="button" data-v="nacht">Nacht</button></div><input type="hidden" id="fTime" value=""></div>
      <div class="fld"><span class="fl">Wetter</span>
        <div class="seg wrap" data-input="fWeather"><button type="button" data-v="" class="on">egal</button><button type="button" data-v="sonnig">Sonnig</button><button type="button" data-v="bewoelkt">Bewölkt</button><button type="button" data-v="regen">Regen</button><button type="button" data-v="wind">Wind</button></div><input type="hidden" id="fWeather" value=""></div>
      <div class="fld"><span class="fl">Wassertemperatur <b id="fTempV">10 °C</b></span><input type="range" id="fTemp" min="0" max="25" step="1" value="10" aria-label="Wassertemperatur"></div>
      <details class="more"><summary>Monat, Halbkugel, Region</summary>
        <label class="fld"><span class="fl">Monat</span><select id="fMonth"></select></label>
        <label class="fld"><span class="fl">Halbkugel</span><select id="fHemi"><option value="N">Nord (Europa, Nordamerika)</option><option value="S">Süd (Neuseeland, Patagonien …)</option></select></label>
        <label class="fld"><span class="fl">Region</span><select id="fRegion"></select></label></details>
    </form>
    <div class="result" aria-live="polite"><div id="nowSum"></div><div id="nowGrid"></div></div>
  </div>
</section>
''')

sect('cond', '''<section class="panel-sec hidden" id="tab-cond" role="tabpanel">
  <div class="page-head"><h2>Bedingungen &amp; Tipps</h2><p>Wassertemperatur, Wasserfarbe und Wetter bestimmen, wie und womit du fischst.</p></div>
  <div class="tool-grid">
    <div class="panel" id="condCalc">
      <div class="panel-h"><h3>Bedingungen</h3></div>
      <div class="fld"><span class="fl">Wassertemperatur <b id="cdTempV">12 °C</b></span>
        <input type="range" id="cdTemp" min="0" max="26" step="1" value="12" aria-label="Wassertemperatur">
        <div class="gauge" aria-hidden="true"><i style="width:15.4%" class="z bad"></i><i style="width:15.4%" class="z warn"></i><i style="width:30.8%" class="z good"></i><i style="width:15.4%" class="z warn"></i><i style="width:23%" class="z bad"></i><span class="mk" id="cdMk"></span></div>
        <div class="gauge-l" aria-hidden="true"><span>0</span><span>8</span><span>16</span><span>26 °C</span></div></div>
      <div class="fld"><span class="fl">Wasserfarbe</span>
        <div class="seg" data-input="cdColor"><button type="button" data-v="klar" class="on">klar</button><button type="button" data-v="leicht">getrübt</button><button type="button" data-v="trueb">Hochwasser</button></div><input type="hidden" id="cdColor" value="klar"></div>
      <div class="fld"><span class="fl">Wetter</span>
        <div class="seg wrap" data-input="cdWx"><button type="button" data-v="" class="on">egal</button><button type="button" data-v="sonne">Sonne</button><button type="button" data-v="bedeckt">Bedeckt</button><button type="button" data-v="regen">Regen</button><button type="button" data-v="wind">Wind</button></div><input type="hidden" id="cdWx" value=""></div>
    </div>
    <div class="result" id="cdOut" aria-live="polite"></div>
  </div>
  <details class="fold"><summary>Vorgehen am Wasser: 8 Grundregeln</summary><div class="tips" id="tips"></div></details>
</section>
''')

sect('tip', '''<section class="panel-sec hidden" id="tab-tip" role="tabpanel">
  <div class="page-head"><h2>Haken &amp; Vorfach</h2><p>Hakengröße wählen – Tippet, Vorfachaufbau und passende Gruppen siehst du sofort.</p></div>
  <div class="tool-grid">
    <div class="panel" id="tipCalc">
      <div class="panel-h"><h3>Eingabe</h3></div>
      <div class="fld"><span class="fl">Hakengröße <b id="hookVal">#14</b></span>
        <input type="range" id="tcHook" min="4" max="26" step="2" value="14" aria-label="Hakengröße"><div class="hookvis" id="hookVis" aria-label="Größen"></div></div>
      <div class="fld"><span class="fl">Vorfachlänge <b id="tcLenV">2,7 m</b></span><input type="range" id="tcLen" min="1.5" max="5.5" step="0.1" value="2.7" aria-label="Vorfachlänge"></div>
      <div class="fld"><span class="fl">Material</span>
        <div class="seg" data-input="tcMat"><button type="button" data-v="ny" class="on">Nylon</button><button type="button" data-v="fc">Fluorocarbon</button></div><input type="hidden" id="tcMat" value="ny"></div>
    </div>
    <div class="result"><div class="tiles" id="tcTiles"></div><div id="leaderSvg"></div><div id="tcOut"></div></div>
  </div>
  <details class="fold"><summary>Tabelle: Hakengrößen und typische Beute</summary><div class="cal-wrap"><table class="cmp" id="hookTable"></table></div></details>
  <details class="fold"><summary>Tabelle: Tippet-Stärken (X)</summary><div class="cal-wrap"><table class="cmp" id="xTable"></table></div></details>
</section>
''')

sect('rec', '''<section class="panel-sec hidden" id="tab-rec" role="tabpanel">
  <div class="page-head"><h2>Binderezepte</h2><p>Die Klassiker für fast alle Gruppen. Karte aufklappen für Material und Bindeschritte. Standardvarianten, die Binder oft abwandeln.</p></div>
  <div class="filterbar"><div class="fb-row"><label class="sr" for="recQ">Rezept suchen</label><input type="search" id="recQ" placeholder="Rezept oder Gruppe suchen …"><div class="chips" id="recFilter" role="group" aria-label="Muster-Typ"></div></div></div>
  <div class="rec-grid" id="recGrid"></div>
</section>
''')

sect('box', '''<section class="panel-sec hidden" id="tab-box" role="tabpanel">
  <div class="page-head"><h2>Meine Box &amp; Fangbuch</h2><p>Alles bleibt in deinem Browser, nichts wird hochgeladen.</p></div>
  <div class="seg lg" data-input="boxView"><button type="button" data-v="log" class="on">Fangbuch</button><button type="button" data-v="box">Fliegenbox</button><button type="button" data-v="miss">Was fehlt?</button></div><input type="hidden" id="boxView" value="log">

  <div class="bx" id="bx-log">
    <div class="log-stats" id="logStats"></div>
    <div class="tool-grid log-grid">
      <form class="panel logform" id="logForm">
        <div class="panel-h"><h3>Fang eintragen</h3></div>
        <div class="two"><label class="fld"><span class="fl">Datum</span><input type="date" id="lDate" required></label>
        <label class="fld"><span class="fl">Gewässer</span><input type="text" id="lWater" placeholder="z. B. Soča, Tolmin" required></label></div>
        <div class="two"><label class="fld"><span class="fl">Fisch</span><select id="lFish"><option>Bachforelle</option><option>Regenbogenforelle</option><option>Marmorata</option><option>Äsche</option><option>Saibling</option><option>Huchen</option><option>Döbel</option><option>Barbe</option><option>Hecht</option><option>Andere</option></select></label>
        <label class="fld"><span class="fl">Länge (cm)</span><input type="number" id="lLen" min="5" max="200" inputmode="numeric"></label></div>
        <label class="fld"><span class="fl">Muster</span><input type="text" id="lFly" list="flyList" placeholder="z. B. Pheasant Tail" required><datalist id="flyList"></datalist></label>
        <div class="two"><label class="fld"><span class="fl">Haken #</span><input type="number" id="lHook" min="2" max="28" step="1" inputmode="numeric"></label>
        <label class="fld"><span class="fl">Wasser °C</span><input type="number" id="lTemp" min="0" max="30" step="0.5" inputmode="decimal"></label></div>
        <label class="fld"><span class="fl">Notiz</span><input type="text" id="lNote" placeholder="Schlupf, Tageszeit, Wetter …"></label>
        <button class="btn pri" type="submit">Eintragen</button>
      </form>
      <div class="result"><div class="cal-wrap"><table class="cmp" id="logTable"></table></div>
        <div class="btnrow"><button class="btn" id="logCsv" type="button">CSV exportieren</button><button class="btn" id="logJson" type="button">Sicherung (JSON)</button><label class="btn filebtn">Sicherung laden<input type="file" id="logLoad" accept="application/json" hidden></label><button class="btn danger" id="logClear" type="button">Fangbuch leeren</button></div>
        <p class="hint" id="logMsg" aria-live="polite"></p></div>
    </div>
  </div>

  <div class="bx hidden" id="bx-box">
    <div class="filterbar"><div class="fb-row"><label class="sr" for="boxQ">Muster suchen</label><input type="search" id="boxQ" placeholder="Muster suchen …"><span class="hint" id="boxCount"></span></div></div>
    <div id="boxList" class="boxlist"></div>
  </div>

  <div class="bx hidden" id="bx-miss">
    <div class="filterbar"><div class="fb-row"><label class="sel"><span>Für den Monat</span><select id="boxMonth"></select></label><span class="hint">Hauptgruppen des Monats und deine Muster dazu.</span></div></div>
    <div id="boxMissing" class="missing"></div>
  </div>
</section>
''')

h = h.replace('<div class="sec-head"><h2>Bestimmungshilfe</h2>\n    <p>Du hast ein Tier in der Hand oder im Netz – welche Gruppe ist es? Antworte Schritt für Schritt.</p></div>',
              '<div class="page-head"><h2>Bestimmungshilfe</h2><p>Du hast ein Tier in der Hand oder im Netz – welche Gruppe ist es?</p></div>')
for t in ['Wo kommen sie vor?', 'Schlupfkalender', 'Lebenszyklen &amp; Stadien', 'Starter-Box']:
    h = re.sub(r'<div class="sec-head"><h2>%s</h2>' % re.escape(t), '<div class="page-head"><h2>%s</h2>' % t, h)
h = h.replace('<script src="features.js"></script>', '<script src="features.js"></script>')
open(S + 'index.html', 'w', encoding='utf8').write(h)

# ------------------------------------------------------------ features.js
f = open(S + 'features.js', encoding='utf8').read()
k = f.index('/* ---------- Jetzt am Wasser ---------- */')
new = open('features_new.js', encoding='utf8').read()
open(S + 'features.js', 'w', encoding='utf8').write(f[:k] + new)
print('ok')
