import React from 'react'
import { invoke } from '@tauri-apps/api/tauri'

export default function Settings() {
  const [path, setPath] = React.useState('')

  const savePath = async () => {
    await invoke('set_mcp_path', { path })
  }

  return (
    <div>
      <h1>Settings</h1>
      <input
        type="text"
        value={path}
        onChange={(e) => setPath(e.target.value)}
        placeholder="MCP Installation Path"
      />
      <button onClick={savePath}>Save</button>
    </div>
  )
}