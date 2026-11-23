# Fly Ento – Entomologie für Fliegenfischer

Interaktive Website: Organigramm der Insekten und Beutetiere, Weltkarte der Verbreitung,
Schlupfkalender, Lebenszyklen, Bestimmungshilfe, Hakengrößen.

- `site/` – die Website (statisch, ohne Build-Schritt)
- `build/` – Hilfsskripte (`standalone.py` erzeugt eine Einzeldatei, `map.py` die Kartendaten)
- `.github/workflows/pages.yml` – Deployment auf GitHub Pages bei jedem Push auf `main`

Lokal testen: `python -m http.server --directory site 8000`

Bildnachweis: Insektenfotos Wikipedia/Wikimedia Commons, Musterfotos Umpqua Feather Merchants, Karte Natural Earth.
