#!/bin/bash

# Set color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "Running comprehensive repository check..."

# Function to check if a file contains Chinese characters
check_chinese() {
    local file="$1"
    # Look for Unicode ranges that include Chinese characters
    if grep -P "[\x{4e00}-\x{9fff}\x{3400}-\x{4dbf}\x{20000}-\x{2a6df}\x{2a700}-\x{2b73f}\x{2b740}-\x{2b81f}\x{2b820}-\x{2ceaf}\x{f900}-\x{faff}\x{2f800}-\x{2fa1f}]" "$file" > /dev/null 2>&1; then
        echo -e "${RED}Found Chinese characters in: $file${NC}"
        return 1
    fi
    return 0
}

# Function to check filenames for Chinese characters
check_filename() {
    local file="$1"
    if echo "$file" | grep -P "[\x{4e00}-\x{9fff}\x{3400}-\x{4dbf}\x{20000}-\x{2a6df}\x{2a700}-\x{2b73f}\x{2b740}-\x{2b81f}\x{2b820}-\x{2ceaf}\x{f900}-\x{faff}\x{2f800}-\x{2fa1f}]" > /dev/null 2>&1; then
        echo -e "${RED}Found Chinese characters in filename: $file${NC}"
        return 1
    fi
    return 0
}

# Function to check file encoding
check_encoding() {
    local file="$1"
    if file "$file" | grep -q "UTF-16"; then
        echo -e "${YELLOW}Warning: File $file is UTF-16 encoded. Converting to UTF-8...${NC}"
        iconv -f UTF-16 -t UTF-8 "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
    fi
}

# Function to check for common Chinese punctuation
check_punctuation() {
    local file="$1"
    if grep -P "[""''〈〉《》【】？！：；、，。]" "$file" > /dev/null 2>&1; then
        echo -e "${YELLOW}Warning: Found Chinese punctuation in: $file${NC}"
        return 1
    fi
    return 0
}

# Function to validate file line endings
check_line_endings() {
    local file="$1"
    if file "$file" | grep -q "CRLF"; then
        echo -e "${YELLOW}Warning: File $file has CRLF line endings. Converting to LF...${NC}"
        dos2unix "$file" 2>/dev/null
    fi
}

found_issues=0

echo "Step 1: Checking file encodings and line endings..."
find . -type f \( ! -path "./.git/*" \) -print0 | while IFS= read -r -d '' file; do
    check_encoding "$file"
    check_line_endings "$file"
done

echo -e "\nStep 2: Checking for Chinese characters and punctuation..."
find . -type f \( ! -path "./.git/*" \) -print0 | while IFS= read -r -d '' file; do
    # Check filename
    if ! check_filename "$file"; then
        found_issues=1
    fi
    
    # Check file content
    if ! check_chinese "$file"; then
        found_issues=1
    fi
    
    # Check punctuation
    if ! check_punctuation "$file"; then
        found_issues=1
    fi
done

echo -e "\nStep 3: Checking for binary files..."
find . -type f -exec file {} \; | grep "binary" | while read -r line; do
    echo -e "${YELLOW}Warning: Binary file found: ${line%:*}${NC}"
done

if [ $found_issues -eq 0 ]; then
    echo -e "\n${GREEN}✓ All checks passed! Repository is clean.${NC}"
    exit 0
else
    echo -e "\n${RED}✗ Issues found. Please review the warnings and errors above.${NC}"
    exit 1
fi