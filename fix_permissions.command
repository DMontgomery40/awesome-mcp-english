#!/bin/bash

# Set color output
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "Starting to fix MCP Manager permissions..."

# Execute command to remove quarantine attribute
xattr -d com.apple.quarantine /Applications/MCP\ Manager.app 2>/dev/null

# Check command execution result
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Fix successful!${NC}"
    echo "You can now open MCP Manager normally."
else
    echo "⚠️ Please ensure MCP Manager.app is installed in the Applications folder."
fi

# Wait for user to press any key to exit
echo ""
read -n 1 -s -r -p "Press any key to exit..."