#!/bin/bash

# Abraham University ReactJS App - Apache Reverse Proxy Setup Script
# For AlmaLinux 9
# This script configures Apache to act as a reverse proxy for the React app
#
# SMART INSTALLATION FEATURES:
# - Checks if components are already installed before attempting installation
# - Skips unnecessary operations to save time and avoid conflicts
# - Supports force flags: --force-update, --force-deploy
# - Validates existing configurations before overwriting
# - Only restarts services when necessary

set -e  # Exit on any error

# Configuration variables
APP_NAME="abraham-university"
APP_DIR="/var/www/${APP_NAME}"
APP_PORT="10000"  # Port where React app will run
DOMAIN="abrahamuniversity.us"  # Your domain name
APACHE_USER="apache"
APACHE_GROUP="apache"
NODE_VERSION="22"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root (use sudo)"
    fi
}

# Update system packages
update_system() {
    log "Checking system packages..."
    
    # Check if epel-release is already installed
    if ! rpm -q epel-release >/dev/null 2>&1; then
        log "Installing epel-release..."
        dnf install -y epel-release
    else
        log "epel-release already installed"
    fi
    
    # Check for force update flag
    FORCE_UPDATE_LOCAL=false
    if [[ "$1" == "--force-update" ]]; then
        FORCE_UPDATE_LOCAL=true
        log "Force update flag detected, will update packages regardless of last update time"
    fi
    
    # Only update if explicitly requested or if it's been a while
    if [[ "$FORCE_UPDATE_LOCAL" == true ]] || [[ ! -f /var/cache/dnf/last_update ]] || [[ $(find /var/cache/dnf/last_update -mtime +7) ]]; then
        log "Updating system packages..."
        dnf update -y
        touch /var/cache/dnf/last_update
    else
        log "System packages recently updated, skipping update"
    fi
}

# Install Apache HTTP Server
install_apache() {
    # Check if Apache is already installed
    if rpm -q httpd >/dev/null 2>&1; then
        log "Apache HTTP Server already installed"
        
        # Check if it's enabled and running
        if ! systemctl is-enabled httpd >/dev/null 2>&1; then
            log "Enabling Apache service..."
            systemctl enable httpd
        fi
        
        if ! systemctl is-active httpd >/dev/null 2>&1; then
            log "Starting Apache service..."
            systemctl start httpd
        else
            log "Apache service already running"
        fi
    else
        log "Installing Apache HTTP Server..."
        dnf install -y httpd httpd-tools
        
        # Enable and start Apache
        systemctl enable httpd
        systemctl start httpd
        
        log "Apache installed and started"
    fi
    
    # Configure firewall (check if rules already exist)
    if ! firewall-cmd --list-services | grep -q "http "; then
        log "Configuring firewall for HTTP..."
        firewall-cmd --permanent --add-service=http
        firewall-cmd --reload
    else
        log "HTTP firewall rule already configured"
    fi
    
    if ! firewall-cmd --list-services | grep -q "https"; then
        log "Configuring firewall for HTTPS..."
        firewall-cmd --permanent --add-service=https
        firewall-cmd --reload
    else
        log "HTTPS firewall rule already configured"
    fi
}

