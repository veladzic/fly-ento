"""Holt je ein Foto pro Untergruppe/Art von Wikipedia (Wikimedia Commons).
Nur Seiten, deren Kurzbeschreibung nach einem passenden Tier klingt (Schutz gegen Namensverwechslungen)."""
import json, os, re, sys, time, glob, subprocess, urllib.request, urllib.parse, urllib.error
sys.stdout.reconfigure(encoding='utf-8')
HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.join(HERE, '..', 'site')
FOT = os.path.join(SITE, 'fotos')
CACHE = os.path.join(HERE, 'subphotos_cache.json')
UA = 'flyento-site-build/1.0 (educational fly fishing site)'

if '--fresh' in sys.argv:
    for f in glob.glob(os.path.join(FOT, 'sub_*.jpg')): os.remove(f)
    if os.path.exists(CACHE): os.remove(CACHE)

js = f"""
const fs=require('fs'),vm=require('vm');
vm.runInThisContext(fs.readFileSync({json.dumps(os.path.join(SITE,'data.js'))},'utf8')+fs.readFileSync({json.dumps(os.path.join(SITE,'data_extra.js'))},'utf8')+';globalThis.ALL=ALL');
const out=[];ALL.forEach(g=>g.sub.forEach(s=>out.push([s[0],s[1],g.id])));
console.log(JSON.stringify(out));
"""
subs = json.loads(subprocess.check_output(['node', '-e', js]).decode('utf8'))
cache = json.load(open(CACHE, encoding='utf8')) if os.path.exists(CACHE) else {}

GOOD = re.compile(r"\b(genus|genera|species|subspecies|family|subfamily|tribe|order|suborder|superfamily|insects?|mayfl\w*|caddis\w*|stonefl\w*|beetles?|ants?|flies|fly|midges?|mosquito\w*|damselfl\w*|dragonfl\w*|bugs?|crickets?|grasshoppers?|katydids?|moths?|wasps?|bees?|hornets?|crustaceans?|amphipods?|isopods?|snails?|gastropods?|mollus\w*|leeches|leech|annelids?|spiders?|arachnids?|termites?|aphids?|cicadas?|leafhoppers?|froghoppers?|hemipteran?s?|dipteran?s?|lepidopteran?s?|hymenopteran?s?|coleopteran?s?|orthopteran?s?|megalopteran?s?|trichopteran?s?|plecopteran?s?|ephemeropteran?s?|odonat\w*|sedges?|alderfl\w*|dobsonfl\w*|fishfl\w*|weevils?|ladybirds?|ladybugs?|chafers?|cockchafers?|hoverfl\w*|craneflies|cranefly|wolf spiders?|schnecke\w*|gattung|art|familie|k[äa]fer|fliege\w*|ameise\w*|libelle\w*|zikade\w*|wanze\w*|spinne\w*|krebs\w*|egel|heuschrecke\w*|grille\w*|falter|wespe\w*|biene\w*|hummel\w*|mücke\w*|eintagsfliege\w*|steinfliege\w*|köcherfliege\w*)\b", re.I)
BAD = re.compile(r"\b(roman|freedwoman|painting|painter|album|film|band|village|municipality|politician|footballer|singer|actor|actress|novel|river|town|city|mountain|born|died|poet|king|queen|saint|goddess|mythology|asteroid|company|brand|disambiguation)\b", re.I)

def candidates(lat):
    base = re.sub(r'\s*\(.*?\)', '', lat).strip()
    parts = [p.strip() for p in base.split('/')]
    c = []
    genus = parts[0].split()[0] if parts and parts[0] else ''
    fixed = []
    for i, p in enumerate(parts):
        if i and p and ' ' not in p and p[0].islower() and genus: p = genus + ' ' + p
        fixed.append(p)
    parts = fixed
    for p in parts:
        if p and p not in c: c.append(p)
    for p in parts:
        g = p.split()[0] if p else ''
        if g and g not in c and g[0].isupper(): c.append(g)
    return c

def get(url):
    for attempt in range(6):
        try:
            return json.load(urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=30))
        except urllib.error.HTTPError as e:
            if e.code == 404: return None
            if e.code == 429: time.sleep(8 * (attempt + 1)); continue
            return None
        except Exception:
            time.sleep(3)
    return None

def find(title):
    for lang in ('en', 'de'):
        j = get(f'https://{lang}.wikipedia.org/api/rest_v1/page/summary/' + urllib.parse.quote(title.replace(' ', '_')))
        time.sleep(0.6)
        if not j or j.get('type') == 'disambiguation': continue
        text = ((j.get('description') or '') + ' ' + (j.get('extract') or '')[:400])
        if BAD.search(text) or not GOOD.search(text): continue
        src = (j.get('thumbnail') or {}).get('source')
        if src: return src, j.get('content_urls', {}).get('desktop', {}).get('page'), j.get('title'), (j.get('description') or '')[:80]
    return None

def slug(s): return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')[:60]

done = 0
for lat, de, gid in subs:
    if lat in cache: continue
    res, cands = None, candidates(lat)
    for i, t in enumerate(cands):
        res = find(t)
        if res: break
    if res:
        src, page, title, desc = res
        fn = 'sub_' + slug(lat) + '.jpg'
        try:
            data = urllib.request.urlopen(urllib.request.Request(src, headers={'User-Agent': UA}), timeout=30).read()
            open(os.path.join(FOT, fn), 'wb').write(data)
            cache[lat] = {'f': fn, 'p': page, 't': title, 'd': desc}
        except Exception:
            cache[lat] = None
        time.sleep(0.6)
    else:
        cache[lat] = None
    done += 1
    print(done, lat, '->', (cache[lat] or {}).get('t'), '|', (cache[lat] or {}).get('d'), flush=True)
    json.dump(cache, open(CACHE, 'w', encoding='utf8'), ensure_ascii=False)
print('FERTIG', sum(1 for v in cache.values() if v), 'von', len(subs))
