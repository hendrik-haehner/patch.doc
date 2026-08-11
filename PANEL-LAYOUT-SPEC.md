# PATCH.doc — Panel-Layout (Spezifikation)

Ziel: Module sollen optional so dargestellt werden können, dass Potis, Buchsen,
Schalter und Taster ungefähr dort sitzen wie auf der echten Frontplatte.

**Nicht maßstabsgetreu.** Lesbarkeit hat Vorrang vor realistischen Proportionen.
Module dürfen breiter und höher werden als das Original.

---

## Grundprinzip

Das Panel ist ein **Raster aus Zellen**, keine freie mm-Positionierung.
Eine Zelle ist 50 × 50 px — derselbe Wert, den das bestehende Knob-Grid
schon nutzt (`--pm-cell-w`).

Das Feld `panel` ist **optional**. Fehlt es, rendert das Modul exakt wie
bisher. Die vorhandene Modulbibliothek bleibt dadurch unangetastet, es
braucht keine Migration, und beide Darstellungsarten können nebeneinander
auf demselben Canvas stehen.

---

## Datenmodell

Erweiterung eines Moduls in `data/modules.json`:

```js
{
  id: 12,
  name: "A-135-2 Quad VCA",
  maker: "Doepfer",
  cat: "vca",
  hp: 8,

  // ── bestehend, bleibt unverändert ───────────────────────────
  inputs:  ["In 1", "CV 1", "In 2", "CV 2"],
  outputs: ["Out 1", "Out 2"],
  paramDefs: [
    { name: "Lvl 1", type: "knob", min: 0, max: 100 },
    { name: "Lvl 2", type: "knob", min: 0, max: 100 }
  ],

  // ── neu, optional ──────────────────────────────────────────
  panel: {
    cols: 4,
    rows: 8,
    elements: [
      { ref: "In 1",  type: "input",  col: 0, row: 0 },
      { ref: "CV 1",  type: "input",  col: 1, row: 0 },
      { ref: "Out 1", type: "output", col: 3, row: 0 },
      { ref: "Lvl 1", type: "knob",   col: 0, row: 2, w: 2 },
      { ref: null,    type: "divider-h", col: 0, row: 4, w: 4 },
      { ref: null,    type: "label",   col: 0, row: 5, w: 4, text: "CHANNEL 2" }
    ]
  }
}
```

### Felder eines Elements

| Feld | Pflicht | Bedeutung |
|---|---|---|
| `ref` | ja¹ | Name des Ports oder Parameters, exakt wie in `inputs` / `outputs` / `paramDefs` |
| `type` | ja | siehe Tabelle unten |
| `col` | ja | Spalte, 0-basiert |
| `row` | ja | Zeile, 0-basiert |
| `w` | nein | Breite in Zellen, Default 1 |
| `h` | nein | Höhe in Zellen, Default 1 |
| `text` | nein | nur bei `label` |
| `size` | nein | nur bei `knob`: `s` / `m` / `l`, Default `m` |

¹ `null` bei `label`, `divider-h`, `divider-v` und `button`.

### Elementtypen

| `type` | Datenquelle | Verhalten |
|---|---|---|
| `knob` | `paramDefs` (`type: knob`) | wie bisher: ziehen, Doppelklick für Wert |
| `switch` | `paramDefs` (`type: toggle`) | wie bisher |
| `enum` | `paramDefs` (`type: enum`) | Dropdown |
| `input` | `inputs` | Buchse, klickbar für Kabelverbindung |
| `output` | `outputs` | Buchse, klickbar für Kabelverbindung |
| `button` | — | **neu**, reine Deko (Momentary-Taster ohne Zustand) |
| `label` | — | Textbeschriftung |
| `divider-h` | — | horizontale Trennlinie |
| `divider-v` | — | vertikale Trennlinie |

Legacy: Panels, die vor dieser Umbenennung gespeichert wurden, können noch
`type: "divider"` enthalten (der alte Name für `divider-h`) — der Renderer
liest beide, aber der Editor erzeugt beim Neuplatzieren nur noch `divider-h`.

**Zu `button`:** Ein Taster hat keinen speicherbaren Wert — er ist eine
Aktion, kein Zustand. Wird nur gezeichnet, damit das Panel wiedererkennbar
ist. Kein Eintrag in `patch.params`, kein Undo-Snapshot.

---

## Renderer

### Einstiegspunkt

In `patch.js`, in der Modulschleife von `render()`:

```js
if (m.panel && Patch._panelMode) {
  el.innerHTML = header + this._renderPanel(pm, m, vals, col, catCol);
} else {
  // bestehender Pfad, komplett unverändert
}
```

Der Header (Hersteller / Modulname / PDF / Collapse / ×) bleibt in beiden
Modi identisch.

### `_renderPanel(pm, m, vals, col, catCol)`

Erzeugt einen Container:

```js
`<div class="pm-panel" style="
    grid-template-columns: repeat(${m.panel.cols}, var(--pm-cell-w, 50px));
    grid-template-rows: repeat(${m.panel.rows}, auto);
 ">${elementsHtml}</div>`
```

Jedes Element bekommt seine Position per Inline-Style:

```js
style="grid-column: ${e.col + 1} / span ${e.w || 1};
       grid-row: ${e.row + 1} / span ${e.h || 1};"
