#!/bin/bash

# Initialize git if needed
git init

# Add all files
git add .

# Commit changes
git commit -m "feat: Complete MCP Manager implementation

- Add React TypeScript components for installation UI
- Create installation service with proper typing
- Add system requirement checker utility
- Implement logging service
- Set up proper project structure with components, services, and utilities"

# Switch to main branch
git branch -M main

# Add remote origin (only if not already added)
git remote add origin https://github.com/DMontgomery40/awesome-mcp-english.git 2>/dev/null || true

# Force push to main branch
git push -u origin main --force