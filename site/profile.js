"use strict";
/* Gewässer-Profile */
const RIVERS = [
  {k: "soca", t: "Soča", land: "Slowenien", type: "Alpiner Karstfluss",
   lead: "Smaragdgrüner Alpenfluss in den Julischen Alpen, Heimat der endemischen Marmorataforelle.",
   facts: [["Länge bis Adria", "ca. 140 km"], ["Kern Trockenfliege", "#16–20"], ["Leitfisch", "Marmorata"]],
   water: "Türkis bis glasklar, kalt und sauerstoffreich. Oben Gumpen, Riffles und Schluchten mit viel Taschenwasser zwischen Blöcken, unterhalb von Tolmin ruhiger, ab Most na Soči Stausee.",
   fish: "Marmorata (Soška postrv, einst fast ausgestorben, wird nachgezüchtet), Adriatische Äsche bis etwa 60 cm, Hybriden Marmorata × Bachforelle, stark besetzte Regenbogner, im Unterlauf Bachforelle, dazu Döbel und Barbe.",
   tactics: "Klares, kaltes Wasser mit Taschenwasser: kurze Würfe, Fliege in jede Tasche, Trockenfliegen #16–20 als Kern, Vorfach lang und fein. Bei Hitzewellen gab es Sperren, dann nur früh und spät fischen.",
   rules: "Drei Bewirtschafter (ZZRS, Fischereiverein Tolmin, RD Soča), C&R- und Entnahmezonen. Schonhaken in allen C&R-Revieren und beim Äschenfischen Pflicht. Quellbäche wie Kneža und Koritnica nur Trockenfliege. Lizenz, Zonen, Mindestmaße und Schonzeiten vor der Anreise beim Bewirtschafter prüfen.",
   read: ["pocket", "riffle", "pool"], src: "Quelle: dein Gewässerguide Soča (Recherche-Stand November 2026)", links: []},
  {k: "pliva", t: "Pliva", land: "Bosnien und Herzegowina", type: "Klarer Kalkfluss bei Jajce",
   lead: "Tiefer und breiter als Ribnik und Sanica, mit weniger, aber größeren Fischen.",
   facts: [["Hauptfische", "Bachforelle, Äsche"], ["Regenbogner", "besetzt"], ["Waten", "schwieriger"]],
   water: "Tiefer und breiter als die benachbarten Flüsse, deshalb ist das Waten schwieriger. Die Fliegenstrecke liegt im oberen Teil des Flusses.",
   fish: "Hauptsächlich Bachforelle und Äsche, darunter einige der größten der Region. Regenbogenforellen sind vorhanden, aber besetzt. Äschen gelten in flacherem Wasser als anspruchsvoller als Regenbogner.",
   tactics: "Lange Vorfächer und Geduld. Das Wasser ist klar wie ein Chalkstream, die Fische prüfen jede Fliege genau. Zwischen den Schlupfphasen wirkt das bosnische Nymphenfischen. Im Herbst (September, Oktober) kommen Wolken von Baetis (Blue-winged Olives), abends Spinnerfall.",
   rules: "Die Fischerei wird von lokalen Vereinen betreut (Zlatovčica Jajce, Jezero). Karte, Zonen und Regeln dort erfragen.",
   read: ["pool", "run", "tail"], src: "Quellen: Outfitter- und Reiseberichte, teils allgemein für die bosnischen Flüsse", links: [["Tactical Fly Fisher: Pliva", "https://tacticalflyfisher.com/blogs/default-blog/bloglessons-from-bosnia-session-2-pliva-river"]]},
  {k: "ribnik", t: "Ribnik", land: "Bosnien und Herzegowina", type: "Quellgespeister Kalkfluss",
   lead: "Kleiner, quellgespeister Kalkfluss, bekannt für große Äschen und Bachforellen.",
   facts: [["Tiefe", "Knöchel bis Hüfte"], ["Tippet", "etwa 6X"], ["Highlight", "Spinnerfall abends"]],
   water: "Klein und flach, meist zwischen knöcheltief und hüfttief. Sehr klar, die Fische sieht man oft.",
   fish: "Äschen und Bachforellen, bekannt für Trophäenäschen. Die Fische sind vorsichtig, das Tippet muss fein sein.",
   tactics: "Im Sommer steigen Äschen und Forellen an vielen Eintags-, Stein- und Köcherfliegen-Schlupfphasen. Im Juni gelten Steinfliegen, Köcherfliegen und Eintagsfliegen als typisch. Im September und Oktober gibt es Wolken von Baetis, die auch die großen Fische hochholen. Der abendliche Spinnerfall ist ein Höhepunkt, auch ohne Massenschlupf.",
   rules: "Regeln und Karten der örtlichen Vereine erfragen.",
   read: ["run", "weed", "tail"], src: "Quellen: Outfitter-, Magazin- und Angler-Berichte (allgemeine Schlupfzeiten)", links: [["Ribnik (Wikipedia)", "https://en.wikipedia.org/wiki/Ribnik_(river)"], ["Aardvark McLeod: Dry fly in Bosnia", "https://www.aardvarkmcleod.com/bosnia-dry-fly-fishing-trout-grayling/"]]},
  {k: "sanica", t: "Sanica", land: "Bosnien und Herzegowina", type: "Kleiner Nebenfluss der Sana",
   lead: "Windungsreich, mit überhängenden Bäumen, Krautrinnen und tieferen Pools.",
   facts: [["Fliegen", "bis Größe 24 und kleiner"], ["Tippet", "bis 8X"], ["Fische", "große Äschen"]],
   water: "Klein, mäandrierend, durch Kulturlandschaft mit überhängenden Bäumen. Flache, krautreiche Rinnen und tiefere Pools.",
   fish: "Große Äschen und Bachforellen, die in den tieferen Pools in Gruppen stehen.",
   tactics: "Sehr kleine Fliegen und dünnes Tippet: In Berichten kamen die Fische erst auf Größe 24 und kleiner mit 8X, flussabwärts gefischt. Die flachen Krautrinnen brachten die meisten Fische.",
   rules: "Revier und Regeln lokal erfragen.",
   read: ["weed", "pool", "cut"], src: "Quellen: Angler- und Wettkampfberichte (dünne Datenlage)", links: [["Tactical Fly Fisher: Sanica", "https://tacticalflyfisher.com/blogs/default-blog/blogworld-fly-fishing-championships-2015-session-5-on-the-sanica"]]},
  {k: "sana", t: "Sana", land: "Bosnien und Herzegowina", type: "Größerer Fluss mit Taschenwasser",
   lead: "Größerer Fluss, in den unter anderem der Ribnik mündet. Wechsel aus Taschenwasser und ruhigeren Strecken.",
   facts: [["Fischdichte", "unter Pliva, Sanica"], ["Methoden", "Trocken, Euronymphing"], ["Äschen", "vorhanden"]],
   water: "Nach der Einmündung des Ribnik führt die Sana deutlich mehr Wasser. Es gibt flaches Taschenwasser.",
   fish: "Äschen sind vorhanden (z. B. bei Sanski Most). Insgesamt weniger Fische als in Pliva und Sanica, mehr als im Vrbas (Wettkampfbericht).",
   tactics: "Trockenfliege und Euronymphing, je nach Strecke. Im Taschenwasser kurze, präzise Würfe.",
   rules: "Strecken und Regeln hängen vom Bewirtschafter ab, vor Ort klären.",
   read: ["pocket", "run", "riffle"], src: "Quellen: Wettkampf- und Angler-Berichte (dünne Datenlage)", links: [["Tactical Fly Fisher: Lessons from Bosnia", "https://tacticalflyfisher.com/blogs/default-blog/bloglessons-from-bosnia-session-1"]]},
  {k: "enns", t: "Enns", land: "Österreich (Steiermark)", type: "Alpenfluss mit Blöcken",
   lead: "Fliegenstrecke zwischen Altenmarkt und Großreifling am Ausgang des Gesäuses.",
   facts: [["Strecke", "ca. 8 km"], ["Äsche", "bis 60 cm gelandet"], ["Huchen", "bis 12 kg"]],
   water: "Schnell fließende Abschnitte mit großen Steinblöcken am Grund, dazu ruhigere Strecken.",
   fish: "Äsche (wieder Leitfisch in diesem Abschnitt), Bach- und Regenbogenforelle sowie Huchen. Die Bachforelle fühlt sich in den schnellen, blockreichen Abschnitten besonders wohl.",
   tactics: "Im Blockwasser und an Kanten beschwerte Nymphe oder Dry-Dropper, in ruhigeren Strecken Trockenfliege auf Äsche. Blockreiches, schnelles Wasser entspricht dem Taschenwasser.",
   rules: "Schonzeiten und Mindestmaße gelten pro Revier. Angaben aus anderen Revieren nicht übernehmen: beim Revierbetreiber oder der Fischereibehörde Steiermark nachfragen.",
   read: ["pocket", "seam", "run"], src: "Quelle: Revierbeschreibung der Steiermark-Tourismusseiten", links: [["Gesäuse: Fliegenfischen", "https://www.steiermark.com/de/Gesaeuse/Microsites/GH-Schnabl/Fliegenfischen"]]}
];

