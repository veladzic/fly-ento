"use strict";
/* Ausführliche Seiten: Eintagsfliegen, Köcherfliegen, Steinfliegen */

const DEEP = {
mayfly: {
  orderId: "mayfly", title: "Eintagsfliegen", en: "Mayflies", lat: "Ephemeroptera", icon: "ins_ephemeroptera.jpg",
  lead: "Das Herzstück des Fliegenfischens: Sie schlüpfen in Massen, treiben hilflos im Film und lösen die berühmtesten Steigphasen aus. Als einzige Insekten haben sie zwei geflügelte Stadien: Dun und Spinner.",
  facts: [["Verwandlung", "unvollständig, mit Dun-Stadium"], ["Larvenzeit", "meist 1 Jahr, manche 2"], ["Adulte", "Stunden bis wenige Tage"], ["Schwanzfäden", "2–3, sehr lang"], ["Haken", "#8–26"], ["Hauptsaison", "März–Oktober, Spitze Mai–Juni"]],
  stages: [
    {k: "ei", t: "Ei", when: "Sommer bis Herbst", look: ["Winzig, in Klumpen oder Streifen", "Sinkt auf den Grund"],
     behavior: "Die Weibchen lassen die Eier im Flug fallen, tauchen den Hinterleib ein oder setzen sich aufs Wasser. Danach sterben sie, der Spinnerfall beginnt. Je nach Art schlüpfen die Larven nach Wochen oder erst nach einer Ruhephase.",
     fish: {how: "Nicht direkt befischbar. Der Eiablageflug kündigt den Spinnerfall an: Beobachte die tanzenden Schwärme am Ufer.", depth: "–", flies: [], hook: "–"}, pics: []},
    {k: "nymph", t: "Nymphe", when: "ganzjährig, 1–2 Jahre", look: ["3 (selten 2) Schwanzfäden", "Kiemenblättchen seitlich am Hinterleib", "Nur 1 Kralle pro Fuß", "Flügelscheiden auf dem Rücken"],
     behavior: "Die Nymphe lebt am Grund, zwischen Steinen, Pflanzen oder im Sediment. Je nach Lebensweise unterscheidet man Schwimmer, Kriecher, Klammerer und Grabende (siehe Tabelle unten). Vor dem Schlupf wird sie unruhig und driftet.",
     fish: {how: "Dead Drift knapp über dem Grund, Dropper unter einer Trockenfliege, bei Schlupf höher im Wasser.", depth: "Grundnah bis Mittelwasser", flies: ["Pheasant Tail Nymph", "Gold Ribbed Hare’s Ear"], hook: "#12–18"}, pics: ["ins_ephemerellidae.jpg", "fly_schwimmer.jpg", "fly_kriecher.jpg"]},
    {k: "aufstieg", t: "Aufstieg & Emerger", when: "Beginn des Schlupfs", look: ["Haut platzt im Film oder knapp darunter", "Ein Teil steckt noch in der Nymphenhaut"],
     behavior: "Die Nymphe löst sich vom Grund, treibt oder schwimmt nach oben und häutet sich am Oberflächenfilm. Dies ist der verletzlichste Moment: Die Fische nehmen oft gezielt Emerger und lassen schon fertige Duns durch.",
     fish: {how: "Emerger im Film, Soft Hackle mit leichtem Schwung am Ende der Drift. Wenn Fische steigen, aber keine Duns zu sehen sind: ein Emerger!", depth: "Film bis 10 cm", flies: ["Klinkhamer Special", "Partridge & Orange", "CDC Emerger"], hook: "#12–20"}, pics: []},
    {k: "dun", t: "Dun (Subimago)", when: "je nach Art Vormittag bis Abend", look: ["Matt, oft dunkler gefärbt", "Flügel aufrecht wie Segel", "Kürzere Schwanzfäden als der Spinner"],
     behavior: "Der Dun treibt Sekunden bis Minuten flugunfähig und fliegt dann zur Ufervegetation, wo er sich zum Spinner häutet. Baetis schlüpft oft mittags, Kriecher und Grabende abends.",
     fish: {how: "Trockenfliege dragfrei, Parachute oder Comparadun. Auf gezielt steigende Einzelfische anspielen. Feines Tippet (5X–6X).", depth: "Oberfläche", flies: ["Adams", "Parachute BWO", "Comparadun"], hook: "#12–20"}, pics: ["ins_ephemeroptera.jpg", "fly_sumpfeintagsfliegen.jpg"]},
    {k: "spinner", t: "Spinner (Imago)", when: "Abend und Morgen", look: ["Glänzender Körper, klare Flügel", "Sehr lange Schwanzfäden", "Nach der Eiablage: Flügel flach im Film (spent)"],
     behavior: "Spinner paaren sich im Tanzflug über Wasser oder Ufer, die Weibchen legen Eier und fallen erschöpft aufs Wasser. Der Spinnerfall ist oft intensiver als der Schlupf. Die Fische steigen dabei sanft und gleichmäßig („sipping“).",
     fish: {how: "Spent-Spinner flach im Film, möglichst nah an die Fische anspielen. Wenn Duns verschmäht werden, aber viele leise Ringe auftreten: Spinnerfall!", depth: "Oberfläche", flies: ["CDC Spent Spinner", "Rusty Spinner"], hook: "#14–22"}, pics: ["ins_caenidae.jpg", "fly_kleine-weisse.jpg"]}
  ],
  types: {title: "Nymphen-Typen", cols: ["Typ", "Körperform", "Lebensraum", "Familien", "Muster"], rows: [
    ["Schwimmer", "Torpedoförmig, schlank", "Strömung, Kraut, Kies", "Baetidae, Siphlonuridae", "Pheasant Tail #14–20"],
    ["Kriecher", "Robust, ruppig", "Zwischen Steinen, Laub, Sediment", "Ephemerellidae, Leptophlebiidae, Caenidae", "Hare’s Ear #12–18"],
    ["Klammerer", "Flach und breit", "Starke Strömung, Unterseite von Steinen", "Heptageniidae", "March Brown Nymph #10–16"],
    ["Grabende", "Zylindrisch, kräftige Grabzähne", "Sand und Schlamm", "Ephemeridae, Polymitarcyidae", "Danica Nymph #8–12 (lang)"]]},
  mistakes: ["Dun-Muster am Abend, obwohl ein Spinnerfall läuft: Fische ignorieren den Dun.", "Zu grobes Tippet bei ruhigem, klarem Wasser – ein 6X (0,13 mm) rettet viele Drifts.", "Dragfreie Drift vernachlässigt: schon ein kleiner Zug lässt den Fisch abdrehen.", "Nur Trockenfliege gefischt, obwohl die Fische Emerger nehmen: dann zeigen Ringe ohne sichtbare Duns an."]},

caddis: {
  orderId: "caddis", title: "Köcherfliegen", en: "Caddisflies · Sedges", lat: "Trichoptera", icon: "ins_trichoptera.jpg",
  lead: "Die zweite Hauptnahrung der Forellen: ganzjährig als Larve am Grund, im Sommer als Puppe und als schnelle Adulte an der Oberfläche. Ihr Schlupf ist schneller und hektischer als der der Eintagsfliegen.",
  facts: [["Verwandlung", "vollständig: Larve → Puppe → Adult"], ["Larvenzeit", "meist 1 Jahr"], ["Adulte", "bis zu mehreren Wochen"], ["Schwanzfäden", "keine"], ["Haken", "#8–22"], ["Hauptsaison", "April–Oktober, Spitze Juni–September"]],
  stages: [
    {k: "ei", t: "Ei", when: "Sommer bis Herbst", look: ["In Gallertpaketen", "An Steinen oder Pflanzen"],
     behavior: "Die Weibchen tauchen zur Eiablage teils bis zum Grund, laufen unter Wasser oder lassen die Eier aus der Luft fallen. Beim Abtauchen trägt eine Luftschicht die Weibchen wie ein silbernes Blasenkleid.",
     fish: {how: "Nicht direkt befischbar. Beobachte tauchende oder skatende Weibchen: dann ist die Eiablage in vollem Gang.", depth: "–", flies: [], hook: "–"}, pics: []},
    {k: "larve", t: "Larve", when: "ganzjährig", look: ["Raupenartig, 3 Beinpaare vorn", "Kleine Haken am Hinterende", "Oft in einem Köcher aus Steinchen, Sand, Holz oder Pflanzen"],
     behavior: "Köcherbauer ziehen ihr Gehäuse mit sich, Netzbauer spinnen Fangnetze in der Strömung, freilebende Larven jagen räuberisch ohne Köcher. Bei Hochwasser und Schlupf-Drift werden viele Larven abgespült.",
     fish: {how: "Dead Drift am Grund (Czech Nymph, Euronymphe), bei Köcherlarven auch langsam am Grund führen.", depth: "Grundnah", flies: ["Peeping Caddis", "Czech Nymph", "Green Caddis Larva"], hook: "#8–16"}, pics: ["ins_limnephilidae.jpg", "fly_kocherbauer.jpg", "fly_freilebende.jpg"]},
    {k: "puppe", t: "Puppe & Aufstieg", when: "vor dem Schlupf", look: ["Ruderbeine zum Schwimmen", "Flügelscheiden und lange Fühler", "Oft von Luftbläschen glänzend"],
     behavior: "Im verschlossenen Köcher oder Kokon verpuppt sich die Larve. Die reife Puppe schneidet sich frei, steigt schnell zur Oberfläche und wird dabei von Fischen gejagt. An der Oberfläche platzt die Haut, und das Adult schlüpft in Sekunden.",
     fish: {how: "Puppenmuster in Aufstiegsstrecken: schwingen lassen und am Ende leicht anheben (Lift). Dropper unter Trockenfliege.", depth: "Mittelwasser bis Film", flies: ["Sparkle Pupa", "Partridge & Orange", "Impostor Pupa"], hook: "#12–18"}, pics: ["fly_netzbauer.jpg"]},
    {k: "adult", t: "Adult", when: "Abend bis Nacht", look: ["Flügel dachförmig, behaart", "Sehr lange Fühler", "Keine Schwanzfäden"],
     behavior: "Die Adulten laufen und flattern über die Oberfläche („skitten“). Das provoziert wilde Bisse. Tagsüber sitzen sie in der Ufervegetation, abends und nachts fliegen die Weibchen zur Eiablage aufs Wasser. Viele Arten sind nachtaktiv.",
     fish: {how: "Trockenfliege (Elk Hair Caddis) skaten oder zupfen, in der Dämmerung auch größere Sedges. Hier ist Drag erwünscht.", depth: "Oberfläche", flies: ["Elk Hair Caddis", "Goddard Caddis", "Deer Hair Sedge"], hook: "#8–18"}, pics: ["ins_trichoptera.jpg", "fly_grannom.jpg", "fly_welshman-s-button.jpg"]}
  ],
  types: {title: "Larven-Typen", cols: ["Typ", "Larve", "Lebensraum", "Familien", "Muster"], rows: [
    ["Köcherbauer", "Gehäuse aus Steinchen, Sand, Pflanzen", "Bäche und Seen", "Limnephilidae, Sericostomatidae, Leptoceridae, Phryganeidae", "Peeping Caddis #8–14"],
    ["Netzbauer", "Freilebend, grünlich bis gelb", "Strömung, Kiesbänke", "Hydropsychidae, Polycentropodidae", "Czech Nymph #12–16"],
    ["Freilebende Räuber", "Leuchtend grün, ohne Köcher", "Schnelle Bäche", "Rhyacophilidae", "Green Caddis Larva #10–14"],
    ["Sattel-Köcher", "Kuppelförmiger Steinköcher", "Starke Strömung", "Glossosomatidae", "Kleine Larve #16–18"],
    ["Mikro-Köcher", "Winzig, flacher Köcher", "Bäche und Seen", "Hydroptilidae", "Micro Pupa #18–22"]]},
  mistakes: ["Nur Adult-Muster am Abend, obwohl die Fische die aufsteigende Puppe nehmen.", "Zu ruhige Drift: aktive Adulte brauchen Bewegung, also zupfen oder skaten.", "Puppenmuster ohne Glanz: Luftbläschen sind ein Schlüsselreiz, daher Antron oder CDC.", "Dämmerung verpasst: viele Sedges schlüpfen erst nach Sonnenuntergang."]},

stone: {
  orderId: "stone", title: "Steinfliegen", en: "Stoneflies", lat: "Plecoptera", icon: "ins_plecoptera.jpg",
  lead: "Zeiger für sauberes, kaltes, sauerstoffreiches Wasser. Die großen Steinfliegen sind das ganze Jahr ein fetter Happen, und ihr Schlupf ist am Ufer.",
  facts: [["Verwandlung", "unvollständig, ohne Puppe"], ["Nymphenzeit", "1–3 Jahre (große Arten)"], ["Adulte", "1–3 Wochen"], ["Schwanzfäden", "2, kurz und kräftig"], ["Haken", "#4–18"], ["Hauptsaison", "ganzjährig, große Arten Mai–Juli"]],
  stages: [
    {k: "ei", t: "Ei", when: "Sommer", look: ["Dunkle Eipakete am Hinterleib der Weibchen"],
     behavior: "Die Weibchen tragen die Eier am Hinterleib und tupfen sie beim Überfliegen oder Sitzen auf das Wasser. Die Larven schlüpfen nach Wochen.",
     fish: {how: "Nicht direkt befischbar. Eiablageflüge am Abend deuten auf aktive Fische.", depth: "–", flies: [], hook: "–"}, pics: []},
    {k: "nymph", t: "Nymphe", when: "ganzjährig, 1–3 Jahre", look: ["2 Schwanzfäden", "2 Krallen pro Fuß", "Breit, flach, kräftige Beine", "Flügelscheiden parallel"],
     behavior: "Steinfliegennymphen leben unter Steinen und in Kies. Sie sind schlechte Schwimmer und werden bei Hochwasser leicht abgespült. Vor dem Schlupf wandern sie zum Ufer.",
     fish: {how: "Schwere Nymphe knapp über dem Grund, Dead Drift an Steinen; vor dem Schlupf zum Ufer führen, Ufernähe befischen.", depth: "Grund, Ufer", flies: ["Pat’s Rubber Legs", "Kaufman’s Stone", "Golden Stone Nymph"], hook: "#4–12"}, pics: ["ins_perlidae.jpg", "fly_grosse-steinfliegen.jpg", "fly_riesensteinfliegen.jpg"]},
    {k: "wanderung", t: "Wanderung & Schlupf", when: "Dämmerung bis Nacht", look: ["Nymphe krabbelt ans Ufer", "Leere Hüllen (Exuvien) an Steinen und Büschen"],
     behavior: "Die Nymphen verlassen das Wasser, krabbeln an Steine oder Pflanzen und häuten sich dort. Das Schlupfsignal ist oft die Wassertemperatur. Eine Exuvienkontrolle am Ufer verrät, welche Art gerade schlüpft.",
     fish: {how: "Nymphe im Uferbereich langsam führen. Fische fressen in der Uferzone besonders aktiv.", depth: "Ufer, flach", flies: ["Kaufman’s Stone", "Prince Nymph"], hook: "#6–14"}, pics: []},
    {k: "adult", t: "Adult", when: "je nach Art Winter bis Sommer", look: ["Flügel flach und parallel auf dem Rücken", "2 kurze Schwanzfäden", "Kräftige Fühler"],
     behavior: "Steinfliegen sind schwache Flieger. Sie sitzen auf Steinen und Büschen und fallen bei Wind oft ins Wasser. Die Weibchen flattern zur Eiablage über das Wasser.",
     fish: {how: "Trockenfliege (Stimulator, Golden Stone Adult) an Ufern, unter überhängenden Büschen. Wenn der Salmonfly schlüpft, genügt ein lauter Aufprall.", depth: "Oberfläche am Ufer", flies: ["Stimulator", "Golden Stone Adult", "Yellow Sally"], hook: "#4–16"}, pics: ["ins_plecoptera.jpg", "fly_uferfliegen.jpg"]}
  ],
  types: {title: "Nymphen-Gruppen", cols: ["Gruppe", "Aussehen", "Lebensraum", "Familien", "Muster"], rows: [
    ["Große Steinfliegen", "Goldbraun, gemustert, Kiementuft an der Brust", "Starke Strömung", "Perlidae", "Golden Stone #6–10"],
    ["Mittlere Steinfliegen", "Schlank, gelblich-grün, lange Schwänze", "Kiesige Bäche", "Perlodidae, Chloroperlidae", "Yellow Sally #12–16"],
    ["Riesen", "Schwarz bis dunkelbraun, sehr groß", "Große Flüsse (Nordamerika)", "Pteronarcyidae", "Rubber Legs #4–8"],
    ["Kleine dunkle", "Schlank, dunkelbraun bis schwarz", "Kalt, Winter und Frühjahr", "Nemouridae, Leuctridae, Taeniopterygidae, Capniidae", "Kleine Nymphe #14–20"]]},
  mistakes: ["Nymphe zu hoch im Wasser: Steinfliegennymphen sind Grundbewohner.", "Ufer ignoriert: der Schlupf passiert am Rand, nicht in der Flussmitte.", "Hochwasser unterschätzt: Dann driften viele Nymphen, und große Muster am Rand fangen.", "Winter-Steinfliegen übersehen: an sonnigen Wintertagen die erste Chance des Jahres."]}
};

