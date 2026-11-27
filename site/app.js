"use strict";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const photo = f => "fotos/" + f;
const hookTxt = g => `#${g.hook[0]}–${g.hook[1]}` + (g.hookNote ? " " + g.hookNote : "");
const BR = {water:"Wasserinsekten", land:"Landinsekten", other:"Weitere Beute"};
const NOW = new Date().getMonth();
const curBranch = g => g.branch;

/* ========== Hinweis-Toast ========== */
let toastT;
function toast(t) {
  let el = document.getElementById("toast");
  if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
  el.textContent = t; el.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove("on"), 2200);
}

/* ========== Navigation ========== */
const GROUPS = [
  {k: "water", t: "Am Wasser", short: "Am Wasser", d: "Was fressen die Fische gerade? Bedingungen, Haken, Vorfach und Bestimmung.",
   tabs: [["now", "Jetzt am Wasser"], ["cond", "Bedingungen & Tipps"], ["tip", "Haken & Vorfach"], ["tech", "Technik"], ["read", "Gewässer lesen"], ["key", "Bestimmung"]]},
  {k: "ins", t: "Insekten nachschlagen", short: "Insekten", d: "Eintags-, Köcher- und Steinfliegen im Detail, alle Gruppen, Saison und Verbreitung.",
   tabs: [["tree", "Organigramm"], ["mayfly", "Eintagsfliegen"], ["caddis", "Köcherfliegen"], ["stone", "Steinfliegen"], ["cal", "Schlupfkalender"], ["map", "Weltkarte"], ["life", "Lebenszyklen"], ["gloss", "Glossar"]]},
  {k: "tie", t: "Binden & Box", short: "Binden & Box", d: "Binderezepte, deine Fliegenbox, das Fangbuch und die Starter-Box.",
   tabs: [["rec", "Binderezepte"], ["box", "Meine Box & Fangbuch"], ["starter", "Starter-Box"]]}
];
const TAB_GROUP = {}; GROUPS.forEach(g => g.tabs.forEach(([id]) => TAB_GROUP[id] = g));
const lastTab = {};
$("#tabs").innerHTML = `<button role="tab" data-group="home" class="mob-only" aria-selected="false">Start</button>` + GROUPS.map(g => `<button role="tab" data-group="${g.k}" aria-selected="false">${esc(g.short || g.t)}</button>`).join("");
function showTab(id) {
  if (!document.getElementById("tab-" + id)) id = "home";
  const g = TAB_GROUP[id];
  $$("#tabs button").forEach(b => b.setAttribute("aria-selected", g ? b.dataset.group === g.k : b.dataset.group === "home"));
  const sn = $("#subnav"); sn.classList.toggle("hidden", !g);
  if (g) { lastTab[g.k] = id; sn.innerHTML = g.tabs.map(([i, t]) => `<button role="tab" data-tab="${i}" aria-selected="${i === id}">${esc(t)}</button>`).join(""); }
  $$(".panel-sec").forEach(s => s.classList.toggle("hidden", s.id !== "tab-" + id));
  const act = sn.querySelector("[aria-selected=true]"); if (act) act.scrollIntoView({inline: "center", block: "nearest"});
  if (id === "map") renderMap();
  if (window.onTab) window.onTab(id);
  history.replaceState(null, "", "#" + id);
  window.scrollTo({top: 0});
}
$("#tabs").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { if (b.dataset.group === "home") return showTab("home"); const g = GROUPS.find(x => x.k === b.dataset.group); showTab(lastTab[g.k] || g.tabs[0][0]); } });
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

/* ========== Stats ========== */
(function stats() {
  const orders = DATA.reduce((n, b) => n + b.orders.length, 0);
  const pats = new Set(); ALL.forEach(g => g.flies.forEach(f => pats.add(f)));
  const items = [[orders, "Ordnungen"], [ALL.length, "Gruppen"], [pats.size, "Fliegenmuster"], [REGIONS.length, "Weltregionen"]];
  $("#stats").innerHTML = items.map(([n, l]) => `<li><b>${n}</b><span>${l}</span></li>`).join("");
})();

/* ========== Organigramm ========== */
const chev = '<svg class="chev" aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1C2620" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
const state = {filter: "all", month: "", only: false, q: ""};


const abbr = t => esc(t).replace(/(BWO|PMD|Hendrickson)/g, m => `<abbr title="${esc(GLOSS[m])}">${m}</abbr>`);
function nameLines(g) {
  const p = g.en.split(" · "), eng = p[0], also = p.slice(1).join(" · ");
  return `<dl class="names"><div><dt>Familie</dt><dd class="mono"><i>${esc(g.lat)}</i></dd></div><div><dt>Englisch</dt><dd>${esc(eng)}</dd></div>${also ? `<div><dt>Auch bekannt als</dt><dd>${abbr(also)}</dd></div>` : ""}</dl>${g.nameNote ? `<p class="nnote">${abbr(g.nameNote)}</p>` : ""}`;
}
function pics(g, alt = true) {
  const flyPic = g.fly ? `<figure class="fly"><img loading="lazy" src="${photo(g.fly)}" alt="${esc(g.flyName)} – Fliegenmuster"><figcaption class="mono">Umpqua: ${esc(g.flyName)}</figcaption></figure>` : "";
  return `<div class="pics${g.fly ? "" : " single"}"><figure><img loading="lazy" src="${photo(g.img)}" alt="${esc(g.de)} – Insekt"><figcaption class="mono">Insekt</figcaption></figure>${flyPic}</div>`;
}

