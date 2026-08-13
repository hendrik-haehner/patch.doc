// Shared entry point (desktop + future mobile targets both call this).
// See main.rs for why there's no custom command surface yet.
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running PATCH.doc");
}
