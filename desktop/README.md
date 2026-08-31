# PATCH.doc desktop (Tauri)

Wraps the static build (`public/`, the same code that runs on
[the GitHub Pages version](https://hendrik-haehner.github.io/patch.doc/))
in a native desktop window via [Tauri](https://tauri.app). No login, no
server by default — patches are saved to the OS webview's local storage,
same as the browser version. Optionally, [NAS sync](#nas-sync) points it at
a self-hosted server's `/data` folder instead, for real cross-device sync.

The only custom Rust code here (`src-tauri/src/lib.rs`) is one command
that resolves/creates this app's own data directory for media/manual
files, plus registering the plugins the frontend needs (dialog, fs,
opener, persisted-scope) — this is a thin native shell around the
existing frontend, not a rewrite.

## Setup

Requires a [Rust toolchain](https://rustup.rs) and Node.js. On Linux you
also need the system webview dev packages, e.g. on Ubuntu/Debian:

```bash
sudo apt install libwebkit2gtk-4.1-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev build-essential libssl-dev libsoup-3.0-dev
```

(macOS and Windows need no extra system packages — Tauri uses WKWebView /
WebView2, which ship with the OS.)

```bash
cd desktop
npm install
```

## Develop

```bash
npm run dev
```

Runs `node ../scripts/build-static.js` to refresh `_site/` and opens it in
a native window. Reload the window (Cmd/Ctrl+R) after editing files under
`public/` — there's no file-watcher wired up yet.

## Build

```bash
npm run build
```

Produces a platform-native installer/bundle (`.app`/`.dmg`, `.exe`/`.msi`,
`.deb`/`.AppImage`, depending on the OS you build on — Tauri doesn't
cross-compile installers by default, so macOS/Windows builds need to run
on that OS, e.g. in CI) under `src-tauri/target/release/bundle/`.

## NAS sync

By default this app is single-device, no accounts — same as the browser
version. If you also run the [self-hosted server](../README.md#installation)
(e.g. on a NAS), the server icon in the topbar lets you point this app at
that server's `/data` folder instead: mount it as a normal network share
(SMB/NFS/AFP — however your NAS exposes it), pick the mounted folder, enter
your username on that server, and hit **activate**.

From then on this app reads and writes straight from those files — the
exact same `state.json`/`modules.json`/`media/`/`manuals/` the server
itself uses (see [Data](../README.md#data)) — no server code involved at
all. `server.js` re-reads its files from disk on every request rather than
caching them, so a save from this app shows up in the web app immediately,
and vice versa.

**What this is not:** a real-time collaboration engine. If this app and
the web app both save changes to the same patch at (almost) the same
moment, the file is shared but the write isn't coordinated — last write
wins, same hazard as two people editing one file over Dropbox. The one
protection built in: if the file on disk changed since this app last read
it, the next save is refused (with a status message telling you to reload)
rather than silently overwriting someone else's change. Treat it as "use
one or the other at a time," not "use both simultaneously."

First activation copies whatever's currently on this device (patches, your
module library if the NAS folder doesn't already have one, plus any local
photos/manuals) into the NAS folder, so switching over doesn't look like
your existing work vanished. **If the NAS folder already had a module
library, this device's modules are merged into it** (matched by name +
maker, same as "import manuals from folder" above) rather than one side
winning outright — a module only on this device gets added, and a manual
you'd only ever attached locally gets folded into the shared copy of that
module. Nothing on the NAS side is ever removed or overwritten. Patches
are the one exception: if the NAS already has patches under this
username, those stay authoritative and this device's local-only patches
aren't merged in, since (unlike a module's name+maker) a patch's id is
just this device's own counter and has no reliable identity to match on
across two independently-used devices. **Deactivate** just stops using
the shared files — it never deletes them, and reverts this device to its
own local storage.

Manuals and media load through a separate, narrower permission than the
patches/modules themselves — clicking a manual opens it in its own small
window rather than your OS's regular PDF viewer, since the OS-level opener
can only be trusted with folders known at build time, never one you pick
at runtime.

CI (`.github/workflows/build-desktop-macos.yml`) builds macOS on every
push to `main`, and adds Windows (`.msi` + `.exe`) and Linux (`.deb` +
`.AppImage`) builds whenever that run also cuts a
[Release](../../../releases) — a tag push, or a manual
**Actions → Build desktop app → Run workflow**.

## Troubleshooting: macOS says the app is damaged

CI builds (and local builds) aren't signed with a paid Apple Developer
certificate. macOS Gatekeeper blocks unsigned apps downloaded from the
internet, and after copying `PATCH.doc.app` to `/Applications` it may
refuse to open it with *"PATCH.doc is damaged and can't be opened, you
should move it to the Trash"*. The app isn't actually damaged — this is
Gatekeeper's response to the missing signature. Fix it by clearing the
quarantine flag once in Terminal:

```bash
xattr -cr /Applications/PATCH.doc.app
```

Then open the app normally. (CI-built `.dmg`s also include this as a
README file alongside the app, for anyone who downloads one directly.)

## Troubleshooting: Windows SmartScreen blocks the installer

Same root cause as above — no paid code-signing certificate, so Windows
SmartScreen shows *"Windows protected your PC"* the first time you run
the `.msi`/`.exe`. It isn't actually unsafe, just unsigned. Click **More
info → Run anyway** to proceed.

## Troubleshooting: AppImage won't launch

Downloaded `.AppImage` files aren't executable by default. Make it
executable once, then run it directly:

```bash
chmod +x PATCH.doc_*.AppImage
./PATCH.doc_*.AppImage
```

The `.deb` doesn't need this — install it normally (`sudo apt install
./patchdoc_*.deb` or your distro's package manager) and launch from your
app menu.

## Icons

Generated once from `public/icon-512.png` via `npx tauri icon
../public/icon-512.png -o src-tauri/icons`. Re-run that if the app icon
changes.