/* Untergruppen-Fotos als Streifen auf der Gruppenkarte */
const subThumbs = g => {
  const withPic = typeof SUBPHOTO !== "undefined" ? g.sub.filter(s => SUBPHOTO[s[0]]) : [];
  if (!withPic.length) return "";
  return `<div class="subthumbs"><span class="stl">Untergruppen</span>${withPic.slice(0, 5).map(s => `<button type="button" class="sth" data-open="${g.id}" title="${esc(s[1])} (${esc(s[0])})"><img loading="lazy" src="${photo(SUBPHOTO[s[0]].f)}" alt="${esc(s[1])}"></button>`).join("")}${g.sub.length > withPic.slice(0, 5).length ? `<span class="more-n">+${g.sub.length - withPic.slice(0, 5).length}</span>` : ""}</div>`;
};
function groupCard(g) {
  const flies = g.flies.join(", ") + (g.flyName && !g.flies.some(f => f.toLowerCase() === g.flyName.toLowerCase()) ? " · Foto: " + g.flyName : "");
  const search = [g.orderDe, g.de, g.en, g.lat, flies, g.info, g.tip, g.day, g.water, ...g.sub.map(s => s.join(" "))].join(" ").toLowerCase();
  return `<article class="group" data-gid="${g.id}" data-search="${esc(search)}">
  ${pics(g)}
  ${subThumbs(g)}
  <div class="gbody"><h3>${esc(g.de)}</h3>${nameLines(g)}
  <p>${esc(g.info.length > 150 ? g.info.slice(0, g.info.lastIndexOf(" ", 150)) + " …" : g.info)}</p>
  <div class="chiprow"><span class="chip mono">Haken ${esc(hookTxt(g))}</span><span class="chip mono act">${esc(g.water)}</span>${g.sub.length ? `<span class="chip mono">${g.sub.length} Untergruppen</span>` : ""}</div>
  <p class="flies"><b>Muster:</b> ${esc(flies)}</p>
  <button type="button" class="more" data-open="${g.id}">Details &amp; Verbreitung →</button></div></article>`;
}
function orderBlock(o, b) {
  const open = o.id === "mayfly";
  return `<div class="row" data-order="${o.id}"><div class="tick"></div><div class="order${open ? " open" : ""}">
  <button class="ohead" type="button" aria-expanded="${open}" aria-controls="p-${o.id}">
   <div class="thumb"><img src="${photo(o.photo)}" alt="${esc(o.de)}"></div>
   <div class="otext"><span class="t">${esc(o.de)}</span><span class="s mono">${esc(o.en)} · <i>${esc(o.lat)}</i></span><span class="d">${esc(o.blurb)}</span></div>
   <div class="oside"><span class="count mono">${o.groups.length} ${o.groups.length === 1 ? "Gruppe" : "Gruppen"}</span>${chev}</div></button>
  <div class="opanel" id="p-${o.id}">
   <div class="oinfo"><div class="ibox"><h4>Erkennungsmerkmale</h4><ul>${o.id_features.map(f => `<li>${esc(f)}</li>`).join("")}</ul></div>
   <div class="ibox"><h4>Lebensstadien</h4><div class="stages">${o.stages.map((s, i) => (i ? "<i>→</i>" : "") + `<span>${esc(s)}</span>`).join("")}</div><p>${esc(o.stageTip)}</p></div></div>
   <div class="grid">${o.groups.map(groupCard).join("")}</div></div></div></div>`;
}
function buildTree() {
  $("#tree").innerHTML = DATA.map(b => `<section class="branch ${b.key}" data-branch="${b.key}"><div class="bar"></div>
  <div class="bnode-wrap"><div class="vline" style="height:28px"></div><div class="bnode"><b>${esc(b.title)}</b><span class="mono">${esc(b.sub)}</span></div><div class="vline" style="height:24px"></div></div>
  <div class="spine">${b.orders.map(o => orderBlock(o, b)).join("")}</div></section>`).join("");
}
buildTree();
$("#monthSel").insertAdjacentHTML("beforeend", MONTHS_LONG.map((m, i) => `<option value="${i}">${m}</option>`).join(""));

const setOpen = (o, on) => { o.classList.toggle("open", on); $(".ohead", o).setAttribute("aria-expanded", on); };

