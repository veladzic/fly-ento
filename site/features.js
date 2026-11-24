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

/* ---------- Jetzt am Wasser ---------- */
(function finder() {
  const f = {m: $("#fMonth"), h: $("#fHemi"), r: $("#fRegion"), w: $("#fWater"), t: $("#fTime"), wx: $("#fWeather"), temp: $("#fTemp"), tv: $("#fTempV")};
  monthOpts(f.m);
  f.r.innerHTML = `<option value="">egal / Mitteleuropa</option>` + REGIONS.map(r => `<option value="${r.k}">${esc(r.short)}</option>`).join("");
  const TIME_RX = {morgen: /morgen|ganzt|tag(?!es)|vormittag/, mittag: /mittag|ganzt|tag(?!es)/, nachmittag: /nachmittag|mittag|ganzt|tag(?!es)/, abend: /abend|dämmerung|ganzt/, nacht: /nacht|dämmerung/};
  const dayHit = (g, t) => { const d = g.day.toLowerCase(); if (t === "morgen" && /morgen/.test(d)) return true; return TIME_RX[t].test(d) && !(t === "nacht" && !/nacht|dämm/.test(d)); };
  const COLD = new Set(["capniidae", "nemouridae", "taeniopterygidae", "leuctridae"]);
  const WARM_LAND = new Set(["caelifera", "cicadidae", "tettigonia", "gryllus", "isoptera"]);
  function score(g) {
    const sIdx = (+f.m.value + (f.h.value === "S" ? 6 : 0)) % 12, season = g.season[sIdx];
    if (!season) return null;
    const why = [], t = +f.temp.value, o = g.order, br = g.branch;
    let s = season * 4; why.push(["Saison", ["", "möglich", "Hauptzeit", "Hochsaison"][season]]);
    if (f.w.value) { if (g.water === f.w.value || g.water === "beides") { s += 2; why.push(["Gewässer", "passt"]); } else s -= 6; }
    if (f.t.value) { if (dayHit(g, f.t.value)) { s += 3; why.push(["Tageszeit", "passt"]); } else s -= 2; }
    // Temperatur
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
    // Wetter
    const wx = f.wx.value;
    if (wx === "wind" && br === "land") { s += 3; why.push(["Wetter", "Wind bringt Landinsekten"]); }
    if (wx === "sonnig" && br === "land") s += 1;
    if (wx === "sonnig" && o === "odonata") s += 2;
    if (wx === "regen" && (g.id === "baetidae" || g.id === "midge_pupa")) { s += 3; why.push(["Wetter", "mag trübes, nasses Wetter"]); }
    if (wx === "regen" && br === "land" && g.id !== "midge_larva") s -= 1;
    if (wx === "bewoelkt" && o === "mayfly") { s += 2; why.push(["Wetter", "bedeckt = guter Schlupf"]); }
    // Region
    if (f.r.value) { const geo = g.geo[f.r.value]; if (!geo) return null; s *= geo / 3; if (geo === 3) why.push(["Region", "Schwerpunkt"]); }
    return s > 0 ? {g, s, why} : null;
  }
  function render() {
    f.tv.textContent = f.temp.value + " °C";
    const res = ALL.map(score).filter(Boolean).sort((a, b) => b.s - a.s).slice(0, 8);
    const grid = $("#nowGrid"), sum = $("#nowSum");
    if (!res.length) { sum.textContent = "Keine passenden Gruppen – Filter lockern."; grid.innerHTML = ""; return; }
    const top = res[0].g, mid = hookMid(top);
    sum.innerHTML = `<b>Beste Wahl:</b> ${esc(top.de)} <span class="mono">(${esc(top.lat)})</span> · Haken ${esc(hookTxt(top))} · Muster ${top.flies.slice(0, 3).map(esc).join(", ")} · Tippet etwa <b>${xFor(mid)}X</b>.`;
    const max = res[0].s;
    grid.innerHTML = res.map((r, i) => { const g = r.g;
      return `<article class="now-card"><div class="rk">${i + 1}</div><div><h3>${esc(g.de)} <span class="mono">${esc(g.lat)}</span></h3>
      <div class="rankbar"><i style="width:${Math.max(8, r.s / max * 100)}%"></i></div>
      <div class="chiprow">${r.why.map(w => `<span class="chip">${esc(w[0])}: ${esc(w[1])}</span>`).join("")}</div>
      <p>Haken <b>${esc(hookTxt(g))}</b> · Tippet ~${xFor(hookMid(g))}X · Muster: ${g.flies.map(esc).join(", ")}</p><p class="tp">${esc(g.tip)}</p>
      <button class="btn" type="button" data-open="${g.id}">Details &amp; Untergruppen</button></div></article>`; }).join("");
  }
  $("#finder").addEventListener("input", render);
  $("#nowGrid").addEventListener("click", e => { const b = e.target.closest("[data-open]"); if (b) openGroup(b.dataset.open); });
  window._renderFinder = render; render();
})();

