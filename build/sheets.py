"""Kontaktbögen zur Sichtprüfung aller Untergruppen-Fotos."""
import json, os, sys, re
from PIL import Image, ImageDraw, ImageFont
sys.stdout.reconfigure(encoding='utf-8')
H = os.path.dirname(os.path.abspath(__file__))
FOT = os.path.join(H, '..', 'site', 'fotos')
OUT = os.path.join(H, 'sheets'); os.makedirs(OUT, exist_ok=True)
cache = json.load(open(os.path.join(H, 'subphotos_cache.json'), encoding='utf8'))
from subfilter import keep, rejected
if len(sys.argv) > 1 and sys.argv[1] == 'gbif':
    gb = json.load(open(os.path.join(H, 'gbif_cache.json'), encoding='utf8'))
    items = [(k, {'f': v['f'], 't': v['gn'] or '', 'd': 'Foto: ' + v['by']}) for k, v in gb.items() if v and os.path.exists(os.path.join(FOT, v['f']))]
else:
    items = [(k, v) for k, v in cache.items() if keep(k, v) and k not in rejected() and os.path.exists(os.path.join(FOT, v['f']))]
try: font = ImageFont.truetype('arial.ttf', 15); fs = ImageFont.truetype('arial.ttf', 12)
except Exception: font = fs = ImageFont.load_default()
COLS, ROWS, TW, TH, CAP = 4, 4, 300, 190, 54
per = COLS * ROWS
for si in range(0, len(items), per):
    chunk = items[si:si + per]
    sheet = Image.new('RGB', (COLS * TW, ROWS * (TH + CAP)), 'white'); d = ImageDraw.Draw(sheet)
    for i, (k, v) in enumerate(chunk):
        x, y = (i % COLS) * TW, (i // COLS) * (TH + CAP)
        try:
            im = Image.open(os.path.join(FOT, v['f'])).convert('RGB'); im.thumbnail((TW - 6, TH - 4))
            sheet.paste(im, (x + 3, y + 2))
        except Exception: pass
        d.text((x + 4, y + TH), f"{si + i + 1}. {k}"[:44], fill='black', font=font)
        d.text((x + 4, y + TH + 18), f"Seite: {v['t']}"[:46], fill=(0, 90, 120), font=fs)
        d.text((x + 4, y + TH + 33), (v.get('d') or '')[:46], fill=(90, 90, 90), font=fs)
    p = os.path.join(OUT, f'sheet_{si // per + 1:02d}.jpg'); sheet.save(p, quality=85)
print(len(items), 'Fotos,', (len(items) + per - 1) // per, 'Bögen')