function applyFilters() {
  const q = state.q.trim().toLowerCase(), m = state.month === "" ? null : +state.month;
  let shown = 0;
  $$(".branch").forEach(br => {
    const brOk = state.filter === "all" || br.dataset.branch === state.filter;
    let any = false;
    $$("[data-order]", br).forEach(row => {
      let rowAny = false;
      $$(".group", row).forEach(card => {
        const g = ALL.find(x => x.id === card.dataset.gid);
        const mOk = m === null || g.season[m] > 0;
        const qOk = !q || card.dataset.search.includes(q);
        const active = m !== null && g.season[m] >= 2;
        card.classList.toggle("dim", m !== null && !active);
        const vis = brOk && qOk && (!state.only || m === null || g.season[m] >= 1);
        card.classList.toggle("hidden", !vis);
        if (vis) { rowAny = true; shown++; }
        let tag = $(".chip.season", card);
        if (m !== null && vis) {
          const txt = ["nicht aktiv", "möglich", "Hauptzeit", "Hochsaison"][g.season[m]];
          if (!tag) { tag = document.createElement("span"); tag.className = "chip mono season"; $(".chiprow", card).appendChild(tag); }
          tag.textContent = MONTHS[m] + ": " + txt; tag.classList.toggle("act3", g.season[m] === 3); tag.classList.toggle("act2", g.season[m] === 2);
        } else if (tag) tag.remove();
      });
      row.classList.toggle("hidden", !rowAny);
      if (q && rowAny) setOpen($(".order", row), true);
      if (rowAny) any = true;
    });
    br.classList.toggle("hidden", !brOk || !any);
  });
  $("#treeEmpty").classList.toggle("hidden", shown > 0);
  $("#treeHint").textContent = (q || m !== null || state.filter !== "all") ? `${shown} Gruppen` + (m !== null ? ` · Hervorgehoben: aktiv im ${MONTHS_LONG[m]} (Mitteleuropa)` : "") : "";
}
$("#q").addEventListener("input", e => { state.q = e.target.value; applyFilters(); });
$("#monthSel").addEventListener("change", e => { state.month = e.target.value; applyFilters(); });
$("#onlyActive").addEventListener("change", e => { state.only = e.target.checked; applyFilters(); });
$("#branchFilter").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  state.filter = b.dataset.f; $$("#branchFilter button").forEach(x => x.classList.toggle("on", x === b)); applyFilters();
});
$("#all").onclick = () => $$(".order").forEach(o => setOpen(o, true));
$("#none").onclick = () => $$(".order").forEach(o => setOpen(o, false));
$("#tree").addEventListener("click", e => {
  const h = e.target.closest(".ohead"); if (h) { const o = h.parentElement; setOpen(o, !o.classList.contains("open")); return; }
  const op = e.target.closest("[data-open]"); if (op) { openGroup(op.dataset.open); return; }
  const f = e.target.closest("figure"); if (f) lightbox(f);
});


/* Untergruppen-Eintrag mit Foto (Wikipedia/Commons) */
const subLi = s => { const p = typeof SUBPHOTO !== "undefined" ? SUBPHOTO[s[0]] : null;
  return `<li${p ? ' class="has-pic"' : ""}>${p ? `<figure class="sfig"><img loading="lazy" src="${photo(p.f)}" alt="${esc(s[0])}" data-credit="${esc(p.p || "")}" data-page="${esc(p.t || "")}" data-by="${esc(p.b || "")}" data-lic="${esc(p.l || "")}"></figure>` : ""}<div class="sbody"><div><i class="mono">${esc(s[0])}</i><b>${esc(s[1])}</b></div><span>${esc(s[2])}</span></div></li>`; };

/* ========== Dialog ========== */
function lightbox(fig) {
  const i = $("img", fig), lb = $("#lb");
  $("img", lb).src = i.src; $("img", lb).alt = i.alt;
  const cap = $("p", lb), cr = i.dataset.credit;
  const by = i.dataset.by, lic = i.dataset.lic;
  cap.textContent = i.alt + (by ? "" : (i.dataset.page ? " · Wikipedia-Seite: " + i.dataset.page : ""));
  if (by) cap.append(" · Foto: " + by + (lic ? " (" + lic + ")" : "") + " · ");
  else if (cr) cap.append(" · Foto: ");
  if (cr) { const l = document.createElement("a"); l.href = cr; l.target = "_blank"; l.rel = "noopener"; l.textContent = by ? "GBIF" : "Wikipedia / Commons"; l.style.color = "#fff"; l.addEventListener("click", ev => ev.stopPropagation()); cap.appendChild(l); }
  lb.classList.add("on");
}
$("#lb").addEventListener("click", () => $("#lb").classList.remove("on"));
function seasonBar(g) {
  return `<div class="secbar" role="img" aria-label="Saison: ${g.season.map((v, i) => MONTHS[i] + " " + v).join(", ")}">${g.season.map((v, i) => `<i class="a${v}" title="${MONTHS_LONG[i]}: ${["–", "möglich", "Hauptzeit", "Hochsaison"][v]}"></i>`).join("")}</div>
  <div class="secmon">${MONTHS.map(m => `<span>${m[0]}</span>`).join("")}</div>`;
}
function hookBar(g) {
  const lo = 4, hi = 26, a = Math.min(...g.hook), b = Math.max(...g.hook);
  const pos = h => (hi - h) / (hi - lo) * 100;
  return `<div class="hookbar" role="img" aria-label="Hakengrößen ${hookTxt(g)}"><i style="left:${pos(b)}%;width:${pos(a) - pos(b)}%"></i></div>
  <div class="hooklbl"><span>#26 winzig</span><span>#4 groß</span></div>`;
}
function openGroup(id) {
  const g = ALL.find(x => x.id === id), bk = DATA.find(b => b.key === g.branch);
  const regs = REGIONS.map(r => `<div class="rb"><span>${esc(r.de)}</span><div class="bar2"><i style="width:${g.geo[r.k] / 3 * 100}%"></i></div></div>`).join("");
  const peakM = g.season.map((v, i) => v === Math.max(...g.season) ? MONTHS_LONG[i] : null).filter(Boolean);
  $("#dlgBody").innerHTML = `<div class="${bk.key}"><div class="dh"><div class="eb mono">${esc(BR[bk.key])} · ${esc(g.orderDe)}</div>
  <h2 id="dlgTitle">${esc(g.de)}</h2>${nameLines(g)}</div>
  <div class="db"><div>${pics(g)}
   <div class="facts"><span class="fact">Haken ${esc(hookTxt(g))}</span><span class="fact">${esc(g.water)}</span><span class="fact">${esc(g.day)}</span></div>
   <h4>Hakengrößen-Bereich</h4>${hookBar(g)}</div>
  <div><p>${esc(g.info)}</p>
   <h4>Fischen mit …</h4><p>${esc(g.tip)}</p>
   <h4>Muster</h4><p>${g.flies.map(esc).join(" · ")}</p>
   ${g.sub.length ? `<h4>Untergruppen &amp; wichtige Arten</h4><ul class="subs">${g.sub.map(subLi).join("")}</ul>` : ""}
   <h4>Saison (Mitteleuropa)</h4>${seasonBar(g)}<p class="hint">Hochsaison: ${esc(peakM.slice(0, 4).join(", "))}${peakM.length > 4 ? " …" : ""}</p>
   <h4>Verbreitung</h4><div class="regbars">${regs}</div><p class="hint">${esc(g.geoNote)}</p>
   <div class="actions"><button class="btn" type="button" data-map="${g.id}">Auf Weltkarte zeigen</button><button class="btn" type="button" data-cal="${g.id}">Im Kalender</button></div></div></div></div>`;
  $("#dlg").classList.remove("hidden"); document.body.style.overflow = "hidden";
  $("#dlgX").focus();
}
const closeDlg = () => { $("#dlg").classList.add("hidden"); document.body.style.overflow = ""; };
$("#dlgX").onclick = closeDlg;
$("#dlg").addEventListener("click", e => {
  if (e.target === $("#dlg")) return closeDlg();
  const m = e.target.closest("[data-map]"); if (m) { closeDlg(); $("#mapSel").value = "g:" + m.dataset.map; showTab("map"); return; }
  const c = e.target.closest("[data-cal]"); if (c) { closeDlg(); showTab("cal"); $("#calQ").value = ALL.find(x => x.id === c.dataset.cal).de; renderCal(); return; }
  const f = e.target.closest("figure"); if (f) lightbox(f);
});
document.addEventListener("keydown", e => { if (e.key === "Escape") { $("#lb").classList.remove("on"); if (!$("#dlg").classList.contains("hidden")) closeDlg(); } });