/* ---------- Binderezepte ---------- */
(function recipes() {
  const types = ["Alle", ...new Set(RECIPES.map(r => r.type))];
  let cur = "Alle";
  const drawChips = () => $("#recFilter").innerHTML = types.map(t => `<button class="chip-btn${t === cur ? " on" : ""}" data-t="${esc(t)}">${esc(t)}</button>`).join("");
  const card = r => `<article class="rec" id="r-${r.id}"><header><span class="chip">${esc(r.type)}</span><h3>${esc(r.name)}</h3><p class="hint">Haken: ${esc(r.hook)} · Faden: ${esc(r.thread)}</p></header>
   <h4>Material</h4><dl class="parts">${r.parts.map(p => `<div><dt>${esc(p[0])}</dt><dd>${esc(p[1])}</dd></div>`).join("")}</dl>
   <h4>Bindeschritte</h4><ol>${r.steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol>
   <p class="tp"><b>Tipp:</b> ${esc(r.tip)}</p>
   <h4>Imitiert</h4><div class="pillrow">${r.groups.map(id => `<button type="button" class="pill" data-open="${id}">${esc(GROUP_BY_ID[id].de)}</button>`).join("")}</div></article>`;
  const draw = () => { drawChips(); $("#recGrid").innerHTML = RECIPES.filter(r => cur === "Alle" || r.type === cur).map(card).join(""); };
  $("#recFilter").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { cur = b.dataset.t; draw(); } });
  $("#recGrid").addEventListener("click", e => { const b = e.target.closest("[data-open]"); if (b) openGroup(b.dataset.open); });
  window._drawRecipes = draw; draw();
  // Gruppen-Dialog um Rezepte ergänzen
  const _og = openGroup;
  openGroup = function (id) {
    _og(id);
    const list = RECIPE_BY_GROUP[id]; if (!list) return;
    const acts = $("#dlgBody .actions"); if (!acts) return;
    acts.insertAdjacentHTML("beforebegin", `<h4>Binderezepte</h4><div class="pillrow">${list.map(r => `<button type="button" class="pill" data-rec="${r.id}">${esc(r.name)}</button>`).join("")}</div>`);
  };
  $("#dlg").addEventListener("click", e => {
    const b = e.target.closest("[data-rec]"); if (!b) return;
    closeDlg(); cur = "Alle"; showTab("rec");
    const el = document.getElementById("r-" + b.dataset.rec); if (el) { el.scrollIntoView({block: "start"}); el.classList.add("flash"); setTimeout(() => el.classList.remove("flash"), 1800); }
  });
})();