```

### Zwingende Regel: bestehende Bausteine wiederverwenden

Der Panel-Renderer erzeugt **kein eigenes Markup** für Controls und Ports.

- **Knobs, Switches, Enums** → über `this._renderControl(pm.id, def, vals[def.name], col)`.
  Der `def` wird per `ref` aus `m.paramDefs` geholt.
- **Buchsen** → exakt dieselbe Markup-Struktur wie im Listenpfad, inklusive
  `id="jack-${pm.id}-${dir}-${portName}"`, `data-pmid`, `data-port`, `data-dir`
  und `onclick`.

**Begründung:** `_getPortCenter()`, `clickPort()`, `updateJacks()`,
`renderCables()` und `_highlightCables()` greifen alle über genau diese
IDs und Attribute zu. Weicht das Panel-Markup davon ab, brechen Kabel,
Highlighting und Parameterwerte — und der Fehler ist schwer zu finden,
weil er sich als „Kabel enden im Nichts" äußert, nicht als Exception.

### Modulbreite

```js
el.style.minWidth = (m.panel.cols * CELL_W + PADDING) + 'px';
```

Kein festes `width` setzen — sonst schneidet `overflow: hidden` lange
Portnamen ab. Das ist in dieser Codebase schon mehrfach passiert.

---

## Umsetzung in drei Schritten

### 1. Renderer

`_panelMode` zunächst fest auf `true`. Nur **ein** Modul in `modules.json`
bekommt ein `panel`. Alle anderen rendern weiter im Listenmodus — der
Vergleich steht dann direkt nebeneinander auf dem Canvas.

Empfohlenes Testmodul: **A-135-2 Quad VCA**. Wenige Elemente, keine Enums,
aber realistisch genug um etwas auszusagen.

Prüfen:
- [x] Kabel lassen sich ziehen und enden mittig auf den Buchsen
- [x] Potis reagieren auf Ziehen und Doppelklick
- [x] Performance-Markierung per Klick auf den Parameternamen
- [x] Hover-Highlighting dimmt unbeteiligte Module
- [ ] PNG-Export enthält das Panel korrekt (Renderer liefert normales DOM/CSS-Grid,
      nicht separat gegen die dom-to-image-more-CDN-Abhängigkeit getestet)

### 2. Umschalter

Toolbar-Button `panel view` / `list view`, gleicher Stil wie `snap` und
`highlighting`: blau wenn aktiv. Zustand in `localStorage`.

Module ohne `panel` rendern immer als Liste, unabhängig vom Modus.

### 3. Editor

Erst wenn Schritt 1 sich gut anfühlt. Zweispaltiger Dialog:

- **Links:** Chips für alle Ports und Parameter, die noch nicht platziert
  sind. Dazu Buttons `+ Label`, `+ Divider`, `+ Button`.
- **Rechts:** das Raster als Gitter leerer Zellen. Chip hineinziehen →
  belegt die Zelle. Innerhalb verschieben → umsortieren. Herausziehen →
  zurück in die Liste. `cols` und `rows` oben einstellbar.

Der Editor **legt keine Ports oder Parameter an** — er positioniert nur,
was im bestehenden Modul-Formular bereits definiert wurde. Anlegen bleibt
dort, wo es jetzt ist.

Kein Snap nötig: das Raster *ist* die Rasterung. HTML5 Drag & Drop auf
CSS-Grid-Zellen reicht.

---

## Panel von Hand eintragen (für Schritt 1)

`modules.json` liegt als eine lange Zeile vor, Handarbeit ist unangenehm.
Besser per Skript auf dem NAS:

```bash
cd /volume1/docker/patchbook/data
cp modules.json modules.json.bak     # nicht überspringen

# Modul-ID und exakte Namen ermitteln
python3 -c "
import json
d = json.load(open('modules.json'))
for m in d['modules']:
    if 'VCA' in m['name']:
        print(m['id'], m['name'])
        print('  in :', m.get('inputs'))
        print('  out:', m.get('outputs'))
        print('  par:', [p['name'] for p in m.get('paramDefs', [])])
"
```

Dann das Panel setzen:

```bash
python3 << 'EOF'
import json
p = 'modules.json'
d = json.load(open(p))
panel = {
  "cols": 4, "rows": 8,
  "elements": [
    {"ref": "In 1",  "type": "input",  "col": 0, "row": 0},
    {"ref": "CV 1",  "type": "input",  "col": 1, "row": 0},
    {"ref": "Out 1", "type": "output", "col": 3, "row": 0},
    {"ref": "Lvl 1", "type": "knob",   "col": 0, "row": 2, "w": 2}
  ]
}
for m in d['modules']:
    if m['id'] == 12:        # ← anpassen
        m['panel'] = panel
json.dump(d, open(p, 'w'), indent=2, ensure_ascii=False)
print('ok')
EOF

python3 -m json.tool modules.json > /dev/null && echo "JSON valid"
```

Kein Container-Neustart nötig — `modules.json` wird bei jedem
`/api/modules`-Aufruf frisch gelesen. Browser neu laden genügt.

Zurückrollen: `cp modules.json.bak modules.json`

---

## Offene Frage für später

Panel-Layouts liegen in `modules.json` und sind damit **global**, also für
alle Nutzer gleich. Das ist konsistent mit den Modulfarben, die sich
genauso verhalten. Falls Panels später pro Nutzer sein sollen, müssten sie
nach `state.json` wandern — das ist derselbe Umbau, der auch für die
Modulfarben nötig wäre, und sollte gemeinsam entschieden werden.
