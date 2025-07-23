#!/bin/bash

# Test script to verify Node.js version detection
NODE_VERSION="22"

echo "Testing Node.js version detection..."

if command -v node >/dev/null 2>&1; then
    current_node_version=$(node --version | sed 's/v//')
    major_version=$(echo $current_node_version | cut -d. -f1)
    
    echo "Current Node.js version: v${current_node_version}"
    echo "Major version: ${major_version}"
    echo "Expected version: ${NODE_VERSION}"
    
    if [ "$major_version" = "$NODE_VERSION" ]; then
        echo "✅ Correct Node.js version ${NODE_VERSION} is installed"
    else
        echo "❌ Wrong Node.js version. Expected ${NODE_VERSION}, got ${major_version}"
    fi
else
    echo "❌ Node.js is not installed"
fi