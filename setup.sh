#!/bin/bash
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Starting MCP Manager setup...${NC}"

# Create directory structure
mkdir -p src/{components,utils,services}
mkdir -p config
mkdir -p scripts
mkdir -p docs
mkdir -p tests/{unit,integration}

# Initialize package.json if it doesn't exist
if [ ! -f package.json ]; then
    npm init -y
fi

# Install dependencies
npm install --save-dev typescript @types/node jest @types/jest ts-jest eslint prettier

echo -e "${GREEN}✓ Setup completed successfully!${NC}"