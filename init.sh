#!/bin/bash

# Initialize Git repository
git init
git add .
git commit -m "Initial commit: Clean English version of MCP Manager"
git branch -M main
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/DMontgomery40/awesome-mcp-english.git
git push -u origin main