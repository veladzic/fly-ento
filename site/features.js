"use strict";
/* Zusatzfunktionen: Jetzt am Wasser · Binderezepte · Meine Box & Fangbuch · Tippet-Rechner · Bedingungen */

/* ---------- gemeinsame Helfer ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
};
const monthOpts = sel => { sel.innerHTML = MONTHS_LONG.map((m, i) => `<option value="${i}">${m}</option>`).join(""); sel.value = new Date().getMonth(); };
const hookMid = g => Math.round((g.hook[0] + g.hook[1]) / 2);
const xFor = hook => Math.max(0, Math.min(8, Math.round(hook / 3)));      // Faustregel: Hakengröße ÷ 3 = X-Stärke
const GROUP_BY_ID = Object.fromEntries(ALL.map(g => [g.id, g]));
const ORDER_OF = id => { let o = null; DATA.forEach(b => b.orders.forEach(x => { if (x.id === id) o = x; })); return o; };

/* ---------- Binderezepte (Daten) ---------- */
const RECIPES = [
 {id:"pheasant-tail", name:"Pheasant Tail Nymph", type:"Nymphe", groups:["baetidae","leptophlebiidae","ephemerellidae"], hook:"Nymphenhaken #12–18", thread:"braun 8/0",
  parts:[["Schwanz","4–6 Fasern vom Fasanen-Schwanzfeder"],["Körper","Fasanenfasern, um Kupferdraht gedreht und vorwärts gewickelt"],["Rippung","Kupferdraht (fein), gegenläufig in engen Spiralen"],["Thorax","Pfauenfeder-Herl"],["Flügelscheide & Beine","Fasanenfasern, über den Thorax nach vorn gelegt, Enden bleiben als Beine"],["Optional","Goldkugel oder Wolfram-Kugel vor dem Haken-Öhr"]],
  steps:["Haken einspannen, Faden am Hakenbogen anlegen, Kupferdraht einbinden.","5 Fasanenfasern (Spitzen als Schwanz, etwa Hakenschenkel-Länge) einbinden.","Fasern zusammendrehen und bis zur Thorax-Position vorwickeln, festbinden.","Draht gegenläufig in engen Spiralen vorwickeln und festbinden.","Pfauenherl für den Thorax einbinden, wickeln; 3–4 Fasanenfasern für die Flügelscheide einbinden.","Fasern über den Thorax nach vorn legen, abbinden, Enden als Beine zurückstehen lassen; Kopf, Abschlussknoten, Lack."],
  tip:"Frank Sawyers Original verwendet nur Kupferdraht ohne Faden. Eine Wolfram-Kugel bringt die Fliege schnell zum Grund."},
 {id:"hares-ear", name:"Gold Ribbed Hare’s Ear", type:"Nymphe", groups:["ephemerellidae","heptageniidae","limnephilidae"], hook:"Nymphenhaken #10–16", thread:"braun oder oliv 8/0",
  parts:[["Schwanz","Grannenhaare vom Hasenohr"],["Körper","Hasenohr-Dubbing (ruppig)"],["Rippung","Goldenes Oval-Tinsel"],["Flügelscheide","Stück Truthahn-Schwanzfeder, gelackt"],["Thorax","Dubbing, mit Dubbingnadel aufgerauht"]],
  steps:["Faden anlegen; Schwanz aus Hasenohr-Grannen einbinden.","Tinsel einbinden, Dubbing locker auf den Faden drehen.","Körper bis zum Thorax wickeln, Tinsel gegenläufig spiralen.","Truthahnfeder-Stück als Flügelscheide einbinden.","Thorax dubben, Flügelscheide nach vorn legen und festbinden.","Thorax mit einer Nadel aufrauen: die „Beine“ machen die Fliege lebendig."],
  tip:"Die ruppige Silhouette imitiert sowohl Eintags- als auch Köcherfliegenlarven."},
 {id:"adams", name:"Adams", type:"Trockenfliege", groups:["baetidae","ephemerellidae","leptophlebiidae"], hook:"Trockenfliegenhaken #12–18", thread:"grau 8/0",
  parts:[["Schwanz","Hechelfasern, Grizzly und Braun gemischt"],["Flügel","Zwei Grizzly-Hechelspitzen, aufrecht"],["Körper","Graues Dubbing (Bisamratte)"],["Hechel","Braun und Grizzly, zusammen gewickelt"]],
  steps:["Faden anlegen, Flügel-Hechelspitzen auf dem Schenkel einbinden und aufrichten.","Schwanz aus gemischten Hechelfasern einbinden.","Zwei Hechelfedern (braun und grizzly) hinter dem Flügel einbinden.","Dubbing auf den Faden drehen und den Körper formen.","Beide Hecheln gemeinsam vor und hinter dem Flügel wickeln, abbinden.","Kopf formen und Abschlussknoten."],
  tip:"Der Klassiker unter den Allround-Trockenfliegen: imitiert Eintagsfliegen und Köcherfliegen in vielen Größen."},
 {id:"elk-hair-caddis", name:"Elk Hair Caddis", type:"Trockenfliege", groups:["limnephilidae","hydropsychidae","brachycentridae","sericostomatidae"], hook:"Trockenfliegenhaken #10–18", thread:"braun oder oliv 8/0",
  parts:[["Körper","Hasenohr- oder Kunstdubbing (tan, oliv)"],["Hechel","Braun, durch den ganzen Körper palmiert"],["Rippung","Feiner Golddraht, durch die Hechel gewickelt"],["Flügel","Elchhaar, natürliche Farbe, dachförmig"]],
  steps:["Faden anlegen, Hechel am Hakenbogen einbinden.","Körper dubben bis kurz hinter das Öhr.","Hechel vorwärts palmieren und abbinden.","Draht gegenläufig durch die Hechel wickeln und abbinden.","Elchhaar auslesen, Spitzen ausrichten und als Flügel über den Körper binden.","Überstehende Haare knapp hinter dem Öhr abschneiden, Kopf mit Lack."],
  tip:"Schwimmt auch im Wellengang hervorragend. Zupfen oder „Skaten“ löst oft aggressive Bisse aus."},
 {id:"zebra-midge", name:"Zebra Midge", type:"Emerger / Puppe", groups:["midge_pupa","midge_larva"], hook:"Gebogener Nymphenhaken #16–20", thread:"schwarz 8/0 oder 70 Den",
  parts:[["Körper","Fadenkörper, glatt und eng gewickelt"],["Rippung","Feiner Silberdraht"],["Kopf","Silber- oder Wolframkugel"]],
  steps:["Kugel auf den Haken schieben, Haken einspannen, Faden hinter der Kugel anlegen.","Silberdraht am Hakenbogen einbinden.","Faden dünn und eng bis zum Bogen wickeln und glatt zurück.","Silberdraht in engen Spiralen vorwärts wickeln, abbinden.","Abschlussknoten, Lack auf den Körper."],
  tip:"Farben: schwarz, rot, olive. Im Stillwasser langsam einziehen oder hängend unter einer Pose."},
 {id:"griffiths-gnat", name:"Griffith’s Gnat", type:"Trockenfliege", groups:["midge_adult"], hook:"Trockenfliegenhaken #18–24", thread:"schwarz 8/0",
  parts:[["Körper","Pfauenfeder-Herl"],["Hechel","Grizzly, palmiert und dicht gewickelt"]],
  steps:["Faden anlegen, Grizzly-Hechel am Hakenbogen einbinden.","Pfauenherl einbinden und zum Körper wickeln.","Hechel vorwärts palmieren, abbinden, Rest abschneiden.","Kopf formen, Abschlussknoten."],
  tip:"Imitiert Mückenklumpen („Cluster“) – ideal bei steigenden Fischen, aber ohne erkennbaren Schlupf."},
 {id:"klinkhamer", name:"Klinkhamer Special", type:"Emerger / Puppe", groups:["ephemerellidae","baetidae","ephemeridae"], hook:"Gebogener Klinkhamer-Haken #10–18", thread:"hellbraun oder grau 8/0",
  parts:[["Abdomen","Dubbing in Oliv, Tan oder Grau"],["Flügel / Aufbau","Polypropylen-Garn, aufrecht als „Post“"],["Thorax","Pfauenherl"],["Hechel","Grizzly oder Braun, um den Post gewickelt"]],
  steps:["Haken einspannen, Faden anlegen, Garn für den Post einbinden und aufrichten.","Faden am Post umwickeln, bis er senkrecht steht.","Abdomen aus Dubbing formen und bis zum Post führen.","Hechel am Post einbinden, Pfauenherl für den Thorax wickeln.","Hechel um den Post wickeln (Parachute), mit Faden abbinden."],
  tip:"Der Hinterleib hängt im Film, die Hechel trägt die Fliege – das macht den Klinkhamer zu einem sehr guten Emerger-Muster."},
 {id:"cdc-spinner", name:"CDC Spent Spinner", type:"Trockenfliege", groups:["caenidae","leptohyphidae","baetidae"], hook:"Trockenfliegenhaken #14–22", thread:"braun oder grau 8/0",
  parts:[["Schwanz","Microfibbets oder Zelfasern, gespreizt"],["Körper","Faden oder feines Dubbing, rötlich-braun"],["Flügel","CDC-Federn, nach beiden Seiten gespreizt („spent“)"],["Thorax","Feines Dubbing"]],
  steps:["Faden anlegen, Schwanzfasern am Bogen einbinden (V-förmig spreizen).","Körper aus Faden oder dünnem Dubbing wickeln.","CDC-Federn quer über den Haken binden und nach hinten abstehen lassen.","Mit etwas Dubbing den Thorax formen und Kopf abbinden."],
  tip:"Imitiert den erschöpften Spinner im Film: ideal für den abendlichen Spinnerfall."},
 {id:"san-juan-worm", name:"San Juan Worm", type:"Nymphe", groups:["midge_larva"], hook:"Nymphenhaken #10–14", thread:"rot oder rosa 6/0",
  parts:[["Körper","Chenille (Ultra Chenille) in Rot, Rosa, Fleisch oder Oliv"]],
  steps:["Haken einspannen, Faden anlegen und am Bogen abbinden.","Chenille einbinden, bis zum Öhr wickeln (nicht zu dick) und abbinden.","Enden der Chenille mit der Flamme anschmelzen oder kürzen."],
  tip:"Besonders nach Regen und Hochwasser, wenn Würmer ausgeschwemmt werden. Auch ein guter Dropper."},
 {id:"woolly-bugger", name:"Woolly Bugger", type:"Streamer", groups:["anisoptera","leech","sialidae","dytiscidae"], hook:"3xl Streamerhaken #6–10", thread:"schwarz 6/0",
  parts:[["Schwanz","Marabou, schwarz oder oliv"],["Körper","Chenille"],["Hechel","Sattelhechel, palmiert"],["Rippung","Draht, durch die Hechel gewickelt"],["Optional","Bleidraht oder Kugel für Gewicht"]],
  steps:["Haken einspannen; Bleidraht oder Kugel optional anbringen.","Marabou als Schwanz (etwa Hakenschenkel-Länge) einbinden.","Hechel und Draht einbinden, Chenille einbinden und vorwärts wickeln.","Hechel palmiert vorwickeln und mit Draht gegenläufig sichern.","Kopf formen, Abschlussknoten."],
  tip:"Vielseitigstes Muster: Egel, Libellenlarve, Fischchen. Farben Schwarz, Oliv und Braun decken fast alles ab."},
 {id:"stimulator", name:"Stimulator", type:"Trockenfliege", groups:["perlidae","pteronarcyidae","perlodidae"], hook:"3xl Trockenfliegenhaken #6–12", thread:"orange oder gelb 6/0",
  parts:[["Schwanz","Elchhaar"],["Körper","Dubbing in Gelb oder Orange, mit Hechel palmiert"],["Rippung","Draht"],["Flügel","Elchhaar"],["Hechel","Grizzly und Braun, vorn gewickelt"],["Thorax","Dubbing, orange oder amber"]],
  steps:["Faden anlegen, Elchhaar als Schwanz einbinden.","Hechel und Draht einbinden, Körper dubben und die Hechel palmieren.","Elchhaar als Flügel einbinden.","Zweite Hechel einbinden, Thorax dubben, Hechel wickeln.","Kopf und Abschlussknoten."],
  tip:"Sehr gut sichtbar und schwimmt hoch: Basis für große Steinfliegen und als Indikator vor einer Nymphe."},
 {id:"foam-ant", name:"Foam Ant", type:"Terrestrial", groups:["lasius","formica","camponotus","alate"], hook:"Trockenfliegenhaken #14–18", thread:"schwarz 8/0",
  parts:[["Hinterleib","Schaumstoff (2 mm), zwei Segmente"],["Hechel","Schwarz, kurz, als Beine"],["Flügel","Optional: wenige weiße Fasern oder CDC"]],
  steps:["Haken einspannen, Schaumstoffstreifen am Hakenbogen einbinden.","Faden bis zur Hakenmitte führen, Schaum über den Faden legen und für das erste Segment binden.","Faden zum Thorax führen, Hechel einbinden und wickeln.","Schaum nach vorn legen, abbinden, Rest abschneiden."],
  tip:"Eine Ameise sinkt im Film leicht ein: ein kleines Segment unter dem Film und den Rest darüber schwimmen lassen."},
 {id:"partridge-orange", name:"Partridge & Orange", type:"Nass / Soft Hackle", groups:["leuctridae","baetidae","hydropsychidae"], hook:"Nassfliegenhaken #12–16", thread:"orange (Seidenfaden oder 8/0)",
  parts:[["Körper","Orange Faden, ganz dünn"],["Hechel","Rebhuhn-Feder (Partridge), 1,5 Windungen"]],
  steps:["Faden anlegen, Körper aus Faden bis kurz hinter das Öhr wickeln.","Rebhuhnfeder mit der Spitze nach vorn einbinden.","Feder 1–2 Mal wickeln, Fasern nach hinten streichen.","Abbinden, Kopf formen und Abschlussknoten."],
  tip:"Als Dropper „schwingen“ lassen: imitiert aufsteigende Puppen und ertrunkene Insekten."},
 {id:"sparkle-pupa", name:"Sparkle Pupa", type:"Emerger / Puppe", groups:["hydropsychidae","limnephilidae","brachycentridae"], hook:"Nymphen- oder Trockenfliegenhaken #12–16", thread:"braun oder oliv 8/0",
  parts:[["Unterkörper","Antron-Dubbing, oliv"],["Überkörper","Antron-Garn, durchsichtig"],["Flügel","Hirschhaar oder Elchhaar, kurz"],["Kopf","Pfauenherl"]],
  steps:["Haken einspannen, Faden anlegen, Antron-Dubbing zu einem Unterkörper formen.","Antron-Garn einbinden und als Hülle über den Körper legen.","Kurze Hirschhaar-Flügel an der Oberseite einbinden.","Kopf aus Pfauenherl, Abschlussknoten."],
  tip:"Gary LaFontaines Idee: die Luftbläschen am Körper der aufsteigenden Puppe werden durch das Antron nachgebildet."}
];
const RECIPE_BY_GROUP = {};
RECIPES.forEach(r => r.groups.forEach(id => (RECIPE_BY_GROUP[id] = RECIPE_BY_GROUP[id] || []).push(r)));

