mod commands;

use tauri::Manager;
use commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            get_mcp_status,
            get_mcp_version,
            get_mcp_config,
            start_mcp,
            stop_mcp,
            update_mcp_config
        ])
        .setup(|app| {
            let app_handle = app.handle();
            
            // Set up system tray
            #[cfg(desktop)]
            app.system_tray(tauri::SystemTray::default());
            
            // Handle Ctrl+C gracefully
            std::thread::spawn(move || {
                ctrlc::set_handler(move || {
                    println!("Received Ctrl+C, shutting down gracefully...");
                    std::process::exit(0);
                })
                .expect("Error setting Ctrl-C handler");
            });
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}