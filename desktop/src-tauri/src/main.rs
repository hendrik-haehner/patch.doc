// Thin binary entry point — the actual setup lives in lib.rs so the same
// code can also be reused by a future mobile (iOS/Android) target.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    patchdoc_lib::run();
}
