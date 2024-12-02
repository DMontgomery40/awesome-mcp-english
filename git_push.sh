#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_message() {
    echo -e "${2}${1}${NC}"
}

# Initialize git repository if needed
git init

# Add all files
git add .

# Commit changes
git commit -m "feat: Complete MCP Manager implementation

- Add complete Tauri backend with system tray support
- Implement React frontend with shadcn/ui components
- Add MCP core functionality and state management
- Set up proper project structure and configuration
- Add comprehensive TypeScript types and interfaces
- Implement proper error handling and loading states"

# Switch to main branch
git branch -M main

# Add remote origin (skip if already exists)
git remote add origin https://github.com/DMontgomery40/awesome-mcp-english.git 2>/dev/null || true

# Force push to main
git push -u origin main --force

print_message "✅ Successfully pushed to GitHub" "${GREEN}"