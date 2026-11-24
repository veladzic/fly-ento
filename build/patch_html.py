import io
S = '../site/'
a = open(S + 'app.js', encoding='utf8').read()
a = a.replace('  if (id === "map") renderMap();', '  if (id === "map") renderMap();\n  if (window.onTab) window.onTab(id);')
a = a.replace('if (["tree","map","cal","life","key","prax"].includes(start)) showTab(start);', 'if ($$("#tabs button").some(b => b.dataset.tab === start)) showTab(start);')
open(S + 'app.js', 'w', encoding='utf8').write(a)

h = open(S + 'index.html', encoding='utf8').read()
h = h.replace('''      <button role="tab" data-tab="cal"    aria-selected="false">Schlupfkalender</button>''', '''      <button role="tab" data-tab="now"    aria-selected="false">Jetzt am Wasser</button>
      <button role="tab" data-tab="cal"    aria-selected="false">Schlupfkalender</button>''')
h = h.replace('''      <button role="tab" data-tab="prax"   aria-selected="false">Hakengrößen &amp; Praxis</button>''', '''      <button role="tab" data-tab="rec"    aria-selected="false">Binderezepte</button>
      <button role="tab" data-tab="box"    aria-selected="false">Meine Box</button>
      <button role="tab" data-tab="prax"   aria-selected="false">Praxis &amp; Rechner</button>''')

now = '''<!-- ===== Jetzt am Wasser ===== -->
<section class="panel-sec hidden" id="tab-now" role="tabpanel">
  <div class="sec-head"><h2>Jetzt am Wasser</h2>
    <p>Gib die Bedingungen ein – du bekommst die wahrscheinlichsten Futtertiere, passende Hakengrößen und Muster. Die Bewertung nutzt Saison, Tageszeit, Gewässertyp, Wassertemperatur und Wetter.</p></div>
  <form class="finder" id="finder" onsubmit="return false">
    <label>Monat<select id="fMonth"></select></label>
    <label>Halbkugel<select id="fHemi"><option value="N">Nord (Europa, Nordamerika)</option><option value="S">Süd (Neuseeland, Patagonien …)</option></select></label>
    <label>Region<select id="fRegion"></select></label>
    <label>Gewässer<select id="fWater"><option value="">egal</option><option value="Fließgewässer">Fluss / Bach</option><option value="Stillwasser">See / Teich</option></select></label>
    <label>Tageszeit<select id="fTime"><option value="">egal</option><option value="morgen">Morgen</option><option value="mittag">Mittag</option><option value="nachmittag">Nachmittag</option><option value="abend">Abend</option><option value="nacht">Nacht / Dämmerung</option></select></label>
    <label>Wetter<select id="fWeather"><option value="">egal</option><option value="sonnig">sonnig, warm</option><option value="bewoelkt">bewölkt</option><option value="regen">Regen / Nieselregen</option><option value="wind">windig</option></select></label>
    <label class="wide">Wassertemperatur: <b id="fTempV">10 °C</b><input type="range" id="fTemp" min="0" max="25" step="1" value="10"></label>
  </form>
  <div class="now-sum" id="nowSum" aria-live="polite"></div>
  <div class="now-grid" id="nowGrid"></div>
</section>

'''
h = h.replace('<!-- ===== Kalender ===== -->', now + '<!-- ===== Kalender ===== -->')

