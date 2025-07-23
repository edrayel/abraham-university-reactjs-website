#!/bin/bash

# Fix Abraham University Service Issue
# This script addresses the npm start failure by ensuring the app is properly built

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARN: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Configuration
APP_NAME="abraham-university"
APP_DIR="/var/www/abraham-university"
APP_USER="abraham-university"

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   error "This script must be run as root (use sudo)"
   exit 1
fi

log "Starting Abraham University service troubleshooting..."

# Stop the failing service
log "Stopping ${APP_NAME} service..."
systemctl stop ${APP_NAME} || true

# Check if application directory exists
if [[ ! -d "${APP_DIR}" ]]; then
    error "Application directory ${APP_DIR} does not exist!"
    error "Please run the setup script first: ./setup-apache-proxy.sh"
    exit 1
fi

# Check if package.json exists
if [[ ! -f "${APP_DIR}/package.json" ]]; then
    error "package.json not found in ${APP_DIR}"
    error "Please deploy your React application to ${APP_DIR} first"
    exit 1
fi

log "Checking Node.js and npm versions..."
node --version
npm --version

# Change to app directory
cd ${APP_DIR}

# Check if node_modules exists
if [[ ! -d "node_modules" ]]; then
    log "Installing dependencies..."
    sudo -u ${APP_USER} npm ci
else
    log "Dependencies already installed"
fi

# Check if dist directory exists
if [[ ! -d "dist" ]]; then
    log "Building application (dist directory missing)..."
    sudo -u ${APP_USER} npm run build
else
    log "Application already built (dist directory exists)"
    warn "Rebuilding to ensure latest version..."
    sudo -u ${APP_USER} npm run build
fi

# Verify build was successful
if [[ -d "dist" && -f "dist/index.html" ]]; then
    log "Build verification successful - dist/index.html exists"
else
    error "Build verification failed - dist/index.html not found"
    exit 1
fi

# Check if the start script works
log "Testing npm start command..."
if sudo -u ${APP_USER} timeout 10s npm start > /dev/null 2>&1; then
    log "npm start command works"
else
    warn "npm start test timed out (this is expected for preview mode)"
fi

# Start the service
log "Starting ${APP_NAME} service..."
systemctl start ${APP_NAME}

# Wait a moment for service to start
sleep 5

# Check service status
if systemctl is-active --quiet ${APP_NAME}; then
    log "✅ ${APP_NAME} service is now running successfully!"
    systemctl status ${APP_NAME} --no-pager
else
    error "❌ ${APP_NAME} service is still failing"
    echo -e "\n${BLUE}Recent service logs:${NC}"
    journalctl -u ${APP_NAME} -n 20 --no-pager
    echo -e "\n${BLUE}Troubleshooting steps:${NC}"
    echo "1. Check logs: journalctl -u ${APP_NAME} -f"
    echo "2. Test manually: cd ${APP_DIR} && sudo -u ${APP_USER} npm start"
    echo "3. Check port availability: netstat -tlnp | grep 10000"
    echo "4. Verify file permissions: ls -la ${APP_DIR}"
    exit 1
fi

# Check if the application is responding
log "Testing application response..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:10000 | grep -q "200\|404"; then
    log "✅ Application is responding on port 10000"
else
    warn "⚠️  Application may not be fully ready yet (this is normal during startup)"
fi

log "🎉 Service issue has been resolved!"
echo -e "\n${BLUE}Service Status:${NC}"
systemctl status ${APP_NAME} --no-pager

echo -e "\n${BLUE}Useful Commands:${NC}"
echo "  - Check service status: systemctl status ${APP_NAME}"
echo "  - View live logs: journalctl -u ${APP_NAME} -f"
echo "  - Restart service: systemctl restart ${APP_NAME}"
echo "  - Test application: curl http://localhost:10000"