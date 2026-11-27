"use strict";
/* Wissensseiten: Technik-Matrix, Gewässer lesen, Glossar */

/* ============ 1) TECHNIK ============ */
const FLOWS = [["riffle", "Schnell & flach"], ["run", "Mittel & gleichmäßig"], ["pool", "Langsam & tief"]];
const TECH = [
  {k: "nymph", t: "Nymphe am Grund", sub: "Larven, Nymphen, Puppen",
   when: "Immer, wenn nichts steigt. Bei kaltem Wasser (unter etwa 10 °C) ist es die wichtigste Methode, weil die Fische tief stehen und kaum nach oben gehen.",
   idea: "Die Fliege driftet frei wie ein natürliches Insekt in der unteren Wasserschicht, dort wo die Fische die meiste Nahrung finden. Die Strömung ist am Grund deutlich langsamer als an der Oberfläche, deshalb muss die Fliege sinken, bevor sie am Fisch ankommt: Wirf deutlich oberhalb der Stelle an.",
   gear: "Indikator-Vorfach (Länge etwa 1,5× Wassertiefe) oder Euro-Vorfach mit Sighter. Beschwerte Nymphe (Kugelkopf) oder Schrot. Tippet 4X–6X.",
   bite: "Der Indikator stoppt, zuckt, taucht schräg oder bewegt sich anders als die Strömung. Beim Euronymphing zeigt sich der Biss als Zupfen oder Stopp im Sighter. Im Zweifel anschlagen: kurz und flüssig, nicht ruckartig.",
   err: ["Fliege driftet zu hoch: Sie muss nahe am Grund laufen, gelegentlich leicht anticken.", "Schnur zieht die Fliege (Drag): Schnur mit Mending oder hoher Rutenhaltung entlasten.", "Zu grobes Tippet in klarem, langsamem Wasser."],
   flow: {riffle: "Mehr Gewicht, kurze Drift, Fliege in die kleinen Taschen und Kanten. Die Fische müssen schnell zugreifen und sind weniger scheu.",
          run: "Der klassische Platz: lange, saubere Drift in der Futterspur, in Schritten flussabwärts abfischen.",
          pool: "Leichter und feiner fischen, langsamere Drift, kleiner Indikator. Fische sehen die Fliege lange, daher nur unauffällige, kleine Muster (z. B. Pheasant Tail)."},
   flies: ["pheasant-tail", "hares-ear", "zebra-midge"], groups: ["baetidae", "heptageniidae", "ephemerellidae", "hydropsychidae"],
   extra: "Steinfliegen schlüpfen an Land: Ihre Nymphen wandern vor dem Schlupf zum Ufer. Dort, dicht an Steinen und Uferkante, sind Steinfliegennymphen besonders wirksam."},
  {k: "emerger", t: "Emerger im Film", sub: "Aufsteigende Nymphe, Puppe, Schlupf",
   when: "Wenn Fische steigen, aber du keine Duns auf dem Wasser siehst, oder wenn sie deine Trockenfliege ignorieren. Beginn des Schlupfs.",
   idea: "Der Emerger steckt im oder knapp unter dem Oberflächenfilm und kann nicht mehr fliehen. Das ist der verletzlichste Moment des Insekts und für Fische eine leichte Beute. Daher nehmen sie oft gezielt Emerger und lassen fertige Duns treiben.",
   gear: "Emerger-Muster (Klinkhamer, CDC) oder Soft Hackle. Als Dropper 40–60 cm hinter einer Trockenfliege oder allein. Tippet 5X–6X, leicht gefettet nur an der Spitze (Emerger soll im Film hängen).",
   bite: "Sanftes Wölben oder Kopf-Schwanz-Ring, oft ohne sichtbare Schnauze. Anschlag mit kleiner Verzögerung, ruhig.",
   err: ["Fische nehmen Emerger, du bietest eine Dun-Imitation an.", "Emerger wird zu stark gefettet und schwimmt auf statt im Film.", "Zu früh anschlagen: Fisch hat die Fliege noch nicht im Maul."],
   flow: {riffle: "Selten die Hauptmethode, Emerger werden schnell weggespült. Soft Hackle quer-abwärts über Kanten swingen.",
          run: "Ideal: Emerger als Dropper hinter der Trockenfliege, dragfrei in der Futterspur.",
          pool: "Der Film ist ruhig und Fische prüfen genau: Kleine, schlanke Muster, lange Vorfächer, präzise vor den Fisch legen."},
   flies: ["klinkhamer", "partridge-orange", "sparkle-pupa"], groups: ["baetidae", "ephemerellidae", "midge_pupa"]},
  {k: "dry", t: "Trockenfliege", sub: "Duns, adulte Eintagsfliegen, Zuckmücken",
   when: "Bei sichtbarem Schlupf und steigenden Fischen. Hauptzeit je nach Art und Jahreszeit mittags (Baetis im Herbst/Frühling) bis abends (große Eintagsfliegen im Sommer).",
   idea: "Die Fliege muss exakt so treiben wie das echte Insekt: ohne Zug (dragfrei). Schon ein kleines V hinter der Fliege verrät sie. Platziere sie etwa 30–60 cm oberhalb des Fisches, damit er sie ruhig kommen sieht.",
   gear: "Langes, feines Vorfach (2,7–4 m), Tippet 5X–7X. Parachute, Comparadun oder CDC. Größe passend zum Naturinsekt: Größe zuerst, Muster später.",
   bite: "Sichtbarer Ring um die Fliege oder die Fliege verschwindet. Einen Moment warten (Fisch dreht sich zurück), dann anheben, nicht reißen.",
   err: ["Drag: Fliege zieht eine V-Welle. Lösung: Reach Cast oder Slack-Line-Wurf mit S-Kurven.", "Schnur oder Vorfach fällt über den Fisch (er flüchtet). Seitlich oder von unten anwerfen.", "Falsche Größe: Fische sind bei Schlupf oft auf ein einziges Insekt fixiert."],
   flow: {riffle: "Muster mit mehr Auftrieb und Sichtbarkeit (Elk-Hair-Typen, Parachute). Kurze Drift, viele Würfe. Die Strömung tarnt den Angler.",
          run: "Comparadun oder Parachute. Auf einzelne Fische anspielen, nicht blind absuchen.",
          pool: "Sehr feines Vorfach (6X–7X), tief stehende, unauffällige Fliege, Anschleichen und lange Drift. Fische beurteilen jede Fliege in Ruhe."},
   flies: ["adams", "elk-hair-caddis", "griffiths-gnat"], groups: ["baetidae", "ephemerellidae", "heptageniidae"]},
  {k: "spinner", t: "Spinnerfall (Spent)", sub: "Erschöpfte Spinner im Film",
   when: "Abends und morgens nach Eiablage der Eintagsfliegen. Oft zeigen sich nach dem Schlupf viele ruhige Ringe, die Fische ignorieren Duns.",
   idea: "Nach der Eiablage fallen die Weibchen erschöpft aufs Wasser, die Flügel liegen flach im Film. Die Fische fressen sie gezielt und genau. Die Spinner sammeln sich in Strömungsrinnen, Kehrwassern und am Poolende (Tailout).",
   gear: "Spent-Spinner mit flach liegenden Flügeln (CDC, Poly-Wing), nicht gefettet an Körper. Tippet 6X–7X. Bei Dämmerung hilft ein sichtbarer Post oder Indikator-Abschnitt.",
   bite: "Leise, schlürfende Ringe. In der Dämmerung musst du auf den Ring statt auf die Fliege achten: Wirf oberhalb und schlage an, wenn der Ring an der erwarteten Stelle erscheint.",
   err: ["Aufrechte Dun-Imitation statt flach liegender Spinner.", "Zu schwere Annäherung: Im Tailout sind die Fische besonders vorsichtig.", "Zu früh aufgeben: Das Zeitfenster ist kurz, 20–60 Minuten, und oft spät."],
   flow: {riffle: "Selten relevant, Spinner sammeln sich in ruhigeren Zonen.",
          run: "Strömungsrinnen und Kanten absuchen, Fische stehen dort in der Futterspur.",
          pool: "Hauptort: Tailout und Kehrwasser. Sehr fein, präzise, unauffällig, in der Dämmerung."},
   flies: ["cdc-spinner", "adams"], groups: ["baetidae", "ephemerellidae", "heptageniidae", "ephemeridae"]},
  {k: "caddis", t: "Köcherfliegen & Steinfliegen (Adulte)", sub: "Skitter, Twitch, Eiablage",
   when: "Abends in warmen Nächten und bei Schlupf. Köcherfliegen sind aktiv, laufen über den Film und tauchen zur Eiablage; Steinfliegen legen Eier mit Tippen auf das Wasser.",
   idea: "Anders als Eintagsfliegen treiben diese Insekten nicht hilflos. Köcherfliegen schlüpfen schnell, flattern und laufen über die Oberfläche (Skitter). Biete die Fliege deshalb auch mit Bewegung an: kleine Zupfer, Anlauf, Swing am Ende der Drift.",
   gear: "Elk Hair Caddis, Stimulator (große Steinfliegen). Tippet 4X–5X, weil die Bisse hart sein können. Dropper mit Puppe/Soft Hackle ist stark.",
   bite: "Oft spritzig und kräftig, auch am Ende des Swings (Fisch folgt der Fliege). Bei Puppen: plötzlicher Zug im Swing.",
   err: ["Nur tote Drift, wenn Fische aktive Insekten jagen.", "Zu fein gefischt: Die Bisse sind hart.", "Falsche Tageszeit: Viele Köcherfliegen fliegen abends und nachts."],
   flow: {riffle: "Skitter und Swing in Wellen und über Kanten. Sehr dankbare Methode.",
          run: "Zupfen oder Drift mit Anlauf am Ende. Auch Dropper (Puppe) unter der Trockenfliege.",
          pool: "Am Ende des Pools Dämmerung nutzen, Spent-Fliegen oder Elk Hair, still schwimmend."},
   flies: ["elk-hair-caddis", "stimulator", "sparkle-pupa"], groups: ["limnephilidae", "hydropsychidae", "brachycentridae", "perlidae"]},
  {k: "terr", t: "Landinsekten (Terrestrials)", sub: "Ameisen, Käfer, Heuschrecken, Zikaden",
   when: "Hoch- und Spätsommer, besonders an warmen, windigen Tagen und an bewachsenen Ufern. Fliegende Ameisen im Spätsommer.",
   idea: "Land-Insekten fallen zufällig ins Wasser, besonders bei Wind. Fische erwarten sie unter Büschen, Gras und Bäumen. Eine Fliege mit hörbarem Aufprall (Plop) kann hier ein Vorteil sein, weil sie die Fische aufmerksam macht.",
   gear: "Foam-Ant, Käfer, Hopper. Gerne als Dry-Dropper mit Nymphe darunter. Tippet 3X–5X, kurze Vorfächer sind okay.",
   bite: "Oft plötzlich und kräftig, aus dem Schatten des Ufers. Anschlag sofort, Fisch verschwindet sonst schnell in der Deckung.",
   err: ["Zu weit vom Ufer entfernt. Die meisten Insekten fallen innerhalb 30–60 cm vom Ufer ins Wasser.", "Zu perfekte Drift: Land-Insekten zappeln oder treiben unregelmäßig.", "Falsche Jahreszeit: Im Frühjahr ist das Angebot gering."],
   flow: {riffle: "Hopper und Ameise in die Kanten und hinter Steine.",
          run: "Dicht entlang der bewachsenen Uferseite.",
          pool: "Unter überhängenden Ästen und an der Außenkurve, mit Anschleichen und kurzer Distanz."},
   flies: ["foam-ant", "stimulator"], groups: ["lasius", "alate", "melolontha", "phyllopertha", "tettigonia", "caelifera"]}
];

