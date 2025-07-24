#!/bin/bash

# Fix Abraham University SystemD Service Issues
# This script addresses the syslog warnings and potential exit-code failures

set -e

# Configuration
APP_NAME="abraham-university"
APP_DIR="/var/www/abraham-university"
APP_PORT="10000"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1" >&2
}

warn() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1" >&2
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
    error "This script must be run as root (use sudo)"
    exit 1
fi

log "Starting SystemD service fix for ${APP_NAME}..."

# Stop the service first
log "Stopping ${APP_NAME} service..."
systemctl stop ${APP_NAME} || true

# Backup existing service file
if [[ -f "/etc/systemd/system/${APP_NAME}.service" ]]; then
    log "Backing up existing service file..."
    cp "/etc/systemd/system/${APP_NAME}.service" "/etc/systemd/system/${APP_NAME}.service.backup.$(date +%Y%m%d_%H%M%S)"
fi

# Create updated systemd service file
log "Creating updated systemd service file..."
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

log "Updated systemd service file created"

# Ensure application is properly built
if [[ -d "${APP_DIR}" ]]; then
    log "Checking application build status..."
    cd "${APP_DIR}"
    
    # Check if dist directory exists
    if [[ ! -d "dist" ]]; then
        log "Building application (dist directory missing)..."
        sudo -u "${APP_NAME}" npm run build
    else
        log "Application already built (dist directory exists)"
    fi
    
    # Verify build was successful
    if [[ -f "dist/index.html" ]]; then
        log "Build verification successful - dist/index.html exists"
    else
        error "Build verification failed - dist/index.html not found"
        exit 1
    fi
else
    error "Application directory ${APP_DIR} not found"
    exit 1
fi

# Reload systemd daemon
log "Reloading systemd daemon..."
systemctl daemon-reload

# Enable the service
log "Enabling ${APP_NAME} service..."
systemctl enable ${APP_NAME}

# Start the service
log "Starting ${APP_NAME} service..."
systemctl start ${APP_NAME}

# Wait a moment for the service to start
sleep 3

# Check service status
log "Checking service status..."
if systemctl is-active ${APP_NAME} >/dev/null 2>&1; then
    log "✅ Service is running successfully"
    systemctl status ${APP_NAME} --no-pager -l
else
    error "❌ Service failed to start"
    log "Service status:"
    systemctl status ${APP_NAME} --no-pager -l || true
    log "Recent logs:"
    journalctl -u ${APP_NAME} --no-pager -l -n 20 || true
    exit 1
fi

# Show recent logs
log "Recent service logs:"
journalctl -u ${APP_NAME} --no-pager -l -n 10

log "SystemD service fix completed successfully!"
log "The service should now run without syslog warnings and exit-code failures."
log "Monitor the service with: sudo journalctl -u ${APP_NAME} -f"