/* ========== Weltkarte ========== */
const proj = (lon, lat) => {
  const l = lon * Math.PI / 180, p = lat * Math.PI / 180, p2 = p * p, p4 = p2 * p2;
  return [100 * l * (0.8707 - 0.131979 * p2 + p4 * (-0.013791 + p4 * (0.003971 * p2 - 0.001529 * p4))),
          -100 * p * (1.007226 + p2 * (0.015085 + p4 * (-0.044475 + 0.028874 * p2 - 0.005916 * p4)))];
};
const LABELS = {NA:[-102,47], MA:[-95,18], SA:[-60,-14], EU:[14,50], NAS:[84,59], ME:[30,26], AF:[22,-3], AS:[102,29], OC:[134,-25]};
const ramp = v => { // 0..3 -> farbe
  const st = [[0,[230,236,232]],[1,[141,185,196]],[2,[30,95,116]],[3,[11,53,68]]];
  v = Math.max(0, Math.min(3, v));
  for (let i = 1; i < st.length; i++) if (v <= st[i][0]) {
    const [a, ca] = st[i-1], [b, cb] = st[i], t = (v - a) / (b - a);
    return `rgb(${ca.map((c, k) => Math.round(c + (cb[k] - c) * t)).join(",")})`;
  }
};
function mapOptions() {
  let h = `<option value="all">Alle Gruppen (Gesamtrelevanz)</option>`;
  DATA.forEach(b => {
    h += `<optgroup label="${esc(b.title)}">`;
    b.orders.forEach(o => {
      h += `<option value="o:${o.id}">${esc(o.de)} (alle Gruppen)</option>`;
      o.groups.forEach(g => h += `<option value="g:${g.id}">— ${esc(g.de)} · ${esc(g.lat)}</option>`);
    });
    h += "</optgroup>";
  });
  return h;
}
$("#mapSel").innerHTML = mapOptions();
function mapValues(sel) {
  let groups, title, sub = "";
  if (sel === "all") { groups = ALL; title = "Alle Gruppen"; sub = "Mittelwert aller Gruppen – wie vielfältig und wichtig ist die Insektenwelt für Fliegenfischer?"; }
  else if (sel.startsWith("o:")) { const id = sel.slice(2); let o; DATA.forEach(b => b.orders.forEach(x => { if (x.id === id) o = x; })); groups = o.groups; title = o.de; sub = `${o.en} · ${o.lat} – Mittelwert über ${groups.length} Gruppen`; }
  else { const g = ALL.find(x => x.id === sel.slice(2)); groups = [g]; title = g.de; sub = `${g.en} · ${g.lat} – ${g.geoNote}`; }
  const vals = {}; REGIONS.forEach(r => vals[r.k] = groups.reduce((s, g) => s + g.geo[r.k], 0) / groups.length);
  return {vals, title, sub, groups};
}
let mapRegion = "EU", mapBuilt = false;
function buildMap() {
  const svg = $("#worldmap");
  svg.innerHTML = Object.keys(MAP_PATHS).map(k => `<g class="reg" data-r="${k}" tabindex="0" role="button" aria-label="${esc(REGIONS.find(r => r.k === k).de)}">${MAP_PATHS[k].map(d => `<path d="${d}"/>`).join("")}</g>`).join("") +
    `<g id="lbls">${REGIONS.map(r => { const [x, y] = proj(...LABELS[r.k]); return `<text x="${x.toFixed(1)}" y="${(y - 4).toFixed(1)}" text-anchor="middle" data-t="${r.k}">${esc(r.short)}</text><text class="v" x="${x.toFixed(1)}" y="${(y + 8).toFixed(1)}" text-anchor="middle" data-v="${r.k}"></text>`; }).join("")}</g>`;
  const tip = $("#mapTip"), wrap = $(".map-wrap");
  svg.addEventListener("mousemove", e => {
    const g = e.target.closest(".reg"); if (!g) return tip.classList.add("hidden");
    const r = REGIONS.find(x => x.k === g.dataset.r), {vals} = mapValues($("#mapSel").value), v = vals[r.k];
    const wb = wrap.getBoundingClientRect();
    tip.innerHTML = `<b>${esc(r.de)}</b><br>${scoreLabel(v)}`; tip.style.left = (e.clientX - wb.left) + "px"; tip.style.top = (e.clientY - wb.top) + "px"; tip.classList.remove("hidden");
  });
  svg.addEventListener("mouseleave", () => tip.classList.add("hidden"));
  svg.addEventListener("click", e => { const g = e.target.closest(".reg"); if (g) { mapRegion = g.dataset.r; renderMap(); $("#regionDetail").scrollIntoView({behavior: "smooth", block: "nearest"}); } });
  svg.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { const g = e.target.closest(".reg"); if (g) { e.preventDefault(); mapRegion = g.dataset.r; renderMap(); } } });
  mapBuilt = true;
}
const scoreLabel = v => v < 0.2 ? "fehlt / unbedeutend" : v < 1 ? "selten / lokal" : v < 1.8 ? "regional vorhanden" : v < 2.5 ? "häufig" : "sehr häufig / Schwerpunkt";
function renderMap() {
  if (!mapBuilt) buildMap();
  const sel = $("#mapSel").value, {vals, title, sub, groups} = mapValues(sel);
  $$("#worldmap .reg").forEach(g => { const k = g.dataset.r; $$("path", g).forEach(p => p.style.fill = ramp(vals[k])); g.classList.toggle("sel", k === mapRegion); });
  $$("#lbls [data-v]").forEach(t => t.textContent = vals[t.dataset.v].toFixed(1).replace(/\.0$/, ""));
  $("#mapInfo").innerHTML = `<b>${esc(title)}</b><br>${esc(sub)}`;
  const sorted = REGIONS.map(r => [r, vals[r.k]]).sort((a, b) => b[1] - a[1]);
  $("#mapRanks").innerHTML = `<div class="lbl">Rangfolge der Regionen</div>` + sorted.map(([r, v]) => `<button type="button" class="rankrow" data-r="${r.k}"><span class="rn">${esc(r.short)}</span><span class="rankbar"><i style="width:${v / 3 * 100}%"></i></span><span class="mono">${v.toFixed(1).replace(/\.0$/, "")}</span></button>`).join("");
  renderRegion();
}
function renderRegion() {
  const r = REGIONS.find(x => x.k === mapRegion);
  const top = ALL.map(g => [g, g.geo[r.k]]).filter(([g, v]) => v >= 2).sort((a, b) => b[1] - a[1] || a[0].de.localeCompare(b[0].de, "de"));
  const lead = top.filter(([, v]) => v === 3).length;
  $("#regionDetail").innerHTML = `<h3>${esc(r.de)}</h3><div class="sub2 mono">${esc(r.sub)}</div><p>${esc(r.tip)}</p>
  <div class="lbl">${lead} Gruppen mit Schwerpunkt in dieser Region · ${top.length - lead} weitere häufig (Klick = Karte, Details öffnen im Organigramm)</div>
  <div class="pillrow">${top.map(([g, v]) => `<button type="button" class="pill l${v}" data-g="${g.id}" title="${esc(g.lat)}">${esc(g.de)}</button>`).join("") || "<span class='hint'>Keine Gruppen mit hoher Relevanz hinterlegt.</span>"}</div>`;
}
$("#mapSel").addEventListener("change", renderMap);
$("#mapRanks").addEventListener("click", e => { const b = e.target.closest("[data-r]"); if (b) { mapRegion = b.dataset.r; renderMap(); } });
$("#regionDetail").addEventListener("click", e => { const b = e.target.closest("[data-g]"); if (b) openGroup(b.dataset.g); });

