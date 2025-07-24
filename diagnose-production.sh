#!/bin/bash

# Production Build Diagnostic Script
# This script helps diagnose issues with the production build serving

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
    echo -e "${BLUE}[DIAGNOSTIC]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log "Starting production build diagnostics..."
echo "==========================================="

# Check if build directory exists
log "Checking build directory..."
if [[ -d "${APP_DIR}/dist" ]]; then
    success "Build directory exists: ${APP_DIR}/dist"
    
    # List key files
    log "Build contents:"
    ls -la ${APP_DIR}/dist/ | head -10
    
    # Check for index.html
    if [[ -f "${APP_DIR}/dist/index.html" ]]; then
        success "index.html found"
    else
        error "index.html missing"
    fi
    
    # Check for assets directory
    if [[ -d "${APP_DIR}/dist/assets" ]]; then
        success "Assets directory found"
        log "Assets contents:"
        ls -la ${APP_DIR}/dist/assets/ | head -5
    else
        warn "Assets directory not found"
    fi
else
    error "Build directory missing: ${APP_DIR}/dist"
fi

echo ""
log "Checking service status..."
if systemctl is-active --quiet ${APP_NAME}; then
    success "${APP_NAME} service is running"
else
    error "${APP_NAME} service is not running"
    log "Recent service logs:"
    journalctl -u ${APP_NAME} --no-pager -n 10
fi

echo ""
log "Checking Apache status..."
if systemctl is-active --quiet httpd; then
    success "Apache is running"
else
    error "Apache is not running"
fi

# Test Apache configuration
log "Testing Apache configuration..."
if httpd -t 2>/dev/null; then
    success "Apache configuration is valid"
else
    error "Apache configuration has errors"
    httpd -t
fi

echo ""
log "Testing application connectivity..."

# Test direct app connection
log "Testing direct app connection (localhost:${APP_PORT})..."
if curl -f -s -I http://localhost:${APP_PORT} > /dev/null 2>&1; then
    success "App responds on port ${APP_PORT}"
    
    # Get response headers
    log "Response headers from app:"
    curl -s -I http://localhost:${APP_PORT} | head -5
else
    error "App not responding on port ${APP_PORT}"
fi

echo ""
# Test Apache proxy
log "Testing Apache proxy (localhost:80)..."
if curl -f -s -I http://localhost > /dev/null 2>&1; then
    success "Apache proxy responds"
    
    # Get response headers
    log "Response headers from Apache:"
    curl -s -I http://localhost | head -5
else
    error "Apache proxy not responding"
fi

echo ""
log "Testing static asset serving..."

# Find a CSS file to test
CSS_FILE=$(find ${APP_DIR}/dist/assets -name "*.css" -type f | head -1)
if [[ -n "$CSS_FILE" ]]; then
    CSS_PATH=$(echo $CSS_FILE | sed "s|${APP_DIR}/dist||")
    log "Testing CSS file: $CSS_PATH"
    
    # Test direct file access
    RESPONSE=$(curl -s -I http://localhost${CSS_PATH} 2>/dev/null || echo "FAILED")
    if [[ "$RESPONSE" != "FAILED" ]]; then
        CONTENT_TYPE=$(echo "$RESPONSE" | grep -i "content-type" || echo "No Content-Type header")
        log "CSS Response: $CONTENT_TYPE"
        
        if echo "$CONTENT_TYPE" | grep -q "text/css"; then
            success "CSS MIME type is correct"
        else
            error "CSS MIME type is incorrect: $CONTENT_TYPE"
        fi
    else
        error "Failed to access CSS file"
    fi
else
    warn "No CSS files found in build"
fi

# Find a JS file to test
JS_FILE=$(find ${APP_DIR}/dist/assets -name "*.js" -type f | head -1)
if [[ -n "$JS_FILE" ]]; then
    JS_PATH=$(echo $JS_FILE | sed "s|${APP_DIR}/dist||")
    log "Testing JS file: $JS_PATH"
    
    # Test direct file access
    RESPONSE=$(curl -s -I http://localhost${JS_PATH} 2>/dev/null || echo "FAILED")
    if [[ "$RESPONSE" != "FAILED" ]]; then
        CONTENT_TYPE=$(echo "$RESPONSE" | grep -i "content-type" || echo "No Content-Type header")
        log "JS Response: $CONTENT_TYPE"
        
        if echo "$CONTENT_TYPE" | grep -q "application/javascript\|text/javascript"; then
            success "JS MIME type is correct"
        else
            error "JS MIME type is incorrect: $CONTENT_TYPE"
        fi
    else
        error "Failed to access JS file"
    fi
else
    warn "No JS files found in build"
fi

echo ""
log "Checking Apache virtual host configuration..."
APACHE_CONF="/etc/httpd/conf.d/${APP_NAME}.conf"
if [[ -f "$APACHE_CONF" ]]; then
    success "Apache virtual host config exists"
    
    # Check for MIME type configuration
    if grep -q "AddType.*css" "$APACHE_CONF"; then
        success "CSS MIME type configured in Apache"
    else
        warn "CSS MIME type not found in Apache config"
    fi
    
    if grep -q "AddType.*javascript" "$APACHE_CONF"; then
        success "JS MIME type configured in Apache"
    else
        warn "JS MIME type not found in Apache config"
    fi
else
    error "Apache virtual host config missing: $APACHE_CONF"
fi

echo ""
log "Checking recent Apache error logs..."
if [[ -f "/var/log/httpd/${APP_NAME}_error.log" ]]; then
    log "Recent Apache errors:"
    tail -10 "/var/log/httpd/${APP_NAME}_error.log" 2>/dev/null || echo "No recent errors"
else
    warn "Apache error log not found"
fi

echo ""
log "Diagnostic complete!"
echo "==========================================="
log "If you see MIME type errors above, run: sudo ./fix-production-build.sh"
log "Then test your application at: http://${DOMAIN}"