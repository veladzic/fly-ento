"""Holt je ein Foto pro Untergruppe/Art von Wikipedia (Wikimedia Commons) und schreibt site/subphotos.js."""
import json, os, re, sys, time, subprocess, urllib.request, urllib.parse, urllib.error
sys.stdout.reconfigure(encoding='utf-8')
HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.join(HERE, '..', 'site')
FOT = os.path.join(SITE, 'fotos')
CACHE = os.path.join(HERE, 'subphotos_cache.json')
UA = 'flyento-site-build/1.0 (educational fly fishing site)'

# Liste aller Untergruppen aus den Datendateien lesen
js = f"""
const fs=require('fs'),vm=require('vm');
vm.runInThisContext(fs.readFileSync({json.dumps(os.path.join(SITE,'data.js'))},'utf8')+fs.readFileSync({json.dumps(os.path.join(SITE,'data_extra.js'))},'utf8')+';globalThis.ALL=ALL');
const out=[];ALL.forEach(g=>g.sub.forEach(s=>out.push([s[0],s[1],g.id])));
console.log(JSON.stringify(out));
"""
subs = json.loads(subprocess.check_output(['node', '-e', js]).decode('utf8'))
cache = json.load(open(CACHE, encoding='utf8')) if os.path.exists(CACHE) else {}

def candidates(lat):
    base = re.sub(r'\s*\(.*?\)', '', lat).strip()
    parts = [p.strip() for p in base.split('/')]
    c = []
    for p in parts:
        if p and p not in c: c.append(p)
        g = p.split()[0] if p else ''
        if g and g not in c and g[0].isupper(): c.append(g)
    return c

def get(url):
    for attempt in range(6):
        try:
            return json.load(urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=30))
        except urllib.error.HTTPError as e:
            if e.code == 404: return None
            if e.code == 429:
                time.sleep(8 * (attempt + 1)); continue
            return None
        except Exception:
            time.sleep(3)
    return None

def find(title):
    for lang in ('en', 'de'):
        j = get(f'https://{lang}.wikipedia.org/api/rest_v1/page/summary/' + urllib.parse.quote(title.replace(' ', '_')))
        time.sleep(0.9)
        if not j or j.get('type') == 'disambiguation': continue
        src = (j.get('thumbnail') or {}).get('source')
        if src: return src, j.get('content_urls', {}).get('desktop', {}).get('page'), j.get('title')
    return None

def slug(s): return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')[:60]

done = 0
for lat, de, gid in subs:
    if lat in cache: continue
    res = None
    for t in candidates(lat):
        res = find(t)
        if res: break
    if res:
        src, page, title = res
        fn = 'sub_' + slug(lat) + '.jpg'
        try:
            data = urllib.request.urlopen(urllib.request.Request(src, headers={'User-Agent': UA}), timeout=30).read()
            open(os.path.join(FOT, fn), 'wb').write(data)
            cache[lat] = {'f': fn, 'p': page, 't': title}
        except Exception as e:
            cache[lat] = None
        time.sleep(0.9)
    else:
        cache[lat] = None
    done += 1
    print(done, lat, '->', (cache[lat] or {}).get('t'), flush=True)
    json.dump(cache, open(CACHE, 'w', encoding='utf8'), ensure_ascii=False)

out = {k: v for k, v in cache.items() if v}
open(os.path.join(SITE, 'subphotos.js'), 'w', encoding='utf8').write('/* Fotos der Untergruppen: Wikipedia / Wikimedia Commons (Seite verlinkt Urheber und Lizenz) */\nconst SUBPHOTO = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n')
print('FERTIG', len(out), 'von', len(subs))
