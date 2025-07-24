#!/bin/bash

# Test script to demonstrate port configuration
# This script shows how to run the React app on different ports

echo "=== Abraham University ReactJS Port Configuration Test ==="
echo ""

echo "1. Default port (3000):"
echo "   npm run dev"
echo "   npm run start"
echo ""

echo "2. Custom port via environment variable:"
echo "   PORT=5000 npm run dev"
echo "   PORT=8000 npm run start"
echo ""

echo "3. Custom port via command line (for production builds):"
echo "   npm run build && PORT=9000 npm run start"
echo ""

echo "4. Testing current configuration:"
echo "   Current default port in vite.config.js: 3000"
echo "   Current default port in .env.production: 3000"
echo "   Current REACT_APP_PORT in setup-apache-proxy.sh: 3000"
echo ""

echo "5. Examples of running on different ports:"
echo "   # Development server on port 4000"
echo "   PORT=4000 npm run dev"
echo ""
echo "   # Production preview on port 8000"
echo "   PORT=8000 npm run start"
echo ""
echo "   # Using the --PORT flag (if supported by the command)"
echo "   npm run dev -- --port 7000"
echo ""

echo "Note: The PORT environment variable takes precedence over default settings."
echo "You can set it before any npm command to override the default port."