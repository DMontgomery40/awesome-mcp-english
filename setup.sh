#!/bin/bash

# Set color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🚀 Starting complete repository setup..."

# Make all scripts executable
chmod +x check_chinese.sh
chmod +x init_repo.sh
chmod +x fix_permissions.command
chmod +x setup.sh

# Run checks
echo -e "\n📝 Running encoding and character checks..."
./check_chinese.sh
if [ $? -ne 0 ]; then
    echo -e "${RED}Character checks failed. Please review and fix the issues.${NC}"
    exit 1
fi

# Initialize repository
echo -e "\n📦 Initializing repository..."
./init_repo.sh
if [ $? -ne 0 ]; then
    echo -e "${RED}Repository initialization failed.${NC}"
    exit 1
fi

echo -e "\n${GREEN}✅ Setup complete! Repository is ready to be pushed to GitHub.${NC}"
echo -e "\nTo complete setup, run:"
echo "1. git remote add origin https://github.com/YOUR_USERNAME/awesome-mcp-english.git"
echo "2. git push -u origin main"
echo -e "\nOptional: Create a new release:"
echo "1. git tag v1.0.0"
echo "2. git push origin v1.0.0"