# Install Node.js and npm
install_nodejs() {
    # Check if Node.js is already installed and if it's the correct version
    if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
        current_node_version=$(node --version | sed 's/v//')
        major_version=$(echo $current_node_version | cut -d. -f1)
        
        if [ "$major_version" = "$NODE_VERSION" ]; then
            npm_version=$(npm --version)
            log "Node.js v${current_node_version} (correct version ${NODE_VERSION}) and npm ${npm_version} already installed"
            
            # Install PM2 globally for process management if not already installed
            if ! command -v pm2 >/dev/null 2>&1; then
                log "Installing PM2 globally..."
                npm install -g pm2
            else
                log "PM2 already installed"
            fi
            return
        else
            warn "Found Node.js v${current_node_version} but need version ${NODE_VERSION}. Reinstalling..."
        fi
    fi
    
    log "Installing Node.js ${NODE_VERSION}..."
    
    # Remove any existing conflicting Node.js packages
    log "Removing any existing Node.js packages to avoid conflicts..."
    # First, try to remove all nodejs-related packages aggressively
    dnf remove -y nodejs* npm* 2>/dev/null || true
    # Also try to remove specific problematic packages
    dnf remove -y nodejs-full-i18n nodejs-npm nodejs-docs 2>/dev/null || true
    
    # Clean package cache
    dnf clean all
    
    # Disable any conflicting nodejs modules
    dnf module disable nodejs -y 2>/dev/null || true
    
    # Install Node.js from NodeSource repository
    log "Setting up NodeSource repository for Node.js ${NODE_VERSION}..."
    curl -fsSL https://rpm.nodesource.com/setup_${NODE_VERSION}.x | bash -
    
    # Verify the repository was set up correctly
    if ! dnf repolist | grep -q nodesource; then
        error "NodeSource repository setup failed"
    fi
    
    # Try to install specific Node.js version with aggressive conflict resolution
    log "Installing Node.js ${NODE_VERSION} from NodeSource repository..."
    if ! dnf install -y nodejs-${NODE_VERSION}* npm --allowerasing --best 2>/dev/null && ! dnf install -y nodejs npm --allowerasing --best; then
        log "Standard installation failed, trying with --nobest..."
        
        # Try with --nobest and --allowerasing
        if ! dnf install -y nodejs npm --allowerasing --nobest; then
            log "Alternative installation failed, trying to skip broken packages..."
            
            # Try with --skip-broken
            if ! dnf install -y nodejs npm --allowerasing --skip-broken; then
                log "All automated methods failed, trying manual cleanup..."
                
                # More aggressive cleanup
                rpm -e --nodeps nodejs nodejs-full-i18n nodejs-npm 2>/dev/null || true
                dnf clean all
                
                # Final attempt
                if ! dnf install -y nodejs npm --allowerasing; then
                    log "ERROR: All Node.js installation methods failed. Please install Node.js manually."
                    log "You can try: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
                    log "Then: nvm install ${NODE_VERSION} && nvm use ${NODE_VERSION}"
                    exit 1
                fi
            fi
        fi
    fi
    
    # Install PM2 globally for process management
    npm install -g pm2
    
    # Verify installation and check version
    installed_node_version=$(node --version | sed 's/v//')
    installed_major_version=$(echo $installed_node_version | cut -d. -f1)
    npm_version=$(npm --version)
    
    if [ "$installed_major_version" = "$NODE_VERSION" ]; then
        log "SUCCESS: Node.js v${installed_node_version} (version ${NODE_VERSION}) and npm ${npm_version} installed successfully"
    else
        error "FAILED: Expected Node.js version ${NODE_VERSION} but got v${installed_node_version}. Please check the installation."
    fi
}

# Create application directory and user
setup_app_directory() {
    log "Setting up application directory..."
    
    # Create application directory if it doesn't exist
    if [[ ! -d "${APP_DIR}" ]]; then
        log "Creating application directory: ${APP_DIR}"
        mkdir -p ${APP_DIR}
    else
        log "Application directory already exists: ${APP_DIR}"
    fi
    
    # Create a dedicated user for the application
    if ! id "${APP_NAME}" &>/dev/null; then
        log "Creating user: ${APP_NAME}"
        useradd -r -s /bin/false -d ${APP_DIR} ${APP_NAME}
        log "Created user: ${APP_NAME}"
    else
        log "User ${APP_NAME} already exists"
    fi
    
    # Set proper ownership
    chown -R ${APP_NAME}:${APP_NAME} ${APP_DIR}
    chmod 755 ${APP_DIR}
}