/* ---------- Segment-Schalter (ersetzen Auswahllisten) ---------- */
document.addEventListener("click", e => {
  const b = e.target.closest(".seg button"); if (!b) return;
  const seg = b.parentElement, inp = document.getElementById(seg.dataset.input); if (!inp) return;
  $$("button", seg).forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", x === b); });
  inp.value = b.dataset.v; inp.dispatchEvent(new Event("input", {bubbles: true}));
});
const setSeg = (id, v) => { const inp = document.getElementById(id); inp.value = v; const seg = document.querySelector(`.seg[data-input="${id}"]`); if (seg) $$("button", seg).forEach(x => { const on = x.dataset.v === v; x.classList.toggle("on", on); x.setAttribute("aria-pressed", on); }); };

/* ---------- Jetzt am Wasser ---------- */
(function finder() {
  const f = {m: $("#fMonth"), h: $("#fHemi"), r: $("#fRegion"), w: $("#fWater"), t: $("#fTime"), wx: $("#fWeather"), temp: $("#fTemp"), tv: $("#fTempV")};
  monthOpts(f.m);
  f.r.innerHTML = `<option value="">egal / Mitteleuropa</option>` + REGIONS.map(r => `<option value="${r.k}">${esc(r.short)}</option>`).join("");
  const TIME_RX = {morgen: /morgen|ganzt|tag(?!es)|vormittag/, mittag: /mittag|ganzt|tag(?!es)/, nachmittag: /nachmittag|mittag|ganzt|tag(?!es)/, abend: /abend|dämmerung|ganzt/, nacht: /nacht|dämmerung/};
  const dayHit = (g, t) => TIME_RX[t].test(g.day.toLowerCase());
  const COLD = new Set(["capniidae", "nemouridae", "taeniopterygidae", "leuctridae"]);
  const WARM_LAND = new Set(["caelifera", "cicadidae", "tettigonia", "gryllus", "isoptera"]);
  function score(g) {
    const sIdx = (+f.m.value + (f.h.value === "S" ? 6 : 0)) % 12, season = g.season[sIdx];
    if (!season) return null;
    const why = [], t = +f.temp.value, o = g.order, br = g.branch;
    let s = season * 4; why.push(["Saison", ["", "möglich", "Hauptzeit", "Hochsaison"][season]]);
    if (f.w.value) { if (g.water === f.w.value || g.water === "beides") { s += 2; why.push(["Gewässer", "passt"]); } else s -= 6; }
    if (f.t.value) { if (dayHit(g, f.t.value)) { s += 3; why.push(["Tageszeit", "passt"]); } else s -= 2; }
    if (COLD.has(g.id)) { if (t <= 8) { s += 4; why.push(["Temperatur", "kaltes Wasser"]); } else if (t > 12) s -= 3; }
    if (g.id === "baetidae" && t >= 4 && t <= 14) { s += 2; why.push(["Temperatur", "ideal für Baetis"]); }
    if (o === "midge" && t < 8) { s += 2; why.push(["Temperatur", "Zuckmücken dominieren"]); }
    if (o === "caddis" && t < 7) s -= 2;
    if (o === "caddis" && t >= 10) s += 1;
    if (g.id === "ephemeridae" && t < 9) s -= 2;
    if (["caenidae", "leptohyphidae", "hydroptilidae"].includes(g.id)) { if (t >= 14) s += 2; else if (t < 9) s -= 2; }
    if (br === "land") { if (t < 8) s -= 5; else if (t < 12) s -= 2; else if (t >= 15) { s += 2; why.push(["Temperatur", "warm genug"]); } }
    if (WARM_LAND.has(g.id)) { if (t >= 16) s += 2; else if (t < 12) s -= 3; }
    if (o === "stone" && g.id !== "capniidae" && t > 16) s -= 2;
    const wx = f.wx.value;
    if (wx === "wind" && br === "land") { s += 3; why.push(["Wetter", "Wind bringt Landinsekten"]); }
    if (wx === "sonnig" && br === "land") s += 1;
    if (wx === "sonnig" && o === "odonata") s += 2;
    if (wx === "regen" && (g.id === "baetidae" || g.id === "midge_pupa")) { s += 3; why.push(["Wetter", "mag nasses Wetter"]); }
    if (wx === "regen" && br === "land" && g.id !== "midge_larva") s -= 1;
    if (wx === "bewoelkt" && o === "mayfly") { s += 2; why.push(["Wetter", "bedeckt = guter Schlupf"]); }
    if (f.r.value) { const geo = g.geo[f.r.value]; if (!geo) return null; s *= geo / 3; if (geo === 3) why.push(["Region", "Schwerpunkt"]); }
    return s > 0 ? {g, s, why} : null;
  }
  const boxChip = g => { const has = window._boxHas ? g.flies.filter(n => _boxHas(n)) : []; return has.length ? `<span class="chip ok">in deiner Box: ${has.map(esc).join(", ")}</span>` : `<span class="chip warn">nicht in deiner Box</span>`; };
  const evenHook = g => { const m = hookMid(g); return m % 2 ? m + 1 : m; };
  const tipLine = g => `<p class="tp">${esc(g.tip)}</p>`;
  const buttons = g => `<div class="btnrow"><button class="btn" type="button" data-open="${g.id}">Details &amp; Untergruppen</button><button class="btn" type="button" data-tipcalc="${evenHook(g)}">Tippet berechnen</button>${(RECIPE_BY_GROUP[g.id] || []).slice(0, 2).map(r => `<button class="btn" type="button" data-rec="${r.id}">Rezept: ${esc(r.name)}</button>`).join("")}</div>`;
  function render() {
    f.tv.textContent = f.temp.value + " °C";
    const res = ALL.map(score).filter(Boolean).sort((a, b) => b.s - a.s).slice(0, 8);
    const sum = $("#nowSum"), grid = $("#nowGrid");
    if (!res.length) { sum.innerHTML = `<div class="empty">Keine passenden Gruppen – Filter lockern.</div>`; grid.innerHTML = ""; return; }
    const top = res[0].g, max = res[0].s, mid = hookMid(top);
    sum.innerHTML = `<article class="reco"><div class="reco-k">Beste Wahl</div>
      <h3>${esc(top.de)} <span class="mono">${esc(top.lat)}</span></h3>
      <div class="tiles"><div><b>${esc(hookTxt(top))}</b><span>Hakengröße</span></div><div><b>${xFor(mid)}X</b><span>Tippet</span></div><div><b>${esc(top.flies[0])}</b><span>Muster</span></div><div><b>${esc(top.day)}</b><span>Beste Zeit</span></div></div>
      <div class="chiprow">${res[0].why.map(w => `<span class="chip">${esc(w[0])}: ${esc(w[1])}</span>`).join("")}${boxChip(top)}</div>
      ${tipLine(top)}${buttons(top)}</article>`;
    grid.innerHTML = `<h3 class="sub">Weitere Kandidaten</h3>` + res.slice(1).map((r, i) => { const g = r.g;
      return `<details class="rowc"><summary><span class="rk">${i + 2}</span><span class="rn"><b>${esc(g.de)}</b><i class="mono">${esc(g.lat)}</i></span><span class="rb"><i style="width:${Math.max(8, r.s / max * 100)}%"></i></span><span class="rh mono">${esc(hookTxt(g))}</span></summary>
      <div class="rowc-in"><div class="chiprow">${r.why.map(w => `<span class="chip">${esc(w[0])}: ${esc(w[1])}</span>`).join("")}${boxChip(g)}</div>
      <p>Tippet ~${xFor(hookMid(g))}X · Muster: ${g.flies.map(esc).join(", ")}</p>${tipLine(g)}${buttons(g)}</div></details>`; }).join("");
  }
  $("#finder").addEventListener("input", render);
  $("#fReset").addEventListener("click", () => { ["fWater", "fTime", "fWeather"].forEach(id => setSeg(id, "")); f.temp.value = 10; monthOpts(f.m); f.h.value = "N"; f.r.value = ""; f.temp.dispatchEvent(new Event("input", {bubbles: true})); });
  $("#tab-now").addEventListener("click", e => {
    const b = e.target.closest("[data-open]"); if (b) return openGroup(b.dataset.open);
    const t = e.target.closest("[data-tipcalc]"); if (t) { $("#tcHook").value = t.dataset.tipcalc; $("#tcHook").dispatchEvent(new Event("input", {bubbles: true})); showTab("tip"); }
  });
  window._renderFinder = render; render();
})();

