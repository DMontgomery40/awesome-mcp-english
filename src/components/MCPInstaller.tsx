import React, { useState } from 'react';
import { installMCP } from '../services/installation';
import { Button } from './ui/Button';
import { ProgressBar } from './ui/ProgressBar';

interface MCPInstallerProps {
  onComplete?: () => void;
}

export const MCPInstaller: React.FC<MCPInstallerProps> = ({ onComplete }) => {
  const [installing, setInstalling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleInstall = async () => {
    try {
      setInstalling(true);
      setError(null);
      
      // Simulate installation progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(i);
      }
      
      await installMCP();
      onComplete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Installation failed');
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">MCP Installation</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <ProgressBar 
        progress={progress} 
        visible={installing} 
      />

      <Button
        onClick={handleInstall}
        disabled={installing}
        className="mt-4"
      >
        {installing ? 'Installing...' : 'Install MCP'}
      </Button>
    </div>
  );
};