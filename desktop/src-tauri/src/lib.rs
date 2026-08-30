// dialog + fs plugins: a plain HTML <input type="file"> opens the native
// picker fine in the WKWebView, but the selected file's contents don't
// reliably come back through to `input.files` (confirmed empty FileList
// after picking) — a known Tauri/WKWebView gap, not an app bug. The web
// frontend (public/js/io.js) detects `window.__TAURI__` and, when
// present, reads the file through these plugins instead of relying on
// the browser's File/FileReader APIs.
//
// local_data_dir: the one real native command this app needs. Media
// attachments (public/js/media.js, per patch) and manuals
// (public/js/manuals.js, per module) are just files with metadata — the
// metadata lives in Store.state (synced like everything else), but the
// files themselves need a real place on disk, which is what this
// resolves/creates: <app data dir>/<category>/<id>/. Keeping the
// path-joining and directory creation in Rust means the frontend never
// has to construct or trust a filesystem path itself — it only ever gets
// back a directory that's guaranteed to exist and to live under this
// app's own data dir. `category` is "media" or "manuals"; `id` is a
// patch id or module id respectively.
#[tauri::command]
fn local_data_dir(app: tauri::AppHandle, category: String, id: String) -> Result<String, String> {
    use tauri::Manager;
    // category/id are app-generated (see store.js) but treated as
    // untrusted input here anyway, since they end up in a filesystem path.
    let sanitize = |s: &str| -> String {
        s.chars()
            .filter(|c| c.is_alphanumeric() || *c == '_' || *c == '-')
            .collect()
    };
    let safe_category = sanitize(&category);
    let safe_id = sanitize(&id);
    if safe_category.is_empty() || safe_id.is_empty() {
        return Err("invalid category or id".into());
    }
    let base = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let dir = base.join(safe_category).join(safe_id);
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir.to_string_lossy().to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        // The fs plugin grants (session-only) filesystem scope to whatever
        // folder the user picks via the dialog plugin's {directory:true,
        // recursive:true} option (see public/js/nassync.js) — without this
        // plugin that grant is forgotten on every restart, forcing the user
        // to re-pick their NAS folder each time they open the app. Must be
        // registered after the fs plugin.
        .plugin(tauri_plugin_persisted_scope::init())
        // opener: a plain <a href target="_blank"> silently does nothing in
        // this webview — Tauri doesn't wire up new-window handling by
        // default, and there's no console error since nothing actually
        // fails, the request just isn't handled at all. Manual links (an
        // "open in new tab" icon, and the manual-icon shown on a module's
        // header in patch view) now go through this instead: openPath()
        // for a local PDF (opens in the OS's default viewer), openUrl()
        // for a link-type manual's http(s) URL (opens in the default
        // browser).
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![local_data_dir])
        .run(tauri::generate_context!())
        .expect("error while running PATCH.doc");
}
