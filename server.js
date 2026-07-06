const express = require('express');
const fs      = require('fs');
const path    = require('path');
const crypto  = require('crypto');
const multer  = require('multer');

const app      = express();
const PORT     = process.env.PORT     || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const SECRET   = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

// ── User management ───────────────────────────────────────────────────────────
// Users are stored in /data/users.json: { username: { password, isAdmin } }
// Initial users from PATCHDOC_USERS env var are seeded on first run.
// First user in PATCHDOC_USERS is admin.

const USERS_FILE = path.join(DATA_DIR, 'users.json');

function _loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  } catch(e) {}
  return {};
}

function _saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

function _seedUsers() {
  const users = _loadUsers();
  const raw = process.env.PATCHDOC_USERS || ('admin:' + (process.env.PATCHDOC_PASSWORD || 'patchdoc'));
  let isFirst = true;
  raw.split(',').forEach(entry => {
    const [username, ...rest] = entry.trim().split(':');
    const password = rest.join(':').trim();
    if (!username || !password) return;
    const key = username.toLowerCase();
    if (!users[key]) {
      users[key] = { password, isAdmin: isFirst };
      ensureUserDir(key);
    }
    isFirst = false;
  });
  _saveUsers(users);
  return users;
}

let USERS = {};

function checkPassword(username, password) {
  const u = USERS[username?.toLowerCase()];
  if (!u) return false;
  return u.password === password;
}

function isAdmin(username) {
  return !!USERS[username?.toLowerCase()]?.isAdmin;
}

function requireAdmin(req, res, next) {
  if (!isAdmin(req.user)) return res.status(403).json({ error: 'forbidden' });
  next();
}

// ── Directory structure ───────────────────────────────────────────────────────
// /data/
//   modules.json        ← shared module library
//   manuals/            ← shared manuals
//   users/
//     <username>/
//       state.json      ← user's patches
//       media/          ← user's media

const MANUALS_DIR  = path.join(DATA_DIR, 'manuals');
const USERS_DIR    = path.join(DATA_DIR, 'users');
const MODULES_FILE = path.join(DATA_DIR, 'modules.json');
const SHARED_FILE  = path.join(DATA_DIR, 'shared.json');

function userDir(u)       { return path.join(USERS_DIR, u); }
function userStateFile(u) { return path.join(userDir(u), 'state.json'); }
function userMediaDir(u)  { return path.join(userDir(u), 'media'); }

function ensureUserDir(u) {
  [userDir(u), userMediaDir(u)].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });
}

// ── Migration from single-user ────────────────────────────────────────────────
function migrate() {
  const oldState = path.join(DATA_DIR, 'state.json');
  const oldMedia = path.join(DATA_DIR, 'media');
  if (!fs.existsSync(oldState)) return;

  const firstUser = Object.keys(USERS)[0];
  console.log(`[migration] Migrating data to user "${firstUser}"…`);
  ensureUserDir(firstUser);

  let state;
  try { state = JSON.parse(fs.readFileSync(oldState, 'utf8')); }
  catch(e) { console.error('[migration] Cannot read state.json', e); return; }

  // Shared modules
  if (state.modules && !fs.existsSync(MODULES_FILE)) {
    fs.writeFileSync(MODULES_FILE, JSON.stringify({
      modules:      state.modules,
      nextModuleId: state.nextModuleId || 24
    }, null, 2));
    console.log(`[migration] ${state.modules.length} modules → modules.json`);
  }

  // User patches
  if (!fs.existsSync(userStateFile(firstUser))) {
    fs.writeFileSync(userStateFile(firstUser), JSON.stringify({
      version:       state.version || 2,
      patches:       state.patches || [],
      activePatchId: state.activePatchId || null,
      nextPatchNum:  state.nextPatchNum  || 1,
    }, null, 2));
    console.log(`[migration] ${(state.patches||[]).length} patches → users/${firstUser}/state.json`);
  }

  // User media
  if (fs.existsSync(oldMedia)) {
    fs.readdirSync(oldMedia).forEach(entry => {
      const src = path.join(oldMedia, entry);
      const dst = path.join(userMediaDir(firstUser), entry);
      if (!fs.existsSync(dst)) fs.cpSync(src, dst, { recursive: true });
    });
    console.log(`[migration] media → users/${firstUser}/media/`);
  }

  fs.renameSync(oldState, oldState + '.migrated');
  console.log('[migration] Done — old state.json renamed to state.json.migrated');
}

