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
    const third = type === "dry" ? ["~" + mm + " mm", "Länge der Fliege"] : type === "ind" ? [nf(sp.ind, 2) + " m", "Indikator–Fliege"] : ["40 cm", "Sighter"];
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

