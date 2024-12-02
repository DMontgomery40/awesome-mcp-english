import { useState, useEffect, useCallback } from 'react';
import { getMCPStatus, getMCPVersion, getMCPConfig, type MCPConfig } from '@/lib/mcp';

interface MCPState {
  isRunning: boolean;
  version: string;
  config: MCPConfig;
  isLoading: boolean;
  error: string | null;
}

export function useMCPState() {
  const [state, setState] = useState<MCPState>({
    isRunning: false,
    version: '',
    config: {
      installation_path: '',
      max_memory: 2048,
      auto_start: false
    },
    isLoading: true,
    error: null
  });

  const fetchState = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const [status, version, config] = await Promise.all([
        getMCPStatus(),
        getMCPVersion(),
        getMCPConfig()
      ]);

      setState({
        isRunning: status,
        version,
        config,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch MCP state'
      }));
    }
  }, []);

  useEffect(() => {
    fetchState();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchState, 5000);
    return () => clearInterval(interval);
  }, [fetchState]);

  return {
    ...state,
    refresh: fetchState
  };
}