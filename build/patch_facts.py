import re
S = '../site/'
f = open(S + 'features.js', encoding='utf8').read()
def rep(a, b, cnt=1):
    global f
    assert a in f, a[:70]
    f = f.replace(a, b, cnt)

# ---- X-Tabelle: Tragkraft (Mono, herstellerabhängig) und Hakengrößen nach gängigen Tabellen
rep('const X = [[0, .28, 5.0], [1, .25, 4.0], [2, .23, 3.5], [3, .20, 3.0], [4, .18, 2.4], [5, .15, 1.9], [6, .13, 1.5], [7, .10, 1.1], [8, .08, 0.8]];\n  $("#xTable").innerHTML = `<thead><tr><th>Stärke</th><th>Durchmesser</th><th>Tragkraft Nylon (ca.)</th><th>Typische Hakengröße</th></tr></thead><tbody>${X.map(([x, d, kg]) => `<tr><td>${x}X</td><td>${d.toFixed(2)} mm</td><td>${kg.toFixed(1)} kg</td><td>#${[2, 4, 6, 8, 12, 15, 18, 21, 24][x]}</td></tr>`).join("")}</tbody>`;',
    '''// [X, Durchmesser mm, Tragkraft kg (Nylon-Mittel), Tragkraft-Spanne, typische Hakengrößen]
  const X = [[0, .28, 7.0, "6–7", "#2–4 (bis 1/0)"], [1, .25, 6.0, "5–6", "#2–6"], [2, .23, 5.0, "4–5", "#4–8"], [3, .20, 3.9, "3,5–4", "#6–12"], [4, .18, 2.7, "2,5–3", "#12–18"], [5, .15, 2.2, "2–2,5", "#14–18"], [6, .13, 1.6, "1,5–1,8", "#16–22"], [7, .10, 1.1, "1–1,2", "#18–24"], [8, .075, 0.8, "0,7–0,9", "#22–28"]];
  $("#xTable").innerHTML = `<thead><tr><th>Stärke</th><th>Durchmesser</th><th>Tragkraft Nylon (ca.)</th><th>Typische Hakengrößen</th></tr></thead><tbody>${X.map(([x, d, kg, rng, hk]) => `<tr><td>${x}X</td><td>${String(d.toFixed(d < .1 ? 3 : 2)).replace(".", ",")} mm</td><td>${rng} kg</td><td>${hk}</td></tr>`).join("")}</tbody><tfoot><tr><td colspan="4" class="hint">Der Durchmesser ist genormt (0X = 0,011 Zoll, je X 0,001 Zoll dünner). Die Tragkraft hängt stark vom Hersteller ab (Nylon, Fluorocarbon, Alter) und schwankt um etwa ±25 %.</td></tr></tfoot>`;''')

# ---- Länge der Fliege = Körperlänge
rep('["~" + nf(mm) + " mm", "Länge der Fliege"]', '["~" + nf(mm) + " mm", "Körperlänge ≈"]')

# ---- Indikator-Nymphe
rep('''parts.push({n: "Konisches Vorfach", len: 2.4, d: .28, c: "base", mat: "Nylon, 2,4 m (0,45 → 0,28 mm)"});''',
    '''parts.push({n: "Konisches Vorfach", len: 2.7, d: .28, c: "base", mat: "Nylon, 2,7 m / 9 ft (0,45 → 0,28 mm)"});''')
rep('''notes.push(`Abstand Indikator – Fliege = ${nf(o.depth * 1.5, 2)} m (1,5 × Wassertiefe; bei starker Strömung bis 2 ×).`);
      notes.push("Kein Beadhead? Dann Schrot ca. 15–20 cm über der obersten Fliege anbringen. Beschwerte Fliegen bevorzugen.");
      notes.push("Drift: Indikator möglichst dragfrei mit der Strömung treiben lassen; ein Anheben oder Stocken ist der Biss.");''',
    '''notes.push(`Abstand Indikator – Fliege = ${nf(o.depth * 1.5, 2)} m: Faustregel 1,5 × Wassertiefe (in langsamem Wasser etwa 1,25 ×, in schneller Strömung 2 × und mehr). Die Länge des Vorfachs sollte nicht unter etwa 9 ft (2,7 m) fallen.`);
      notes.push("Ohne beschwerte Fliege: Schrot mindestens 25–30 cm (10–12 Zoll) über der unteren Fliege. Mehrere kleine Schrote verteilen statt ein großes zu bündeln, sonst klappt das Vorfach beim Wurf.");
      notes.push("Der Abstand wird je nach Quelle bis zur Fliege oder bis zum Schrot gemessen: im Zweifel zur untersten Fliege und anschließend anpassen.");
      notes.push("Drift: Indikator dragfrei mit der Strömung treiben lassen; Stocken, Eintauchen oder seitliches Abweichen ist der Biss.");''')