(function riverPages() {
  const E = esc; let cur = "soca";
  const habBtn = k => { const h = HABS.find(x => x.k === k); return h ? `<button type="button" class="pill" data-readhab="${k}">${E(h.t.split(" (")[0])}</button>` : ""; };
  function draw() {
    const r = RIVERS.find(x => x.k === cur);
    $("#rvBtns").innerHTML = RIVERS.map(x => `<button type="button" class="pill ${x.k === cur ? "on" : ""}" data-rv="${x.k}" aria-pressed="${x.k === cur}">${E(x.t)}</button>`).join("");
    $("#rvCard").innerHTML = `<article class="stage-card"><div class="st-h"><h3>${E(r.t)} <span class="mono">· ${E(r.land)}</span></h3><span class="chip">${E(r.type)}</span></div>
      <p class="lead2">${E(r.lead)}</p>
      <div class="tiles">${r.facts.map(f => `<div><b>${E(f[1])}</b><span>${E(f[0])}</span></div>`).join("")}</div>
      <h4>Das Wasser</h4><p>${E(r.water)}</p>
      <h4>Fische</h4><p>${E(r.fish)}</p>
      <h4>Taktik und Insekten</h4><p>${E(r.tactics)}</p>
      <div class="pillrow"><button type="button" class="pill" data-go="mayfly">Eintagsfliegen</button><button type="button" class="pill" data-go="caddis">Köcherfliegen</button><button type="button" class="pill" data-go="stone">Steinfliegen</button></div>
      <h4>Typische Bereiche (Gewässer lesen)</h4><div class="pillrow">${r.read.map(habBtn).join("")}</div>
      <div class="flowhl"><b>Regeln:</b> ${E(r.rules)}</div>
      <p class="hint">${E(r.src)}${r.links.length ? " · " + r.links.map(l => `<a href="${E(l[1])}" target="_blank" rel="noopener">${E(l[0])}</a>`).join(" · ") : ""}</p></article>`;
  }
  $("#tab-rivers").innerHTML = `<div class="page-head"><h2>Gewässer-Profile</h2><p>Soča, Pliva, Ribnik, Sanica, Sana und Enns: Charakter, Fische, Taktik und typische Wasserbereiche. Die Insektenangaben gelten allgemein für die Region, nicht als gemessener Schlupfkalender.</p></div>
    <div class="pillrow" id="rvBtns"></div><div id="rvCard"></div>`;
  $("#tab-rivers").addEventListener("click", e => {
    const a = e.target.closest("[data-rv]"); if (a) { cur = a.dataset.rv; draw(); return; }
    const h = e.target.closest("[data-readhab]"); if (h) { showTab("read"); const b = document.querySelector('#habBtns [data-hab="' + h.dataset.readhab + '"]'); if (b) b.click(); }
  });
  draw();
})();
