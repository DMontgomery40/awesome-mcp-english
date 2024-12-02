#!/bin/bash

# Initialize git if needed
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Complete repository structure and base files"

# Switch to main branch
git branch -M main

# Add remote origin
git remote add origin https://github.com/DMontgomery40/awesome-mcp-english.git

# Force push to main branch
git push -u origin main --force