// AI module draft — lets a user with their own Anthropic API key have a
// Claude model research a real module's ports/parameters on the web and
// pre-fill the add-module form. Bring-your-own-key, called directly from
// the browser (no server involved at all — works the same in the browser,
// desktop and self-hosted builds), so it's off by default and costs the
// user's own account, not this project's.
//
// Deliberately list-view only: panel layout (front-panel control positions)
// isn't something text research can determine reliably — that stays a
// manual, PanelEditor-driven step, same as for any other module.
//
// The key/model are stored in localStorage only, same as the theme toggle
// — never synced via Store, never sent anywhere but api.anthropic.com.

const AIModule = (() => {
  const KEY_STORAGE   = 'patchdoc_anthropic_key';
  const MODEL_STORAGE = 'patchdoc_anthropic_model';
  const DEFAULT_MODEL = 'claude-sonnet-4-5-20250929';
  const VALID_CATS = ['oscillator','filter','envelope','lfo','vca','sequencer','effects','utility','guitar pedal','placeholder','other'];

  function open() {
    const maker = document.getElementById('m-maker').value.trim();
    const name  = document.getElementById('m-name').value.trim();
    if (!maker || !name) {
      App.setStatus('enter manufacturer and module name first, then request an AI suggestion');
      document.getElementById(maker ? 'm-name' : 'm-maker').focus();
      return;
    }
    document.getElementById('ai-module-target').textContent = maker + ' ' + name;
    try { document.getElementById('ai-key').value = localStorage.getItem(KEY_STORAGE) || ''; } catch(e) {}
    let savedModel = '';
    try { savedModel = localStorage.getItem(MODEL_STORAGE) || ''; } catch(e) {}
    document.getElementById('ai-model').value = savedModel || DEFAULT_MODEL;
    document.getElementById('ai-hint').value = '';
    _setStatus('', '');
    document.getElementById('ai-module-modal-bg').classList.add('open');
    document.getElementById('ai-key').focus();
  }

  function close() {
    document.getElementById('ai-module-modal-bg').classList.remove('open');
  }

  function _setStatus(text, kind) {
    const el = document.getElementById('ai-module-status');
    if (!el) return;
    el.textContent = text;
    el.style.color = kind === 'err' ? 'var(--danger)' : (kind === 'ok' ? 'var(--success)' : 'var(--text2)');
  }

  const SYSTEM_PROMPT = `You research Eurorack modules (or guitar pedals / other outboard gear) and return ONLY a single strict JSON object describing the module — no markdown fences, no prose before or after.

Use web search to find the manufacturer's real manual, product page or spec sheet for the given module, and base the answer on that — never invent port names or parameters that don't exist on the real hardware. If you can't find reliable information for a field, use a reasonable minimal default rather than guessing wildly.

JSON shape (all fields required, arrays may be empty):
{
  "maker": string,
  "name": string,
  "hp": integer,                 // Eurorack width in HP; best real-world guess if not Eurorack
  "cat": one of ${JSON.stringify(VALID_CATS)},
  "inputs": [string, ...],       // real input jack labels, as printed on the panel
  "outputs": [string, ...],      // real output jack labels
  "paramDefs": [                 // front-panel controls that are NOT jacks — knobs, faders, switches, menus
    { "name": string, "type": "knob", "display": "number"|"clock"|"freq", "min": number, "max": number, "default": number },
    { "name": string, "type": "fader", "display": "number"|"freq", "min": number, "max": number, "default": number },
    { "name": string, "type": "toggle", "default": boolean },
    { "name": string, "type": "enum", "options": "comma, separated, options", "default": string },
    { "name": string, "type": "text", "default": "" }
  ]
}

"display":"clock" is for a knob with no real unit (just a sweep position, e.g. a blend/mix knob) — use "freq" for an audio-frequency control (min/max in Hz), "number" otherwise; "clock" doesn't apply to a fader (linear travel, not a rotary sweep). Use "fader" only for an actual linear slide control (e.g. a mixer channel fader) — a rotary knob is "knob" even if it looks like a fader in a photo. Keep paramDefs to genuine adjustable controls, not every silkscreen label.`;

  async function generate() {
    const maker = document.getElementById('m-maker').value.trim();
    const name  = document.getElementById('m-name').value.trim();
    const key   = document.getElementById('ai-key').value.trim();
    const model = document.getElementById('ai-model').value.trim() || DEFAULT_MODEL;
    const hint  = document.getElementById('ai-hint').value.trim();
    if (!key) { _setStatus('please enter an API key.', 'err'); return; }

    try { localStorage.setItem(KEY_STORAGE, key); } catch(e) {}
    try { localStorage.setItem(MODEL_STORAGE, model); } catch(e) {}

    const genBtn = document.getElementById('ai-module-generate-btn');
    genBtn.disabled = true;
    _setStatus('researching ' + maker + ' ' + name + ' …', '');

    let userMsg = 'Module: ' + maker + ' ' + name;
    if (hint) userMsg += '\nHint: ' + hint;

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          // Required for a direct browser->API call with a user-supplied key
          // instead of going through a server proxy — this app has none.
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model,
          max_tokens: 4096,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userMsg }],
          tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 3 }],
        }),
      });

      if (!res.ok) {
        const errBody = await res.text().catch(() => '');
        let msg = 'HTTP ' + res.status;
        try { msg = JSON.parse(errBody).error?.message || msg; } catch(e) {}
        throw new Error(msg);
      }

      const data = await res.json();
      const text = (data.content || [])
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('\n')
        .trim();
      if (!text) throw new Error('empty response from the model');

      const parsed = _extractJson(text);
      _applyDraft(parsed, maker, name);

      close();
      document.getElementById('ai-module-banner').style.display = 'block';
      App.setStatus('AI suggestion filled in — please review before saving');
    } catch(err) {
      _setStatus('error: ' + err.message, 'err');
    } finally {
      genBtn.disabled = false;
    }
  }

  function _extractJson(text) {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1 || end < start) throw new Error('no JSON response detected');
    return JSON.parse(text.slice(start, end + 1));
  }

  function _sanitizePorts(list) {
    if (!Array.isArray(list)) return [];
    return list
      .filter(p => typeof p === 'string' && p.trim())
      .slice(0, 40)
      .map(p => ({ name: p.trim().slice(0, 40) }));
  }

  function _sanitizeParamDefs(list) {
    if (!Array.isArray(list)) return [];
    return list.map(d => {
      if (!d || typeof d !== 'object' || !d.name || !d.type) return null;
      const name = String(d.name).trim().slice(0, 60);
      if (!name) return null;
      if (d.type === 'knob' || d.type === 'fader') {
        // "clock" (rotary sweep-position readout) doesn't apply to a fader
        // — the system prompt already tells the model that, this is just
        // the defensive fallback in case it ignores it anyway.
        const allowedDisplays = d.type === 'fader' ? ['number', 'freq'] : ['number', 'clock', 'freq'];
        const display = allowedDisplays.includes(d.display) ? d.display : 'number';
        if (display === 'clock') return { name, type: d.type, display, min: 0, max: 100, default: 0 };
        const min = Number(d.min), max = Number(d.max), def = Number(d.default);
        const safeMin = Number.isFinite(min) ? min : 0;
        const safeMax = Number.isFinite(max) && max > safeMin ? max : safeMin + 100;
        return { name, type: d.type, display,
          min: safeMin, max: safeMax,
          default: Number.isFinite(def) ? Math.min(safeMax, Math.max(safeMin, def)) : safeMin };
      }
      if (d.type === 'toggle') return { name, type: 'toggle', default: !!d.default };
      if (d.type === 'enum') {
        const options = typeof d.options === 'string' ? d.options
          : (Array.isArray(d.options) ? d.options.join(', ') : '');
        const first = options.split(',')[0]?.trim() || '';
        const def = typeof d.default === 'string' && options.split(',').map(o => o.trim()).includes(d.default) ? d.default : first;
        return options ? { name, type: 'enum', options, default: def } : null;
      }
      if (d.type === 'text') return { name, type: 'text', default: typeof d.default === 'string' ? d.default.slice(0, 200) : '' };
      return null;
    }).filter(Boolean).slice(0, 40);
  }

  function _applyDraft(data, fallbackMaker, fallbackName) {
    document.getElementById('m-maker').value = (data.maker && String(data.maker).trim()) || fallbackMaker;
    document.getElementById('m-name').value  = (data.name  && String(data.name).trim())  || fallbackName;
    const hp = Number(data.hp);
    document.getElementById('m-hp').value = Number.isFinite(hp) && hp > 0 ? Math.round(hp) : 8;
    document.getElementById('m-cat').value = VALID_CATS.includes(data.cat) ? data.cat : 'other';

    window._tempInputs    = _sanitizePorts(data.inputs);
    window._tempOutputs   = _sanitizePorts(data.outputs);
    window._tempParamDefs = _sanitizeParamDefs(data.paramDefs);

    App._renderIOTags();
    App._renderParamDefs();
  }

  return { open, close, generate };
})();
