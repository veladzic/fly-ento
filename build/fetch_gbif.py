"""Ergänzt fehlende Untergruppen-Fotos aus GBIF (iNaturalist-Beobachtungen mit bestätigter Bestimmung, nur CC0 / CC BY)."""
import json, os, re, sys, time, io, subprocess, urllib.request, urllib.parse, urllib.error
from PIL import Image
sys.stdout.reconfigure(encoding='utf-8')
HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.join(HERE, '..', 'site'); FOT = os.path.join(SITE, 'fotos')
CACHE = os.path.join(HERE, 'gbif_cache.json')
sys.path.insert(0, HERE)
from subfilter import keep, rejected, parts as sf_parts
UA = 'flyento-site-build/1.0 (educational fly fishing site)'
INAT = '50c9509d-22c7-4a22-a47d-8c48425ef4a7'   # iNaturalist Research-grade Observations

js = f"""
const fs=require('fs'),vm=require('vm');
vm.runInThisContext(fs.readFileSync({json.dumps(os.path.join(SITE,'data.js'))},'utf8')+fs.readFileSync({json.dumps(os.path.join(SITE,'data_extra.js'))},'utf8')+';globalThis.ALL=ALL');
const out=[];ALL.forEach(g=>g.sub.forEach(s=>out.push([s[0],s[1],g.id])));console.log(JSON.stringify(out));"""
subs = json.loads(subprocess.check_output(['node', '-e', js]).decode('utf8'))
wiki = json.load(open(os.path.join(HERE, 'subphotos_cache.json'), encoding='utf8'))
cache = json.load(open(CACHE, encoding='utf8')) if os.path.exists(CACHE) else {}
rej = rejected()

def get(url, params=None):
    if params: url += '?' + urllib.parse.urlencode(params, doseq=True)
    for attempt in range(4):
        try:
            return json.load(urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=40))
        except urllib.error.HTTPError as e:
            if e.code == 429: time.sleep(5 * (attempt + 1)); continue
            return None
        except Exception: time.sleep(2)
    return None

def names(lat):
    """Nur vollständige Namen aus dem Eintrag (keine Gattungs-Ersatznamen für Arten)."""
    base = re.sub(r'\s*\(.*?\)', '', lat).strip()
    ps = [p.strip() for p in base.split('/')]
    g = ps[0].split()[0] if ps and ps[0] else ''
    out = []
    for i, p in enumerate(ps):
        if i and p and ' ' not in p and p[0].islower() and g: p = g + ' ' + p
        if p and p not in out: out.append(p)
    return out

def okLic(l): return bool(l) and ('publicdomain/zero' in l or '/by/' in l or l in ('CC0_1_0', 'CC_BY_4_0'))
def licShort(l):
    if 'zero' in l or l == 'CC0_1_0': return 'CC0'
    m = re.search(r'/by/([\d.]+)', l or ''); return 'CC BY ' + m.group(1) if m else 'CC BY'
def slug(s): return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')[:50]

def photo_for(name):
    m = get('https://api.gbif.org/v1/species/match', {'name': name})
    time.sleep(0.25)
    if not m or m.get('matchType') != 'EXACT' or m.get('rank') in (None, 'KINGDOM', 'PHYLUM', 'CLASS'): return None
    canon = (m.get('canonicalName') or '').lower()
    if canon != name.lower(): return None
    key = m.get('acceptedUsageKey') or m.get('usageKey')
    for ds in (INAT, None):
        p = {'taxonKey': key, 'mediaType': 'StillImage', 'limit': 25, 'occurrenceStatus': 'PRESENT'}
        if ds: p['datasetKey'] = ds
        r = get('https://api.gbif.org/v1/occurrence/search', p); time.sleep(0.25)
        for o in (r or {}).get('results', []):
            for md in o.get('media', []):
                ident, lic = md.get('identifier') or '', md.get('license') or o.get('license') or ''
                if md.get('type') != 'StillImage' or not ident.startswith('http') or not okLic(lic): continue
                by = md.get('creator') or md.get('rightsHolder') or o.get('recordedBy') or 'unbekannt'
                return {'url': ident, 'by': by[:60], 'lic': licShort(lic), 'page': 'https://www.gbif.org/occurrence/' + str(o.get('key')), 'gk': key, 'gn': m.get('scientificName')}
    return None

done = 0
for lat, de, gid in subs:
    if lat in cache: continue
    if keep(lat, wiki.get(lat)) and lat not in rej: continue      # hat schon ein geprüftes Wikipedia-Foto
    res = None
    for n in names(lat):
        res = photo_for(n)
        if res: break
    if res:
        u = res['url']
        u2 = re.sub(r'/original\.(\w+)$', r'/medium.\1', u)       # iNaturalist: mittlere Größe
        try:
            data = urllib.request.urlopen(urllib.request.Request(u2, headers={'User-Agent': UA}), timeout=40).read()
            im = Image.open(io.BytesIO(data)).convert('RGB'); im.thumbnail((640, 640))
            fn = 'sub_g-' + slug(lat) + '.jpg'; im.save(os.path.join(FOT, fn), quality=82)
            res['f'] = fn; res.pop('url'); cache[lat] = res
        except Exception as e:
            cache[lat] = None
    else:
        cache[lat] = None
    done += 1
    print(done, lat, '->', (cache[lat] or {}).get('gn'), '|', (cache[lat] or {}).get('by'), flush=True)
    json.dump(cache, open(CACHE, 'w', encoding='utf8'), ensure_ascii=False)
print('FERTIG', sum(1 for v in cache.values() if v), 'Fotos aus GBIF')
