import re
S = '../site/'
h = open(S + 'index.html', encoding='utf8').read()

# --- Header: Navigation wird per JS aufgebaut
h = re.sub(r'<nav class="tabs" id="tabs".*?</nav>', '<nav class="tabs" id="tabs" role="tablist" aria-label="Hauptbereiche"></nav>', h, flags=re.S)
h = h.replace('<a class="brand" href="#start" data-tab="tree">', '<a class="brand" href="#home">')
h = h.replace('</header>\n', '</header>\n<nav class="subnav hidden" id="subnav" role="tablist" aria-label="Unterbereiche"></nav>\n', 1)

# --- Hero -> Startseite
home = '''<section class="panel-sec" id="tab-home" role="tabpanel">
  <div class="hero" id="start">
    <p class="eyebrow mono">Fly Fishing Entomology</p>
    <h1>Was frisst die Forelle?</h1>
    <p class="lead">Insekten, Muster, Saison und Bedingungen an einem Ort: erst nachsehen, was gerade aktiv ist, dann Haken, Vorfach und Fliege wählen.</p>
    <form class="homesearch" id="homeSearch" role="search">
      <label class="sr" for="homeQ">Suche</label>
      <input id="homeQ" type="search" placeholder="Insekt, Muster oder Gruppe suchen: Baetis, Hopper, Elk Hair Caddis …" autocomplete="off">
      <button class="btn pri" type="submit">Suchen</button>
    </form>
  </div>
  <div class="home-now"><h2>Jetzt aktiv im <span id="homeMonth"></span></h2>
    <div class="pillrow" id="homeActive"></div>
    <p class="hint">Hauptzeit in Mitteleuropa. <button class="linkbtn" data-go="now">Mit Wetter, Wassertemperatur und Tageszeit auswerten →</button></p></div>
  <div class="home-cards" id="homeCards"></div>
  <ul class="stats" id="stats"></ul>
</section>
'''
h = re.sub(r'<section class="hero" id="start">.*?</section>\n', home, h, flags=re.S)
h = h.replace('<section class="panel-sec" id="tab-tree"', '<section class="panel-sec hidden" id="tab-tree"')

# --- Praxis-Tab aufteilen
m = re.search(r'<!-- ===== Praxis ===== -->.*?</section>\n', h, flags=re.S)
prax = m.group(0)
def between(a, b):
    i = prax.index(a); j = prax.index(b, i)
    return prax[i:j]
hooktool = between('  <div class="hook-tool">', '  <h3 class="sub">Vorfach-')
tippet = between('  <h3 class="sub">Vorfach-', '  <h3 class="sub">Wassertemperatur')
cond = between('  <h3 class="sub">Wassertemperatur', '  <h3 class="sub">Vorgehen')
tips = between('  <h3 class="sub">Vorgehen', '  <h3 class="sub">Starter-Box')
starter = between('  <h3 class="sub">Starter-Box', '  <h3 class="sub">Quellen')
sources = prax[prax.index('<p class="foot">'):prax.index('</section>')]
tippet = tippet.replace('<h3 class="sub">Vorfach- &amp; Tippet-Rechner</h3>', '<h3 class="sub">Vorfach- &amp; Tippet-Rechner</h3>')
cond = cond.replace('<h3 class="sub">Wassertemperatur &amp; Bedingungen</h3>', '')
tips = tips.replace('Vorgehen am Wasser', 'Vorgehen am Wasser: 8 Grundregeln')
starter = starter.replace('<h3 class="sub">Starter-Box: 12 Muster, die fast überall fangen</h3>', '')

new = f'''<!-- ===== Haken & Vorfach ===== -->
<section class="panel-sec hidden" id="tab-tip" role="tabpanel">
  <div class="sec-head"><h2>Haken &amp; Vorfach</h2>
    <p>Hakengröße wählen, passende Tippet-Stärke und Vorfachaufbau berechnen.</p></div>
{hooktool}  <h3 class="sub">Hakengrößen-Übersicht</h3>
  <div class="cal-wrap"><table class="cmp" id="hookTable"></table></div>
{tippet}</section>

<!-- ===== Bedingungen & Tipps ===== -->
<section class="panel-sec hidden" id="tab-cond" role="tabpanel">
  <div class="sec-head"><h2>Bedingungen &amp; Tipps</h2>
    <p>Wassertemperatur, Wasserfarbe und Wetter bestimmen, wie und womit du fischst.</p></div>
{cond}{tips}</section>

<!-- ===== Starter-Box ===== -->
<section class="panel-sec hidden" id="tab-starter" role="tabpanel">
  <div class="sec-head"><h2>Starter-Box</h2>
    <p>12 Muster, die an fast jedem Wasser etwas fangen. Klick auf ein Muster zeigt die passende Gruppe; im Reiter „Binderezepte“ findest du die Rezepte.</p></div>
{starter}</section>
'''
h = h.replace(prax, new)

