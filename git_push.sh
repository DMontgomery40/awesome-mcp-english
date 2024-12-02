#!/bin/bash
git init
git add .
git commit -m "chore: Clean rebuild of MCP Manager"
git branch -M main
git remote add origin https://github.com/DMontgomery40/awesome-mcp-english.git
git push -u origin main --force