/* ========== Kalender ========== */
const calState = {h: "N", f: "all", q: ""};
function renderCal() {
  const shift = calState.h === "S" ? 6 : 0, q = $("#calQ").value.trim().toLowerCase();
  let h = `<thead><tr><th style="text-align:left;padding-left:12px">Gruppe</th>${MONTHS.map((m, i) => `<th class="${i === NOW ? "cur" : ""}">${m}</th>`).join("")}</tr></thead><tbody>`;
  DATA.forEach(b => {
    if (calState.f !== "all" && calState.f !== b.key) return;
    b.orders.forEach(o => {
      const gs = o.groups.filter(g => !q || (g.de + g.en + g.lat + o.de).toLowerCase().includes(q));
      if (!gs.length) return;
      h += `<tr class="grp"><td colspan="13">${esc(o.de)} <span class="mono" style="text-transform:none;letter-spacing:0">· ${esc(o.lat)}</span></td></tr>`;
      gs.forEach(g => {
        const cls = {water: "w", land: "l", other: "o"}[b.key];
        h += `<tr data-g="${g.id}"><td class="name">${esc(g.de)}<small class="mono">${esc(g.lat)} · ${esc(g.day)}</small></td>` +
          Array.from({length: 12}, (_, i) => { const v = g.season[(i + shift) % 12]; return `<td class="m ${v ? cls + v : "z"}${i === NOW ? " cur" : ""}" title="${MONTHS_LONG[i]}: ${["–", "möglich", "Hauptzeit", "Hochsaison"][v]}"><div></div></td>`; }).join("") + "</tr>";
      });
    });
  });
  $("#cal").innerHTML = h + "</tbody>";
}
$("#calHemi").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; calState.h = b.dataset.h; $$("#calHemi button").forEach(x => x.classList.toggle("on", x === b)); renderCal(); });
$("#calFilter").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; calState.f = b.dataset.f; $$("#calFilter button").forEach(x => x.classList.toggle("on", x === b)); renderCal(); });
$("#calQ").addEventListener("input", renderCal);
$("#cal").addEventListener("click", e => { const r = e.target.closest("tr[data-g]"); if (r) openGroup(r.dataset.g); });
renderCal();