// ── Setup ─────────────────────────────────────────────────────────────────────
[DATA_DIR, MANUALS_DIR, USERS_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});
// Init shared patches file
if (!fs.existsSync(SHARED_FILE)) fs.writeFileSync(SHARED_FILE, JSON.stringify([]), 'utf8');
// Seed users from env and load into memory
USERS = _seedUsers();
migrate();

// ── Sessions — persisted to disk so container restarts don't log everyone out ──
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

function _loadSessions() {
  try {
    if (!fs.existsSync(SESSIONS_FILE)) return new Map();
    const raw = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8'));
    const now = Date.now();
    // Filter expired sessions on load
    return new Map(Object.entries(raw).filter(([, s]) => s.exp > now));
  } catch(e) { return new Map(); }
}

function _saveSessions(sessions) {
  try {
    const obj = {};
    sessions.forEach((v, k) => { obj[k] = v; });
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(obj), 'utf8');
  } catch(e) { console.error('Could not save sessions:', e); }
}

const sessions = _loadSessions();

function createSession(username) {
  const id  = crypto.randomBytes(32).toString('hex');
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30 days
  sessions.set(id, { username, exp });
  _saveSessions(sessions);
  return id;
}

function getSession(req) {
  const m = (req.headers.cookie || '').match(/patchdoc_session=([a-f0-9]+)/);
  if (!m) return null;
  const s = sessions.get(m[1]);
  if (!s || Date.now() > s.exp) {
    if (s) { sessions.delete(m[1]); _saveSessions(sessions); }
    return null;
  }
  return s;
}

function getSessionId(req) {
  const m = (req.headers.cookie || '').match(/patchdoc_session=([a-f0-9]+)/);
  return m ? m[1] : null;
}

// ── Middleware ────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  if (req.headers['content-type']?.startsWith('multipart/form-data')) return next();
  express.json({ limit: '50mb' })(req, res, err => {
    if (err) return next(err);
    express.urlencoded({ extended: false })(req, res, err => {
      if (err) return next(err);
      express.text({ type: '*/*', limit: '50mb' })(req, res, next);
    });
  });
});

function requireAuth(req, res, next) {
  if (req.path === '/login' || req.path === '/api/login') return next();
  const s = getSession(req);
  if (s) { req.user = s.username; return next(); }
  if (req.path.startsWith('/api/')) return res.status(401).json({ error: 'unauthorized' });
  res.redirect('/login');
}
app.use(requireAuth);