/* ---------- Binderezepte ---------- */
(function recipes() {
  const types = ["Alle", ...new Set(RECIPES.map(r => r.type))];
  let cur = "Alle", q = "";
  const drawChips = () => $("#recFilter").innerHTML = types.map(t => `<button class="chip-btn${t === cur ? " on" : ""}" data-t="${esc(t)}">${esc(t)}</button>`).join("");
  const card = r => `<details class="rec" id="r-${r.id}"><summary><span class="chip">${esc(r.type)}</span><b>${esc(r.name)}</b><span class="hint">${esc(r.hook)}</span><span class="imit">für: ${r.groups.map(id => esc(GROUP_BY_ID[id].de)).join(", ")}</span></summary>
   <div class="rec-in"><div><h4>Material · Faden: ${esc(r.thread)}</h4><dl class="parts">${r.parts.map(p => `<div><dt>${esc(p[0])}</dt><dd>${esc(p[1])}</dd></div>`).join("")}</dl></div>
   <div><h4>Bindeschritte</h4><ol>${r.steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol></div>
   <p class="tp"><b>Tipp:</b> ${esc(r.tip)}</p>
   <div class="pillrow">${r.groups.map(id => `<button type="button" class="pill" data-open="${id}">${esc(GROUP_BY_ID[id].de)}</button>`).join("")}</div></div></details>`;
  const draw = () => { drawChips(); const list = RECIPES.filter(r => (cur === "Alle" || r.type === cur) && (!q || (r.name + r.type + r.groups.map(id => GROUP_BY_ID[id].de).join(" ")).toLowerCase().includes(q)));
    $("#recGrid").innerHTML = list.map(card).join("") || `<p class="empty">Kein Rezept gefunden.</p>`; };
  $("#recFilter").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { cur = b.dataset.t; draw(); } });
  $("#recQ").addEventListener("input", e => { q = e.target.value.trim().toLowerCase(); draw(); });
  $("#recGrid").addEventListener("click", e => { const b = e.target.closest("[data-open]"); if (b) openGroup(b.dataset.open); });
  draw();
  const _og = openGroup;
  openGroup = function (id) {
    _og(id);
    const list = RECIPE_BY_GROUP[id]; if (!list) return;
    const acts = $("#dlgBody .actions"); if (!acts) return;
    acts.insertAdjacentHTML("beforebegin", `<h4>Binderezepte</h4><div class="pillrow">${list.map(r => `<button type="button" class="pill" data-rec="${r.id}">${esc(r.name)}</button>`).join("")}</div>`);
  };
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-rec]"); if (!b) return;
    if (!$("#dlg").classList.contains("hidden")) closeDlg();
    cur = "Alle"; q = ""; $("#recQ").value = ""; draw(); showTab("rec");
    const el = document.getElementById("r-" + b.dataset.rec); if (el) { el.open = true; el.scrollIntoView({block: "start"}); el.classList.add("flash"); setTimeout(() => el.classList.remove("flash"), 1800); }
  });
})();