/* ========== Lebenszyklen ========== */
(function life() {
  const picks = ["mayfly", "caddis", "stone", "midge"];
  const stageNote = {
    mayfly: ["Nymphe", "Dun", "Spinner"], caddis: ["Larve", "Puppe", "Adult"], stone: ["Nymphe", "Adult"], midge: ["Larve", "Puppe", "Adult"]};
  const imitate = {
    mayfly: ["Nymphe: Pheasant Tail, Hare’s Ear (dead drift)", "Emerger: Klinkhamer, CDC-Emerger (im Film)", "Dun: Parachute, Comparadun, Adams", "Spinner: CDC Spent Spinner, Rusty Spinner"],
    caddis: ["Larve: Peeping Caddis, Czech Nymph (am Grund)", "Puppe: Sparkle Pupa, Soft Hackle (aufsteigend)", "Adult: Elk Hair Caddis, Goddard Caddis (skaten)"],
    stone: ["Nymphe: Rubber Legs, Kaufman’s Stone (tief)", "Adult: Stimulator, Golden Stone Adult (Ufer)"],
    midge: ["Larve: Bloodworm, San Juan Worm", "Puppe/Emerger: Zebra Midge, Shipman’s Buzzer", "Adult: Griffith’s Gnat, Black Gnat"]};
  const find = id => { let o; DATA.forEach(b => b.orders.forEach(x => { if (x.id === id) o = x; })); return [o, DATA.find(b => b.orders.includes(o))]; };
  $("#lifeGrid").innerHTML = picks.map(id => {
    const [o, b] = find(id);
    return `<article class="life ${b.key}"><header><img src="${photo(o.photo)}" alt=""><div><h3>${esc(o.de)}</h3><span class="mono">${esc(o.en)} · ${esc(o.lat)}</span></div></header>
    <div class="flow">${o.stages.map((s, i) => (i ? '<span class="arr" aria-hidden="true">→</span>' : "") + `<div class="st">${esc(s)}</div>`).join("")}</div>
    <ul>${imitate[id].map(t => `<li>${esc(t)}</li>`).join("")}</ul><p>${esc(o.stageTip)}</p></article>`;
  }).join("");
  const rows = [
    ["Flügel in Ruhe", "aufrecht wie ein Segel", "dachförmig, behaart", "flach auf dem Rücken", "nur 2 Flügel"],
    ["Schwanzfäden", "2–3, sehr lang", "keine", "2, kurz und kräftig", "keine"],
    ["Fühler", "kurz, unscheinbar", "lang, oft körperlang", "kräftig, lang (V-Form)", "Männchen buschig"],
    ["Körper", "schlank, nach oben gebogen", "behaart, mittelkräftig", "breit, flach, robust", "winzig, schlank"],
    ["Verwandlung", "unvollständig + Dun-Stadium", "vollständig mit Puppe", "unvollständig", "vollständig mit Puppe"],
    ["Typische Hakengröße", "#12–22", "#10–20", "#4–16", "#16–26"],
    ["Wichtigstes Muster", "Pheasant Tail / Adams / BWO", "Elk Hair Caddis / Sparkle Pupa", "Stimulator / Rubber Legs", "Zebra Midge / Griffith’s Gnat"]];
  $("#cmpTable").innerHTML = `<thead><tr><th></th><th>Eintagsfliegen</th><th>Köcherfliegen</th><th>Steinfliegen</th><th>Zuckmücken</th></tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody>`;
})();