rec = '''<!-- ===== Binderezepte ===== -->
<section class="panel-sec hidden" id="tab-rec" role="tabpanel">
  <div class="sec-head"><h2>Binderezepte</h2>
    <p>Die Klassiker, die fast alle Gruppen dieser Seite abdecken: Materialliste und Bindeschritte. Rezepte sind Standardvarianten und werden von Bindern oft abgewandelt.</p></div>
  <div class="toolbar"><div class="chips" id="recFilter" role="group" aria-label="Muster-Typ"></div></div>
  <div class="rec-grid" id="recGrid"></div>
</section>

<!-- ===== Meine Box ===== -->
<section class="panel-sec hidden" id="tab-box" role="tabpanel">
  <div class="sec-head"><h2>Meine Fliegenbox &amp; Fangbuch</h2>
    <p>Hake an, welche Muster du dabei hast, und führe ein Fangbuch. Alles bleibt in deinem Browser (nichts wird hochgeladen).</p></div>
  <div class="box-grid">
    <div class="boxcol">
      <h3 class="sub nm">Fliegenbox</h3>
      <div class="toolbar"><input type="search" id="boxQ" placeholder="Muster suchen …"><span class="hint" id="boxCount"></span></div>
      <div class="chk-list" id="boxList"></div>
    </div>
    <div class="boxcol">
      <h3 class="sub nm">Was fehlt für diesen Monat?</h3>
      <label class="sel"><span>Monat</span><select id="boxMonth"></select></label>
      <div id="boxMissing" class="missing"></div>
      <h3 class="sub">Fang eintragen</h3>
      <form class="logform" id="logForm">
        <label>Datum<input type="date" id="lDate" required></label>
        <label>Gewässer<input type="text" id="lWater" placeholder="z. B. Soča, Tolmin" required></label>
        <label>Fisch<select id="lFish"><option>Bachforelle</option><option>Regenbogenforelle</option><option>Marmorata</option><option>Äsche</option><option>Saibling</option><option>Huchen</option><option>Döbel</option><option>Barbe</option><option>Hecht</option><option>Andere</option></select></label>
        <label>Länge (cm)<input type="number" id="lLen" min="5" max="200"></label>
        <label>Muster<input type="text" id="lFly" list="flyList" placeholder="z. B. Pheasant Tail" required><datalist id="flyList"></datalist></label>
        <label>Haken #<input type="number" id="lHook" min="2" max="28" step="1"></label>
        <label>Wasser °C<input type="number" id="lTemp" min="0" max="30" step="0.5"></label>
        <label class="wide">Notiz<input type="text" id="lNote" placeholder="Schlupf, Tageszeit, Wetter …"></label>
        <button class="btn pri" type="submit">Eintragen</button>
      </form>
    </div>
  </div>
  <h3 class="sub">Fangbuch</h3>
  <div class="log-stats" id="logStats"></div>
  <div class="cal-wrap"><table class="cmp" id="logTable"></table></div>
  <div class="toolbar"><button class="btn" id="logCsv" type="button">Als CSV exportieren</button><button class="btn" id="logJson" type="button">Sicherung (JSON)</button><label class="btn filebtn">Sicherung laden<input type="file" id="logLoad" accept="application/json" hidden></label><button class="btn danger" id="logClear" type="button">Fangbuch leeren</button></div>
  <p class="hint" id="logMsg" aria-live="polite"></p>
</section>

'''
h = h.replace('<!-- ===== Praxis ===== -->', rec + '<!-- ===== Praxis ===== -->')

prax = '''  <h3 class="sub">Vorfach- &amp; Tippet-Rechner</h3>
  <div class="calc" id="tipCalc">
    <label>Hakengröße #<select id="tcHook"></select></label>
    <label>Vorfachlänge (m)<input type="number" id="tcLen" min="1.5" max="7" step="0.1" value="2.7"></label>
    <label>Material<select id="tcMat"><option value="ny">Nylon</option><option value="fc">Fluorocarbon</option></select></label>
    <div class="calc-out" id="tcOut" aria-live="polite"></div>
  </div>
  <div class="cal-wrap"><table class="cmp" id="xTable"></table></div>

  <h3 class="sub">Wassertemperatur &amp; Bedingungen</h3>
  <div class="calc" id="condCalc">
    <label class="wide">Wassertemperatur: <b id="cdTempV">12 °C</b><input type="range" id="cdTemp" min="0" max="26" step="1" value="12"></label>
    <label>Wasserfarbe<select id="cdColor"><option value="klar">klar</option><option value="leicht">leicht getrübt</option><option value="trueb">stark getrübt / Hochwasser</option></select></label>
    <label>Wetter<select id="cdWx"><option value="">egal</option><option value="sonne">hell und sonnig</option><option value="bedeckt">bedeckt</option><option value="regen">Regen</option><option value="wind">windig</option></select></label>
    <div class="calc-out" id="cdOut" aria-live="polite"></div>
  </div>

'''
h = h.replace('  <h3 class="sub">Vorgehen am Wasser</h3>', prax + '  <h3 class="sub">Vorgehen am Wasser</h3>')
h = h.replace('<h2>Hakengrößen &amp; Praxis</h2>', '<h2>Praxis &amp; Rechner</h2>')
h = h.replace('<script src="app.js"></script>', '<script src="app.js"></script>\n<script src="features.js"></script>')
open(S + 'index.html', 'w', encoding='utf8').write(h)
print('ok')
