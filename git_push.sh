#!/bin/bash
git init
git add .
git commit -m "feat: implement Model Context Protocol core functionality

- Add ModelContextManager for state management
- Add ModelIntegration for API connectivity
- Implement MCPService for high-level operations
- Set up proper TypeScript configuration and dependencies"
git branch -M main
git remote add origin https://github.com/DMontgomery40/awesome-mcp-english.git 2>/dev/null || true
git push -u origin main --force