const TLAB = {nymph: "Nymphe", emerger: "Emerger", dry: "Trockenfliege", spinner: "Spinnerfall", caddis: "Köcher & Stein (adult)", terr: "Landinsekten"};
const RISES = [
  ["Sanfter Ring ohne Blasen, Kopf und Rücken erscheinen kurz", "Insekten an der Oberfläche: Duns oder Spinner", "Trockenfliege in passender Größe, dragfrei"],
  ["Wölbung der Oberfläche, keine Schnauze sichtbar (Bulging)", "Emerger oder Nymphen kurz unter dem Film", "Emerger, Soft Hackle oder leicht beschwerte Nymphe im Film"],
  ["Platscher oder Spritzer, Fisch jagt", "Aktive Insekten: Köcherfliegen, Landinsekten, große Schlupfwelle", "Elk Hair Caddis oder Hopper, mit Bewegung angeboten"],
  ["Rückenflosse oder Schwanz ragt in flachem Wasser aus dem Wasser (Tailing)", "Nymphen und Krebse vom Grund", "Kleine Nymphe oder Scud nah am Grund, vorsichtig anschleichen"],
  ["Ring mit leisem, schlürfendem Geräusch in Strömungsrinne oder Kehrwasser, abends", "Spinnerfall oder Mücken im Film", "Spent-Spinner oder Griffith’s Gnat im Film"],
  ["Fisch springt ganz aus dem Wasser", "Oft aufsteigende Köcherfliegenpuppen, kann aber auch ohne Futter geschehen", "Puppen-Muster im Aufstieg oder Swing, nicht lange auf Springer warten"]
];