# --- Quellen in den Fuß
h = h.replace('<footer class="site-foot">Fly Ento – Entomologie für Fliegenfischer. Petri Heil!</footer>',
  '<footer class="site-foot"><details><summary>Quellen &amp; Hinweise</summary>' + sources.strip() + '</details><p>Fly Ento – Entomologie für Fliegenfischer. Petri Heil!</p></footer>')
open(S + 'index.html', 'w', encoding='utf8').write(h)

# --- app.js: Navigation
a = open(S + 'app.js', encoding='utf8').read()
i = a.index('/* ========== Tabs ========== */')
j = a.index('/* ========== Stats ========== */')
nav = '''/* ========== Navigation ========== */
const GROUPS = [
  {k: "water", t: "Am Wasser", d: "Was fressen die Fische gerade? Bedingungen, Haken, Vorfach und Bestimmung.",
   tabs: [["now", "Jetzt am Wasser"], ["cond", "Bedingungen & Tipps"], ["tip", "Haken & Vorfach"], ["key", "Bestimmung"]]},
  {k: "ins", t: "Insekten nachschlagen", d: "Alle Gruppen, Untergruppen, Saison, Verbreitung und Lebenszyklen.",
   tabs: [["tree", "Organigramm"], ["cal", "Schlupfkalender"], ["map", "Weltkarte"], ["life", "Lebenszyklen"]]},
  {k: "tie", t: "Binden & Box", d: "Binderezepte, deine Fliegenbox, das Fangbuch und die Starter-Box.",
   tabs: [["rec", "Binderezepte"], ["box", "Meine Box & Fangbuch"], ["starter", "Starter-Box"]]}
];
const TAB_GROUP = {}; GROUPS.forEach(g => g.tabs.forEach(([id]) => TAB_GROUP[id] = g));
const lastTab = {};
$("#tabs").innerHTML = GROUPS.map(g => `<button role="tab" data-group="${g.k}" aria-selected="false">${esc(g.t)}</button>`).join("");
function showTab(id) {
  if (!document.getElementById("tab-" + id)) id = "home";
  const g = TAB_GROUP[id];
  $$("#tabs button").forEach(b => b.setAttribute("aria-selected", !!g && b.dataset.group === g.k));
  const sn = $("#subnav"); sn.classList.toggle("hidden", !g);
  if (g) { lastTab[g.k] = id; sn.innerHTML = g.tabs.map(([i, t]) => `<button role="tab" data-tab="${i}" aria-selected="${i === id}">${esc(t)}</button>`).join(""); }
  $$(".panel-sec").forEach(s => s.classList.toggle("hidden", s.id !== "tab-" + id));
  if (id === "map") renderMap();
  if (window.onTab) window.onTab(id);
  history.replaceState(null, "", "#" + id);
  window.scrollTo({top: 0});
}
$("#tabs").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { const g = GROUPS.find(x => x.k === b.dataset.group); showTab(lastTab[g.k] || g.tabs[0][0]); } });
$("#subnav").addEventListener("click", e => { const b = e.target.closest("button"); if (b) showTab(b.dataset.tab); });
document.addEventListener("click", e => { const b = e.target.closest("[data-go]"); if (b) showTab(b.dataset.go); });
$(".brand").addEventListener("click", e => { e.preventDefault(); showTab("home"); });
(function stickyOffset() { const set = () => document.documentElement.style.setProperty("--hh", $(".top").offsetHeight + "px"); set(); addEventListener("resize", set); })();

/* ========== Startseite ========== */
$("#homeCards").innerHTML = GROUPS.map(g => `<article class="hcard ${g.k}"><h2>${esc(g.t)}</h2><p>${esc(g.d)}</p>
  <div class="pillrow">${g.tabs.map(([id, t]) => `<button type="button" class="pill" data-go="${id}">${esc(t)}</button>`).join("")}</div></article>`).join("");
$("#homeMonth").textContent = MONTHS_LONG[NOW];
(function homeActive() {
  const gs = ALL.filter(g => g.season[NOW] >= 2).sort((a, b) => b.season[NOW] - a.season[NOW] || a.de.localeCompare(b.de, "de")).slice(0, 14);
  $("#homeActive").innerHTML = gs.map(g => `<button type="button" class="pill l${g.season[NOW]}" data-open="${g.id}" title="${esc(g.lat)} · Haken ${esc(hookTxt(g))}">${esc(g.de)}</button>`).join("");
})();
$("#homeActive").addEventListener("click", e => { const b = e.target.closest("[data-open]"); if (b) openGroup(b.dataset.open); });
$("#homeSearch").addEventListener("submit", e => { e.preventDefault(); const q = $("#homeQ").value; showTab("tree"); $("#q").value = q; $("#q").dispatchEvent(new Event("input", {bubbles: true})); });

'''
a = a[:i] + nav + a[j:]
a = a.replace('if ($$("#tabs button").some(b => b.dataset.tab === start)) showTab(start);', 'showTab(start || "home");')
open(S + 'app.js', 'w', encoding='utf8').write(a)
print('ok')