// Prevent browser caching of all API responses
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// ── Login page ────────────────────────────────────────────────────────────────
app.get('/login', (req, res) => {
  if (getSession(req)) return res.redirect('/');
  const multi = Object.keys(USERS).length > 1;
  res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>PATCH.doc — Login</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'JetBrains Mono', ui-monospace, monospace; background: #0a0e0a; color: #ccd8c4; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { background: #111811; border: 0.5px solid rgba(180,210,180,0.2); border-radius: 12px; padding: 40px 36px; width: 320px; }
    .brand { font-size: 18px; font-weight: 600; letter-spacing: 0.1em; color: #8f86e8; margin-bottom: 6px; }
    .subtitle { font-size: 11px; color: #4e5e4c; margin-bottom: 28px; }
    label { font-size: 10px; color: #5e7060; letter-spacing: 0.1em; display: block; margin-bottom: 6px; }
    input { width: 100%; padding: 10px 12px; font-size: 14px; font-family: inherit; background: #0a0e0a; border: 1px solid rgba(180,210,180,0.2); border-radius: 6px; color: #ccd8c4; outline: none; margin-bottom: 16px; }
    input:focus { border-color: rgba(143,134,232,0.5); }
    button { width: 100%; padding: 10px; font-size: 13px; font-family: inherit; background: rgba(143,134,232,0.15); border: 1px solid rgba(143,134,232,0.4); border-radius: 6px; color: #8f86e8; cursor: pointer; font-weight: 600; letter-spacing: 0.06em; transition: background 0.15s; }
    button:hover { background: rgba(143,134,232,0.25); }
    .error { font-size: 11px; color: #c8612a; margin-bottom: 14px; padding: 8px 10px; background: rgba(200,97,42,0.1); border-radius: 4px; border: 0.5px solid rgba(200,97,42,0.3); display: none; }
    .error.show { display: block; }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">▣ PATCH.doc</div>
    <div class="subtitle">Eurorack Patch Documentation</div>
    <form method="POST" action="/api/login">
      ${multi
        ? `<label>USERNAME</label><input type="text" name="username" autofocus autocomplete="username" placeholder="username">`
        : `<input type="hidden" name="username" value="${Object.keys(USERS)[0]}">`}
      <label>PASSWORD</label>
      <div class="error ${req.query.err ? 'show' : ''}">Wrong username or password.</div>
      <input type="password" name="password" ${!multi ? 'autofocus' : ''} autocomplete="current-password" placeholder="••••••••">
      <button type="submit">Login</button>
    </form>
  </div>
</body>
</html>`);
});

app.post('/api/login', (req, res) => {
  const username = (req.body.username || Object.keys(USERS)[0]).trim().toLowerCase();
  const password = (req.body.password || '').trim();
  if (!checkPassword(username, password)) return res.redirect('/login?err=1');
  const id  = createSession(username);
  const exp = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toUTCString();
  res.setHeader('Set-Cookie', `patchdoc_session=${id}; Path=/; HttpOnly; Expires=${exp}; SameSite=Strict`);
  res.redirect('/');
});

app.get('/api/logout', (req, res) => {
  const id = getSessionId(req);
  if (id) { sessions.delete(id); _saveSessions(sessions); }
  res.setHeader('Set-Cookie', 'patchdoc_session=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
  res.redirect('/login');
});

// ── Static files ──────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── Multer: per-user media ────────────────────────────────────────────────────
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const d = path.join(userMediaDir(req.user), req.params.patchId);
      if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
      cb(null, d);
    },
    filename: (req, file, cb) => cb(null, crypto.randomBytes(8).toString('hex') + path.extname(file.originalname))
  }),
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, /^(image|audio)\//.test(file.mimetype))
});

// ── Multer: shared manuals ────────────────────────────────────────────────────
const uploadManual = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const d = path.join(MANUALS_DIR, req.params.moduleId);
      if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
      cb(null, d);
    },
    filename: (req, file, cb) => cb(null, crypto.randomBytes(8).toString('hex') + (path.extname(file.originalname) || '.pdf'))
  }),
  limits: { fileSize: 150 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, file.mimetype === 'application/pdf')
});

// ── API: user settings (per-user category colors etc.) ───────────────────────
const DEFAULT_CAT_COLORS = {
  oscillator: '#8f86e8', filter: '#2aaa7a', envelope: '#d4963a',
  lfo: '#4a9fd4', vca: '#c45c82', sequencer: '#c8612a',
  effects: '#7aaa2a', utility: '#7a8a78', 'guitar pedal': '#c87850',
  placeholder: '#a0a0a0', other: '#7a8a78'
};

function userSettingsFile(u) { return path.join(userDir(u), 'settings.json'); }

function _loadUserSettings(u) {
  try {
    if (fs.existsSync(userSettingsFile(u))) {
      return JSON.parse(fs.readFileSync(userSettingsFile(u), 'utf8'));
    }
  } catch(e) {}
  return { catColors: { ...DEFAULT_CAT_COLORS } };
}

app.get('/api/settings', (req, res) => {
  res.json(_loadUserSettings(req.user));
});

app.post('/api/settings', (req, res) => {
  try {
    const current = _loadUserSettings(req.user);
    const updated = { ...current, ...req.body };
    fs.writeFileSync(userSettingsFile(req.user), JSON.stringify(updated, null, 2), 'utf8');
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: 'Could not save settings' }); }
});

// ── API: user patches ─────────────────────────────────────────────────────────
app.get('/api/state', (req, res) => {
  const f = userStateFile(req.user);
  if (!fs.existsSync(f)) return res.json(null);
  try { res.json(JSON.parse(fs.readFileSync(f, 'utf8'))); }
  catch(e) { res.status(500).json({ error: 'Could not read state' }); }
});

app.post('/api/state', (req, res) => {
  try {
    if (!req.body || !Array.isArray(req.body.patches)) return res.status(400).json({ error: 'Invalid state' });
    ensureUserDir(req.user);
    const tmp = userStateFile(req.user) + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(req.body, null, 2), 'utf8');
    fs.renameSync(tmp, userStateFile(req.user));
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: 'Could not save state' }); }
});

app.post('/api/state-beacon', (req, res) => {
  try {
    let data;
    if (typeof req.body === 'string')      data = req.body;
    else if (Buffer.isBuffer(req.body))    data = req.body.toString('utf8');
    else                                   data = JSON.stringify(req.body);
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed.patches))    { res.status(400).end(); return; }
    ensureUserDir(req.user);
    const tmp = userStateFile(req.user) + '.tmp';
    fs.writeFileSync(tmp, data, 'utf8');
    fs.renameSync(tmp, userStateFile(req.user));
    res.status(204).end();
  } catch(e) { res.status(500).end(); }
});

// ── API: shared modules ───────────────────────────────────────────────────────
app.get('/api/modules', (req, res) => {
  if (!fs.existsSync(MODULES_FILE)) return res.json({ modules: [], nextModuleId: 1 });
  try { res.json(JSON.parse(fs.readFileSync(MODULES_FILE, 'utf8'))); }
  catch(e) { res.status(500).json({ error: 'Could not read modules' }); }
});

app.post('/api/modules', (req, res) => {
  try {
    if (!req.body || !Array.isArray(req.body.modules)) return res.status(400).json({ error: 'Invalid modules' });
    const tmp = MODULES_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(req.body, null, 2), 'utf8');
    fs.renameSync(tmp, MODULES_FILE);
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: 'Could not save modules' }); }
});

// ── API: who am I ─────────────────────────────────────────────────────────────
app.get('/api/me', (req, res) => res.json({ username: req.user, isAdmin: isAdmin(req.user) }));

// ── API: health ───────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const sf = userStateFile(req.user);
  res.json({ status: 'ok', user: req.user, dataFile: fs.existsSync(sf), dataDir: DATA_DIR });
});

// ── API: per-user media ───────────────────────────────────────────────────────
app.post('/api/media/:patchId', (req, res) => {
  upload.single('file')(req, res, err => {
    if (err) return res.status(500).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'no file' });
    res.json({ id: req.file.filename, name: req.file.originalname, type: req.file.mimetype, size: req.file.size, url: `/api/media/${req.params.patchId}/${req.file.filename}` });
  });
});

app.get('/api/media/:patchId', (req, res) => {
  const d = path.join(userMediaDir(req.user), req.params.patchId);
  if (!fs.existsSync(d)) return res.json([]);
  const meta = _mediaMeta(req.user, req.params.patchId);
  res.json(fs.readdirSync(d).filter(f => !f.endsWith('.meta.json')).map(f => ({
    id: f, name: meta[f]?.name || f, type: meta[f]?.type || 'application/octet-stream',
    size: fs.statSync(path.join(d, f)).size, url: `/api/media/${req.params.patchId}/${f}`
  })));
});

app.get('/api/media/:patchId/:filename', (req, res) => {
  const f = path.join(userMediaDir(req.user), req.params.patchId, req.params.filename);
  if (!fs.existsSync(f)) return res.status(404).end();
  res.sendFile(f);
});

app.patch('/api/media/:patchId/:filename', (req, res) => {
  const meta = _mediaMeta(req.user, req.params.patchId);
  meta[req.params.filename] = { ...meta[req.params.filename], ...req.body };
  _saveMediaMeta(req.user, req.params.patchId, meta);
  res.json({ ok: true });
});

app.delete('/api/media/:patchId/:filename', (req, res) => {
  const f = path.join(userMediaDir(req.user), req.params.patchId, req.params.filename);
  if (fs.existsSync(f)) fs.unlinkSync(f);
  const meta = _mediaMeta(req.user, req.params.patchId);
  delete meta[req.params.filename];
  _saveMediaMeta(req.user, req.params.patchId, meta);
  res.json({ ok: true });
});

function _mediaMeta(u, patchId) {
  const f = path.join(userMediaDir(u), patchId, '.meta.json');
  try { return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {}; } catch(e) { return {}; }
}
function _saveMediaMeta(u, patchId, meta) {
  const d = path.join(userMediaDir(u), patchId);
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, '.meta.json'), JSON.stringify(meta, null, 2));
}

// ── API: shared manuals ───────────────────────────────────────────────────────
app.post('/api/manuals/:moduleId', (req, res) => {
  uploadManual.single('file')(req, res, err => {
    if (err) return res.status(500).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'no file' });
    res.json({ id: req.file.filename, name: req.file.originalname, type: req.file.mimetype, size: req.file.size, url: `/api/manuals/${req.params.moduleId}/${req.file.filename}` });
  });
});

app.get('/api/manuals/:moduleId', (req, res) => {
  const d = path.join(MANUALS_DIR, req.params.moduleId);
  if (!fs.existsSync(d)) return res.json([]);
  const meta = _manualMeta(req.params.moduleId);
  res.json(fs.readdirSync(d).filter(f => !f.endsWith('.meta.json')).map(f => ({
    id: f, name: meta[f]?.name || f, type: meta[f]?.type || 'application/pdf',
    size: fs.statSync(path.join(d, f)).size, url: `/api/manuals/${req.params.moduleId}/${f}`
  })));
});

app.get('/api/manuals/:moduleId/:filename', (req, res) => {
  const f = path.join(MANUALS_DIR, req.params.moduleId, req.params.filename);
  if (!fs.existsSync(f)) return res.status(404).end();
  res.sendFile(f);
});

app.patch('/api/manuals/:moduleId/:filename', (req, res) => {
  const meta = _manualMeta(req.params.moduleId);
  meta[req.params.filename] = { ...meta[req.params.filename], ...req.body };
  _saveManualMeta(req.params.moduleId, meta);
  res.json({ ok: true });
});

app.delete('/api/manuals/:moduleId/:filename', (req, res) => {
  const f = path.join(MANUALS_DIR, req.params.moduleId, req.params.filename);
  if (fs.existsSync(f)) fs.unlinkSync(f);
  const meta = _manualMeta(req.params.moduleId);
  delete meta[req.params.filename];
  _saveManualMeta(req.params.moduleId, meta);
  res.json({ ok: true });
});

function _manualMeta(moduleId) {
  const f = path.join(MANUALS_DIR, moduleId, '.meta.json');
  try { return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {}; } catch(e) { return {}; }
}
function _saveManualMeta(moduleId, meta) {
  const d = path.join(MANUALS_DIR, moduleId);
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, '.meta.json'), JSON.stringify(meta, null, 2));
}

// ── API: shared patches ──────────────────────────────────────────────────────
function _loadShared() {
  try { return fs.existsSync(SHARED_FILE) ? JSON.parse(fs.readFileSync(SHARED_FILE, 'utf8')) : []; }
  catch(e) { return []; }
}
function _saveShared(patches) {
  const tmp = SHARED_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(patches, null, 2), 'utf8');
  fs.renameSync(tmp, SHARED_FILE);
}

// List all shared patches
app.get('/api/shared', (req, res) => {
  res.json(_loadShared());
});

// Share a patch (body: { patch })
app.post('/api/shared', (req, res) => {
  try {
    const { patch } = req.body;
    if (!patch || !patch.id) return res.status(400).json({ error: 'invalid patch' });
    const shared = _loadShared();
    // Avoid duplicates — replace if same original id+user already shared
    const existing = shared.findIndex(s => s.originalId === patch.id && s.sharedBy === req.user);
    const entry = {
      id:         'shared_' + Date.now(),
      originalId: patch.id,
      sharedBy:   req.user,
      sharedAt:   new Date().toISOString(),
      patch:      { ...patch, id: 'shared_' + Date.now() }
    };
    if (existing !== -1) shared[existing] = entry;
    else shared.push(entry);
    _saveShared(shared);
    res.json({ ok: true, entry });
  } catch(e) { res.status(500).json({ error: 'Could not share patch' }); }
});

// Delete a shared patch
app.delete('/api/shared/:id', (req, res) => {
  const shared = _loadShared().filter(s => s.id !== req.params.id);
  _saveShared(shared);
  res.json({ ok: true });
});

// Claim a shared patch — returns the patch to be added client-side
app.get('/api/shared/:id/claim', (req, res) => {
  const entry = _loadShared().find(s => s.id === req.params.id);
  if (!entry) return res.status(404).json({ error: 'not found' });
  res.json({ patch: entry.patch, sharedBy: entry.sharedBy });
});

// ── Admin API ─────────────────────────────────────────────────────────────────
app.get('/api/admin/users', requireAdmin, (req, res) => {
  const users = _loadUsers();
  res.json(Object.entries(users).map(([username, u]) => ({
    username,
    isAdmin: !!u.isAdmin
  })));
});

app.post('/api/admin/users', requireAdmin, (req, res) => {
  const { username, password, isAdmin: admin } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  const key = username.toLowerCase().trim();
  if (!/^[a-z0-9_-]+$/.test(key)) return res.status(400).json({ error: 'username may only contain letters, numbers, - and _' });
  const users = _loadUsers();
  if (users[key]) return res.status(409).json({ error: 'user already exists' });
  users[key] = { password: password.trim(), isAdmin: !!admin };
  _saveUsers(users);
  USERS = users;
  ensureUserDir(key);
  res.json({ ok: true, username: key });
});

app.patch('/api/admin/users/:username', requireAdmin, (req, res) => {
  const key = req.params.username.toLowerCase();
  const users = _loadUsers();
  if (!users[key]) return res.status(404).json({ error: 'user not found' });
  if (req.body.password) users[key].password = req.body.password.trim();
  if (typeof req.body.isAdmin === 'boolean') {
    // Prevent removing admin from the last admin
    const adminCount = Object.values(users).filter(u => u.isAdmin).length;
    if (!req.body.isAdmin && users[key].isAdmin && adminCount <= 1) {
      return res.status(400).json({ error: 'cannot remove the last admin' });
    }
    users[key].isAdmin = req.body.isAdmin;
  }
  _saveUsers(users);
  USERS = users;
  res.json({ ok: true });
});

app.delete('/api/admin/users/:username', requireAdmin, (req, res) => {
  const key = req.params.username.toLowerCase();
  if (key === req.user) return res.status(400).json({ error: 'cannot delete yourself' });
  const users = _loadUsers();
  if (!users[key]) return res.status(404).json({ error: 'user not found' });
  const adminCount = Object.values(users).filter(u => u.isAdmin).length;
  if (users[key].isAdmin && adminCount <= 1) return res.status(400).json({ error: 'cannot delete the last admin' });
  delete users[key];
  _saveUsers(users);
  USERS = users;
  res.json({ ok: true });
});

// Settings page — available to all users
app.get('/settings', (req, res) => {
  const settings = _loadUserSettings(req.user);
  const cats = Object.entries({ ...DEFAULT_CAT_COLORS, ...settings.catColors });
  res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>PATCH.doc — Settings</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'JetBrains Mono', ui-monospace, monospace; background: #0a0e0a; color: #ccd8c4; padding: 32px 24px; max-width: 520px; margin: 0 auto; }
    h1 { font-size: 16px; letter-spacing: 0.12em; color: #8f86e8; margin-bottom: 4px; }
    .subtitle { font-size: 11px; color: #4e5e4c; margin-bottom: 32px; }
    h2 { font-size: 11px; letter-spacing: 0.1em; color: #5e7060; margin: 24px 0 12px; }
    .color-row {
      display: flex; align-items: center; gap: 12px;
      padding: 8px 0; border-bottom: 0.5px solid rgba(180,210,180,0.1);
    }
    .color-row:last-child { border-bottom: none; }
    .color-label { flex: 1; font-size: 12px; color: #ccd8c4; }
    input[type=color] {
      width: 36px; height: 36px; border: none; border-radius: 6px;
      cursor: pointer; background: none; padding: 0;
    }
    .color-hex { font-size: 11px; color: #5e7060; width: 70px; font-family: monospace; }
    .btn { font-family: inherit; font-size: 12px; padding: 8px 16px; border-radius: 6px;
      cursor: pointer; border: 0.5px solid; transition: background 0.1s; margin-top: 20px; }
    .btn-primary { background: rgba(143,134,232,0.15); border-color: rgba(143,134,232,0.4); color: #8f86e8; }
    .btn-primary:hover { background: rgba(143,134,232,0.25); }
    .btn-reset { background: transparent; border-color: rgba(180,210,180,0.2); color: #5e7060; margin-left: 8px; }
    .btn-reset:hover { color: #ccd8c4; }
    .msg { font-size: 11px; margin-top: 10px; }
    .back { font-size: 11px; color: #5e7060; text-decoration: none; display: inline-block; margin-bottom: 24px; }
    .back:hover { color: #8f86e8; }
    ${isAdmin(req.user) ? '.admin-link { display: inline-block; margin-left: 16px; }' : ''}
  </style>
</head>
<body>
  <a href="/" class="back">← back to PATCH.doc</a>
  ${isAdmin(req.user) ? '<a href="/admin" class="back admin-link">⚙ admin panel</a>' : ''}
  <h1>▣ PATCH.doc</h1>
  <div class="subtitle">Settings · ${req.user}</div>

  <h2>CATEGORY COLORS</h2>
  <div id="color-list">
    ${cats.map(([cat, hex]) => `
    <div class="color-row">
      <span class="color-label">${cat}</span>
      <input type="color" value="${hex}" data-cat="${cat}" oninput="updateHex(this)">
      <span class="color-hex" id="hex-${cat}">${hex}</span>
    </div>`).join('')}
  </div>
  <div>
    <button class="btn btn-primary" onclick="save()">save</button>
    <button class="btn btn-reset" onclick="reset()">reset to defaults</button>
  </div>
  <div class="msg" id="msg"></div>

  <script>
    function updateHex(input) {
      document.getElementById('hex-' + input.dataset.cat).textContent = input.value;
    }

    async function save() {
      const catColors = {};
      document.querySelectorAll('input[type=color]').forEach(el => {
        catColors[el.dataset.cat] = el.value;
      });
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ catColors })
      });
      const msg = document.getElementById('msg');
      if (res.ok) { msg.style.color = '#2aaa7a'; msg.textContent = '✓ saved'; }
      else { msg.style.color = '#e05555'; msg.textContent = '✗ save failed'; }
      setTimeout(() => msg.textContent = '', 3000);
    }

    async function reset() {
      if (!confirm('Reset all colors to defaults?')) return;
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ catColors: {} })
      });
      location.reload();
    }
  </script>
</body>
</html>`);
});

// Admin UI page
app.get('/admin', (req, res) => {
  if (!isAdmin(req.user)) return res.status(403).send('Forbidden');
  res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>PATCH.doc — Admin</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'JetBrains Mono', ui-monospace, monospace; background: #0a0e0a; color: #ccd8c4; padding: 32px 24px; max-width: 600px; margin: 0 auto; }
    h1 { font-size: 16px; letter-spacing: 0.12em; color: #8f86e8; margin-bottom: 4px; }
    .subtitle { font-size: 11px; color: #4e5e4c; margin-bottom: 32px; }
    h2 { font-size: 11px; letter-spacing: 0.1em; color: #5e7060; margin: 24px 0 12px; }
    .user-row {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 14px; background: #111811;
      border: 0.5px solid rgba(180,210,180,0.15); border-radius: 8px; margin-bottom: 6px;
    }
    .user-name { flex: 1; font-size: 13px; color: #ccd8c4; }
    .badge { font-size: 9px; padding: 2px 6px; border-radius: 3px; background: rgba(143,134,232,0.15); color: #8f86e8; border: 0.5px solid rgba(143,134,232,0.3); }
    .btn { font-family: inherit; font-size: 11px; padding: 5px 10px; border-radius: 5px; cursor: pointer; border: 0.5px solid; transition: background 0.1s; }
    .btn-danger { background: rgba(200,97,42,0.1); border-color: rgba(200,97,42,0.4); color: #c8612a; }
    .btn-danger:hover { background: rgba(200,97,42,0.2); }
    .btn-primary { background: rgba(143,134,232,0.15); border-color: rgba(143,134,232,0.4); color: #8f86e8; }
    .btn-primary:hover { background: rgba(143,134,232,0.25); }
    .form-card { background: #111811; border: 0.5px solid rgba(180,210,180,0.15); border-radius: 8px; padding: 16px; margin-top: 8px; }
    label { font-size: 10px; color: #5e7060; letter-spacing: 0.1em; display: block; margin-bottom: 5px; margin-top: 12px; }
    label:first-child { margin-top: 0; }
    input[type=text], input[type=password] { width: 100%; padding: 8px 10px; font-size: 13px; font-family: inherit; background: #0a0e0a; border: 1px solid rgba(180,210,180,0.2); border-radius: 5px; color: #ccd8c4; outline: none; }
    input:focus { border-color: rgba(143,134,232,0.5); }
    .checkbox-row { display: flex; align-items: center; gap: 8px; margin-top: 12px; font-size: 12px; color: #8f9e8f; }
    .error { font-size: 11px; color: #c8612a; margin-top: 8px; }
    .success { font-size: 11px; color: #2aaa7a; margin-top: 8px; }
    .back { font-size: 11px; color: #5e7060; text-decoration: none; display: inline-block; margin-bottom: 24px; }
    .back:hover { color: #8f86e8; }
  </style>
</head>
<body>
  <a href="/" class="back">← back to PATCH.doc</a>
  <h1>▣ PATCH.doc</h1>
  <div class="subtitle">User Administration · logged in as ${req.user}</div>

  <h2>USERS</h2>
  <div id="user-list">loading…</div>

  <h2>ADD USER</h2>
  <div class="form-card">
    <label>USERNAME</label>
    <input type="text" id="new-username" placeholder="lowercase, letters/numbers/-/_" autocomplete="off">
    <label>PASSWORD</label>
    <input type="password" id="new-password" placeholder="••••••••" autocomplete="new-password">
    <div class="checkbox-row">
      <input type="checkbox" id="new-admin">
      <label for="new-admin" style="margin:0;letter-spacing:0">Admin</label>
    </div>
    <div style="margin-top:14px">
      <button class="btn btn-primary" onclick="addUser()">+ add user</button>
    </div>
    <div id="add-msg"></div>
  </div>

  <script>
    async function loadUsers() {
      const res = await fetch('/api/admin/users');
      const users = await res.json();
      const list = document.getElementById('user-list');
      list.innerHTML = users.map(u => \`
        <div class="user-row">
          <span class="user-name">\${u.username} \${u.isAdmin ? '<span class="badge">admin</span>' : ''}</span>
          <button class="btn btn-danger" onclick="deleteUser('\${u.username}')">delete</button>
        </div>\`).join('') || '<div style="color:#4e5e4c;font-size:12px">no users</div>';
    }

    async function addUser() {
      const username = document.getElementById('new-username').value.trim();
      const password = document.getElementById('new-password').value.trim();
      const isAdmin  = document.getElementById('new-admin').checked;
      const msg = document.getElementById('add-msg');
      if (!username || !password) { msg.className='error'; msg.textContent='Username and password required'; return; }
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, isAdmin })
      });
      const data = await res.json();
      if (!res.ok) { msg.className='error'; msg.textContent=data.error; return; }
      msg.className='success'; msg.textContent='✓ user added';
      document.getElementById('new-username').value = '';
      document.getElementById('new-password').value = '';
      document.getElementById('new-admin').checked = false;
      loadUsers();
    }

    async function deleteUser(username) {
      if (!confirm('Delete user "' + username + '"? Their patches will remain on disk.')) return;
      const res = await fetch('/api/admin/users/' + username, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) { alert(data.error); return; }
      loadUsers();
    }

    loadUsers();
  </script>
</body>
</html>`);
});

// ── SPA fallback ──────────────────────────────────────────────────────────────
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => {
  console.log(`PATCH.doc running on http://localhost:${PORT}`);
  console.log(`Users: ${Object.keys(USERS).join(', ')}`);
  if (USERS.admin === 'patchdoc') console.warn('⚠  Default password in use — set PATCHDOC_USERS in docker-compose.yml');
});
