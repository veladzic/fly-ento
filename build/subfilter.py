import re, json, os
H = os.path.dirname(os.path.abspath(__file__))
def norm(s): return re.sub(r'[^a-z0-9 ]', '', s.lower()).strip()
def parts(lat):
    base = re.sub(r'\s*\(.*?\)', '', lat).strip()
    ps = [p.strip() for p in base.split('/')]
    g = ps[0].split()[0] if ps and ps[0] else ''
    out = []
    for i, p in enumerate(ps):
        if i and p and ' ' not in p and p[0].islower() and g: p = g + ' ' + p
        out.append(norm(p))
    return out
def keep(lat, v):
    """Foto nur behalten, wenn die Wikipedia-Seite genau diese Art/dieses Taxon beschreibt (kein Gattungs-Ersatzfoto)."""
    if not v: return False
    t = norm(v['t']); ps = parts(lat)
    if t in ps: return True
    d = (v.get('d') or '')
    m = re.match(r'Art der Gattung (\w+)', d)   # deutsche Artseite (Titel ist ein deutscher Name)
    if m and ps and ps[0].split()[0] == norm(m.group(1)) and ' ' in ps[0]: return True
    return False
def rejected():
    p = os.path.join(H, 'subphotos_reject.json')
    return set(json.load(open(p, encoding='utf8'))) if os.path.exists(p) else set()
