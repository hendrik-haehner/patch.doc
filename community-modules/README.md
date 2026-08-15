# Community modules

`index.json` in this folder is a shared library of Eurorack module
definitions that anyone running PATCH.doc (browser, desktop, or
self-hosted) can browse and import into their own module library, via
**Modules → the download-cloud icon next to "+ New Module"**.

This is currently **read-only from inside the app** — there's no in-app
upload yet, only search/import. To add a module, open a pull request
against this file.

## How importing works

The app fetches this file directly from GitHub
(`raw.githubusercontent.com/hendrik-haehner/patch.doc/main/community-modules/index.json`)
at request time — no server or account needed, works the same in the
browser version, the desktop app, and self-hosted instances. Importing a
module copies its definition into your own local module library; nothing
here is fetched or synced automatically after that.

Modules already in your library (matched by name + manufacturer) are
shown as already added instead of offering an import button, so you can't
accidentally duplicate one you already have.

## Contributing a module

1. Fork this repo and open `community-modules/index.json`.
2. Add an entry to the JSON array following the schema below.
3. Open a pull request. Keep it to one module (or a small, related batch)
   per PR so it's easy to review.

Please only submit modules you're comfortable sharing publicly — panel
photos/scans aren't part of this format (see "not included" below), but
the port/parameter layout you describe here becomes public domain-ish
shared data anyone can pull into their own library.

## Schema

```jsonc
{
  "name": "Plaits",              // required
  "maker": "Mutable Instruments", // required
  "hp": 12,                       // module width in HP, integer
  "cat": "oscillator",            // one of: oscillator, filter, envelope,
                                   // lfo, vca, sequencer, effects, utility,
                                   // guitar pedal, other
  "color": "#4a90d9",             // optional hex color, or omit/null
  "paramCols": 3,                 // parameter grid column count (2-8)
  "power12p": 30,                 // optional, +12V current draw in mA
  "power12n": 15,                 // optional, -12V current draw in mA
  "power5": 0,                    // optional, +5V current draw in mA

  "inputs":  [{ "name": "v/oct" }, { "name": "trigger" }],
  "outputs": [{ "name": "out" }, { "name": "aux" }],

  "paramDefs": [
    { "name": "frequency", "type": "knob", "display": "freq", "min": -60, "max": 60, "default": 0 },
    { "name": "model",     "type": "enum", "options": "virtual analog, waveshaping, fm, grain", "default": "virtual analog" },
    { "name": "sync",      "type": "toggle", "default": false },
    { "type": "divider" }
  ]
}
```

- `paramDefs[].type` is one of `knob`, `toggle`, `enum`, `text`, `divider`.
- `knob.display` is one of `number`, `clock`, `freq` — `clock` ignores
  `min`/`max`/`default` and always renders 0-100.
- `enum.options` is a single comma-separated string, not an array.
- `divider` only needs `{ "type": "divider" }` (a visual separator between
  parameters, no name/value).

**Not included**: manual PDFs/links and front-panel visual layouts aren't
part of this format — those stay local to whoever adds them (manuals
because they're often copyrighted PDFs, panel layouts because they're
fiddly per-user grid placements). Imported modules always start as a
plain list view; anyone can add their own panel layout afterward.

## Validating your PR locally

There's no build step — `index.json` just needs to be valid JSON and an
array of objects roughly matching the schema above. Run this from the
repo root before opening a PR:

```bash
node -e "const a = require('./community-modules/index.json'); if (!Array.isArray(a)) throw new Error('not an array'); console.log(a.length + ' module(s), OK')"
```
