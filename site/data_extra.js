/* Ergänzungen: weitere Gruppen + Untergruppen / wichtige Arten (SUBS)
   Jeder Eintrag: [wissenschaftlicher Name, deutscher/englischer Name, Hinweis für Angler] */
"use strict";

(function () {
  const findOrder = id => { let o = null; DATA.forEach(b => b.orders.forEach(x => { if (x.id === id) o = x; })); return o; };
  const branchOf = id => DATA.find(b => b.orders.some(o => o.id === id));
  const add = (orderId, g) => { const o = findOrder(orderId); g.order = o.id; g.branch = branchOf(orderId).key; g.orderDe = o.de; o.groups.push(g); ALL.push(g); };

  /* ----- Neue Ordnung: weitere Landtiere ----- */
  DATA.find(b => b.key === "land").orders.push({
    id: "landother", de: "Weitere Landtiere", en: "Other terrestrials", lat: "Isoptera · Heteroptera · Araneae", photo: "ins_spider.jpg",
    blurb: "Termiten, Wanzen und Spinnen: seltener, aber regional und saisonal ein sicherer Happen.",
    id_features: ["Termiten: gerade Fühler, 4 gleich lange Flügel (Schwärmer)", "Wanzen: Rückenschild, Stechrüssel, Flügel halb hart", "Spinnen: 8 Beine, kein Fühler, 2 Körperabschnitte (keine Insekten)"],
    stages: ["Ei", "Jungtier", "Adult"],
    stageTip: "Termitenschwärmer fliegen nach Regenfällen in Massen aus und landen oft auf dem Wasser – regional ein Hauptereignis. Spinnen laufen vom Ufer aufs Wasser oder werden verweht; Jagdspinnen wie Dolomedes leben am Wasser.",
    groups: []});

  add("mayfly", {id:"isonychiidae", de:"Slate Drakes", en:"Slate Drake · Isonychia", lat:"Isonychiidae", hook:[10,12],
    info:"Kräftige, dunkelgraue Eintagsfliegen mit schwimmstarken Larven, die zum Schlupf zum Ufer krabbeln. Vor allem Nordamerika (Isonychia bicolor im Osten), außerdem Teile Asiens. In Europa fehlt die Familie.",
    tip:"Nymphen im Spätsommer und Frühherbst in schnellem Wasser, beim Schlupf Slate-Drake-Dun (dunkelgrau, #10–12) an Strömungskanten.",
    flies:["Slate Drake","Isonychia Nymph"], img:"ins_isonychia.jpg", fly:null, flyName:"",
    season:S("5-6:2,7-9:3,10:1"), day:"Abend", water:"Fließgewässer", geo:R("NA3 MA1 SA1 AS2"), geoNote:"Nur Neue Welt und Asien; nicht in Europa."});
  add("caddis", {id:"glossosomatidae", de:"Sattel-Köcherfliegen", en:"Saddle-case Caddis", lat:"Glossosomatidae", hook:[16,18],
    info:"Die Larven bauen kuppelförmige Steinköcher („Schildkröten“) auf Steinen in schnellem Wasser. Der Köcher hat eine Unterseite, die die Larve beim Verpuppen verschließt.",
    tip:"Kleine grüne bis gelbliche Larven oder Puppen nahe am Grund; Puppen steigen in der Strömung zur Oberfläche.",
    flies:["Green Caddis Larva","Soft Hackle"], img:"ins_glossosoma.jpg", fly:null, flyName:"",
    season:S("4-5:2,6-8:3,9:1"), day:"Abend", water:"Fließgewässer", geo:R("NA3 MA1 EU3 NAS2 ME1 AS2"), geoNote:"Holarktisch; Gebirgsbäche und schnelle Rinnen."});
  add("caddis", {id:"polycentropodidae", de:"Trichternetz-Köcherfliegen", en:"Trumpet-net Caddis", lat:"Polycentropodidae", hook:[12,16],
    info:"Larven spinnen trichterförmige Fangnetze in ruhigerem Wasser und in Seen. Köcherlose Larven, räuberisch.",
    tip:"In Seen und langsamen Rinnen kleine, braune Puppen- oder Adult-Muster am Abend.",
    flies:["Brown Sedge","Caddis Pupa"], img:"ins_polycentropus.jpg", fly:null, flyName:"",
    season:S("5:1,6-8:3,9:2"), day:"Abend", water:"beides", geo:R("NA3 MA2 SA1 EU3 NAS2 ME2 AF2 AS3 OC1"), geoNote:"Weit verbreitet."});
  add("stone", {id:"capniidae", de:"Winter-Steinfliegen", en:"Winter Stones", lat:"Capniidae", hook:[18,20],
    info:"Kleine, schwarze, schlanke Steinfliegen, die im Winter schlüpfen und oft auf Schnee und Eis umherlaufen. Die erste Insektenmahlzeit des Jahres.",
    tip:"Nur in sonnigen Pausen im Januar bis März: kleine schwarze Nymphe oder Trockenfliege (#18–20) nahe der Strömungskante.",
    flies:["Little Black Stone","Winter Stone"], img:"ins_capnia.jpg", fly:null, flyName:"",
    season:S("12:1,1-3:3,4:1"), day:"Mittag", water:"Fließgewässer", geo:R("NA3 EU3 NAS3 ME1 AS2"), geoNote:"Nordhalbkugel; in Gebirgsbächen."});
  add("midge", {id:"chaoboridae", de:"Büschelmücken", en:"Phantom Midge · Glassworm", lat:"Chaoboridae", hook:[12,16],
    info:"Verwandte der Zuckmücken. Die glasklaren Larven („Glassworms“) leben schwebend im Freiwasser von Seen und steigen nachts auf; Stechen können sie nicht.",
    tip:"Klare, transparente Larven- und Puppen-Muster (Clear Buzzer) im Freiwasser. Wirkt vor allem an Seen mit wenig Kraut.",
    flies:["Glassworm","Clear Buzzer"], img:"ins_chaoborus.jpg", fly:null, flyName:"",
    season:S("4:1,5-9:3,10:1"), day:"Dämmerung bis Nacht", water:"Stillwasser", geo:R("NA3 MA2 SA2 EU3 NAS3 ME2 AF3 AS3 OC2"), geoNote:"Weltweit in Seen."});
  add("beetles", {id:"cantharidae", de:"Weichkäfer", en:"Soldier Beetle", lat:"Cantharidae", hook:[12,14],
    info:"Schmale, weich wirkende Käfer mit rot-schwarzer oder braun-roter Färbung. Sie sitzen auf Doldenblüten am Ufer und fallen bei Wind ins Wasser. Rhagonycha fulva ist der „Soldier Beetle“ der Fliegenfischer.",
    tip:"Schlanke, rot-schwarze Käfer-Muster im Juni bis August an blühenden Ufern; leise ablegen.",
    flies:["Soldier Beetle","Red Beetle"], img:"ins_cantharis.jpg", fly:null, flyName:"",
    season:S("5:1,6-8:3,9:1"), day:"Tag, windig", water:"Fließgewässer", geo:R("NA3 EU3 NAS2 ME1 AS2"), geoNote:"Holarktisch."});
  add("beetles", {id:"chrysomelidae", de:"Blatt-, Rüssel- & Schnellkäfer", en:"Leaf beetles, weevils & click beetles", lat:"Chrysomelidae · Curculionidae · Elateridae", hook:[14,18],
    info:"Kleine, oft metallisch glänzende Käfer von Ufergebüsch und Bäumen. Besonders Weiden- und Erlenblattkäfer fallen in Mengen.",
    tip:"Kleine, schwarze oder metallisch grüne Foam-Beetles; zart landen lassen, Fische sind bei kleinen Käfern wählerisch.",
    flies:["Black Beetle","Foam Beetle","Peacock Beetle"], img:"ins_chrysomelidae.jpg", fly:null, flyName:"",
    season:S("5:1,6-8:3,9:1"), day:"Tag", water:"Fließgewässer", geo:R("NA3 MA3 SA3 EU3 NAS3 ME2 AF3 AS3 OC3"), geoNote:"Weltweit."});
  add("flies", {id:"muscidae", de:"Echte Fliegen", en:"House Flies, Blowflies, Dung Flies", lat:"Muscidae · Calliphoridae · Scathophagidae", hook:[10,16],
    info:"Stubenfliegen, Schmeißfliegen und Dungfliegen, die von Weiden und Stallungen zum Wasser kommen. Gelbe Dungfliegen sind an Bächen häufig.",
    tip:"Kompakte, dunkle oder goldgelbe Fliegen im Oberflächenfilm, besonders an Wiesenbächen.",
    flies:["House Fly","Dung Fly","Blow Fly"], img:"ins_muscidae.jpg", fly:null, flyName:"",
    season:S("5:1,6-9:3,10:1"), day:"Tag", water:"Fließgewässer", geo:R("NA3 MA3 SA3 EU3 NAS3 ME3 AF3 AS3 OC3"), geoNote:"Weltweit."});
  add("landother", {id:"isoptera", de:"Termiten", en:"Termites · Flying Termites", lat:"Isoptera (Blattodea)", hook:[12,16],
    info:"Geflügelte Termiten schwärmen nach Regenfällen massenhaft aus und landen oft auf dem Wasser. In Afrika, Südamerika, Asien und Australien ein regionaler Schlupf-Ersatz.",
    tip:"Hellbraune bis schwarze Alate-Muster im Film; Fische fressen sie in Massen am Abend nach dem Regen.",
    flies:["Flying Termite","Alate Termite"], img:"ins_termite.jpg", fly:null, flyName:"",
    season:S("1-12:1"), day:"Abend nach Regen", water:"beides", geo:R("NA2 MA3 SA3 EU1 ME2 AF3 AS3 OC3"), geoNote:"Hauptsächlich Tropen und Subtropen; Südeuropa und Südstaaten der USA am Rand."});
  add("landother", {id:"pentatomidae", de:"Wanzen", en:"Stink Bugs · Shield Bugs", lat:"Pentatomidae · Heteroptera", hook:[10,14],
    info:"Schildwanzen mit grünem oder braunem Schild; im Spätsommer und Herbst häufig auf Ufergebüsch. Die Marmorierte Baumwanze (Halyomorpha halys) ist eingeschleppt.",
    tip:"Grüne bis bräunliche Foam-Wanzen; selten, aber bei Wind am Ufer wirksam.",
    flies:["Stink Bug","Foam Bug"], img:"ins_pentatomidae.jpg", fly:null, flyName:"",
    season:S("6-10:3"), day:"Tag", water:"Fließgewässer", geo:R("NA3 MA3 SA3 EU3 NAS2 ME2 AF3 AS3 OC2"), geoNote:"Weltweit."});
  add("landother", {id:"araneae", de:"Spinnen", en:"Spiders", lat:"Araneae (keine Insekten)", hook:[10,16],
    info:"Jagdspinnen leben am Wasser, Radnetzspinnen werden vom Ufer verweht und Wolfsspinnen laufen über den Boden zum Ufer. Spinnen sind zahlreich in Herbstmonaten.",
    tip:"Dunkle Spinnenmuster mit Gummibeinen; nach Wind und im Herbst unter Ufergebüsch.",
    flies:["Foam Spider","Spider"], img:"ins_spider.jpg", fly:null, flyName:"",
    season:S("6:1,7-10:3,11:1"), day:"Tag", water:"Fließgewässer", geo:R("NA3 MA3 SA3 EU3 NAS3 ME3 AF3 AS3 OC3"), geoNote:"Weltweit."});

  /* ----- Untergruppen ----- */
  const SUBS = {
  baetidae:[["Baetis rhodani","Large Dark Olive","Häufigste Art Europas; Schlupf Februar bis April und September bis Oktober; #16–18"],["Nigrobaetis niger","Iron Blue","Sehr klein und dunkel (#20); Frühjahr und Herbst, besonders bei kühlem, trübem Wetter"],["Baetis tricaudatus / Acentrella","Baetis BWO (Nordamerika)","Die „Pseudo-BWOs“ in #18–22; Frühjahr und Herbst"],["Cloeon dipterum","Pond Olive","Stillwasser und langsame Rinnen; #14–16"]],
  ephemerellidae:[["Serratella ignita","Blue-winged Olive (Europa)","Sommerabende von Juni bis September; #14–16"],["Ephemerella notata","Yellow Evening Dun","Erscheint an Sommerabenden in Mitteleuropa"],["Ephemerella subvaria","Hendrickson","Nordamerika, Schlupf April bis Mai"],["Ephemerella excrucians / dorothea","Pale Morning Dun (PMD)","Nordamerika, Juni bis August"],["Drunella grandis","Western Green Drake","Nordamerika; große Nymphe, Schlupf Juni bis Juli"],["Drunella flavilinea","Flav","Nordamerika; kleinere, gelbliche Drunella (#14–16)"]],
  heptageniidae:[["Rhithrogena germanica","March Brown","Europa; März bis Mai, #12–14"],["Rhithrogena semicolorata","Olive Upright","Europa; Frühjahr bis Sommer, #14–16"],["Ecdyonurus venosus / dispar","Late March Brown / Autumn Dun","Europa; Frühjahr bzw. August bis Oktober"],["Heptagenia sulphurea","Yellow May Dun","Europa; Sommerabende, #12–14"],["Epeorus pleuralis","Quill Gordon","Nordamerika; früher Schlupf im April"]],
  ephemeridae:[["Ephemera danica","Maifliege (Mayfly)","Europa; Schlupf Mai bis Juni, größte Eintagsfliege der Fliegenfischer"],["Ephemera vulgata","Spotted Mayfly","Europa; ähnlich, etwas später"],["Hexagenia limbata","Hex","Nordamerika; nächtlicher Massenschlupf Juni bis Juli"],["Ephemera guttulata","Eastern Green Drake","Nordamerika; Ende Mai bis Juni"],["Ephemera simulans","Brown Drake","Nordamerika; Dämmerung, Mai bis Juni"]],
  caenidae:[["Caenis horaria","Angler’s Curse","Häufigste Art; Juni bis August; #22–26"],["Caenis macrura","Dusky Broadwing","Größere Caenis; Sommer"],["Caenis robusta","Robust Caenis","Fließgewässer und Seen"],["Brachycercus harrisella","Caenis-Verwandter","Sandbänke in Flüssen"]],
  leptohyphidae:[["Tricorythodes minutus / fictus","Tricos","Nordamerikanische Tricos, Juli bis Oktober, #20–24"],["Leptohyphes","Leptohyphes","Mittel- und Südamerika"]],
  leptophlebiidae:[["Leptophlebia marginata","Sepia Dun","Europa; April bis Mai"],["Leptophlebia vespertina","Claret Dun","Europa; Mai bis Juni"],["Paraleptophlebia submarginata","Turkey Brown","Europa; Frühling"],["Paraleptophlebia cincta","Purple Dun","Europa; Sommer"],["Deleatidium","NZ Mayfly","Neuseeland; wichtigste Nymphe, #14–16"],["Atalophlebia","Australian Mayfly","Australien und Tasmanien"]],
  siphlonuridae:[["Siphlonurus lacustris","Large Summer Dun","Europa; Seen und ruhige Gewässer"],["Siphlonurus armatus","Siphlonurus","Europa; Sommer"],["Siphlonurus occidentalis","Western Gray Drake","Nordamerika; Spätsommer"]],
  polymitarcyidae:[["Palingenia longicauda","Theißblüte","Ungarn und Serbien; Juni; riesige Eintagsfliege"],["Ephoron virgo","Weiße Eintagsfliege","Rhein, Main, Mosel; August bis September, abends"],["Ephoron album","White Fly","Nordamerika; Spätsommer"]],
  isonychiidae:[["Isonychia bicolor","Slate Drake","Nordamerika Osten; Juli bis September"],["Isonychia sicca","Isonychia","Westliches Nordamerika"]],
  limnephilidae:[["Limnephilus rhombicus","Cinnamon Sedge","Europa; Sommerabende"],["Halesus radiatus","Caperer","Europa; Herbst"],["Glyphotaelius pellucidus","Speckled Peter","Europa; Stillwasser, Sommer"],["Potamophylax","Autumn Sedges","Europa; Herbst"],["Dicosmoecus gilvipes","October Caddis","Nordamerika; Oktober, große orange Sedge"]],
  hydropsychidae:[["Hydropsyche siltalai / pellucidula","Spotted Sedge","Europa; häufigste Netzspinner, Juni bis September"],["Cheumatopsyche","Little Sister Sedge","Nordamerika; Sommer"],["Arctopsyche grandis","Great Gray Spotted Sedge","Nordamerika; große Netzspinner, Juli bis September"]],
  rhyacophilidae:[["Rhyacophila dorsalis","Rhyacophila","Europa; Gebirgsbäche"],["Rhyacophila fasciata","Rhyacophila","Europa; schnelle Rinnen"],["Rhyacophila (Nordamerika)","Green Rock Worm","Grüne Larven; ganzjährig"]],
  brachycentridae:[["Brachycentrus subnubilus","Grannom","Europa; April bis Mai"],["Brachycentrus americanus","Mother’s Day Caddis","Nordamerika (Osten und Mitte); April bis Mai"],["Brachycentrus occidentalis","Western Brachycentrus","Westliches Nordamerika"]],
  sericostomatidae:[["Sericostoma personatum","Welshman’s Button","Europa; Mai bis August"],["Notidobia ciliaris","Notidobia","Europa; Sandköcher"]],
  hydroptilidae:[["Hydroptila","Micro Sedge","Sehr kleine Arten, #20–22"],["Agraylea multipunctata","Mottled Micro","Stillwasser"],["Oxyethira","Tiny Sedge","Stillwasser; #22"],["Ithytrichia lamellaris","Pea Sedge","Kleiner Köcher"]],
  phryganeidae:[["Phryganea grandis","Murrough / Large Sedge","Größte Köcherfliege Europas; Mai bis Juli, Dämmerung"],["Phryganea bipunctata","Large Sedge","Europa; ähnlich"],["Agrypnia varia","Köcherfliege","Stillwasser; Frühjahr"]],
  leptoceridae:[["Athripsodes cinereus","Brown Silverhorn","Fließwasser und Seen; Sommer"],["Mystacides azurea","Black Silverhorn","Seen; Juni bis August"],["Triaenodes bicolor","Swimming Sedge","Schwimmende Larven in Seen"]],
  glossosomatidae:[["Glossosoma","Saddle-case Caddis","Quellbäche und Bergbäche"],["Agapetus","Saddle-case Caddis","Kleine Arten, Europa"]],
  polycentropodidae:[["Polycentropus flavomaculatus","Brown Sedge","Seen und Bäche"],["Cyrnus trimaculatus","Cyrnus","Stillwasser"],["Plectrocnemia conspersa","Plectrocnemia","Quellbäche"],["Neureclipsis bimaculata","Trumpet-net Caddis","Fließgewässer; Nordamerika und Europa"]],
  perlidae:[["Perla bipunctata / grandis","Große Steinfliege","Europa; Mai bis Juli"],["Dinocras cephalotes","Große Steinfliege","Europa; Gebirgsbäche"],["Hesperoperla pacifica","Golden Stone","Nordamerika Westen; Juni bis Juli"],["Calineuria californica","Golden Stone","Nordamerika Westen"],["Acroneuria","Golden Stone (Osten)","Nordamerika Osten"]],
  perlodidae:[["Isoperla grammatica","Yellow Sally","Europa; Mai bis Juli"],["Perlodes microcephalus","Perlodes","Europa; Frühjahr"],["Skwala americana","Skwala","Nordamerika; früher Schlupf März bis April"]],
  pteronarcyidae:[["Pteronarcys californica","Salmonfly","Nordamerika Westen; Mai bis Juli"],["Pteronarcys dorsata","Giant Black Stonefly","Nordamerika Osten"],["Pteronarcella badia","Smaller Salmonfly","Nordamerika; kleiner"]],
  nemouridae:[["Nemoura cinerea","Nemoura","Europa; Frühling"],["Protonemura meyeri","Early Brown","Europa; Februar bis Mai"],["Amphinemura sulcicollis","Small Brown Stonefly","Europa; Frühling"],["Malenka / Zapada","Nordamerika","Frühling und Sommer"]],
  taeniopterygidae:[["Taeniopteryx nebulosa","February Red","Europa; Februar bis März"],["Brachyptera risi","Brachyptera","Europa; Frühjahr"],["Taeniopteryx / Strophopteryx","Early Brown Stones","Nordamerika; Februar bis April"]],
  leuctridae:[["Leuctra fusca","Needle Fly","Herbst"],["Leuctra geniculata","Needle Fly","Spätsommer bis Herbst"],["Leuctra nigra","Needle Fly","Frühjahr bis Sommer"]],
  chloroperlidae:[["Chloroperla tripunctata","Small Yellow Sally","Europa; Sommer"],["Siphonoperla torrentium","Small Yellow Sally","Europa; Bäche"],["Sweltsa","Little Yellow Sally","Nordamerika; Sommer"]],
  capniidae:[["Capnia bifrons","Winter Stone","Europa; Januar bis März"],["Capnia (Nordamerika)","Little Winter Black","Nordamerika; Winter"]],
  midge_larva:[["Chironomini (Chironomus)","Bloodworm","Rote Larven in Schlamm; #10–14"],["Tanypodinae","Räuberische Larven","Hell und glasig; Freiwasser und Boden"],["Tanytarsini","Kleine Schlauchbauer","Olive bis rot; #14–18"],["Orthocladiinae","Fließwasser-Zuckmücken","Kleine, olive bis braune Larven; #16–20"]],
  midge_pupa:[["Chironomus","Große schwarze/rote Buzzer","#10–12; Seen"],["Tanytarsini","Kleine hellbraune Buzzer","#14–18"],["Orthocladiinae","Ginger / Olive Buzzer","#16–20; Fließwasser"]],
  midge_adult:[["Chironomus plumosus","Große Zuckmücke","Dunkelgrün bis schwarz; #12–14"],["Cricotopus / Orthocladiinae","Black Gnat","Kleine schwarze Zuckmücken; #18–22"],["Tanytarsus","Zuckmückenschwärme","Sehr kleine Schwärme; #22–26"]],
  chaoboridae:[["Chaoborus crystallinus","Phantom Midge","Seen; Frühling bis Herbst"],["Chaoborus flavicans","Glassworm","Seen; Nacht"]],
  zygoptera:[["Coenagrion puella","Hufeisen-Azurjungfer","Blaue Kleinlibelle; Mai bis August"],["Ischnura elegans","Große Pechlibelle","Häufig an Seen"],["Pyrrhosoma nymphula","Frühe Adonislibelle","Rote Kleinlibelle; April bis Juli"],["Calopteryx splendens","Gebänderte Prachtlibelle","Fließgewässer"],["Enallagma","Bluets","Nordamerika; Seen"]],
  anisoptera:[["Aeshna cyanea / Aeshnidae","Mosaikjungfern","Große Larven in Seen und Teichen"],["Libellulidae","Segellibellen","Breite Larven im Schlamm"],["Gomphidae","Flussjungfern","Grabend in Bächen und Flüssen"],["Anax imperator","Große Königslibelle","Sehr große Larve; Seen"]],
  corixidae:[["Corixa punctata","Water Boatman","Große Art; #10–12"],["Sigara","Kleine Ruderwanzen","#14–16"],["Hesperocorixa","Hesperocorixa","Seen"]],
  notonectidae:[["Notonecta glauca","Common Backswimmer","Große Rückenschwimmer"],["Notonecta maculata","Backswimmer","Klar gefleckt"]],
  simuliidae:[["Simulium","Kriebelmücken","Schnelle Bäche; Larven an Steinen"],["Prosimulium","Frühjahrs-Kriebelmücke","Nordamerika; früh im Jahr"],["Austrosimulium","NZ Sandfly","Neuseeland"]],
  sialidae:[["Sialis lutaria","Alderfly","Europa; Mai"],["Sialis fuliginosa","Alderfly","Europa; Fließgewässer"],["Corydalus cornutus","Hellgrammite","Nordamerika; große Larven"],["Nigronia","Fishfly","Nordamerika"]],
  dytiscidae:[["Dytiscus marginalis","Gelbrandkäfer","Große Larven (Wassertiger)"],["Acilius sulcatus","Kleiner Schwimmkäfer","Seen"],["Hydroporus","Kleine Schwimmkäfer","Teiche"],["Agabus","Agabus","Teiche und Seen"]],
  lasius:[["Lasius niger","Schwarze Wegameise","Sehr häufig, tief im Film"],["Lasius flavus","Gelbe Wiesenameise","Wiesen, Hochzeitsflug im Sommer"],["Lasius fuliginosus","Glänzend-schwarze Holzameise","Baumameise, große Völker"]],
  formica:[["Formica rufa","Rote Waldameise","Geschützt; Waldnähe"],["Formica polyctena","Kahlrückige Waldameise","Geschützt"],["Myrmica rubra","Rote Gartenameise","Rot, stachelig; Wiese"],["Formica obscuripes","Western Thatching Ant","Nordamerika"]],
  camponotus:[["Camponotus ligniperda","Rossameise","Europa; Totholz"],["Camponotus herculeanus","Rossameise","Europa; Wald"],["Camponotus pennsylvanicus","Black Carpenter Ant","Nordamerika"]],
  alate:[["Lasius niger (Alate)","Schwarze Wegameise","Hochzeitsflug Juli bis August"],["Myrmica (Alate)","Rote Gartenameise","Hochzeitsflug im Spätsommer"],["Formica (Alate)","Waldameisen","Nordamerika und Europa"]],
  phyllopertha:[["Phyllopertha horticola","Gartenlaubkäfer","Mai bis Juni"],["Serica brunnea","Brauner Laubkäfer","Juni bis Juli"],["Cetonia aurata","Rosenkäfer","Juni bis Juli; metallisch grün"]],
  melolontha:[["Melolontha melolontha","Feldmaikäfer","April bis Mai"],["Melolontha hippocastani","Waldmaikäfer","Mai"],["Amphimallon solstitiale","Junikäfer","Juni bis Juli"],["Phyllophaga","June Bug","Nordamerika"]],
  coccinellidae:[["Coccinella septempunctata","Siebenpunkt-Marienkäfer","Häufigste Art"],["Harmonia axyridis","Asiatischer Marienkäfer","Eingeschleppt, farbvariabel"],["Adalia bipunctata","Zweipunkt-Marienkäfer","Gärten und Ufer"]],
  cantharidae:[["Rhagonycha fulva","Roter Weichkäfer (Soldier Beetle)","Juni bis August auf Doldenblüten"],["Cantharis fusca","Schwarzblauer Weichkäfer","Mai bis Juni"],["Cantharis rustica","Rustica","Frühjahr bis Sommer"]],
  chrysomelidae:[["Plagiodera versicolora","Weidenblattkäfer","Metallisch blau-grün; Weiden"],["Phyllobius","Blattrüssler","Grüne Rüsselkäfer"],["Elateridae","Schnellkäfer","Ufer und Wald"]],
  caelifera:[["Chorthippus / Pseudochorthippus","Grashüpfer","Häufige Wiesenarten"],["Melanoplus","Hopper (Nordamerika)","Muster für Dave’s Hopper"],["Locusta migratoria","Wanderheuschrecke","Südeuropa/Afrika; Schwärme"]],
  gryllus:[["Gryllus campestris","Feldgrille","Europa; Mai bis Juli"],["Acheta domesticus","Heimchen","Gebäude, Ufer in Wärme"],["Gryllotalpa gryllotalpa","Maulwurfsgrille","Sandige Ufer; selten"],["Gryllus pennsylvanicus","Field Cricket (Nordamerika)","Nordamerika"]],
  tettigonia:[["Tettigonia viridissima","Grünes Heupferd","Juli bis September"],["Tettigonia cantans","Zwitscherschrecke","Wiesen und Hecken"],["Metrioptera roeselii","Roesels Beißschrecke","Wiesen"],["Pterophylla camellifolia","Katydid","Nordamerika"]],
  tipulidae:[["Tipula paludosa","Wiesenschnake","August bis Oktober"],["Tipula oleracea","Kohlschnake","Frühjahr und Herbst"],["Tipula maxima","Riesenschnake","Fließgewässer"],["Nephrotoma appendiculata","Gefleckte Schnake","Frühsommer"]],
  bibio:[["Bibio marci","Märzfliege (St. Mark’s Fly)","April bis Mai"],["Bibio johannis","Johannis-Haarmücke","Mai bis Juni"],["Bibio hortulanus","Gartenhaarmücke","Frühling bis Sommer"]],
  syrphidae:[["Episyrphus balteatus","Hainschwebfliege","Häufige Wiesenart"],["Eristalis tenax","Mistbiene","Große Schwebfliege"],["Syrphus ribesii","Gemeine Schwebfliege","Blumenwiesen"]],
  muscidae:[["Musca domestica","Stubenfliege","Weltweit"],["Lucilia / Calliphora","Schmeißfliegen","Metallisch glänzend; Sommer"],["Scathophaga stercoraria","Gelbe Dungfliege","Weideflächen"]],
  cicadellidae:[["Cicadella viridis","Grüne Zikade","Feuchtwiesen"],["Empoasca","Kleinzikaden","Nordamerika und Europa"],["Graphocephala","Spitzkopfzikaden","Nordamerika"]],
  cercopidae:[["Cercopis vulnerata","Blutzikade","Mai bis Juli; rot-schwarz"],["Cercopis sanguinolenta","Südliche Blutzikade","Südeuropa"],["Philaenus spumarius","Wiesenschaumzikade","Larven in Schaum (Aphrophoridae)"]],
  cicadidae:[["Magicicada septendecim / cassini","Periodical Cicadas","Nordamerika; 13/17-Jahre-Massenjahre"],["Neotibicen (Tibicen)","Dog-Day Cicada","Nordamerika; Hochsommer"],["Cicada orni","Mediterrane Zikade","Südeuropa"],["Amphipsalta","Chorus Cicada","Neuseeland"],["Psaltoda","Redeye Cicada","Australien"]],
  aphididae:[["Aphis fabae","Schwarze Bohnenlaus","Mai bis Juni"],["Myzus persicae","Grüne Pfirsichblattlaus","Frühjahr"],["Cinara","Große Rindenlaus","Nadelbäume; Sommer"]],
  isoptera:[["Reticulitermes","Bodentermiten","Südeuropa und Nordamerika"],["Macrotermes","Pilzzüchter-Termiten","Afrika und Asien"],["Coptotermes","Coptotermes","Australien und Asien"]],
  pentatomidae:[["Palomena prasina","Grüne Stinkwanze","Europa"],["Halyomorpha halys","Marmorierte Baumwanze","Eingeschleppt"],["Nezara viridula","Grüne Reiswanze","Warme Regionen"]],
  araneae:[["Araneus diadematus","Kreuzspinne","Radnetze, Herbst"],["Pisaura mirabilis","Listspinne","Wiesen"],["Dolomedes fimbriatus","Gerandete Jagdspinne","Am Wasser"],["Pardosa","Wolfsspinne","Uferböden"]],
  geometridae:[["Biston betularia","Birkenspanner","Raupen im Frühling und Sommer"],["Epirrita autumnata","Herbstspanner","Massenvermehrung in Nordeuropa"],["Erannis defoliaria","Großer Frostspanner","Raupen an Laubbäumen im Frühling"]],
  operophtera:[["Operophtera brumata","Kleiner Frostspanner","Raupen April bis Mai"],["Erannis defoliaria","Großer Frostspanner","Raupen an Laubbäumen"]],
  moth:[["Noctuidae","Eulenfalter","Sommernächte"],["Hepialidae","Wurzelbohrer (Ghost Swift)","Dämmerung; Muster 'Orange Swift'"],["Sphingidae","Schwärmer","Große Falter"],["Nymphula nymphaeata","Seerosenzünsler","Wasserpflanzen"]],
  vespula:[["Vespula vulgaris","Gemeine Wespe","August bis September"],["Vespula germanica","Deutsche Wespe","Weltweit eingeführt"],["Vespa crabro","Hornisse","Geschützt; Wald"],["Polistes","Feldwespe","Südeuropa und USA"]],
  apis:[["Apis mellifera","Honigbiene","Weltweit"],["Bombus","Hummeln","Patagonien und Neuseeland sind besonders bekannt"],["Andrena","Sandbienen","Frühling; Ufer"]],
  gammarus:[["Gammarus pulex","Bachflohkrebs","Europa; kalkreiche Bäche"],["Gammarus fossarum","Bergbach-Flohkrebs","Europa; Gebirgsbäche"],["Gammarus lacustris","Seen-Flohkrebs","Holarktisch"],["Hyalella azteca","Scud (Nordamerika)","Seen und Teiche"],["Dikerogammarus villosus","Höckerflohkrebs","Eingeschleppt in Flüssen"]],
  asellus:[["Asellus aquaticus","Wasserassel","Europa; Seen und langsame Gewässer"],["Caecidotea","Aquatic Sowbug","Nordamerika"],["Proasellus","Proasellus","Europa; Quellen"]],
  snail:[["Lymnaea stagnalis","Spitzschlammschnecke","Seen und Teiche"],["Radix balthica","Eiförmige Schlammschnecke","Seen"],["Planorbis planorbis","Tellerschnecke","Kleine Gewässer"],["Physa acuta","Blasenschnecke","Weltweit"],["Potamopyrgus antipodarum","NZ Mud Snail","Neuseeland; weltweit eingeschleppt"]],
  leech:[["Erpobdella octoculata","Rollegel","Häufigster Egel in Seen"],["Glossiphonia complanata","Schneckenegel","Teiche"],["Helobdella stagnalis","Kleiner Schneckenegel","Seen"],["Hirudo medicinalis","Medizinischer Blutegel","Geschützt; selten"]]
  };
  ALL.forEach(g => { g.sub = SUBS[g.id] || []; });
})();
