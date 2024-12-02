use tauri::Runtime;
use tauri::command;
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use once_cell::sync::Lazy;

// State management
static MCP_STATE: Lazy<Mutex<MCPState>> = Lazy::new(|| {
    Mutex::new(MCPState {
        is_running: false,
        version: String::from("1.0.0"),
        config: Default::default(),
    })
});

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct MCPConfig {
    pub installation_path: String,
    pub max_memory: u32,
    pub auto_start: bool,
}

#[derive(Debug)]
struct MCPState {
    is_running: bool,
    version: String,
    config: MCPConfig,
}

#[command]
pub async fn get_mcp_status() -> Result<bool, String> {
    let state = MCP_STATE.lock().map_err(|e| e.to_string())?;
    Ok(state.is_running)
}

#[command]
pub async fn get_mcp_version() -> Result<String, String> {
    let state = MCP_STATE.lock().map_err(|e| e.to_string())?;
    Ok(state.version.clone())
}

#[command]
pub async fn get_mcp_config() -> Result<MCPConfig, String> {
    let state = MCP_STATE.lock().map_err(|e| e.to_string())?;
    Ok(state.config.clone())
}

#[command]
pub async fn start_mcp() -> Result<bool, String> {
    let mut state = MCP_STATE.lock().map_err(|e| e.to_string())?;
    if !state.is_running {
        state.is_running = true;
        Ok(true)
    } else {
        Err("MCP is already running".into())
    }
}

#[command]
pub async fn stop_mcp() -> Result<bool, String> {
    let mut state = MCP_STATE.lock().map_err(|e| e.to_string())?;
    if state.is_running {
        state.is_running = false;
        Ok(true)
    } else {
        Err("MCP is not running".into())
    }
}

#[command]
pub async fn update_mcp_config(config: MCPConfig) -> Result<(), String> {
    let mut state = MCP_STATE.lock().map_err(|e| e.to_string())?;
    state.config = config;
    Ok(())
}