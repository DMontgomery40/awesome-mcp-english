import React from 'react'
import { invoke } from '@tauri-apps/api/tauri'

export default function Dashboard() {
  const [isRunning, setIsRunning] = React.useState(false)

  const toggleMCP = async () => {
    if (isRunning) {
      await invoke('stop_mcp')
      setIsRunning(false)
    } else {
      await invoke('start_mcp')
      setIsRunning(true)
    }
  }

  return (
    <div>
      <h1>MCP Manager</h1>
      <button onClick={toggleMCP}>
        {isRunning ? 'Stop MCP' : 'Start MCP'}
      </button>
    </div>
  )
}