# Configure Apache Virtual Host with reverse proxy
configure_apache_vhost() {
    log "Configuring Apache virtual host..."
    
    # Check if proxy modules configuration already exists
    if [[ ! -f "/etc/httpd/conf.modules.d/00-proxy.conf" ]] || ! grep -q "LoadModule proxy_module" /etc/httpd/conf.modules.d/00-proxy.conf; then
        log "Creating Apache proxy modules configuration..."
        # Enable required Apache modules
        cat > /etc/httpd/conf.modules.d/00-proxy.conf << 'EOF'
# Proxy modules
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule proxy_balancer_module modules/mod_proxy_balancer.so
LoadModule lbmethod_byrequests_module modules/mod_lbmethod_byrequests.so
LoadModule headers_module modules/mod_headers.so
LoadModule rewrite_module modules/mod_rewrite.so
EOF
    else
        log "Apache proxy modules already configured"
    fi

    # Check if virtual host configuration already exists
    if [[ ! -f "/etc/httpd/conf.d/${APP_NAME}.conf" ]] || ! grep -q "ServerName ${DOMAIN}" /etc/httpd/conf.d/${APP_NAME}.conf; then
        log "Creating Apache virtual host configuration..."
        # Create virtual host configuration
        cat > /etc/httpd/conf.d/${APP_NAME}.conf << EOF
<VirtualHost *:80>
    ServerName ${DOMAIN}
    ServerAlias www.${DOMAIN}
    
    # Document root (for static files if needed)
    DocumentRoot ${APP_DIR}/dist
    
    # Logging
    ErrorLog /var/log/httpd/${APP_NAME}_error.log
    CustomLog /var/log/httpd/${APP_NAME}_access.log combined
    
    # Security headers
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Proxy configuration for React app
    ProxyPreserveHost On
    ProxyRequests Off
    
    # Proxy API requests to React dev server
    ProxyPass /api/ http://localhost:${APP_PORT}/api/
    ProxyPassReverse /api/ http://localhost:${APP_PORT}/api/
    
    # Proxy WebSocket connections (for HMR in development)
    ProxyPass /ws ws://localhost:${APP_PORT}/ws
    ProxyPassReverse /ws ws://localhost:${APP_PORT}/ws
    
    # Proxy all other requests to React app
    ProxyPass / http://localhost:${APP_PORT}/
    ProxyPassReverse / http://localhost:${APP_PORT}/
    
    # Handle static files directly (optional optimization)
    <LocationMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
        # Try to serve static files directly, fallback to proxy
        RewriteEngine On
        RewriteCond ${APP_DIR}/dist%{REQUEST_URI} -f
        RewriteRule ^(.*)$ ${APP_DIR}/dist\$1 [L]
        
        # If file doesn't exist, proxy to React app
        ProxyPass http://localhost:${APP_PORT}/
        ProxyPassReverse http://localhost:${APP_PORT}/
        
        # Cache static assets
        ExpiresActive On
        ExpiresDefault "access plus 1 month"
    </LocationMatch>
    
    # Gzip compression
    <Location />
        SetOutputFilter DEFLATE
        SetEnvIfNoCase Request_URI \\
            \.(?:gif|jpe?g|png|ico)$ no-gzip dont-vary
        SetEnvIfNoCase Request_URI \\
            \.(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary
    </Location>
</VirtualHost>

# HTTPS Virtual Host (uncomment and configure SSL certificates)
# <VirtualHost *:443>
#     ServerName ${DOMAIN}
#     ServerAlias www.${DOMAIN}
#     
#     DocumentRoot ${APP_DIR}/dist
#     
#     # SSL Configuration
#     SSLEngine on
#     SSLCertificateFile /etc/ssl/certs/${DOMAIN}.crt
#     SSLCertificateKeyFile /etc/ssl/private/${DOMAIN}.key
#     
#     # Same proxy configuration as HTTP
#     ProxyPreserveHost On
#     ProxyRequests Off
#     
#     ProxyPass /api/ http://localhost:${APP_PORT}/api/
#     ProxyPassReverse /api/ http://localhost:${APP_PORT}/api/
#     
#     ProxyPass /ws ws://localhost:${APP_PORT}/ws
#     ProxyPassReverse /ws ws://localhost:${APP_PORT}/ws
#     
#     ProxyPass / http://localhost:${APP_PORT}/
#     ProxyPassReverse / http://localhost:${APP_PORT}/
# </VirtualHost>
EOF
        log "Apache virtual host configuration created"
    else
        log "Apache virtual host already configured"
    fi
}

# Create systemd service for the React app
create_systemd_service() {
    # Check if systemd service already exists
    if [[ ! -f "/etc/systemd/system/${APP_NAME}.service" ]] || ! grep -q "ExecStart=/usr/bin/npm start" /etc/systemd/system/${APP_NAME}.service; then
        log "Creating systemd service for React app..."
        
        cat > /etc/systemd/system/${APP_NAME}.service << EOF
[Unit]
Description=Abraham University ReactJS Application
After=network.target
Wants=network.target

[Service]
Type=simple
User=${APP_NAME}
Group=${APP_NAME}
WorkingDirectory=${APP_DIR}
Environment=NODE_ENV=production
Environment=PORT=${APP_PORT}
Environment=HOST=0.0.0.0
ExecStart=/usr/bin/npm start
ExecReload=/bin/kill -HUP \$MAINPID
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=${APP_NAME}

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=${APP_DIR}

[Install]
WantedBy=multi-user.target
EOF
        
        # Reload systemd and enable the service
        systemctl daemon-reload
        systemctl enable ${APP_NAME}
        
        log "Systemd service created and enabled"
    else
        log "Systemd service already exists"
        
        # Still reload daemon in case of changes
        systemctl daemon-reload
        
        # Ensure it's enabled
        if ! systemctl is-enabled ${APP_NAME} >/dev/null 2>&1; then
            log "Enabling ${APP_NAME} service..."
            systemctl enable ${APP_NAME}
        fi
    fi
}

# Create PM2 ecosystem file for production
create_pm2_config() {
    # Check if PM2 config already exists
    if [[ ! -f "${APP_DIR}/ecosystem.config.js" ]] || ! grep -q "name: '${APP_NAME}'" ${APP_DIR}/ecosystem.config.js; then
        log "Creating PM2 configuration..."
        
        cat > ${APP_DIR}/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '${APP_NAME}',
    script: 'npm',
    args: 'start',
    cwd: '${APP_DIR}',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: ${APP_PORT},
      HOST: '0.0.0.0'
    },
    error_file: '/var/log/${APP_NAME}/error.log',
    out_file: '/var/log/${APP_NAME}/out.log',
    log_file: '/var/log/${APP_NAME}/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
EOF
        
        chown ${APP_NAME}:${APP_NAME} ${APP_DIR}/ecosystem.config.js
        log "PM2 configuration created"
    else
        log "PM2 configuration already exists"
    fi
    
    # Create log directory if it doesn't exist
    if [[ ! -d "/var/log/${APP_NAME}" ]]; then
        log "Creating log directory..."
        mkdir -p /var/log/${APP_NAME}
        chown ${APP_NAME}:${APP_NAME} /var/log/${APP_NAME}
    else
        log "Log directory already exists"
    fi
}