/* ============ 2) GEWÄSSER LESEN ============ */
const HABS = [
  {k: "riffle", t: "Riffle (Stromschnelle)", look: "Flaches, schnelles Wasser über Kies und Steinen, Oberfläche gekräuselt.",
   role: "Hier entsteht das meiste Futter: Strömungsliebende Larven sitzen auf und unter den Steinen, von hier driften sie flussabwärts. Zugleich sind die Fische weniger scheu, weil die unruhige Oberfläche den Angler tarnt.",
   groups: ["baetidae", "heptageniidae", "ephemerellidae", "hydropsychidae", "rhyacophilidae", "glossosomatidae", "simuliidae", "perlidae"],
   fish: "Eher kleinere bis mittlere Fische in Taschen und an Kanten; große Fische halten sich in tiefen Rinnen oder am Auslauf des Riffles.",
   how: "Kurze Distanz, beschwerte Nymphen oder Dry-Dropper, Fliege in jede Tasche. Mit hohen Würfen und kurzer Drift abfischen."},
  {k: "run", t: "Run (gleichmäßige Strömung)", look: "Gleichmäßig strömend, Tiefe etwa 0,5–1,5 m, Oberfläche leicht gewellt.",
   role: "Die Hauptdriftbahn: Nymphen und Larven aus den Riffles treiben hier in der Futterspur. Bei Schlupf steigen hier die meisten Fische.",
   groups: ["baetidae", "ephemerellidae", "leptophlebiidae", "limnephilidae", "brachycentridae"],
   fish: "Fische stehen in der Futterspur (feeding lane) und an Strömungskanten. Äschen halten sich eher im freien Wasser, Forellen näher an Deckung.",
   how: "Klassischer Platz für tote Nymphen-Drift und Trockenfliege. Systematisch in Schritten abfischen."},
  {k: "pool", t: "Pool (Kolk, tief und langsam)", look: "Tief, langsam, oft dunkle Farbe, wenig Oberflächenbewegung.",
   role: "Sediment am Rand und Boden: grabende Eintagsfliegen (Ephemera), Zuckmückenlarven und Kleine Weiße (Caenis). Hier sammeln sich auch Spinner und Schaum.",
   groups: ["ephemeridae", "polymitarcyidae", "caenidae", "midge_larva", "midge_pupa"],
   fish: "Große, vorsichtige Fische, oft tagsüber tief und aktiv in der Dämmerung. Sie sehen alles in Ruhe.",
   how: "Lange feine Vorfächer, Anschleichen, tagsüber tief nymphen, in der Dämmerung Trockenfliege."},
  {k: "tail", t: "Tailout (Auslauf des Pools)", look: "Der Übergang vom tiefen Pool zum nächsten Riffle: glatt, flacher werdend, oft spiegelnd.",
   role: "Strömung und Schaum bündeln Spinner, Emerger und Mücken. Hier erscheinen abends die meisten Ringe.",
   groups: ["baetidae", "ephemerellidae", "midge_adult", "caenidae"],
   fish: "Fische stehen exponiert und kritisch, weil die Oberfläche glatt ist. Sie betrachten die Fliege genau.",
   how: "Sehr feines Tippet (6X–7X), kleine Fliege, seitlich von unten annähern, keine Schnur über den Fisch legen."},
  {k: "eddy", t: "Kehrwasser & Schaumlinie", look: "Rückströmung hinter Steinen und Kurven, oft eine Schaumlinie an der Grenze.",
   role: "Sammelstelle für alles, was treibt: Spinner, Duns, Landinsekten, Pollen. Futter kommt hier konzentriert an.",
   groups: ["midge_adult", "lasius", "alate", "coccinellidae"],
   fish: "Fische kreisen in der Rückströmung und nehmen alles an der Schaumlinie. Oft mehrere Ringe auf kleinem Raum.",
   how: "Fliege in die Schaumlinie, dragfrei. Die Kreisströmung zieht Schnur und Vorfach besonders schnell."},
  {k: "seam", t: "Strömungskante (Seam)", look: "Linie zwischen schnellem und langsamem Wasser, oft sichtbar als Wechsel von Wellen und glatter Fläche.",
   role: "Die Kante bringt Futter aus dem schnellen Wasser und bietet den Fischen zugleich Ruhe: wenig Kraftverbrauch, viel Nahrung.",
   groups: [],
   fish: "Die häufigste Standzone von Forelle und Äsche: auf der ruhigen Seite der Kante, leicht erhöht in der Strömung.",
   how: "Fliege entlang der Kante führen, Drift möglichst lang halten. Auch Dry-Dropper entlang der Kante."},
  {k: "cut", t: "Prallufer & unterspülte Ufer", look: "Außenkurve mit steilem Ufer, Wurzeln und Überhängen, oft tief und dunkel.",
   role: "Landinsekten fallen hier ins Wasser, Steinfliegennymphen leben im Uferbereich, Wurzeln und Höhlen bieten Deckung.",
   groups: ["lasius", "melolontha", "phyllopertha", "tettigonia", "caelifera", "perlidae"],
   fish: "Große Forellen stehen oft direkt am Ufer unter Überhang, tagsüber kaum sichtbar.",
   how: "Fliege 15–40 cm vom Ufer. Präzise, mit wenig Platz zum Werfen. Dry-Dropper oder Streamer."},
  {k: "weed", t: "Wasserpflanzen & Krautbänke", look: "Wasserhahnenfuß und andere Pflanzen, häufig in ruhigen, kalkreichen Bächen und Quellflüssen.",
   role: "Extrem insektenreich: Flohkrebse, Wasserasseln, Schnecken, Kleine Weiße (Caenis) und Zuckmückenlarven leben im Kraut.",
   groups: ["gammarus", "asellus", "snail", "caenidae", "midge_larva", "zygoptera", "leptoceridae"],
   fish: "Fische stehen in Lücken und an den Rändern der Pflanzen, oft in kleiner Deckung und mit Blick nach oben.",
   how: "Scud oder Nymphe knapp über dem Kraut. Trockenfliege in Lücken. Vorsichtig fischen: Pflanzen führen schnell zu Hängern."},
  {k: "pocket", t: "Taschenwasser (Pocket Water)", look: "Steine und Blöcke im schnellen Wasser, hinter jedem Stein eine kleine ruhige Zone.",
   role: "Strömungsliebende Larven leben an den Steinen. In jeder Tasche sammelt sich Drift, jede Tasche kann einen Fisch halten.",
   groups: ["heptageniidae", "rhyacophilidae", "hydropsychidae", "perlidae"],
   fish: "Meist ein Fisch pro Tasche, nahe Strömungsschutz hinter dem Stein. Typisch für Gebirgsflüsse wie die Soča.",
   how: "Kurze Würfe, kurzes Vorfach, Fliege 10–30 Sekunden in jeder Tasche. Von unten annähern, nicht stören."}
];