# ---- Euronymphe
rep('''parts.push({n: "Basis (Mono)", len: 3.0, d: .30, c: "base", mat: "Monofil 0,30 mm"});
    parts.push({n: "Übergang (Mono)", len: 1.5, d: .22, c: "mid", mat: "Monofil 0,22 mm"});
    parts.push({n: "Sighter (zweifarbig)", len: .4, d: .28, c: "sight", mat: "Bunter Mono 0,25–0,28 mm", ind: true});
    parts.push({n: "Tippet", len: tipLen, d: mmTip, c: "tip", mat: "Fluorocarbon", fly: n === 1 ? true : "drop", drops: n - 1});''',
    '''const dTip = Math.min(mmTip, .18);
    parts.push({n: "Basis (Mono)", len: 3.0, d: .35, c: "base", mat: "Monofil 0,30–0,40 mm"});
    parts.push({n: "Übergang (Mono)", len: 1.5, d: .25, c: "mid", mat: "Monofil 0,22–0,25 mm"});
    parts.push({n: "Sighter (zweifarbig)", len: .75, d: .20, c: "sight", mat: "Bunter Sighter-Mono 0,18–0,20 mm, 60–90 cm", ind: true});
    parts.push({n: "Tippet", len: tipLen, d: dTip, c: "tip", mat: "Fluorocarbon 4X–6X", fly: n === 1 ? true : "drop", drops: n - 1});''')
rep('''notes.push("Euronymphe (Tightline): Nur das Vorfach liegt im Wasser, die Fliegenschnur bleibt in der Luft. Rute 9–10 ft, Klasse #2–#4; Rute kurz anheben und führen, um Kontakt zu behalten.");
    notes.push(`Tippet ≈ ${nf(o.depth * 1.2, 1)} m (1,2 × Wassertiefe, mindestens 0,8 m). Fliegen im Abstand von 40–60 cm; Seitenarme (Dropper) 10–15 cm.`);
    notes.push("Der bunte Sighter zeigt den Kontakt an. Die schwerste Fliege (Jig oder Beadhead) kommt an das Ende, die leichtere an einen Seitenarm.");
    notes.push("Anzahl erlaubter Fliegen und Beschwerung vorher in der Gewässerordnung prüfen: je nach Revier gelten Grenzen.");''',
    '''notes.push("Euronymphe (Tightline): Nur das dünne Vorfach liegt im Wasser, die Fliegenschnur bleibt in der Luft. Übliche Ruten sind 10–11 ft in den Klassen #2–#4; die Rute führt die Fliegen und hält den Kontakt.");
    notes.push("Typische Gesamtlänge etwa 6–7 m (≈ 20 ft): Vorfach 3–4,5 m, Sighter 60–90 cm, Tippet rund 90 cm. Ein Tippet-Ring (2–2,5 mm) zwischen Sighter und Tippet erleichtert das Wechseln.");
    notes.push(`Tippet hier ≈ ${nf(tipLen, 1)} m (Faustregel 1,2 × Wassertiefe, mindestens 0,8 m). Fliegen mit etwa 40–60 cm Abstand; Seitenarme (Dropper) 10–15 cm.`);
    notes.push("Der bunte Sighter zeigt den Kontakt an. Die schwerste Fliege (Jig oder Beadhead) kommt an das Ende, leichtere an einen Seitenarm.");
    notes.push("Die Durchmesser sind Beispiele, die je nach Wassertiefe und Beschwerung variieren. Anzahl erlaubter Fliegen und Beschwerung vorher in der Gewässerordnung prüfen.");''')

# ---- Trockenfliege: Hinweise
rep('notes.push("Bei feinen Fischen auf 3,5–4,5 m verlängern; Tippet nach jedem Fliegenwechsel kürzen und unter ca. 30 cm ersetzen.");',
    'notes.push("Bei scheuen Fischen auf 3,5–4,5 m verlängern; Tippet nach jedem Fliegenwechsel kürzen und unter ca. 30 cm ersetzen. Faustregel für die Spitze: Hakengröße ÷ 3 = X-Stärke (z. B. #16 → 5X, mit 6X oder 4X als Alternative).");')