/* ========== Bestimmung ========== */
const NODES = {
adult: {
  start: {q: "Wie viele Flügel hat das Tier?", sub: "Zähle die deutlich sichtbaren Flügel.", opts: [
    ["2 Flügel", "Mücken & Fliegen (Zweiflügler)", "dipt"], ["4 Flügel", "Typische Insektenflügel", "four"], ["Harte Flügeldecken", "Käfer", "R:beetles"], ["Keine oder verkümmert", "Ameisen, Raupen, Flügellose", "R:ants"]]},
  dipt: {q: "Wie sieht die Mücke/Fliege aus?", opts: [
    ["Winzig, schlanke Mücke, buschige Fühler (♂)", "Keine Stechmücke – Zuckmücke", "R:midge"], ["Sehr lange Beine, groß und schlank", "Schnake", "R:flies:tipulidae"], ["Schwarz, behaart, hängende Beine", "Märzfliege (April/Mai)", "R:flies:bibio"], ["Winzig, gedrungen, buckelig", "Kriebelmücke", "R:aqother:simuliidae"], ["Gelb-schwarz wie Wespe", "Schwebfliege", "R:flies:syrphidae"]]},
  four: {q: "Wie hält das Tier die Flügel in Ruhe?", opts: [
    ["Aufrecht wie ein Segel", "Dazu 2–3 lange Schwanzfäden", "R:mayfly"], ["Dachförmig, behaart, lange Fühler", "Keine Schwanzfäden", "R:caddis"], ["Flach und parallel auf dem Rücken", "2 kurze Schwanzfäden, kräftige Fühler", "R:stone"], ["Abgespreizt, große Facettenaugen", "Groß, rasanter Flieger", "R:odonata"], ["Geschuppt, Saugrüssel", "Schmetterling / Nachtfalter", "R:lepi"], ["Wespentaille, gestreift", "Hautflügler", "R:hymen"], ["Kleine, dachförmige Flügel, springend", "Zikaden und Blattläuse", "R:leafhoppers"], ["Lange Sprungbeine, derbe Flügel", "Heuschrecken", "R:hoppers"]]}
},
larva: {
  start: {q: "Wie sieht das Tier aus?", sub: "Steine umdrehen, Netz in die Strömung halten (Kicksampling).", opts: [
    ["Mit 3 Schwanzfäden und Kiemenblättchen seitlich", "Schlank bis kräftig", "R:mayfly"], ["Flach, 2 Schwanzfäden, 2 Krallen pro Fuß", "Breit, robust", "R:stone"], ["Raupenartig, weicher Hinterleib, 3 Beinpaare vorn", "Oft im Köcher aus Steinchen/Pflanzen", "R:caddis"], ["Wurmartig, ohne Beine, oft rot", "Kleine „Würmer“ im Schlamm", "R:midge"], ["Breit, mit Fangmaske, kräftig", "Räuber im Stillwasser", "R:odonata"], ["Seitlich abgeflachter Krebs", "Springt beim Herausnehmen", "R:crust:gammarus"], ["Flach, 7 Beinpaare, grau", "Wasserassel", "R:crust:asellus"], ["Bräunlich, mit Beinen, Atemrohr", "Wasserkäfer/-wanzen", "R:aqother"]]}
}};
const keyState = {mode: "adult", path: ["start"], labels: []};
function findOrder(id) { let o; DATA.forEach(b => b.orders.forEach(x => { if (x.id === id) o = x; })); return o; }
function renderKey() {
  const last = keyState.path[keyState.path.length - 1];
  if (last.startsWith("R:")) return renderResult(last);
  const node = NODES[keyState.mode][last];
  const crumbs = keyState.labels.map(p => `<span>${esc(p)}</span>`).join("");
  $("#keyBox").innerHTML = `<div class="stepn mono">Schritt ${keyState.labels.length + 1}</div>${crumbs ? `<div class="crumbs">${crumbs}</div>` : ""}<h3>${esc(node.q)}</h3><p class="q-sub">${esc(node.sub || "")}</p>
  <div class="opts">${node.opts.map((o, i) => `<button class="opt" data-i="${i}"><b>${esc(o[0])}</b><span>${esc(o[1])}</span></button>`).join("")}</div>
  ${keyState.path.length > 1 ? `<div class="keybtns"><button class="btn" id="keyBack">← Zurück</button><button class="btn" id="keyReset">Neu starten</button></div>` : ""}`;
}
function renderResult(code) {
  const [, oid, gid] = code.split(":");
  const o = findOrder(oid), gs = gid ? [ALL.find(g => g.id === gid)] : o.groups.slice(0, 4);
  $("#keyBox").innerHTML = `<h3>Ergebnis: ${esc(o.de)}${gid ? " – " + esc(gs[0].de) : ""}</h3><p class="q-sub">${esc(o.en)} · ${esc(o.lat)}</p>
  <div class="res"><div class="res-card"><img src="${photo(o.photo)}" alt="${esc(o.de)}"><div><h4>${esc(o.de)}</h4><p>${esc(o.blurb)}</p><p><b>Erkennung:</b> ${o.id_features.map(esc).join(" · ")}</p></div></div>
  ${gs.map(g => `<div class="res-card"><img src="${photo(g.img)}" alt="${esc(g.de)}"><div><h4>${esc(g.de)} <span class="mono" style="font-size:12px;color:var(--muted)">${esc(g.lat)}</span></h4><p>Haken ${esc(hookTxt(g))} · Muster: ${g.flies.map(esc).join(", ")}</p><button class="btn" data-open="${g.id}">Details</button></div></div>`).join("")}</div>
  <div class="keybtns"><button class="btn" id="keyBack">← Zurück</button><button class="btn" id="keyReset">Neu starten</button></div>`;
}
$("#keyBox").addEventListener("click", e => {
  const op = e.target.closest(".opt");
  if (op) { const node = NODES[keyState.mode][keyState.path[keyState.path.length - 1]]; const t = node.opts[+op.dataset.i]; keyState.path.push(t[2]); keyState.labels.push(t[0]); renderKey(); return; }
  if (e.target.id === "keyBack") { keyState.path.pop(); keyState.labels.pop(); renderKey(); return; }
  if (e.target.id === "keyReset") { keyState.path = ["start"]; keyState.labels = []; renderKey(); return; }
  const d = e.target.closest("[data-open]"); if (d) openGroup(d.dataset.open);
});
$("#keyMode").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; keyState.mode = b.dataset.m; keyState.path = ["start"]; keyState.labels = []; $$("#keyMode button").forEach(x => x.classList.toggle("on", x === b)); renderKey(); });
renderKey();

