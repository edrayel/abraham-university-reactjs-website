#!/bin/bash

# Abraham University ReactJS App - Deployment Validation Script
# This script validates the deployment setup and configuration

set -e

# Configuration
APP_NAME="abraham-university"
APP_DIR="/var/www/${APP_NAME}"
APP_PORT="3000"
DOMAIN="abraham-university.local"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results
PASSED=0
FAILED=0
WARNINGS=0

# Logging functions
log() {
    echo -e "${GREEN}[INFO] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARN] $1${NC}"
    ((WARNINGS++))
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    ((FAILED++))
}

pass() {
    echo -e "${GREEN}[PASS] $1${NC}"
    ((PASSED++))
}

# Test functions
test_system_requirements() {
    log "Testing system requirements..."
    
    # Check if running on AlmaLinux
    if [[ -f /etc/almalinux-release ]]; then
        pass "Running on AlmaLinux"
    else
        warn "Not running on AlmaLinux (this script is optimized for AlmaLinux 9)"
    fi
    
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        pass "Node.js installed: ${NODE_VERSION}"
    else
        error "Node.js not installed"
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        pass "npm installed: ${NPM_VERSION}"
    else
        error "npm not installed"
    fi
    
    # Check Apache
    if command -v httpd &> /dev/null; then
        APACHE_VERSION=$(httpd -v | head -n1)
        pass "Apache installed: ${APACHE_VERSION}"
    else
        error "Apache (httpd) not installed"
    fi
}

test_apache_configuration() {
    log "Testing Apache configuration..."
    
    # Test Apache configuration syntax
    if httpd -t &> /dev/null; then
        pass "Apache configuration syntax is valid"
    else
        error "Apache configuration has syntax errors"
        httpd -t
    fi
    
    # Check if Apache is running
    if systemctl is-active --quiet httpd; then
        pass "Apache service is running"
    else
        error "Apache service is not running"
    fi
    
    # Check if Apache is enabled
    if systemctl is-enabled --quiet httpd; then
        pass "Apache service is enabled"
    else
        warn "Apache service is not enabled for auto-start"
    fi
    
    # Check virtual host configuration
    if [[ -f "/etc/httpd/conf.d/${APP_NAME}.conf" ]]; then
        pass "Virtual host configuration file exists"
    else
        error "Virtual host configuration file not found"
    fi
    
    # Check proxy modules
    if httpd -M 2>/dev/null | grep -q "proxy_module"; then
        pass "Apache proxy module is loaded"
    else
        error "Apache proxy module is not loaded"
    fi
}

test_application_setup() {
    log "Testing application setup..."
    
    # Check application directory
    if [[ -d "${APP_DIR}" ]]; then
        pass "Application directory exists: ${APP_DIR}"
    else
        error "Application directory not found: ${APP_DIR}"
    fi
    
    # Check package.json
    if [[ -f "${APP_DIR}/package.json" ]]; then
        pass "package.json found"
    else
        error "package.json not found in application directory"
    fi
    
    # Check if dependencies are installed
    if [[ -d "${APP_DIR}/node_modules" ]]; then
        pass "Node.js dependencies are installed"
    else
        warn "Node.js dependencies not found (run npm install)"
    fi
    
    # Check if application is built
    if [[ -d "${APP_DIR}/dist" ]]; then
        pass "Application build directory exists"
    else
        warn "Application not built (run npm run build)"
    fi
    
    # Check application user
    if id "${APP_NAME}" &>/dev/null; then
        pass "Application user '${APP_NAME}' exists"
    else
        error "Application user '${APP_NAME}' not found"
    fi
}

test_systemd_service() {
    log "Testing systemd service..."
    
    # Check service file
    if [[ -f "/etc/systemd/system/${APP_NAME}.service" ]]; then
        pass "Systemd service file exists"
    else
        error "Systemd service file not found"
    fi
    
    # Check if service is enabled
    if systemctl is-enabled --quiet "${APP_NAME}" 2>/dev/null; then
        pass "Application service is enabled"
    else
        warn "Application service is not enabled"
    fi
    
    # Check if service is running
    if systemctl is-active --quiet "${APP_NAME}" 2>/dev/null; then
        pass "Application service is running"
    else
        warn "Application service is not running"
    fi
}

