import json, math, sys
sys.stdout.reconfigure(encoding='utf-8')
SC=r'C:/Users/dzenis/AppData/Local/Temp/claude/60810e7a512a7194/30a18fcd-d75c-486a-ae46-ddd8b84f4cd3/scratchpad/'
t=json.load(open(SC+'world.json',encoding='utf8'))
sx,sy=t['transform']['scale']; tx,ty=t['transform']['translate']
arcs=[]
for a in t['arcs']:
    x=y=0; pts=[]
    for dx,dy in a:
        x+=dx;y+=dy; pts.append((x*sx+tx,y*sy+ty))
    arcs.append(pts)
def ring(idx):
    out=[]
    for i in idx:
        p=arcs[i] if i>=0 else arcs[~i][::-1]
        out+= p if not out else p[1:]
    return out
def proj(lon,lat):  # Natural Earth
    l=math.radians(lon); p=math.radians(lat); p2=p*p; p4=p2*p2
    x=l*(0.8707-0.131979*p2+p4*(-0.013791+p4*(0.003971*p2-0.001529*p4)))
    y=p*(1.007226+p2*(0.015085+p4*(-0.044475+0.028874*p2-0.005916*p4)))
    return x,y
W=1000
# region sets by name
CA={'Mexico','Guatemala','Belize','Honduras','El Salvador','Nicaragua','Costa Rica','Panama','Cuba','Jamaica','Haiti','Dominican Rep.','Puerto Rico','Bahamas','Trinidad and Tobago'}
NAS={'Russia','Kazakhstan','Uzbekistan','Turkmenistan','Tajikistan','Kyrgyzstan','Mongolia'}
ME_W={'Turkey','Cyprus','N. Cyprus','Syria','Lebanon','Israel','Palestine','Jordan','Iraq','Iran','Saudi Arabia','Yemen','Oman','United Arab Emirates','Qatar','Kuwait','Georgia','Armenia','Azerbaijan','Afghanistan','Egypt','Libya','Tunisia','Algeria','Morocco','W. Sahara','Sudan','Mauritania'}
OC={'Australia','New Zealand','Papua New Guinea','Fiji','Solomon Is.','Vanuatu','New Caledonia'}
ASIA={'India','Pakistan','Nepal','Bhutan','Bangladesh','Sri Lanka','China','Japan','North Korea','South Korea','Taiwan','Myanmar','Thailand','Laos','Vietnam','Cambodia','Malaysia','Indonesia','Philippines','Brunei','Timor-Leste'}
def region(name,lon,lat):
    if name in ('Antarctica','Fr. S. Antarctic Lands'): return None
    if name in NAS: return 'NAS'
    if name in ME_W: return 'ME'
    if name in OC: return 'OC'
    if name in ASIA: return 'AS'
    if name in CA: return 'MA'
    if lon<-25:
        if name=='Greenland': return 'NA'
        return 'SA' if lat<12 and name not in ('United States of America','Canada') else ('NA' if lat>=12 else 'SA')
    if lon>-25 and lat>34 and lon<45: return 'EU'
    if lat<=34: return 'AF'
    return 'EU'
paths={}
names={}
for g in t['objects']['countries']['geometries']:
    name=g['properties']['name']
    polys=g['arcs'] if g['type']=='MultiPolygon' else [g['arcs']]
    pts=[p for poly in polys for p in ring(poly[0])]
    lon=sum(p[0] for p in pts)/len(pts); lat=sum(p[1] for p in pts)/len(pts)
    r=region(name,lon,lat)
    if r is None: continue
    d=''
    for poly in polys:
        for rg in poly:
            rr=ring(rg)
            # Datumsgrenze: Längengrade fortlaufend machen
            un=[];prev=None;off=0
            for lo,la in rr:
                if prev is not None:
                    if lo+off-prev>180: off-=360
                    elif lo+off-prev<-180: off+=360
                un.append((lo+off,la)); prev=lo+off
            lons=[p[0] for p in un]
            for shift in (0,360,-360):
                pts=[(lo+shift,la) for lo,la in un]
                if max(p[0] for p in pts)<-185 or min(p[0] for p in pts)>185: continue
                seg=[]
                for lo,la in pts:
                    x,y=proj(lo,la); seg.append((x,-y))
                d+='M'+'L'.join(f'{x*100:.1f},{y*100:.1f}' for x,y in seg)+'Z'
    paths.setdefault(r,[]).append((name,d))
    names.setdefault(r,[]).append(name)
for r,v in names.items(): print(r,len(v),', '.join(v))
json.dump({r:[{'n':n,'d':d} for n,d in v] for r,v in paths.items()},open(SC+'paths.json','w',encoding='utf8'),ensure_ascii=False)
# bbox
allx=[];ally=[]
import re
for v in paths.values():
    for n,d in v:
        for m in re.finditer(r'(-?[\d.]+),(-?[\d.]+)',d): allx.append(float(m[1]));ally.append(float(m[2]))
print(min(allx),max(allx),min(ally),max(ally))