# Setup log rotation
setup_log_rotation() {
    # Check if log rotation is already configured
    if [[ ! -f "/etc/logrotate.d/${APP_NAME}" ]] || ! grep -q "/var/log/${APP_NAME}/\*.log" /etc/logrotate.d/${APP_NAME}; then
        log "Setting up log rotation..."
        
        cat > /etc/logrotate.d/${APP_NAME} << EOF
/var/log/${APP_NAME}/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 ${APP_NAME} ${APP_NAME}
    postrotate
        systemctl reload ${APP_NAME} > /dev/null 2>&1 || true
    endscript
}

/var/log/httpd/${APP_NAME}_*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 ${APACHE_USER} ${APACHE_GROUP}
    postrotate
        systemctl reload httpd > /dev/null 2>&1 || true
    endscript
}
EOF
        log "Log rotation configured"
    else
        log "Log rotation already configured"
    fi
}

# Deploy application (if source code is available)
deploy_application() {
    log "Deploying React application..."
    
    # Check for force deploy flag
    FORCE_DEPLOY_LOCAL=false
    if [[ "$1" == "--force-deploy" ]]; then
        FORCE_DEPLOY_LOCAL=true
        log "Force deploy flag detected, will redeploy regardless of current state"
    fi
    
    # Check if we're in the React app directory
    if [[ -f "package.json" && -f "vite.config.js" ]]; then
        # Check if application is already deployed
        if [[ -f "${APP_DIR}/package.json" ]] && [[ -d "${APP_DIR}/dist" ]] && [[ -d "${APP_DIR}/node_modules" ]]; then
            log "Application already deployed and built in ${APP_DIR}"
            
            # Check if source has been updated (compare modification times)
            if [[ "package.json" -nt "${APP_DIR}/package.json" ]] || [[ "src" -nt "${APP_DIR}/dist" ]] || [[ "$FORCE_DEPLOY_LOCAL" == true ]]; then
                log "Source files have been updated, redeploying..."
            else
                log "Application is up to date, skipping deployment"
                return
            fi
        fi
        
        log "Found React app in current directory, copying files..."
        
        # Copy application files
        cp -r . ${APP_DIR}/
        
        # Set proper ownership
        chown -R ${APP_NAME}:${APP_NAME} ${APP_DIR}
        
        # Install dependencies and build
        cd ${APP_DIR}
        
        # Check if node_modules exists and package.json hasn't changed (skip if force deploy)
        if [[ ! -d "node_modules" ]] || [[ "package.json" -nt "node_modules" ]] || [[ "$FORCE_DEPLOY_LOCAL" == true ]]; then
            log "Installing dependencies..."
            sudo -u ${APP_NAME} npm ci
        else
            log "Dependencies already installed and up to date"
        fi
        
        # Check if build is needed (skip if force deploy)
        if [[ ! -d "dist" ]] || [[ "src" -nt "dist" ]] || [[ "package.json" -nt "dist" ]] || [[ "$FORCE_DEPLOY_LOCAL" == true ]]; then
            log "Building application..."
            sudo -u ${APP_NAME} npm run build
            
            # Verify build was successful
            if [[ -d "${APP_DIR}/dist" ]]; then
                log "Application built successfully - dist directory created"
            else
                error "Build failed - dist directory not found"
                exit 1
            fi
        else
            log "Application already built and up to date"
        fi
        
        log "Application deployed and built successfully"
    else
        warn "No React app found in current directory. You'll need to deploy your app manually to ${APP_DIR}"
        warn "Make sure to run 'npm ci && npm run build' after deploying your code"
    fi
}