test_network_connectivity() {
    log "Testing network connectivity..."
    
    # Check if port 80 is listening
    if netstat -tlnp 2>/dev/null | grep -q ":80 "; then
        pass "Port 80 is listening (HTTP)"
    else
        error "Port 80 is not listening"
    fi
    
    # Check if application port is listening
    if netstat -tlnp 2>/dev/null | grep -q ":${APP_PORT} "; then
        pass "Application port ${APP_PORT} is listening"
    else
        warn "Application port ${APP_PORT} is not listening"
    fi
    
    # Test HTTP response
    if curl -s -o /dev/null -w "%{http_code}" "http://localhost" | grep -q "200\|301\|302"; then
        pass "HTTP server responds successfully"
    else
        warn "HTTP server not responding or returning error"
    fi
}

test_firewall_configuration() {
    log "Testing firewall configuration..."
    
    # Check if firewalld is running
    if systemctl is-active --quiet firewalld; then
        pass "Firewalld is running"
        
        # Check HTTP service
        if firewall-cmd --list-services | grep -q "http"; then
            pass "HTTP service is allowed in firewall"
        else
            warn "HTTP service not allowed in firewall"
        fi
        
        # Check HTTPS service
        if firewall-cmd --list-services | grep -q "https"; then
            pass "HTTPS service is allowed in firewall"
        else
            warn "HTTPS service not allowed in firewall"
        fi
    else
        warn "Firewalld is not running"
    fi
}

test_ssl_configuration() {
    log "Testing SSL configuration..."
    
    # Check if SSL module is loaded
    if httpd -M 2>/dev/null | grep -q "ssl_module"; then
        pass "Apache SSL module is loaded"
        
        # Check for SSL virtual host
        if grep -q "<VirtualHost \*:443>" /etc/httpd/conf.d/${APP_NAME}.conf 2>/dev/null; then
            pass "SSL virtual host is configured"
        else
            warn "SSL virtual host not configured (HTTPS not available)"
        fi
    else
        warn "Apache SSL module not loaded"
    fi
}

test_log_files() {
    log "Testing log file configuration..."
    
    # Check Apache log directory
    if [[ -d "/var/log/httpd" ]]; then
        pass "Apache log directory exists"
    else
        error "Apache log directory not found"
    fi
    
    # Check application log directory
    if [[ -d "/var/log/${APP_NAME}" ]]; then
        pass "Application log directory exists"
    else
        warn "Application log directory not found"
    fi
    
    # Check logrotate configuration
    if [[ -f "/etc/logrotate.d/${APP_NAME}" ]]; then
        pass "Log rotation is configured"
    else
        warn "Log rotation not configured"
    fi
}

test_performance() {
    log "Testing performance configuration..."
    
    # Check if compression is enabled
    if grep -q "SetOutputFilter DEFLATE" /etc/httpd/conf.d/${APP_NAME}.conf 2>/dev/null; then
        pass "Gzip compression is configured"
    else
        warn "Gzip compression not configured"
    fi
    
    # Check if caching headers are set
    if grep -q "ExpiresActive On" /etc/httpd/conf.d/${APP_NAME}.conf 2>/dev/null; then
        pass "Cache headers are configured"
    else
        warn "Cache headers not configured"
    fi
}

# Display summary
show_summary() {
    echo -e "${BLUE}"
    echo "==========================================="
    echo "       Deployment Validation Summary"
    echo "==========================================="
    echo -e "${GREEN}Passed: ${PASSED}${BLUE}"
    echo -e "${YELLOW}Warnings: ${WARNINGS}${BLUE}"
    echo -e "${RED}Failed: ${FAILED}${BLUE}"
    echo "==========================================="
    
    if [[ ${FAILED} -eq 0 ]]; then
        echo -e "${GREEN}✓ Deployment validation completed successfully!${BLUE}"
        if [[ ${WARNINGS} -gt 0 ]]; then
            echo -e "${YELLOW}⚠ Please review the warnings above${BLUE}"
        fi
    else
        echo -e "${RED}✗ Deployment validation failed!${BLUE}"
        echo -e "${RED}Please fix the errors above before proceeding${BLUE}"
    fi
    
    echo "==========================================="
    echo -e "${NC}"
}

# Main execution
main() {
    log "Starting deployment validation for Abraham University ReactJS App..."
    echo ""
    
    test_system_requirements
    echo ""
    test_apache_configuration
    echo ""
    test_application_setup
    echo ""
    test_systemd_service
    echo ""
    test_network_connectivity
    echo ""
    test_firewall_configuration
    echo ""
    test_ssl_configuration
    echo ""
    test_log_files
    echo ""
    test_performance
    echo ""
    
    show_summary
    
    # Exit with appropriate code
    if [[ ${FAILED} -gt 0 ]]; then
        exit 1
    else
        exit 0
    fi
}

# Run main function
main "$@"