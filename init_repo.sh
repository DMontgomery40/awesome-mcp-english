#!/bin/bash

# Set color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🚀 Initializing repository setup..."

# Function to check if command exists
check_command() {
    if ! command -v "$1" &> /dev/null; then
        echo -e "${RED}Error: $1 is required but not installed.${NC}"
        exit 1
    fi
}

# Check required commands
echo "Step 1: Checking required tools..."
check_command "git"
check_command "grep"
check_command "file"

# Make scripts executable
echo -e "\nStep 2: Setting file permissions..."
chmod +x check_chinese.sh
chmod +x fix_permissions.command
chmod +x init_repo.sh

# Run Chinese character check
echo -e "\nStep 3: Running character encoding checks..."
./check_chinese.sh
if [ $? -ne 0 ]; then
    echo -e "${RED}Please fix the issues before continuing${NC}"
    exit 1
fi

# Initialize git if not already initialized
echo -e "\nStep 4: Setting up Git repository..."
if [ ! -d ".git" ]; then
    git init
    echo -e "${GREEN}✓ Git repository initialized${NC}"
else
    echo -e "${YELLOW}Git repository already initialized${NC}"
fi

# Configure git
echo -e "\nStep 5: Configuring Git..."
git config core.autocrlf input
git config core.eol lf

# Create .gitattributes
echo -e "\nStep 6: Creating .gitattributes..."
cat > .gitattributes << 'EOL'
# Auto detect text files and perform LF normalization
* text=auto eol=lf

# Shell scripts should use LF
*.sh text eol=lf
*.command text eol=lf

# Denote all files that are truly binary and should not be modified
*.png binary
*.jpg binary
*.gif binary
*.ico binary
*.mov binary
*.mp4 binary
*.mp3 binary
*.gz binary
*.zip binary
*.7z binary
*.ttf binary
EOL

# Add files
echo -e "\nStep 7: Adding files to Git..."
git add .

# Create initial commit
echo -e "\nStep 8: Creating initial commit..."
git commit -m "Initial commit: English version of awesome-mcp

- Converted all content to English
- Added comprehensive check scripts
- Set up proper Git configuration
- Established project structure"

# Rename master branch to main
echo -e "\nStep 9: Setting up main branch..."
git branch -M main

# Create standard GitHub files
echo -e "\nStep 10: Creating GitHub standard files..."

# Create CONTRIBUTING.md
cat > CONTRIBUTING.md << 'EOL'
# Contributing to MCP Manager

Thank you for your interest in contributing to MCP Manager! Here's how you can help:

## Reporting Issues
- Use the GitHub issue tracker
- Include detailed steps to reproduce
- Specify your environment details

## Pull Requests
1. Fork the repository
2. Create a feature branch
3. Write clear commit messages
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

## Code Style
- Follow existing code style
- Add comments for complex logic
- Use meaningful variable names

## License
By contributing, you agree that your contributions will be licensed under the project's modified GPL-3.0 license.
EOL

# Create CODE_OF_CONDUCT.md
cat > CODE_OF_CONDUCT.md << 'EOL'
# Code of Conduct

## Our Pledge
We pledge to make participation in our project a harassment-free experience for everyone.

## Our Standards
- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism
- Focus on what is best for the community

## Enforcement
Project maintainers are responsible for clarifying and enforcing our standards of acceptable behavior.
EOL

echo -e "\n${GREEN}✅ Repository initialization complete!${NC}"
echo -e "\nNext steps:"
echo "1. Create a new repository on GitHub"
echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/awesome-mcp-english.git"
echo "3. Run: git push -u origin main"