const COMPARE = {cols: ["Merkmal", "Eintagsfliegen", "Köcherfliegen", "Steinfliegen"], rows: [
  ["Larve / Nymphe", "3 Schwanzfäden, Kiemen seitlich, 1 Kralle", "Raupenartig, Haken am Hinterende, oft im Köcher", "2 Schwanzfäden, flach, 2 Krallen"],
  ["Puppe", "keine", "ja, im Köcher oder Kokon", "keine"],
  ["Flügel in Ruhe", "aufrecht wie Segel", "dachförmig, behaart", "flach auf dem Rücken"],
  ["Schwanzfäden (Adult)", "2–3, sehr lang", "keine", "2, kurz"],
  ["Fühler", "kurz", "lang", "mittel bis lang"],
  ["Schlupf", "im Oberflächenfilm", "schnell von unten, rennt", "am Ufer auf Steinen"],
  ["Wichtigster Moment", "Emerger, Dun, Spinnerfall", "Puppe und skatende Adulte", "Nymphe am Ufer, Adult am Ufer"]]};

(function deepPages() {
  const esc2 = esc;
  const stageSel = {};
  const recipesFor = key => RECIPES.filter(r => r.groups.some(id => GROUP_BY_ID[id] && GROUP_BY_ID[id].order === DEEP[key].orderId));
  const tbl = (cols, rows) => `<div class="cal-wrap"><table class="cmp"><thead><tr>${cols.map(c => `<th>${esc2(c)}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${esc2(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  const stageCard = (key, k) => {
    const d = DEEP[key], s = d.stages.find(x => x.k === k) || d.stages[0], rec = RECIPES;
    const pill = n => { const l = n.toLowerCase(); const r = rec.find(x => { const m = x.name.toLowerCase(); return m === l || m.startsWith(l) || l.startsWith(m); }); return r ? `<button type="button" class="pill" data-rec="${r.id}">${esc2(n)}</button>` : `<span class="pill plain">${esc2(n)}</span>`; };
    return `<article class="stage-card"><div class="st-h"><h3>${esc2(s.t)}</h3><span class="chip">${esc2(s.when)}</span></div>
      <div class="st-grid"><div><h4>So erkennst du es</h4><ul>${s.look.map(x => `<li>${esc2(x)}</li>`).join("")}</ul>
      <h4>Verhalten</h4><p>${esc2(s.behavior)}</p></div>
      <div class="st-fish"><h4>So fischst du es</h4><p>${esc2(s.fish.how)}</p>
      <div class="tiles"><div><b>${esc2(s.fish.depth)}</b><span>Tiefe</span></div><div><b>${esc2(s.fish.hook)}</b><span>Haken</span></div></div>
      ${s.fish.flies.length ? `<div class="pillrow">${s.fish.flies.map(pill).join("")}</div>` : ""}</div></div>
      ${s.pics.length ? `<div class="stpics">${s.pics.map(p => `<figure><img loading="lazy" src="${photo(p)}" alt=""></figure>`).join("")}</div>` : ""}</article>`;
  };
  const seasonBar = g => `<div class="secbar mini">${g.season.map(v => `<i class="a${v}"></i>`).join("")}</div>`;
  function render(key) {
    const d = DEEP[key], o = ORDER_OF(d.orderId), groups = o.groups, el = document.getElementById("tab-" + key);
    const first = d.stages[1].k; stageSel[key] = first;
    el.innerHTML = `<div class="deep water">
      <div class="deep-head"><img src="${photo(d.icon)}" alt=""><div><h2>${esc2(d.title)}</h2><p class="mono">${esc2(d.en)} · <i>${esc2(d.lat)}</i></p><p class="lead2">${esc2(d.lead)}</p></div></div>
      <div class="tiles facts">${d.facts.map(f => `<div><b>${esc2(f[1])}</b><span>${esc2(f[0])}</span></div>`).join("")}</div>

      <h3 class="sub">Lebenszyklus: Stadium wählen</h3>
      <div class="stagebar" data-key="${key}" role="tablist">${d.stages.map((s, i) => (i ? '<span class="arr" aria-hidden="true">→</span>' : "") + `<button type="button" role="tab" data-stage="${s.k}" aria-selected="${s.k === first}">${esc2(s.t)}</button>`).join("")}</div>
      <div id="stage-${key}">${stageCard(key, first)}</div>

      <h3 class="sub">${esc2(d.types.title)}</h3>${tbl(d.types.cols, d.types.rows)}

      <h3 class="sub">Familien und Gruppen (${groups.length})</h3>
      <div class="dgroups">${groups.map(g => `<button type="button" class="dg" data-open="${g.id}"><img loading="lazy" src="${photo(g.img)}" alt=""><div><b>${esc2(g.de)}</b><i class="mono">${esc2(g.lat)}</i><span>Haken ${esc2(hookTxt(g))} · ${g.sub.length} Untergruppen</span>${seasonBar(g)}</div></button>`).join("")}</div>

      <h3 class="sub">Arten und Untergruppen</h3>
      <div class="filterbar"><div class="fb-row"><label class="sr" for="sp-${key}">Art suchen</label><input type="search" id="sp-${key}" placeholder="Art oder Name suchen …" data-species="${key}"></div></div>
      <div class="species" id="species-${key}"></div>

      <h3 class="sub">Jahresverlauf</h3>
      <div class="cal-wrap"><table class="cal">${calRows(groups)}</table></div>

      <h3 class="sub">Binderezepte</h3>
      <div class="pillrow">${recipesFor(key).map(r => `<button type="button" class="pill" data-rec="${r.id}">${esc2(r.name)}</button>`).join("") || "<span class='hint'>Noch keine Rezepte.</span>"}</div>

      <h3 class="sub">Typische Fehler</h3>
      <ul class="mistakes">${d.mistakes.map(m => `<li>${esc2(m)}</li>`).join("")}</ul>

      <h3 class="sub">Im Vergleich mit den anderen beiden</h3>${tbl(COMPARE.cols, COMPARE.rows)}
    </div>`;
    drawSpecies(key, "");
  }
  function calRows(groups) {
    let h = `<thead><tr><th style="text-align:left;padding-left:12px">Gruppe</th>${MONTHS.map((m, i) => `<th class="${i === NOW ? "cur" : ""}">${m}</th>`).join("")}</tr></thead><tbody>`;
    groups.forEach(g => { h += `<tr data-g="${g.id}"><td class="name">${esc2(g.de)}<small class="mono">${esc2(g.lat)}</small></td>${g.season.map((v, i) => `<td class="m ${v ? "w" + v : "z"}${i === NOW ? " cur" : ""}"><div></div></td>`).join("")}</tr>`; });
    return h + "</tbody>";
  }
  function drawSpecies(key, q) {
    const o = ORDER_OF(DEEP[key].orderId); q = q.trim().toLowerCase(); let n = 0;
    const html = o.groups.map(g => {
      const items = g.sub.filter(s => !q || s.join(" ").toLowerCase().includes(q) || g.de.toLowerCase().includes(q));
      if (!items.length) return "";
      n += items.length;
      return `<div class="sp-group"><button type="button" class="sp-h" data-open="${g.id}">${esc2(g.de)} <span class="mono">${esc2(g.lat)}</span></button><ul class="subs">${items.map(s => `<li><div><i class="mono">${esc2(s[0])}</i><b>${esc2(s[1])}</b></div><span>${esc2(s[2])}</span></li>`).join("")}</ul></div>`;
    }).join("");
    $("#species-" + key).innerHTML = html || `<p class="empty">Keine Art gefunden.</p>`;
  }
  ["mayfly", "caddis", "stone"].forEach(render);
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-stage]"); if (!b) return;
    const bar = b.closest(".stagebar"), key = bar.dataset.key;
    $$("button", bar).forEach(x => x.setAttribute("aria-selected", x === b));
    $("#stage-" + key).innerHTML = stageCard(key, b.dataset.stage);
  });
  document.addEventListener("input", e => { const t = e.target.closest("[data-species]"); if (t) drawSpecies(t.dataset.species, t.value); });
  ["mayfly", "caddis", "stone"].forEach(key => {
    const el = document.getElementById("tab-" + key);
    el.addEventListener("click", e => { const b = e.target.closest("[data-open]"); if (b) openGroup(b.dataset.open); const r = e.target.closest("tr[data-g]"); if (r) openGroup(r.dataset.g); });
  });
  // Die großen Drei auf der Startseite
  const big = $("#big3");
  if (big) { big.innerHTML = ["mayfly", "caddis", "stone"].map(k => { const d = DEEP[k]; return `<button type="button" class="b3" data-go="${k}"><img src="${photo(d.icon)}" alt=""><span><b>${esc2(d.title)}</b><i class="mono">${esc2(d.lat)}</i><em>Lebenszyklus, Arten, Muster</em></span></button>`; }).join(""); }
})();
