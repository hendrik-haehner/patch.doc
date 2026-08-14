// dialog + fs plugins: a plain HTML <input type="file"> opens the native
// picker fine in the WKWebView, but the selected file's contents don't
// reliably come back through to `input.files` (confirmed empty FileList
// after picking) — a known Tauri/WKWebView gap, not an app bug. The web
// frontend (public/js/io.js) detects `window.__TAURI__` and, when
// present, reads the file through these plugins instead of relying on
// the browser's File/FileReader APIs.
//
// media_dir_for_patch: the one real native command this app needs. Media
// attachments (public/js/media.js) are just files with metadata — the
// metadata lives in Store.state (synced like everything else), but the
// files themselves need a real place on disk per patch, which is what
// this resolves/creates. Keeping the path-joining and directory creation
// in Rust means the frontend never has to construct or trust a
// filesystem path itself — it only ever gets back a directory that's
// guaranteed to exist and to live under this app's own data dir.
#[tauri::command]
fn media_dir_for_patch(app: tauri::AppHandle, patch_id: String) -> Result<String, String> {
    use tauri::Manager;
    // patch_id is app-generated (see store.js) but treated as untrusted
    // input here anyway, since it ends up in a filesystem path.
    let safe_id: String = patch_id
        .chars()
        .filter(|c| c.is_alphanumeric() || *c == '_' || *c == '-')
        .collect();
    if safe_id.is_empty() {
        return Err("invalid patch id".into());
    }
    let base = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let dir = base.join("media").join(safe_id);
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir.to_string_lossy().to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![media_dir_for_patch])
        .run(tauri::generate_context!())
        .expect("error while running PATCH.doc");
}
