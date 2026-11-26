S = '../site/'
a = open(S + 'app.js', encoding='utf8').read()
if 'function toast(' not in a:
    a = a.replace('/* ========== Navigation ========== */', '''/* ========== Hinweis-Toast ========== */
let toastT;
function toast(t) {
  let el = document.getElementById("toast");
  if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
  el.textContent = t; el.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove("on"), 2200);
}

/* ========== Navigation ========== */''', 1)
    a = a.replace('''  $$(".panel-sec").forEach(s => s.classList.toggle("hidden", s.id !== "tab-" + id));
  if (id === "map") renderMap();''', '''  $$(".panel-sec").forEach(s => s.classList.toggle("hidden", s.id !== "tab-" + id));
  const act = sn.querySelector("[aria-selected=true]"); if (act) act.scrollIntoView({inline: "center", block: "nearest"});
  if (id === "map") renderMap();''', 1)
open(S + 'app.js', 'w', encoding='utf8').write(a)

f = open(S + 'features.js', encoding='utf8').read()
f = f.replace('const msg = t => { $("#logMsg").textContent = t; };', 'const msg = t => { $("#logMsg").textContent = t; toast(t); };')
old = '''<tbody>${rows.map(r => `<tr><td>${esc(r.date)}</td><td>${esc(r.water)}</td><td>${esc(r.fish)}</td><td>${esc(r.len || "")}</td><td>${esc(r.fly)}</td><td>${esc(r.hook || "")}</td><td>${esc(r.temp || "")}</td><td>${esc(r.note || "")}</td><td><button class="btn sm" type="button" data-del="${r.id}" aria-label="Eintrag löschen">×</button></td></tr>`).join("")}</tbody>`'''
new = '''<tbody>${rows.map(r => `<tr><td data-label="Datum">${esc(r.date)}</td><td data-label="Gewässer">${esc(r.water)}</td><td data-label="Fisch">${esc(r.fish)}</td><td data-label="Länge">${esc(r.len ? r.len + " cm" : "–")}</td><td data-label="Muster">${esc(r.fly)}</td><td data-label="Haken">${esc(r.hook || "–")}</td><td data-label="Wasser °C">${esc(r.temp || "–")}</td><td data-label="Notiz">${esc(r.note || "–")}</td><td data-label=""><button class="btn sm" type="button" data-del="${r.id}" aria-label="Eintrag löschen">×</button></td></tr>`).join("")}</tbody>`'''
assert old in f
f = f.replace(old, new)
f = f.replace('''$("#logTable").innerHTML = rows.length ?''', '''$("#logTable").classList.add("stack"); $("#logTable").innerHTML = rows.length ?''')
open(S + 'features.js', 'w', encoding='utf8').write(f)

c = open(S + 'style.css', encoding='utf8').read()
if 'Phone-Usability' not in c:
    c += open('v3.css', encoding='utf8').read()
open(S + 'style.css', 'w', encoding='utf8').write(c)
print('ok')