/* ============ 3) GLOSSAR ============ */
const WORDS = [
  ["Adult / Imago", "Insekt", "Das fertig entwickelte, geschlechtsreife Insekt mit voll entwickelten Flügeln. Bei Eintagsfliegen heißt dieses Stadium Spinner."],
  ["Aufsteigende Nymphe", "Insekt", "Nymphe oder Puppe auf dem Weg vom Grund zur Oberfläche, kurz vor dem Schlupf. Fische jagen sie gezielt."],
  ["Cerci (Schwanzfäden)", "Insekt", "Fadenförmige Anhänge am Hinterleib. Eintagsfliegen haben 2–3, Steinfliegen 2. Wichtiges Bestimmungsmerkmal."],
  ["Dun / Subimago", "Insekt", "Das erste geflügelte Stadium der Eintagsfliege. Matte Farbe, aufrechte Flügel. Es häutet sich nach einigen Stunden zum Spinner."],
  ["Drift", "Insekt", "Das Mitreißen von Insekten in der Strömung. Larven lösen sich vom Grund, besonders in der Dämmerung. Fische stehen so, dass sie die Drift fressen."],
  ["Eintagsfliegen", "Insekt", "Ordnung Ephemeroptera. Zwei geflügelte Stadien (Dun, Spinner), 2–3 Schwanzfäden, aufrechte Flügel."],
  ["Emergenz / Schlupf (Hatch)", "Insekt", "Das Schlüpfen der flugfähigen Insekten aus dem Wasser. Löst oft das Steigen der Fische aus."],
  ["Emerger", "Insekt", "Insekt im Moment des Schlüpfens, halb in der Nymphen- oder Puppenhaut, im oder unter dem Oberflächenfilm."],
  ["EPT", "Insekt", "Abkürzung für Ephemeroptera (Eintagsfliegen), Plecoptera (Steinfliegen), Trichoptera (Köcherfliegen). Die Gruppen reagieren empfindlich auf Verschmutzung und gelten als Indikator für gute Wasserqualität."],
  ["Exuvie", "Insekt", "Die abgestreifte Haut nach der Häutung oder dem Schlupf. Am Ufer oder auf Steinen findest du sie als Hinweis auf aktuelle Arten."],
  ["Flügelscheiden (wing pads)", "Insekt", "Ausbuchtungen auf dem Rücken der Nymphe. Wenn sie dunkel und groß sind, steht der Schlupf bald bevor."],
  ["Gattung / Familie / Ordnung", "Insekt", "Stufen der Biologie-Systematik: Ordnung (z. B. Eintagsfliegen) ⊃ Familie (z. B. Baetidae) ⊃ Gattung (z. B. Baetis) ⊃ Art."],
  ["Hemimetabol (unvollständige Verwandlung)", "Insekt", "Ei, Nymphe, Adult. Die Nymphe sieht dem Adulten ähnlich, hat aber noch keine Flügel. Eintags-, Stein- und Libellen."],
  ["Holometabol (vollständige Verwandlung)", "Insekt", "Ei, Larve, Puppe, Adult. Larve und Adult sehen völlig verschieden aus. Köcherfliegen, Zuckmücken, Käfer, Fliegen."],
  ["Katastrophendrift", "Insekt", "Massenhaftes Mitgerissenwerden von Larven durch Hochwasser, Austrocknung oder Verschmutzung. Kurzfristig viel Futter, danach oft Leere."],
  ["Köcher", "Insekt", "Das selbst gebaute Gehäuse mancher Köcherfliegenlarven aus Sand, Steinchen oder Pflanzenteilen."],
  ["Köcherfliegen", "Insekt", "Ordnung Trichoptera. Dachförmig gelegte, behaarte Flügel, lange Fühler, vollständige Verwandlung."],
  ["Nymphe", "Insekt", "Wasserlebendes Jugendstadium von Eintags-, Stein- und Libellen. Auch ein Fliegenmuster, das dieses Stadium nachahmt."],
  ["Puppe", "Insekt", "Ruhestadium bei vollständiger Verwandlung (Köcherfliegen, Zuckmücken). Vor dem Schlupf steigt sie zur Oberfläche auf."],
  ["Spinner", "Insekt", "Das geschlechtsreife Endstadium der Eintagsfliege. Glänzende, klare Flügel, sehr lange Schwanzfäden."],
  ["Spinnerfall", "Insekt", "Nach der Eiablage fallen die Weibchen erschöpft aufs Wasser. Die Fische fressen sie gezielt, oft abends."],
  ["Spent", "Insekt", "Erschöpfter Spinner mit flach ausgebreiteten Flügeln im Oberflächenfilm. Auch ein Fliegenmuster."],
  ["Steinfliegen", "Insekt", "Ordnung Plecoptera. Zwei Schwanzfäden, flach anliegende Flügel, Nymphe krabbelt zum Ufer und schlüpft an Land."],
  ["Terrestrials", "Insekt", "Landinsekten (Ameisen, Käfer, Heuschrecken), die zufällig ins Wasser fallen."],
  ["Univoltin", "Insekt", "Nur eine Generation pro Jahr. Viele Eintagsfliegen sind univoltin, andere (z. B. Baetis) haben mehrere Generationen."],
  ["Kriecher / Schwimmer / Klammerer / Grabende", "Insekt", "Die vier Nymphentypen der Eintagsfliegen nach Körperform und Lebensweise."],
  ["Comparadun", "Fliege & Binden", "Trockenfliege ohne Hackle, mit Hirschhaar-Flügel. Sitzt flach im Film und imitiert Duns."],
  ["CDC", "Fliege & Binden", "Cul de Canard: Federn vom Entenbürzel. Sie schwimmen sehr gut und bewegen sich natürlich, daher beliebt für Emerger und Spinner."],
  ["Dubbing", "Fliege & Binden", "Körpermaterial aus Fell oder Kunstfaser, das auf den Faden gedreht wird."],
  ["Hackle", "Fliege & Binden", "Feder (meist vom Hahn), die als Kragen um den Haken gewickelt wird. Sie hält die Trockenfliege über Wasser."],
  ["Klinkhamer", "Fliege & Binden", "Emerger-Muster, bei dem der Haken senkrecht im Film hängt und der Hackle auf dem Film steht."],
  ["Kugelkopf (Beadhead)", "Fliege & Binden", "Perle am Hakenkopf: Sie beschwert die Nymphe und sorgt für schnelleres Absinken."],
  ["Parachute", "Fliege & Binden", "Trockenfliege, bei der der Hackle waagerecht um einen Flügelpost gewickelt ist. Die Fliege sitzt tiefer im Film."],
  ["Schonhaken (barbless)", "Fliege & Binden", "Haken ohne Widerhaken oder mit angedrücktem Widerhaken. Pflicht beim Catch & Release."],
  ["Soft Hackle", "Fliege & Binden", "Nassfliege mit weicher Feder, die im Wasser pulsiert. Imitiert Emerger oder aufsteigende Puppen."],
  ["Streamer", "Fliege & Binden", "Große Fliege, die kleine Fische oder große Beute imitiert."],
  ["Scud", "Fliege & Binden", "Muster des Flohkrebses (Gammarus)."],
  ["Wing case", "Fliege & Binden", "Der Flügelscheiden-Abschnitt an einer Nymphen-Imitation, oft aus Folie oder Feder."],
  ["Anschlag", "Technik", "Das ruckartige Anheben der Rute, wenn der Fisch beißt, um den Haken zu setzen."],
  ["Dead Drift", "Technik", "Natürliche Drift ohne Zug der Schnur: Die Fliege treibt wie ein echtes Insekt mit der Strömung."],
  ["Down and Across", "Technik", "Fischen quer-abwärts: Die Fliege schwingt am Ende der Drift im Bogen."],
  ["Drag", "Technik", "Zug auf die Fliege durch die Fliegenschnur, der die Drift unnatürlich macht. Häufigster Fehler beim Trockenfliegenfischen."],
  ["Dry-Dropper", "Technik", "Trockenfliege mit Nymphe darunter als Dropper. Sie dient zugleich als Indikator."],
  ["Euronymphing / Contact Nymphing", "Technik", "Nymphen mit straffer Schnur und langem Vorfach, ohne Fliegenschnur im Wasser. Gibt direkten Kontakt zur Fliege."],
  ["Fischfenster", "Technik", "Der Kreis an der Wasseroberfläche, durch den der Fisch nach oben sehen kann. Er hat etwa 97° Öffnungswinkel; außerhalb sieht der Fisch nur Spiegelungen."],
  ["Indikator", "Technik", "Schwimmer oder auffälliger Vorfachteil, der den Biss einer Nymphe anzeigt."],
  ["Leisenring Lift", "Technik", "Die Nymphe sinkt und wird am Ende der Drift langsam angehoben. Imitiert aufsteigende Insekten."],
  ["Mending", "Technik", "Korrigieren der Schnur auf dem Wasser, um Drag zu verhindern."],
  ["Reach Cast", "Technik", "Wurf, bei dem die Schnur nach dem Wurf seitlich stromauf gelegt wird, damit die Fliege länger ohne Zug treibt."],
  ["Skitter / Skating", "Technik", "Die Fliege wird mit kleinen Zupfern über den Film gezogen. Imitiert eine laufende Köcherfliege."],
  ["Slack-Line-Wurf", "Technik", "Wurf mit bewusst lockerer Schnur in S-Kurven, damit die Fliege länger ohne Zug treibt."],
  ["Tightline", "Technik", "Nymphenfischen mit gespannter Schnur und ohne Indikator."],
  ["Bulging Rise", "Technik", "Wölbung der Oberfläche, bei der der Fisch einen Emerger knapp unter dem Film nimmt, ohne dass die Schnauze erscheint."],
  ["Cut Bank (Prallufer)", "Gewässer", "Steiles Außenufer einer Kurve, meist tief und mit Deckung."],
  ["Freestone", "Gewässer", "Gebirgsfluss, der von Regen und Schneeschmelze gespeist wird. Wassermenge und Temperatur schwanken stark."],
  ["Futterspur (Feeding Lane)", "Gewässer", "Die Strömungsbahn, in der die Drift hereinkommt. Dort stehen die Fische."],
  ["Kehrwasser (Eddy)", "Gewässer", "Rückströmung hinter Hindernissen oder an Kurven. Sammelt Treibgut und Insekten."],
  ["Lie (Standplatz)", "Gewässer", "Der Platz, an dem ein Fisch steht: Strömungsschutz, Deckung und Nahrung zugleich."],
  ["Pocket Water (Taschenwasser)", "Gewässer", "Wasser mit vielen Steinen und kleinen ruhigen Zonen dahinter."],
  ["Pool (Kolk)", "Gewässer", "Tiefe, langsam strömende Stelle."],
  ["Riffle", "Gewässer", "Flache, schnelle Stelle über Steinen und Kies mit gekräuselter Oberfläche."],
  ["Run", "Gewässer", "Gleichmäßig strömende Zone mittlerer Tiefe."],
  ["Seam (Strömungskante)", "Gewässer", "Grenze zwischen schneller und langsamer Strömung. Bevorzugter Standplatz."],
  ["Spring Creek (Quellfluss)", "Gewässer", "Fluss mit gleichmäßiger Temperatur und Wasserführung, speist sich aus Quellen. Oft klar, krautreich und fischreich."],
  ["Tailout", "Gewässer", "Der flache, glatte Auslauf eines Pools vor dem nächsten Riffle."],
  ["Tailwater", "Gewässer", "Fluss unterhalb eines Stausees mit kaltem, gleichmäßigem Wasser."],
  ["Tippet", "Ausrüstung", "Das dünne, letzte Stück des Vorfachs, an dem die Fliege hängt."],
  ["X-Stärke", "Ausrüstung", "Kennzeichnung des Tippet-Durchmessers: 0X ist dick, 8X ist sehr dünn."],
  ["Sighter", "Ausrüstung", "Auffällig gefärbtes Vorfachstück beim Euronymphing, das den Biss anzeigt."],
  ["Vorfach", "Ausrüstung", "Verjüngte Verbindung zwischen Fliegenschnur und Fliege."],
  ["Catch & Release (C&R)", "Ausrüstung", "Gefangene Fische werden schonend zurückgesetzt."],
  ["Mindestmaß / Schonzeit", "Ausrüstung", "Regeln pro Gewässer: Ab welcher Größe oder in welchem Zeitraum Fische entnommen oder gefangen werden dürfen. Immer vor der Anreise prüfen."]
];

