import { invoke } from '@tauri-apps/api';

export interface MCPConfig {
  installation_path: string;
  max_memory: number;
  auto_start: boolean;
}

export async function getMCPStatus(): Promise<boolean> {
  return invoke('get_mcp_status');
}

export async function getMCPVersion(): Promise<string> {
  return invoke('get_mcp_version');
}

export async function getMCPConfig(): Promise<MCPConfig> {
  return invoke('get_mcp_config');
}

export async function startMCP(): Promise<boolean> {
  return invoke('start_mcp');
}

export async function stopMCP(): Promise<boolean> {
  return invoke('stop_mcp');
}

export async function updateMCPConfig(config: MCPConfig): Promise<void> {
  return invoke('update_mcp_config', { config });
}

// Additional utility functions
export function validateMCPConfig(config: MCPConfig): string[] {
  const errors: string[] = [];

  if (!config.installation_path) {
    errors.push('Installation path is required');
  }

  if (config.max_memory < 1024) {
    errors.push('Maximum memory must be at least 1024MB');
  }

  return errors;
}