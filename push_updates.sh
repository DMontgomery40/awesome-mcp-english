#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Print colored message
print_message() {
    echo -e "${2}${1}${NC}"
}

# Create necessary directories if they don't exist
mkdir -p src/{components,utils,services}
mkdir -p config
mkdir -p scripts
mkdir -p docs
mkdir -p tests/{unit,integration}

# Save files
print_message "Creating/Updating files..." "${YELLOW}"

# Update README.md with full content
cat > README.md << 'EOL'
# MCP Manager

[![Awesome](https://cdn.jsdelivr.net/gh/sindresorhus/awesome@d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/sindresorhus/awesome)
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

[English](README.md) | [中文](README_zh.md)

A comprehensive visual management tool for Model Context Protocol (MCP), providing an intuitive graphical interface for managing your MCP environment.

## 🌟 Key Features

- One-click environment installation
- Visual MCP installation/uninstallation
- Real-time status monitoring
- Interactive configuration interface
- Environment health checks
- Performance optimization utilities
- Debugging and troubleshooting tools

## System Requirements

### Currently Supported
- macOS 10.15 (Catalina) or later
- 4GB RAM minimum (8GB recommended)
- 2GB free disk space

### Coming Soon
- Windows 10/11 support
- Linux distribution support

For complete documentation, visit our [Documentation](docs/)