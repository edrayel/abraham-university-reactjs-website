#!/bin/bash

# Fix Production Build Script
# This script addresses MIME type issues and ensures proper production build serving

set -e

# Configuration
APP_NAME="abraham-university"
APP_DIR="/var/www/abraham-university"
APP_PORT="10000"
DOMAIN="abrahamuniversity.us"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   error "This script must be run as root (use sudo)"
   exit 1
fi

log "Starting production build fix..."

# Stop the current service
log "Stopping ${APP_NAME} service..."
systemctl stop ${APP_NAME} || warn "Service was not running"

# Navigate to app directory
cd ${APP_DIR}

# Clean previous build
log "Cleaning previous build..."
rm -rf dist/
rm -rf node_modules/.vite/

# Install dependencies (ensure latest)
log "Installing dependencies..."
sudo -u ${APP_NAME} npm ci

# Build the application
log "Building application for production..."
sudo -u ${APP_NAME} npm run build

# Verify build output
if [[ ! -d "${APP_DIR}/dist" ]]; then
    error "Build failed - dist directory not found"
    exit 1
fi

if [[ ! -f "${APP_DIR}/dist/index.html" ]]; then
    error "Build failed - index.html not found in dist"
    exit 1
fi

success "Build completed successfully"

# Check Apache configuration
log "Checking Apache configuration..."
if ! httpd -t; then
    error "Apache configuration test failed"
    exit 1
fi

# Restart Apache to apply MIME type changes
log "Restarting Apache..."
systemctl restart httpd

if ! systemctl is-active --quiet httpd; then
    error "Apache failed to start"
    exit 1
fi

success "Apache restarted successfully"

# Start the application service
log "Starting ${APP_NAME} service..."
systemctl start ${APP_NAME}

# Wait a moment for service to start
sleep 3

# Check service status
if systemctl is-active --quiet ${APP_NAME}; then
    success "${APP_NAME} service is running"
else
    error "${APP_NAME} service failed to start"
    log "Checking service logs..."
    journalctl -u ${APP_NAME} --no-pager -n 20
    exit 1
fi

# Test the application
log "Testing application..."
sleep 2

# Test local connection
if curl -f -s http://localhost:${APP_PORT} > /dev/null; then
    success "Application is responding on port ${APP_PORT}"
else
    warn "Application may not be responding on port ${APP_PORT}"
fi

# Test Apache proxy
if curl -f -s http://localhost > /dev/null; then
    success "Apache proxy is working"
else
    warn "Apache proxy may have issues"
fi

# Show service status
log "Service status:"
systemctl status ${APP_NAME} --no-pager -l

log "Production build fix completed!"
log "You can now test your application at: http://${DOMAIN}"
log "Check the browser console for any remaining MIME type errors."

success "All done! 🚀"