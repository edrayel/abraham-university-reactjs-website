#!/bin/bash

# Abraham University ReactJS App - Apache Reverse Proxy Setup Script
# For AlmaLinux 9
# This script configures Apache to act as a reverse proxy for the React app

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
    log "Updating system packages..."
    dnf update -y
    dnf install -y epel-release
}

# Install Apache HTTP Server
install_apache() {
    log "Installing Apache HTTP Server..."
    dnf install -y httpd httpd-tools
    
    # Enable and start Apache
    systemctl enable httpd
    systemctl start httpd
    
    # Configure firewall
    firewall-cmd --permanent --add-service=http
    firewall-cmd --permanent --add-service=https
    firewall-cmd --reload
    
    log "Apache installed and configured"
}

# Install Node.js and npm
install_nodejs() {
    # Check if Node.js is already installed
    if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
        node_version=$(node --version)
        npm_version=$(npm --version)
        log "Node.js ${node_version} and npm ${npm_version} already installed, skipping installation"
        
        # Install PM2 globally for process management if not already installed
        if ! command -v pm2 >/dev/null 2>&1; then
            log "Installing PM2 globally..."
            npm install -g pm2
        else
            log "PM2 already installed"
        fi
        return
    fi
    
    log "Installing Node.js ${NODE_VERSION}..."
    
    # Install Node.js from NodeSource repository
    curl -fsSL https://rpm.nodesource.com/setup_${NODE_VERSION}.x | bash -
    dnf install -y nodejs
    
    # Install PM2 globally for process management
    npm install -g pm2
    
    # Verify installation
    node_version=$(node --version)
    npm_version=$(npm --version)
    log "Node.js ${node_version} and npm ${npm_version} installed successfully"
}

# Create application directory and user
setup_app_directory() {
    log "Setting up application directory..."
    
    # Create application directory
    mkdir -p ${APP_DIR}
    
    # Create a dedicated user for the application
    if ! id "${APP_NAME}" &>/dev/null; then
        useradd -r -s /bin/false -d ${APP_DIR} ${APP_NAME}
        log "Created user: ${APP_NAME}"
    fi
    
    # Set proper ownership
    chown -R ${APP_NAME}:${APP_NAME} ${APP_DIR}
    chmod 755 ${APP_DIR}
}

# Configure Apache Virtual Host with reverse proxy
configure_apache_vhost() {
    log "Configuring Apache virtual host..."
    
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

    log "Apache virtual host configured"
}

# Create systemd service for the React app
create_systemd_service() {
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
Environment=HOST=localhost
ExecStart=/usr/bin/npm start
ExecReload=/bin/kill -HUP \$MAINPID
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
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
}

# Create PM2 ecosystem file for production
create_pm2_config() {
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
      HOST: 'localhost'
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

    # Create log directory
    mkdir -p /var/log/${APP_NAME}
    chown ${APP_NAME}:${APP_NAME} /var/log/${APP_NAME}
    
    chown ${APP_NAME}:${APP_NAME} ${APP_DIR}/ecosystem.config.js
}

# Setup log rotation
setup_log_rotation() {
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
}

# Deploy application (if source code is available)
deploy_application() {
    log "Deploying React application..."
    
    # Check if we're in the React app directory
    if [[ -f "package.json" && -f "vite.config.js" ]]; then
        log "Found React app in current directory, copying files..."
        
        # Copy application files
        cp -r . ${APP_DIR}/
        
        # Set proper ownership
        chown -R ${APP_NAME}:${APP_NAME} ${APP_DIR}
        
        # Install dependencies and build
        cd ${APP_DIR}
        sudo -u ${APP_NAME} npm ci --production
        sudo -u ${APP_NAME} npm run build
        
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
    httpd -t
    
    # Restart Apache
    systemctl restart httpd
    
    # Start the React app service
    if [[ -f "${APP_DIR}/package.json" ]]; then
        systemctl start ${APP_NAME}
        systemctl status ${APP_NAME} --no-pager
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
    
    check_root
    update_system
    install_apache
    install_nodejs
    setup_app_directory
    configure_apache_vhost
    create_systemd_service
    create_pm2_config
    setup_log_rotation
    deploy_application
    start_services
    show_completion_info
}

# Run main function
main "$@"