/* ========== Praxis ========== */
const HOOKS = {4:[18,"Streamer, Salmonfly, große Wiesenheuschrecke"],6:[15,"große Steinfliege, Maikäfer, Grünes Heupferd"],8:[12,"Großer Hopper, Libellenlarve, Maifliege"],10:[10,"Köcherfliege, Schnake, Ephemera"],12:[8,"Sedge, Märzfliege, Hopper klein"],14:[6.5,"Kriecher-Eintagsfliege, Marienkäfer, Köcherfliege"],16:[5,"Baetis, Ameise, Blattlaus groß"],18:[4,"kleine Baetis, Fliegende Ameise, Kriebelmücke"],20:[3,"Caenis, kleine Zuckmücke, Trico"],22:[2.5,"Mikro-Köcher, Midge-Emerger"],24:[2,"Trico, Zuckmücke"],26:[1.5,"Winz-Caenis, Midge-Adult"]};
$("#hookTable").innerHTML = `<thead><tr><th>Größe</th><th>Körperlänge ≈</th><th>Typische Beute</th></tr></thead><tbody>${Object.keys(HOOKS).map(Number).sort((a, b) => a - b).map(s => `<tr><td>#${s}</td><td>${HOOKS[s][0]} mm</td><td>${esc(HOOKS[s][1])}</td></tr>`).join("")}</tbody>`;
$("#tips").innerHTML = [
  ["Wasser lesen", "Beobachte 10 Minuten, bevor du auswirfst: Gibt es Ringe (Steiger), Schwärme über dem Wasser, Insekten auf Steinen oder Spinnweben? Das sagt dir Ordnung und Stadium."],
  ["Stadium bestimmen", "Steiger im Film = Emerger/Dun; flatternde Insekten und Spritzer = Köcherfliege; Spinnerfall am Abend = Spent-Muster. Ohne Anzeichen: Nymphe am Grund."],
  ["Größe vor Farbe", "Erst die Größe treffen, dann Silhouette, dann Farbe. Eine zu große Fliege wird häufiger abgelehnt als eine falsche Farbe."],
  ["Netz & Stein", "Kicksampling (Netz unterhalten, Kies aufwühlen) oder Steine umdrehen zeigt, was am Grund wirklich lebt. Fange nur zu Beobachtungszwecken und setze die Tiere zurück."],
  ["Wassertemperatur", "Steinfliegen und Baetis mögen kühles Wasser (unter 10 °C), Köcherfliegen und Hopper warme Tage. Zuckmücken sind immer da. Bei >20 °C Wasser den Fisch schonen."],
  ["Drift & Zug", "Eintagsfliegen: dead drift, drag-frei. Köcherfliegen: gelegentlich skaten oder zupfen. Hopper/Käfer: laut ablegen. Stillwasser: sehr langsam, Zuckmücken oft regungslos."],
  ["Tageszeit", "Frühling: Mittag bis Nachmittag. Sommer: früh morgens und abends (Köcher, Spinner, Caenis). Herbst: wieder Mittag. Nachts: Große Sedges und Motten."],
  ["Notizbuch", "Notiere Datum, Wassertemperatur, Schlupf, Muster und Erfolg. Nach einer Saison hast du deinen persönlichen Schlupfkalender für das Gewässer."]
].map(([t, p], i) => `<article class="tipc"><h4><span class="n">${i + 1}</span>${esc(t)}</h4><p>${esc(p)}</p></article>`).join("");
const STARTER = ["baetidae","ephemerellidae","heptageniidae","limnephilidae","hydropsychidae","perlidae","midge_pupa","midge_adult","caelifera","lasius","tipulidae","zygoptera"];
$("#starter").innerHTML = STARTER.map(id => { const g = ALL.find(x => x.id === id); const im = g.fly || g.img; return `<button class="sf" data-open="${g.id}"><img loading="lazy" src="${photo(im)}" alt="${esc(g.flyName || g.de)}"><div><b>${esc(g.flyName || g.flies[0])}</b>${esc(g.de)} · ${esc(hookTxt(g))}</div></button>`; }).join("");
$("#starter").addEventListener("click", e => { const b = e.target.closest("[data-open]"); if (b) openGroup(b.dataset.open); });

/* ========== Start ========== */
const start = location.hash.slice(1);
showTab(start || "home");
applyFilters();
