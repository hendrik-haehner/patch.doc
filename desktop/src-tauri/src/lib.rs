// Shared entry point (desktop + future mobile targets both call this).
// See main.rs for why there's no custom command surface yet.
//
// dialog + fs plugins: a plain HTML <input type="file"> opens the native
// picker fine in the WKWebView, but the selected file's contents don't
// reliably come back through to `input.files` (confirmed empty FileList
// after picking) — a known Tauri/WKWebView gap, not an app bug. The web
// frontend (public/js/io.js) detects `window.__TAURI__` and, when
// present, reads the file through these plugins instead of relying on
// the browser's File/FileReader APIs.
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .run(tauri::generate_context!())
        .expect("error while running PATCH.doc");
}