/* ---------- Meine Box & Fangbuch ---------- */
(function box() {
  const patterns = new Map();     // Muster -> Gruppen-IDs
  ALL.forEach(g => g.flies.forEach(n => { if (!patterns.has(n)) patterns.set(n, []); patterns.get(n).push(g.id); }));
  $("#flyList").innerHTML = [...patterns.keys()].sort().map(n => `<option value="${esc(n)}">`).join("");
  let inBox = new Set(store.get("flyento.box", [])), log = store.get("flyento.log", []);
  const saveBox = () => store.set("flyento.box", [...inBox]);
  const saveLog = () => store.set("flyento.log", log);
  monthOpts($("#boxMonth"));
  $("#lDate").value = new Date().toISOString().slice(0, 10);

  function drawBox() {
    const q = $("#boxQ").value.trim().toLowerCase();
    let h = "";
    DATA.forEach(b => b.orders.forEach(o => {
      const names = [...new Set(o.groups.flatMap(g => g.flies))].filter(n => !q || n.toLowerCase().includes(q));
      if (!names.length) return;
      h += `<fieldset><legend>${esc(o.de)}</legend>${names.map(n => `<label class="ck"><input type="checkbox" data-p="${esc(n)}"${inBox.has(n) ? " checked" : ""}> ${esc(n)}</label>`).join("")}</fieldset>`;
    }));
    $("#boxList").innerHTML = h || `<p class="hint">Kein Muster gefunden.</p>`;
    $("#boxCount").textContent = `${[...inBox].filter(n => patterns.has(n)).length} von ${patterns.size} Mustern in der Box`;
    drawMissing();
  }
  function drawMissing() {
    const m = +$("#boxMonth").value;
    const gs = ALL.filter(g => g.season[m] >= 2).sort((a, b) => b.season[m] - a.season[m]).slice(0, 12);
    $("#boxMissing").innerHTML = gs.map(g => {
      const have = g.flies.filter(n => inBox.has(n)), miss = g.flies.filter(n => !inBox.has(n));
      return `<div class="miss ${have.length ? "ok" : "no"}"><div><b>${esc(g.de)}</b> <span class="mono">${esc(hookTxt(g))}</span></div>
      <div>${have.length ? `<span class="chip">in der Box: ${have.map(esc).join(", ")}</span>` : `<span class="chip warn">nichts dabei</span>`}</div>
      ${miss.length ? `<div class="pillrow">${miss.map(n => `<button class="pill" type="button" data-add="${esc(n)}" title="In die Box legen">+ ${esc(n)}</button>`).join("")}</div>` : ""}</div>`; }).join("") || `<p class="hint">Keine Hauptgruppen in diesem Monat.</p>`;
  }
  $("#boxList").addEventListener("change", e => { const c = e.target.closest("input[data-p]"); if (!c) return; c.checked ? inBox.add(c.dataset.p) : inBox.delete(c.dataset.p); saveBox(); $("#boxCount").textContent = `${[...inBox].filter(n => patterns.has(n)).length} von ${patterns.size} Mustern in der Box`; drawMissing(); });
  $("#boxMissing").addEventListener("click", e => { const b = e.target.closest("[data-add]"); if (b) { inBox.add(b.dataset.add); saveBox(); drawBox(); } });
  $("#boxQ").addEventListener("input", drawBox);
  $("#boxMonth").addEventListener("change", drawMissing);

  /* Fangbuch */
  const msg = t => { $("#logMsg").textContent = t; };
  function drawLog() {
    const rows = [...log].sort((a, b) => b.date.localeCompare(a.date));
    $("#logTable").innerHTML = rows.length ? `<thead><tr><th>Datum</th><th>Gewässer</th><th>Fisch</th><th>cm</th><th>Muster</th><th>Haken</th><th>°C</th><th>Notiz</th><th></th></tr></thead><tbody>${rows.map(r => `<tr><td>${esc(r.date)}</td><td>${esc(r.water)}</td><td>${esc(r.fish)}</td><td>${esc(r.len || "")}</td><td>${esc(r.fly)}</td><td>${esc(r.hook || "")}</td><td>${esc(r.temp || "")}</td><td>${esc(r.note || "")}</td><td><button class="btn sm" type="button" data-del="${r.id}" aria-label="Eintrag löschen">×</button></td></tr>`).join("")}</tbody>` : `<tbody><tr><td class="hint">Noch keine Einträge. Trage deinen ersten Fang ein.</td></tr></tbody>`;
    const cnt = a => { const m = {}; a.forEach(x => { if (x) m[x] = (m[x] || 0) + 1; }); return Object.entries(m).sort((a, b) => b[1] - a[1])[0]; };
    if (!log.length) { $("#logStats").innerHTML = ""; return; }
    const big = log.filter(r => r.len).sort((a, b) => b.len - a.len)[0], tp = cnt(log.map(r => r.fly)), tw = cnt(log.map(r => r.water)), tm = cnt(log.map(r => MONTHS_LONG[+r.date.slice(5, 7) - 1]));
    $("#logStats").innerHTML = [[log.length, "Fänge"], [big ? big.len + " cm" : "–", "größter Fisch"], [tp ? tp[0] : "–", "Top-Muster" + (tp ? ` (${tp[1]}×)` : "")], [tw ? tw[0] : "–", "Top-Gewässer"], [tm ? tm[0] : "–", "bester Monat"]].map(([a, b]) => `<div><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join("");
  }
  $("#logForm").addEventListener("submit", e => {
    e.preventDefault();
    const r = {id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), date: $("#lDate").value, water: $("#lWater").value.trim(), fish: $("#lFish").value, len: $("#lLen").value, fly: $("#lFly").value.trim(), hook: $("#lHook").value, temp: $("#lTemp").value, note: $("#lNote").value.trim()};
    if (!r.date || !r.water || !r.fly) return;
    log.push(r); const ok = saveLog(); drawLog(); msg(ok ? "Fang eingetragen." : "Gespeichert nur für diese Sitzung: der Browser blockiert den Speicher.");
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
  window._drawBox = () => { drawBox(); drawLog(); }; drawBox(); drawLog();
})();

/* ---------- Tippet-Rechner ---------- */
(function tippet() {
  const X = [[0, .28, 5.0], [1, .25, 4.0], [2, .23, 3.5], [3, .20, 3.0], [4, .18, 2.4], [5, .15, 1.9], [6, .13, 1.5], [7, .10, 1.1], [8, .08, 0.8]];
  const hooks = []; for (let h = 4; h <= 26; h += 2) hooks.push(h);
  $("#tcHook").innerHTML = hooks.map(h => `<option value="${h}"${h === 14 ? " selected" : ""}>#${h}</option>`).join("");
  $("#xTable").innerHTML = `<thead><tr><th>Stärke</th><th>Durchmesser</th><th>Tragkraft Nylon (ca.)</th><th>Typische Hakengröße</th></tr></thead><tbody>${X.map(([x, d, kg]) => `<tr><td>${x}X</td><td>${d.toFixed(2)} mm</td><td>${kg.toFixed(1)} kg</td><td>#${[2, 4, 6, 8, 12, 15, 18, 21, 24][x]}${x >= 3 ? "" : ""}</td></tr>`).join("")}</tbody>`;
  function calc() {
    const h = +$("#tcHook").value, x = xFor(h), len = +$("#tcLen").value || 2.7, mat = $("#tcMat").value, row = X[x];
    const butt = len * .6, mid = len * .2, tip = len * .2;
    $("#tcOut").innerHTML = `<p><b>Empfohlene Spitze (Tippet): ${x}X</b> · ${row[1].toFixed(2)} mm · ca. ${row[2].toFixed(1)} kg Tragkraft (Nylon).</p>
    <p>Aufbau nach der 60/20/20-Regel für ${len.toFixed(1)} m: <b>${butt.toFixed(2)} m</b> Basis (ca. 0,40–0,50 mm), <b>${mid.toFixed(2)} m</b> Mittelstück (ca. 0,28–0,30 mm), <b>${tip.toFixed(2)} m</b> Tippet (${x}X).</p>
    <p class="hint">${mat === "fc" ? "Fluorocarbon sinkt, ist steifer und fast unsichtbar: ideal für Nymphen und Tippet. Bei gleicher X-Angabe oft etwas dünner und stärker als Nylon." : "Nylon schwimmt und dehnt sich: gut für Trockenfliegen."} Faustregel: Hakengröße ÷ 3 = X-Stärke. Tippet nach jedem Fliegenwechsel kürzen und unter ca. 30 cm ersetzen.</p>`;
  }
  $("#tipCalc").addEventListener("input", calc); calc();
})();

/* ---------- Wassertemperatur & Bedingungen ---------- */
(function cond() {
  const T = $("#cdTemp");
  function act(t) {
    if (t < 4) return ["träge", "Sehr kalt: die Forellen fressen kaum. Nur in der Tagesmitte, tiefe ruhige Gumpen, kleine Nymphen und Zuckmücken, sehr langsam."];
    if (t < 8) return ["langsam", "Kalt: Fische stehen tief und in ruhigem Wasser. Nymphen und Zuckmücken-Muster, besonders mittags."];
    if (t <= 15) return ["optimal", "Optimaler Bereich: Fische sind aktiv und fressen an der Oberfläche und am Grund. Alle Methoden möglich."];
    if (t < 20) return ["gestresst", "Warm: früh und spät fischen, schnelles, sauerstoffreiches Wasser suchen, Fische kurz drillen und schonend zurücksetzen. Äschen reagieren schon ab ca. 18 °C empfindlich."];
    return ["Angeln einstellen", "Zu warm: ab etwa 20 °C sind Forellen gestresst und der Sauerstoff wird knapp – das Risiko für Drillverluste ist hoch. Besser pausieren."];
  }
  const INS = [["Winter-Steinfliegen, Nemouridae", 0, 8], ["Zuckmücken", 0, 26], ["Baetidae", 4, 16], ["Heptageniidae / Ephemerellidae", 8, 16], ["Grabende (Ephemera)", 9, 16], ["Köcherfliegen", 10, 24], ["Ameisen, Käfer", 12, 26], ["Caenidae / Tricos", 14, 26], ["Heuschrecken, Zikaden", 16, 26]];
  function render() {
    const t = +T.value; $("#cdTempV").textContent = t + " °C";
    const [lbl, txt] = act(t), color = $("#cdColor").value, wx = $("#cdWx").value;
    const colTxt = {klar: "Klares Wasser: feines Vorfach (0,12–0,14 mm), natürliche Farben und kleinere Muster, vorsichtig anschleichen.", leicht: "Leicht getrübt: etwas größere Muster oder Beadheads, Standardvorfach. Gute Bedingungen für Nymphen.", trueb: "Stark getrübt oder Hochwasser: große, dunkle oder kontrastreiche Muster (Woolly Bugger, San Juan Worm), ruhige Ufernähe, kräftigeres Tippet (ab 0,20 mm). Vorsicht beim Waten."}[color];
    const wxTxt = {sonne: "Hell und sonnig: früh und spät fischen, Schatten nutzen, lange feine Vorfächer; mittags Terrestrials und Tiefwasser-Nymphen.", bedeckt: "Bedeckt: gute Schlupfbedingungen – Eintagsfliegen (besonders Baetis) steigen oft. Trockenfliegen und Emerger probieren.", regen: "Regen/Nieselregen: Baetis-Schlupf wahrscheinlich; Würmer werden ausgeschwemmt, Wurmmuster funktionieren oft.", wind: "Wind: Landinsekten wie Ameisen, Käfer und Hopper am Windufer anbieten; kürzeres, kräftigeres Vorfach."}[wx] || "";
    const act2 = INS.filter(([, a, b]) => t >= a && t <= b).map(([n]) => `<span class="chip">${esc(n)}</span>`).join(" ");
    $("#cdOut").innerHTML = `<p class="stat ${t >= 20 ? "bad" : t >= 16 ? "warn" : "good"}"><b>Forellenaktivität: ${esc(lbl)}</b> – ${esc(txt)}</p><p><b>Insekten, die bei dieser Temperatur aktiv sind:</b><br>${act2}</p><p>${esc(colTxt)}</p>${wxTxt ? `<p>${esc(wxTxt)}</p>` : ""}<p class="hint">Richtwerte für Bachforelle/Regenbogenforelle; einzelne Gewässer und Arten weichen ab.</p>`;
  }
  $("#condCalc").addEventListener("input", render); render();
})();

/* ---------- Tab-Hook ---------- */
window.onTab = id => { if (id === "now" && window._renderFinder) _renderFinder(); if (id === "box" && window._drawBox) _drawBox(); };