# ---- Bedingungen: Temperaturzonen nach Fischerei-Quellen (Regenbogenforelle: Fressbereich ca. 4–20 °C, Optimum ca. 11–18 °C, ab 20 °C Stress)
i = f.index('  function act(t) {')
j = f.index('  const INS = [')
f = f[:i] + '''  function act(t) {
    if (t < 4) return ["träge", "Sehr kalt: der Stoffwechsel ist stark gedrosselt, die Fische fressen kaum. Nur in der Tagesmitte, tiefe ruhige Gumpen, kleine Nymphen und Zuckmücken, sehr langsam.", "bad"];
    if (t < 10) return ["gedrosselt", "Kühl: Fische stehen tief und fressen verhalten. Nymphen und Zuckmücken-Muster nahe am Grund, besonders in der warmen Tagesmitte.", "warn"];
    if (t < 18) return ["optimal", "Bester Bereich (etwa 10–18 °C): Fische sind aktiv und fressen am Grund und an der Oberfläche. Alle Methoden sind möglich.", "good"];
    if (t < 20) return ["warm", "Grenzbereich: früh am Morgen fischen, schnelles, sauerstoffreiches Wasser suchen, Fische kurz drillen und schonend zurücksetzen. Äschen sind empfindlicher als Forellen, bei ihnen schon ab etwa 18 °C vorsichtig sein.", "warn"];
    return ["Angeln einstellen", "Zu warm: ab etwa 20 °C stehen Forellen unter Stress, der Sauerstoff wird knapp und die Sterblichkeit nach dem Drill steigt. Besser pausieren oder auf andere Arten ausweichen.", "bad"];
  }
''' + f[j:]
rep('["Baetidae", 4, 16]', '["Baetidae", 4, 16]')
open(S + 'features.js', 'w', encoding='utf8').write(f)

# ---- Skala im HTML an die Zonen anpassen (0–4 | 4–10 | 10–18 | 18–20 | 20–26)
h = open(S + 'index.html', encoding='utf8').read()
old = re.search(r'<div class="gauge" aria-hidden="true">.*?<span class="mk" id="cdMk"></span></div>\s*<div class="gauge-l" aria-hidden="true">.*?</div>', h, flags=re.S)
assert old
h = h.replace(old.group(0), '''<div class="gauge" aria-hidden="true"><i style="width:15.4%" class="z bad"></i><i style="width:23.1%" class="z warn"></i><i style="width:30.8%" class="z good"></i><i style="width:7.7%" class="z warn"></i><i style="width:23%" class="z bad"></i><span class="mk" id="cdMk"></span></div>
        <div class="gauge-l" aria-hidden="true"><span>0</span><span>4</span><span>10</span><span>18</span><span>20</span><span>26 °C</span></div>''')
open(S + 'index.html', 'w', encoding='utf8').write(h)

# ---- Tiefenseiten: Aussagen präzisieren
d = open(S + 'deep.js', encoding='utf8').read()
def drep(a, b):
    global d
    assert a in d, a[:70]
    d = d.replace(a, b, 1)
drep('Der Spinnerfall ist oft intensiver als der Schlupf.', 'Der Spinnerfall ist oft ebenso wichtig wie der Schlupf.')
drep('look: ["3 (selten 2) Schwanzfäden"', 'look: ["Meist 3 Schwanzfäden (bei manchen Arten 2 oder ein stark verkürzter mittlerer)"')
drep('Beim Abtauchen trägt eine Luftschicht die Weibchen wie ein silbernes Blasenkleid.', 'Einige Arten tauchen dafür unter, getragen von einer silbrigen Luftschicht. Die Eiablage verläuft meist verstreuter als ein Spinnerfall bei Eintagsfliegen.')
drep('Die reife Puppe schneidet sich frei, steigt schnell zur Oberfläche und wird dabei von Fischen gejagt. An der Oberfläche platzt die Haut, und das Adult schlüpft in Sekunden.',
     'Die reife Puppe schneidet sich frei und driftet oft minutenlang am Grund, bevor sie, getragen von Luftbläschen, zur Oberfläche aufsteigt. Dabei und im Film ist sie besonders gefährdet. An der Oberfläche platzt die Haut, und das Adult schlüpft in Sekunden.')
drep('["Larve / Nymphe", "3 Schwanzfäden, Kiemen seitlich, 1 Kralle", "Raupenartig, Haken am Hinterende, oft im Köcher", "2 Schwanzfäden, flach, 2 Krallen"]',
     '["Larve / Nymphe", "Meist 3 Schwanzfäden, Kiemen seitlich, 1 Kralle pro Fuß", "Raupenartig, keine Schwanzfäden, Nachschieber mit Haken am Hinterende, oft im Köcher", "2 Schwanzfäden, flach, 2 Krallen pro Fuß"]')
d = d.replace('"Der Schlupf der Köcherfliegen ist schneller', '"Der Schlupf der Köcherfliegen ist schneller')
open(S + 'deep.js', 'w', encoding='utf8').write(d)
print('ok')