# Start services
start_services() {
    log "Starting services..."
    
    # Test Apache configuration
    if ! httpd -t; then
        error "Apache configuration test failed. Please check the configuration."
        exit 1
    fi
    
    # Check if Apache is running, restart only if needed
    if systemctl is-active httpd >/dev/null 2>&1; then
        log "Apache is running, reloading configuration..."
        systemctl reload httpd
    else
        log "Starting Apache..."
        systemctl start httpd
    fi
    
    # Start the React app service
    if [[ -f "${APP_DIR}/package.json" ]]; then
        # Ensure the app is built before starting
        if [[ ! -d "${APP_DIR}/dist" ]]; then
            log "Building application before starting service..."
            cd ${APP_DIR}
            sudo -u ${APP_NAME} npm run build
        fi
        
        # Check if service is already running
        if systemctl is-active ${APP_NAME} >/dev/null 2>&1; then
            log "${APP_NAME} service is already running, restarting..."
            systemctl restart ${APP_NAME}
        else
            log "Starting ${APP_NAME} service..."
            systemctl start ${APP_NAME}
        fi
        
        sleep 3
        systemctl status ${APP_NAME} --no-pager
        
        # Check if service is running
        if systemctl is-active --quiet ${APP_NAME}; then
            log "${APP_NAME} service started successfully"
        else
            error "${APP_NAME} service failed to start. Check logs with: journalctl -u ${APP_NAME} -n 50"
        fi
    else
        warn "No application found in ${APP_DIR}, skipping service start"
    fi
    
    log "Services started successfully"
}

# Display final information
show_completion_info() {
    log "Setup completed successfully!"
    echo -e "${BLUE}"
    echo "==========================================="
    echo "  Abraham University ReactJS App Setup"
    echo "==========================================="
    echo "Application Directory: ${APP_DIR}"
    echo "React App Port: ${APP_PORT}"
    echo "Apache Port: 80 (HTTP), 443 (HTTPS)"
    echo "Domain: ${DOMAIN}"
    echo "Service Name: ${APP_NAME}"
    echo ""
    echo "Useful Commands:"
    echo "  - Check app status: systemctl status ${APP_NAME}"
    echo "  - Check Apache status: systemctl status httpd"
    echo "  - View app logs: journalctl -u ${APP_NAME} -f"
    echo "  - View Apache logs: tail -f /var/log/httpd/${APP_NAME}_*.log"
    echo "  - Restart app: systemctl restart ${APP_NAME}"
    echo "  - Restart Apache: systemctl restart httpd"
    echo ""
    echo "Next Steps:"
    echo "  1. Update DNS to point ${DOMAIN} to this server"
    echo "  2. Configure SSL certificates for HTTPS"
    echo "  3. Deploy your React application to ${APP_DIR}"
    echo "  4. Test the setup by visiting http://${DOMAIN}"
    echo "==========================================="
    echo -e "${NC}"
}

# Main execution
main() {
    log "Starting Abraham University ReactJS App setup..."
    
    # Parse command line arguments
    FORCE_UPDATE=false
    FORCE_DEPLOY=false
    
    for arg in "$@"; do
        case $arg in
            --force-update)
                FORCE_UPDATE=true
                shift
                ;;
            --force-deploy)
                FORCE_DEPLOY=true
                shift
                ;;
            --help|-h)
                echo "Usage: $0 [OPTIONS]"
                echo "Options:"
                echo "  --force-update    Force system package updates even if recently updated"
                echo "  --force-deploy    Force application redeployment even if up to date"
                echo "  --help, -h        Show this help message"
                exit 0
                ;;
        esac
    done
    
    check_root
    
    # Pass force flags to functions that support them
    if [ "$FORCE_UPDATE" = true ]; then
        update_system --force-update
    else
        update_system
    fi
    
    install_apache
    install_nodejs
    setup_app_directory
    configure_apache_vhost
    create_systemd_service
    create_pm2_config
    setup_log_rotation
    
    if [ "$FORCE_DEPLOY" = true ]; then
        deploy_application --force-deploy
    else
        deploy_application
    fi
    
    start_services
    show_completion_info
}

# Run main function
main "$@"