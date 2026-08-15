# PATCH.doc desktop (Tauri)

Wraps the static build (`public/`, the same code that runs on
[the GitHub Pages version](https://hendrik-haehner.github.io/patch.doc/))
in a native desktop window via [Tauri](https://tauri.app). No login, no
server — patches are saved to the OS webview's local storage, same as the
browser version.

There's no custom Rust code here yet (`src-tauri/src/lib.rs` just opens
the window) — this is a thin native shell around the existing frontend,
not a rewrite.

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

## Icons

Generated once from `public/icon-512.png` via `npx tauri icon
../public/icon-512.png -o src-tauri/icons`. Re-run that if the app icon
changes.
