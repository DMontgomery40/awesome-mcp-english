#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
struct MCPConfig {
    path: String,
}

#[tauri::command]
async fn start_mcp() -> Result<(), String> {
    Ok(())
}

#[tauri::command]
async fn stop_mcp() -> Result<(), String> {
    Ok(())
}

#[tauri::command]
async fn set_mcp_path(path: String) -> Result<(), String> {
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            start_mcp,
            stop_mcp,
            set_mcp_path
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}