/* ---------- Meine Box & Fangbuch ---------- */
(function box() {
  const patterns = new Map();
  ALL.forEach(g => g.flies.forEach(n => { if (!patterns.has(n)) patterns.set(n, []); patterns.get(n).push(g.id); }));
  $("#flyList").innerHTML = [...patterns.keys()].sort().map(n => `<option value="${esc(n)}">`).join("");
  let inBox = new Set(store.get("flyento.box", [])), log = store.get("flyento.log", []);
  const saveBox = () => store.set("flyento.box", [...inBox]);
  const saveLog = () => store.set("flyento.log", log);
  monthOpts($("#boxMonth"));
  $("#lDate").value = new Date().toISOString().slice(0, 10);
  const countTxt = () => `${[...inBox].filter(n => patterns.has(n)).length} von ${patterns.size} Mustern`;

  function drawBox() {
    const q = $("#boxQ").value.trim().toLowerCase();
    let h = "";
    DATA.forEach(b => b.orders.forEach(o => {
      const all = [...new Set(o.groups.flatMap(g => g.flies))], names = all.filter(n => !q || n.toLowerCase().includes(q));
      if (!names.length) return;
      const have = all.filter(n => inBox.has(n)).length;
      h += `<details class="boxo"${q ? " open" : ""}><summary><b>${esc(o.de)}</b><span class="count mono">${have}/${all.length}</span></summary><div class="boxo-in">${names.map(n => `<label class="ck"><input type="checkbox" data-p="${esc(n)}"${inBox.has(n) ? " checked" : ""}> ${esc(n)}</label>`).join("")}</div></details>`;
    }));
    $("#boxList").innerHTML = h || `<p class="empty">Kein Muster gefunden.</p>`;
    $("#boxCount").textContent = countTxt();
    drawMissing();
  }
  function drawMissing() {
    const m = +$("#boxMonth").value;
    const gs = ALL.filter(g => g.season[m] >= 2).sort((a, b) => b.season[m] - a.season[m]).slice(0, 14);
    $("#boxMissing").innerHTML = gs.map(g => {
      const have = g.flies.filter(n => inBox.has(n)), miss = g.flies.filter(n => !inBox.has(n));
      return `<div class="miss ${have.length ? "ok" : "no"}"><div class="miss-h"><b>${esc(g.de)}</b><span class="mono">${esc(hookTxt(g))}</span>${have.length ? `<span class="chip ok">vorhanden</span>` : `<span class="chip warn">fehlt</span>`}</div>
      ${miss.length ? `<div class="pillrow">${miss.map(n => `<button class="pill" type="button" data-add="${esc(n)}" title="In die Box legen">+ ${esc(n)}</button>`).join("")}</div>` : ""}</div>`; }).join("") || `<p class="empty">Keine Hauptgruppen in diesem Monat.</p>`;
  }
  $("#boxList").addEventListener("change", e => { const c = e.target.closest("input[data-p]"); if (!c) return; c.checked ? inBox.add(c.dataset.p) : inBox.delete(c.dataset.p); saveBox(); $("#boxCount").textContent = countTxt(); const sm = c.closest("details").querySelector(".count"); const names = [...c.closest(".boxo-in").querySelectorAll("input")]; sm.textContent = `${names.filter(x => x.checked).length}/${names.length}`; drawMissing(); });
  $("#boxMissing").addEventListener("click", e => { const b = e.target.closest("[data-add]"); if (b) { inBox.add(b.dataset.add); saveBox(); drawBox(); toast(b.dataset.add + " in die Box gelegt"); } });
  $("#boxQ").addEventListener("input", drawBox);
  $("#boxMonth").addEventListener("change", drawMissing);
  $("#boxView").addEventListener("input", () => { const v = $("#boxView").value; $$(".bx").forEach(p => p.classList.toggle("hidden", p.id !== "bx-" + v)); });

  const msg = t => { $("#logMsg").textContent = t; toast(t); };
  function drawLog() {
    const rows = [...log].sort((a, b) => b.date.localeCompare(a.date));
    $("#logTable").classList.add("stack"); $("#logTable").innerHTML = rows.length ? `<thead><tr><th>Datum</th><th>Gewässer</th><th>Fisch</th><th>cm</th><th>Muster</th><th>Haken</th><th>°C</th><th>Notiz</th><th></th></tr></thead><tbody>${rows.map(r => `<tr><td data-label="Datum">${esc(r.date)}</td><td data-label="Gewässer">${esc(r.water)}</td><td data-label="Fisch">${esc(r.fish)}</td><td data-label="Länge">${esc(r.len ? r.len + " cm" : "–")}</td><td data-label="Muster">${esc(r.fly)}</td><td data-label="Haken">${esc(r.hook || "–")}</td><td data-label="Wasser °C">${esc(r.temp || "–")}</td><td data-label="Notiz">${esc(r.note || "–")}</td><td data-label=""><button class="btn sm" type="button" data-del="${r.id}" aria-label="Eintrag löschen">×</button></td></tr>`).join("")}</tbody>` : `<tbody><tr><td class="hint">Noch keine Einträge. Trage deinen ersten Fang links ein.</td></tr></tbody>`;
    const cnt = a => { const m = {}; a.forEach(x => { if (x) m[x] = (m[x] || 0) + 1; }); return Object.entries(m).sort((a, b) => b[1] - a[1])[0]; };
    if (!log.length) { $("#logStats").innerHTML = ""; return; }
    const big = log.filter(r => r.len).sort((a, b) => b.len - a.len)[0], tp = cnt(log.map(r => r.fly)), tw = cnt(log.map(r => r.water)), tm = cnt(log.map(r => MONTHS_LONG[+r.date.slice(5, 7) - 1]));
    $("#logStats").innerHTML = [[log.length, "Fänge"], [big ? big.len + " cm" : "–", "größter Fisch"], [tp ? tp[0] : "–", "Top-Muster" + (tp ? ` (${tp[1]}×)` : "")], [tw ? tw[0] : "–", "Top-Gewässer"], [tm ? tm[0] : "–", "bester Monat"]].map(([a, b]) => `<div><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join("");
  }
  $("#logForm").addEventListener("submit", e => {
    e.preventDefault();
    const r = {id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), date: $("#lDate").value, water: $("#lWater").value.trim(), fish: $("#lFish").value, len: $("#lLen").value, fly: $("#lFly").value.trim(), hook: $("#lHook").value, temp: $("#lTemp").value, note: $("#lNote").value.trim()};
    if (!r.date || !r.water || !r.fly) return;
    log.push(r); const ok = saveLog(); drawLog(); msg(ok ? "Fang eingetragen." : "Nur für diese Sitzung gespeichert: der Browser blockiert den Speicher.");
    if (patterns.has(r.fly) && !inBox.has(r.fly)) { inBox.add(r.fly); saveBox(); drawBox(); }
    ["lLen", "lFly", "lHook", "lNote"].forEach(id => $("#" + id).value = "");
  });
  let delArm = null;
  $("#logTable").addEventListener("click", e => {
    const b = e.target.closest("[data-del]"); if (!b) return;
    if (delArm === b.dataset.del) { log = log.filter(r => r.id !== delArm); saveLog(); delArm = null; drawLog(); msg("Eintrag gelöscht."); }
    else { delArm = b.dataset.del; b.textContent = "Sicher?"; msg("Zum Löschen noch einmal klicken."); setTimeout(() => { if (delArm === b.dataset.del) { delArm = null; drawLog(); } }, 3000); }
  });
  const download = (name, text, type) => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], {type})); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); };
  const csvCell = v => { const s = String(v ?? ""); return /[",;\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  $("#logCsv").onclick = () => { if (!log.length) return msg("Das Fangbuch ist noch leer."); const head = ["Datum", "Gewässer", "Fisch", "Länge cm", "Muster", "Haken", "Wasser °C", "Notiz"];
    download("fangbuch.csv", "﻿" + [head, ...log.map(r => [r.date, r.water, r.fish, r.len, r.fly, r.hook, r.temp, r.note])].map(r => r.map(csvCell).join(";")).join("\n"), "text/csv"); };
  $("#logJson").onclick = () => download("fly-ento-sicherung.json", JSON.stringify({version: 1, box: [...inBox], log}, null, 1), "application/json");
  $("#logLoad").addEventListener("change", async e => {
    const f = e.target.files[0]; if (!f) return;
    try { const d = JSON.parse(await f.text()); if (!Array.isArray(d.log) || !Array.isArray(d.box)) throw 0;
      log = d.log.filter(r => r && r.date && r.water && r.fly).map(r => ({id: String(r.id || Math.random()), date: String(r.date).slice(0, 10), water: String(r.water), fish: String(r.fish || ""), len: String(r.len || ""), fly: String(r.fly), hook: String(r.hook || ""), temp: String(r.temp || ""), note: String(r.note || "")}));
      inBox = new Set(d.box.map(String)); saveLog(); saveBox(); drawBox(); drawLog(); msg("Sicherung geladen."); }
    catch (err) { msg("Die Datei ist keine gültige Sicherung."); }
    e.target.value = "";
  });
  let clrArm = false;
  $("#logClear").onclick = () => { if (!clrArm) { clrArm = true; $("#logClear").textContent = "Wirklich leeren?"; setTimeout(() => { clrArm = false; $("#logClear").textContent = "Fangbuch leeren"; }, 3000); return; } clrArm = false; $("#logClear").textContent = "Fangbuch leeren"; log = []; saveLog(); drawLog(); msg("Fangbuch geleert."); };
  window._boxHas = n => inBox.has(n);
  window._drawBox = () => { drawBox(); drawLog(); }; drawBox(); drawLog();
})();

/* ---------- Haken & Vorfach: Rechner für Trockenfliege, Indikator-Nymphe und Euronymphe ---------- */
(function hooktool() {
  const X = [[0, .28, 5.0], [1, .25, 4.0], [2, .23, 3.5], [3, .20, 3.0], [4, .18, 2.4], [5, .15, 1.9], [6, .13, 1.5], [7, .10, 1.1], [8, .08, 0.8]];
  $("#xTable").innerHTML = `<thead><tr><th>Stärke</th><th>Durchmesser</th><th>Tragkraft Nylon (ca.)</th><th>Typische Hakengröße</th></tr></thead><tbody>${X.map(([x, d, kg]) => `<tr><td>${x}X</td><td>${d.toFixed(2)} mm</td><td>${kg.toFixed(1)} kg</td><td>#${[2, 4, 6, 8, 12, 15, 18, 21, 24][x]}</td></tr>`).join("")}</tbody>`;
  const nf = (n, d = 1) => n.toFixed(d).replace(".", ",");
  const cm = m => Math.round(m * 100);
  const COL = {base: "var(--ink)", mid: "var(--water)", tip: "#B8791B", ind: "#D9542B", sight: "#C9A227"};

  /* Aufbau je Vorfach-Typ: Teile mit Länge in m, Durchmesser in mm */
  function spec(type, o) {
    const mmTip = o.row[1], parts = [], notes = [];
    if (type === "dry") {
      const L = o.len;
      parts.push({n: "Basis (steif)", len: L * .6, d: .45, c: "base", mat: "Nylon"});
      parts.push({n: "Mittelstück", len: L * .2, d: .30, c: "mid", mat: "Nylon"});
      parts.push({n: "Tippet", len: L * .2, d: mmTip, c: "tip", mat: o.mat === "fc" ? "Fluorocarbon" : "Nylon", fly: true});
      notes.push("Klassisches konisches Vorfach nach der 60/20/20-Regel: der steife, dicke Teil überträgt die Kraft, das dünne Tippet lässt die Fliege dragfrei treiben.");
      notes.push("Bei feinen Fischen auf 3,5–4,5 m verlängern; Tippet nach jedem Fliegenwechsel kürzen und unter ca. 30 cm ersetzen.");
      notes.push("Teile mit Blutknoten verbinden. Nylon schwimmt und dehnt sich, daher für Trockenfliegen bevorzugt.");
      return {parts, flies: 1, total: L, ind: null, notes, title: "Trockenfliege"};
    }
    if (type === "ind") {
      const D = Math.max(.6, o.depth * 1.5), n = o.flies;
      parts.push({n: "Konisches Vorfach", len: 2.4, d: .28, c: "base", mat: "Nylon, 2,4 m (0,45 → 0,28 mm)"});
      parts.push({n: "Indikator", len: 0, d: 0, c: "ind", mat: "Strike-Indicator auf dem Vorfach-Ende", ind: true});
      if (n === 1) { parts.push({n: "Tippet bis zur Fliege", len: D, d: mmTip, c: "tip", mat: "Fluorocarbon", fly: true}); }
      else { parts.push({n: "Tippet bis Fliege 1", len: D - .5 < .4 ? .4 : D - .5, d: mmTip, c: "tip", mat: "Fluorocarbon", fly: "drop"});
             parts.push({n: "Abstand zur Fliege 2", len: .5, d: Math.max(0.08, mmTip - .02), c: "tip", mat: "Fluorocarbon", fly: true}); }
      notes.push(`Abstand Indikator – Fliege = ${nf(o.depth * 1.5, 2)} m (1,5 × Wassertiefe; bei starker Strömung bis 2 ×).`);
      notes.push("Kein Beadhead? Dann Schrot ca. 15–20 cm über der obersten Fliege anbringen. Beschwerte Fliegen bevorzugen.");
      notes.push("Drift: Indikator möglichst dragfrei mit der Strömung treiben lassen; ein Anheben oder Stocken ist der Biss.");
      return {parts, flies: n, total: parts.reduce((s, p) => s + p.len, 0), ind: D, notes, title: "Indikator-Nymphe"};
    }
    // Euronymphe
    const tipLen = Math.max(.8, Math.min(2.0, o.depth * 1.2)), n = o.flies;
    parts.push({n: "Basis (Mono)", len: 3.0, d: .30, c: "base", mat: "Monofil 0,30 mm"});
    parts.push({n: "Übergang (Mono)", len: 1.5, d: .22, c: "mid", mat: "Monofil 0,22 mm"});
    parts.push({n: "Sighter (zweifarbig)", len: .4, d: .28, c: "sight", mat: "Bunter Mono 0,25–0,28 mm", ind: true});
    parts.push({n: "Tippet", len: tipLen, d: mmTip, c: "tip", mat: "Fluorocarbon", fly: n === 1 ? true : "drop", drops: n - 1});
    notes.push("Euronymphe (Tightline): Nur das Vorfach liegt im Wasser, die Fliegenschnur bleibt in der Luft. Rute 9–10 ft, Klasse #2–#4; Rute kurz anheben und führen, um Kontakt zu behalten.");
    notes.push(`Tippet ≈ ${nf(o.depth * 1.2, 1)} m (1,2 × Wassertiefe, mindestens 0,8 m). Fliegen im Abstand von 40–60 cm; Seitenarme (Dropper) 10–15 cm.`);
    notes.push("Der bunte Sighter zeigt den Kontakt an. Die schwerste Fliege (Jig oder Beadhead) kommt an das Ende, die leichtere an einen Seitenarm.");
    notes.push("Anzahl erlaubter Fliegen und Beschwerung vorher in der Gewässerordnung prüfen: je nach Revier gelten Grenzen.");
    return {parts, flies: n, total: parts.reduce((s, p) => s + p.len, 0), ind: .4, notes, title: "Euronymphe"};
  }

  function svg(sp) {
    const W = 600, pad = 14, drawn = sp.parts.filter(p => p.len > 0), total = drawn.reduce((s, p) => s + Math.max(p.len, .25), 0);
    let x = pad, h = `<svg viewBox="0 0 ${W + 2 * pad} 140" role="img" aria-label="Vorfachaufbau ${esc(sp.title)}" class="leader">`;
    sp.parts.forEach(p => {
      if (!p.len) { // Indikator
        h += `<circle cx="${x}" cy="64" r="9" fill="${COL.ind}" stroke="#fff" stroke-width="2"/><text x="${x}" y="40" text-anchor="middle" class="lt">Indikator</text>`;
        return;
      }
      const w = Math.max(p.len, .25) / total * W, y = 64;
      h += `<line x1="${x}" y1="${y}" x2="${x + w}" y2="${y}" stroke="${COL[p.c]}" stroke-width="${Math.max(2, p.d * 12)}" stroke-linecap="round"/>`;
      h += `<text x="${x + w / 2}" y="40" text-anchor="middle" class="lt">${esc(p.n.length > 16 ? p.n.split(" ")[0] : p.n)}</text><text x="${x + w / 2}" y="26" text-anchor="middle" class="lt2">${p.len >= 1 ? nf(p.len, 1) + " m" : cm(p.len) + " cm"}</text><text x="${x + w / 2}" y="100" text-anchor="middle" class="lt2">${nf(p.d, 2)} mm</text>`;
      if (p.fly === "drop") { const dx = x + w - 4; h += `<path d="M${dx} 64v28" stroke="${COL.tip}" stroke-width="2" fill="none"/><path d="M${dx - 4} 92v8c0 6 8 6 8 0" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/>`; }
      if (p.drops && p.drops > 1) { const dx = x + w * .5; h += `<path d="M${dx} 64v28" stroke="${COL.tip}" stroke-width="2" fill="none"/><path d="M${dx - 4} 92v8c0 6 8 6 8 0" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/>`; }
      x += w;
    });
    h += `<path d="M${x + 4} 54v26c0 9 6 12 11 12 6 0 9-4 9-10v-4" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><text x="${x + 14}" y="116" text-anchor="middle" class="lt2">Fliege</text></svg>`;
    return h;
  }

  function calc() {
    const h = +$("#tcHook").value, mat = $("#tcMat").value, type = $("#leaderType").value, x = xFor(h), row = X[x];
    const depth = +$("#tcDepth").value, len = +$("#tcLen").value, flies = +$("#tcFlies").value || 1;
    $("#hookVal").textContent = "#" + h; $("#tcLenV").textContent = nf(len) + " m"; $("#tcDepthV").textContent = nf(depth) + " m";
    $("#fldLen").classList.toggle("hidden", type !== "dry"); $("#fldDepth").classList.toggle("hidden", type === "dry"); $("#fldFlies").classList.toggle("hidden", type === "dry");
    $$("#tcFlies button").forEach(b => { b.disabled = type === "ind" && b.dataset.v === "3"; });
    let nflies = flies; if (type === "ind" && nflies > 2) { nflies = 2; setSeg("tcFlies", "2"); }
    const sp = spec(type, {row, len, depth, flies: nflies, mat});
    const mm = (HOOKS[h] || HOOKS[h + 1] || [0])[0];
    const third = type === "dry" ? ["~" + nf(mm) + " mm", "Länge der Fliege"] : type === "ind" ? [nf(sp.ind, 2) + " m", "Indikator–Fliege"] : ["40 cm", "Sighter"];
    $("#tcTiles").innerHTML = `<div><b>${nf(sp.total, 1)} m</b><span>Gesamtlänge Vorfach</span></div><div><b>${x}X · ${nf(row[1], 2)} mm</b><span>Tippet-Stärke</span></div><div><b>${esc(third[0])}</b><span>${esc(third[1])}</span></div><div><b>${sp.flies}</b><span>${sp.flies === 1 ? "Fliege" : "Fliegen"}</span></div>`;
    $("#leaderSvg").innerHTML = svg(sp);
    const matches = ALL.filter(g => h >= Math.min(...g.hook) && h <= Math.max(...g.hook));
    $("#tcOut").innerHTML = `<h4>Teile und Material</h4><div class="cal-wrap"><table class="cmp"><thead><tr><th>Teil</th><th>Länge</th><th>Durchmesser</th><th>Material</th></tr></thead><tbody>${sp.parts.filter(p => p.len > 0).map(p => `<tr><td>${esc(p.n)}</td><td>${p.len >= 1 ? nf(p.len, 2) + " m" : cm(p.len) + " cm"}</td><td>${nf(p.d, 2)} mm</td><td>${esc(p.mat)}</td></tr>`).join("")}</tbody></table></div>
      <h4>Hinweise zu ${esc(sp.title)}</h4><ul class="mistakes">${sp.notes.map(n => `<li>${esc(n)}</li>`).join("")}</ul>
      <p class="hint">Richtwerte, die je nach Rute, Gewässer und Hersteller abweichen. ${mat === "fc" ? "Fluorocarbon sinkt und ist fast unsichtbar: ideal für Nymphen." : "Nylon schwimmt: gut für Trockenfliegen."} Faustregel: Hakengröße ÷ 3 = X-Stärke.</p>
      <h4>Passt zu ${matches.length} Gruppen in #${h}</h4><div class="pillrow">${matches.slice(0, 14).map(g => `<button type="button" class="pill" data-open="${g.id}">${esc(g.de)}</button>`).join("")}${matches.length > 14 ? `<span class="hint">+ ${matches.length - 14} weitere</span>` : ""}</div>`;
    $("#hookVis").innerHTML = Object.keys(HOOKS).map(Number).sort((a, b) => b - a).map(s => `<span class="hk${s === h ? " cur" : ""}" data-h="${s}"><svg width="${Math.max(12, 70 / (s * .45 + 1))}" viewBox="0 0 40 60" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"><path d="M10 6v34c0 11 6 16 14 16 9 0 12-7 12-14v-6"/></svg>${s}</span>`).join("");
  }
  $("#tipCalc").addEventListener("input", calc);
  $("#tab-tip").addEventListener("click", e => { const b = e.target.closest("[data-open]"); if (b) openGroup(b.dataset.open); const k = e.target.closest(".hk"); if (k) { $("#tcHook").value = k.dataset.h; calc(); } });
  calc();
})();

/* ---------- Bedingungen ---------- */
(function cond() {
  const T = $("#cdTemp");
  const ZONES = [[4, "träge", "bad"], [8, "langsam", "warn"], [16, "optimal", "good"], [20, "gestresst", "warn"], [99, "kritisch", "bad"]];
  function act(t) {
    if (t < 4) return ["träge", "Sehr kalt: die Forellen fressen kaum. Nur in der Tagesmitte, tiefe ruhige Gumpen, kleine Nymphen und Zuckmücken, sehr langsam.", "bad"];
    if (t < 8) return ["langsam", "Kalt: Fische stehen tief und in ruhigem Wasser. Nymphen und Zuckmücken-Muster, besonders mittags.", "warn"];
    if (t <= 15) return ["optimal", "Optimaler Bereich: Fische sind aktiv und fressen an der Oberfläche und am Grund. Alle Methoden möglich.", "good"];
    if (t < 20) return ["gestresst", "Warm: früh und spät fischen, schnelles, sauerstoffreiches Wasser suchen, Fische kurz drillen und schonend zurücksetzen. Äschen reagieren schon ab ca. 18 °C empfindlich.", "warn"];
    return ["Angeln einstellen", "Zu warm: ab etwa 20 °C sind Forellen gestresst und der Sauerstoff wird knapp – das Risiko für Drillverluste ist hoch. Besser pausieren.", "bad"];
  }
  const INS = [["Winter-Steinfliegen, Nemouridae", 0, 8], ["Zuckmücken", 0, 26], ["Baetidae", 4, 16], ["Heptageniidae / Ephemerellidae", 8, 16], ["Grabende (Ephemera)", 9, 16], ["Köcherfliegen", 10, 24], ["Ameisen, Käfer", 12, 26], ["Caenidae / Tricos", 14, 26], ["Heuschrecken, Zikaden", 16, 26]];
  function render() {
    const t = +T.value; $("#cdTempV").textContent = t + " °C"; $("#cdMk").style.left = (t / 26 * 100) + "%";
    const [lbl, txt, cls] = act(t), color = $("#cdColor").value, wx = $("#cdWx").value;
    const colTxt = {klar: "Feines Vorfach (0,12–0,14 mm), natürliche Farben und kleinere Muster, vorsichtig anschleichen.", leicht: "Etwas größere Muster oder Beadheads, Standardvorfach. Gute Bedingungen für Nymphen.", trueb: "Große, dunkle oder kontrastreiche Muster (Woolly Bugger, San Juan Worm), ruhige Ufernähe, kräftigeres Tippet (ab 0,20 mm). Vorsicht beim Waten."}[color];
    const wxTxt = {sonne: "Früh und spät fischen, Schatten nutzen, lange feine Vorfächer; mittags Terrestrials und Tiefwasser-Nymphen.", bedeckt: "Gute Schlupfbedingungen – Eintagsfliegen (besonders Baetis) steigen oft. Trockenfliegen und Emerger probieren.", regen: "Baetis-Schlupf wahrscheinlich; Würmer werden ausgeschwemmt, Wurmmuster funktionieren oft.", wind: "Landinsekten wie Ameisen, Käfer und Hopper am Windufer anbieten; kürzeres, kräftigeres Vorfach."}[wx];
    const ins = INS.filter(([, a, b]) => t >= a && t <= b).map(([n]) => `<span class="chip">${esc(n)}</span>`).join(" ");
    $("#cdOut").innerHTML = `<article class="card-st ${cls}"><div class="reco-k">Forellenaktivität</div><h3>${esc(lbl)}</h3><p>${esc(txt)}</p></article>
      <div class="cards2"><article class="card-s"><h4>Aktive Insekten bei ${t} °C</h4><div class="chiprow">${ins}</div><button class="btn" type="button" data-go="now">Passende Gruppen anzeigen →</button></article>
      <article class="card-s"><h4>Wasserfarbe</h4><p>${esc(colTxt)}</p></article>
      ${wxTxt ? `<article class="card-s"><h4>Wetter</h4><p>${esc(wxTxt)}</p></article>` : ""}</div>
      <p class="hint">Richtwerte für Bach- und Regenbogenforelle; einzelne Gewässer und Arten weichen ab.</p>`;
  }
  $("#condCalc").addEventListener("input", render); render();
  const FT = $("#fTemp");
  T.addEventListener("input", () => { if (FT.value !== T.value) { FT.value = T.value; FT.dispatchEvent(new Event("input", {bubbles: true})); } });
  FT.addEventListener("input", () => { if (T.value !== FT.value) { T.value = FT.value; render(); } });
  $("#tab-cond").addEventListener("click", e => { if (e.target.closest("[data-go]")) return; });
})();

/* ---------- Tab-Hook ---------- */
window.onTab = id => { if (id === "now" && window._renderFinder) _renderFinder(); if (id === "box" && window._drawBox) _drawBox(); };

document.addEventListener("click", e => { const b = e.target.closest("[data-scroll]"); if (b) { const el = document.getElementById(b.dataset.scroll); if (el) el.scrollIntoView({behavior: "smooth", block: "start"}); } });