(function wissenPages() {
  const E = esc;
  const pill = id => GROUP_BY_ID[id] ? `<button type="button" class="pill" data-open="${id}">${E(GROUP_BY_ID[id].de)}</button>` : "";
  const recPill = id => { const r = RECIPES.find(x => x.id === id); return r ? `<button type="button" class="pill" data-rec="${id}">${E(r.name)}</button>` : ""; };
  const openDelegate = el => el.addEventListener("click", e => { const b = e.target.closest("[data-open]"); if (b) openGroup(b.dataset.open); });

  /* ---------- Technik ---------- */
  let tStage = "nymph", tFlow = "run";
  function drawTech() {
    const t = TECH.find(x => x.k === tStage);
    $("#techStage").innerHTML = TECH.map(x => `<button type="button" role="tab" data-ts="${x.k}" aria-selected="${x.k === tStage}">${E(TLAB[x.k])}</button>`).join("");
    $("#techFlow").innerHTML = FLOWS.map(([k, l]) => `<button type="button" role="tab" data-tf="${k}" aria-selected="${k === tFlow}">${E(l)}</button>`).join("");
    $("#techCard").innerHTML = `<article class="stage-card"><div class="st-h"><h3>${E(t.t)}</h3><span class="chip">${E(t.sub)}</span></div>
      <h4>Wann</h4><p>${E(t.when)}</p>
      <h4>Die Idee</h4><p>${E(t.idea)}</p>
      <div class="flowhl"><b>${E(FLOWS.find(f => f[0] === tFlow)[1])}:</b> ${E(t.flow[tFlow])}</div>
      <div class="st-grid"><div><h4>Ausrüstung</h4><p>${E(t.gear)}</p><h4>Biss erkennen</h4><p>${E(t.bite)}</p></div>
      <div class="st-fish"><h4>Typische Fehler</h4><ul>${t.err.map(x => `<li>${E(x)}</li>`).join("")}</ul>${t.extra ? `<h4>Gut zu wissen</h4><p>${E(t.extra)}</p>` : ""}</div></div>
      <h4>Muster</h4><div class="pillrow">${t.flies.map(recPill).join("")}</div>
      <h4>Typische Insekten</h4><div class="pillrow">${t.groups.map(pill).join("")}</div></article>`;
  }
  $("#tab-tech").innerHTML = `<div class="page-head"><h2>Technik nach Stadium</h2><p>Wähle das Insektenstadium und die Strömung: Du siehst, wie du die Fliege anbietest, woran du den Biss erkennst und welche Fehler du vermeidest.</p></div>
    <h3 class="sub">Stadium</h3><div class="stagebar" id="techStage" role="tablist"></div>
    <h3 class="sub">Strömung</h3><div class="stagebar" id="techFlow" role="tablist"></div>
    <div id="techCard"></div>
    <h3 class="sub">Steigende Fische lesen</h3><p class="hint">Die Form des Rings verrät, was der Fisch frisst.</p>
    <div class="cal-wrap"><table class="cmp"><thead><tr><th>Das siehst du</th><th>Das frisst der Fisch</th><th>Das bietest du an</th></tr></thead><tbody>${RISES.map(r => `<tr>${r.map(c => `<td>${E(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  $("#tab-tech").addEventListener("click", e => {
    const a = e.target.closest("[data-ts]"); if (a) { tStage = a.dataset.ts; drawTech(); return; }
    const b = e.target.closest("[data-tf]"); if (b) { tFlow = b.dataset.tf; drawTech(); }
  });
  openDelegate($("#tab-tech")); drawTech();

  /* ---------- Gewässer lesen ---------- */
  let hab = "riffle";
  const diagram = () => `<svg viewBox="0 0 720 250" class="river" role="img" aria-label="Schema eines Flussabschnitts mit Riffle, Run, Pool, Tailout, Kehrwasser, Prallufer und Krautbank">
    <rect width="720" height="250" fill="#E9EFE6"/>
    <path d="M0 60 H720 V210 H0Z" fill="#B9D6E0"/>
    <g data-hab="riffle" class="hz"><rect x="0" y="60" width="150" height="150" fill="#9CC7D6"/><path d="M12 85l14-6 14 6 14-6 14 6 14-6 14 6 14-6M12 125l14-6 14 6 14-6 14 6 14-6 14 6 14-6M12 165l14-6 14 6 14-6 14 6 14-6 14 6 14-6" fill="none" stroke="#fff" stroke-width="2" opacity=".8"/><circle cx="50" cy="105" r="7" fill="#8A8F85"/><circle cx="100" cy="150" r="8" fill="#8A8F85"/><circle cx="60" cy="185" r="6" fill="#8A8F85"/><text x="75" y="55" text-anchor="middle">Riffle</text></g>
    <g data-hab="run" class="hz"><rect x="150" y="60" width="170" height="150" fill="#A9CFDC"/><path d="M165 105h140M165 135h140M165 165h140" stroke="#fff" stroke-width="1.5" opacity=".7" fill="none"/><text x="235" y="55" text-anchor="middle">Run</text></g>
    <g data-hab="seam" class="hz"><path d="M150 135 C230 135 280 135 330 135" stroke="#fff" stroke-width="3" stroke-dasharray="6 6" fill="none"/><text x="235" y="130" text-anchor="middle" fill="#124357">Seam</text></g>
    <g data-hab="pool" class="hz"><rect x="320" y="60" width="190" height="150" fill="#5E9DB5"/><text x="415" y="55" text-anchor="middle">Pool</text></g>
    <g data-hab="tail" class="hz"><rect x="510" y="60" width="90" height="150" fill="#C3DDE6"/><text x="555" y="55" text-anchor="middle">Tailout</text></g>
    <g data-hab="pocket" class="hz"><rect x="600" y="60" width="120" height="150" fill="#9CC7D6"/><circle cx="640" cy="105" r="10" fill="#8A8F85"/><circle cx="685" cy="150" r="11" fill="#8A8F85"/><circle cx="635" cy="185" r="9" fill="#8A8F85"/><text x="660" y="55" text-anchor="middle">Taschenwasser</text></g>
    <g data-hab="cut" class="hz"><rect x="320" y="210" width="190" height="30" fill="#8B6B3E"/><path d="M330 215l10 20M360 215l10 20M390 215l10 20M420 215l10 20M450 215l10 20M480 215l10 20" stroke="#5E4724" stroke-width="2"/><text x="415" y="206" text-anchor="middle" fill="#fff" font-size="12">Prallufer</text></g>
    <g data-hab="eddy" class="hz"><ellipse cx="270" cy="190" rx="38" ry="14" fill="#7FB1C4"/><path d="M245 190a25 9 0 1 1 50 0" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="3 3"/><text x="270" y="194" text-anchor="middle" font-size="12">Kehrwasser</text></g>
    <g data-hab="weed" class="hz"><path d="M530 195c4-14 8-14 10 0M545 195c4-18 9-18 11 0M562 195c4-12 8-12 10 0" fill="none" stroke="#3E7D3A" stroke-width="3"/><text x="555" y="238" text-anchor="middle" font-size="12">Kraut</text></g>
    <text x="10" y="20" font-size="12" fill="#3B4A41">Fließrichtung →</text><path d="M110 16h60" stroke="#3B4A41" stroke-width="2" marker-end="url(#ar)"/>
    <defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#3B4A41"/></marker></defs>
  </svg>`;
  function drawHab() {
    const h = HABS.find(x => x.k === hab);
    $$("#habSvg .hz").forEach(g => g.classList.toggle("on", g.dataset.hab === hab));
    $("#habBtns").innerHTML = HABS.map(x => `<button type="button" class="pill ${x.k === hab ? "on" : ""}" data-hab="${x.k}" aria-pressed="${x.k === hab}">${E(x.t.split(" (")[0])}</button>`).join("");
    $("#habCard").innerHTML = `<article class="stage-card"><div class="st-h"><h3>${E(h.t)}</h3></div><p class="lead2">${E(h.look)}</p>
      <h4>Warum hier Futter ist</h4><p>${E(h.role)}</p>
      <div class="st-grid"><div><h4>Wo der Fisch steht</h4><p>${E(h.fish)}</p></div><div class="st-fish"><h4>So fischst du es</h4><p>${E(h.how)}</p></div></div>
      ${h.groups.length ? `<h4>Typische Insekten</h4><div class="pillrow">${h.groups.map(pill).join("")}</div>` : ""}</article>`;
  }
  $("#tab-read").innerHTML = `<div class="page-head"><h2>Gewässer lesen</h2><p>Ein Fisch braucht drei Dinge: Nahrung, Deckung und Strömungsschutz. Tippe auf einen Bereich im Schema und sieh, welche Insekten dort leben, wo der Fisch steht und wie du fischst.</p></div>
    <div class="riverbox" id="habSvg">${diagram()}</div><p class="hint">Schema, nicht maßstäblich. Tippe auf einen Bereich oder wähle unten.</p>
    <div class="pillrow" id="habBtns"></div><div id="habCard"></div>
    <h3 class="sub">Die drei Regeln für die Standplatz-Suche</h3>
    <ul class="mistakes"><li>Nahrung: Fische stehen dort, wo die Drift hereinkommt (Futterspur, Kanten, Kehrwasserlinien).</li><li>Deckung: Steine, Wurzeln, Tiefe, Überhänge. Große Fische stehen fast immer mit Schutz im Rücken.</li><li>Energie: Sie suchen langsames Wasser direkt neben schnellem, damit sie wenig Kraft verbrauchen und viel Nahrung erreichen.</li></ul>`;
  $("#tab-read").addEventListener("click", e => {
    const b = e.target.closest("[data-hab]"); if (b) { hab = b.dataset.hab; drawHab(); if (b.closest("svg")) $("#habCard").scrollIntoView({block: "nearest", behavior: "smooth"}); }
  });
  openDelegate($("#tab-read")); drawHab();

  /* ---------- Glossar ---------- */
  let gc = "Alle", gq = "";
  const cats = ["Alle", ...Array.from(new Set(WORDS.map(x => x[1])))];
  const fold = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  function drawGloss() {
    $("#glCats").innerHTML = cats.map(c => `<button type="button" class="chip-btn ${c === gc ? "on" : ""}" data-gc="${E(c)}">${E(c)}</button>`).join("");
    const q = fold(gq.trim());
    const list = WORDS.filter(x => (gc === "Alle" || x[1] === gc) && (!q || fold(x[0] + " " + x[2]).includes(q))).sort((a, b) => a[0].localeCompare(b[0], "de"));
    $("#glCount").textContent = list.length + " Begriffe";
    $("#glList").innerHTML = list.map(x => `<div class="gl"><dt>${E(x[0])}<span class="chip">${E(x[1])}</span></dt><dd>${E(x[2])}</dd></div>`).join("") || `<p class="empty">Kein Begriff gefunden.</p>`;
  }
  $("#tab-gloss").innerHTML = `<div class="page-head"><h2>Glossar</h2><p>Die wichtigsten Begriffe aus Entomologie, Fliegenbinden, Technik und Gewässerkunde, durchsuchbar.</p></div>
    <div class="filterbar"><div class="fb-row"><label class="sr" for="glQ">Begriff suchen</label><input type="search" id="glQ" placeholder="Begriff suchen …"></div><div class="fb-row pillrow" id="glCats"></div></div>
    <p class="hint" id="glCount"></p><dl class="glossary" id="glList"></dl>`;
  $("#glQ").addEventListener("input", e => { gq = e.target.value; drawGloss(); });
  $("#glCats").addEventListener("click", e => { const b = e.target.closest("[data-gc]"); if (b) { gc = b.dataset.gc; drawGloss(); } });
  drawGloss();
})();
