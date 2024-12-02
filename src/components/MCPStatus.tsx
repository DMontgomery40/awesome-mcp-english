import React from 'react';
import { useMCPState } from '@/hooks/useMCPState';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { startMCP, stopMCP } from '@/lib/mcp';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export function MCPStatus() {
  const { isRunning, version, isLoading, error, refresh } = useMCPState();

  const handleToggle = async () => {
    try {
      if (isRunning) {
        await stopMCP();
      } else {
        await startMCP();
      }
      refresh();
    } catch (error) {
      console.error('Failed to toggle MCP:', error);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading MCP status...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 border-red-200 bg-red-50">
        <div className="flex items-center space-x-2 text-red-700">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isRunning ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            )}
            <span className="font-medium">
              MCP is {isRunning ? 'running' : 'stopped'}
            </span>
          </div>
          <Button
            size="sm"
            variant={isRunning ? "destructive" : "default"}
            onClick={handleToggle}
          >
            {isRunning ? 'Stop' : 'Start'} MCP
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Version: {version}
        </div>
      </div>
    </Card>
  );
}