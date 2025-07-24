#!/bin/bash

# Abraham University Multi-App Apache Reverse Proxy Setup Script
# For AlmaLinux 9
# This script configures Apache to act as a reverse proxy for both ReactJS and WordPress apps
#
# ENHANCED FEATURES:
# - Systematic verification of existing server configuration
# - Rollback/update capabilities for wrong configurations
# - Configuration conflict resolution
# - Separate app management (ReactJS with NodeJS, WordPress with PHP built-in server)
# - Crash recovery and auto-restart mechanisms
# - WebSocket support (optional)
# - Comprehensive validation and troubleshooting
# - Smart installation with conflict detection

set -e  # Exit on any error

# Script version for tracking
SCRIPT_VERSION="2.0.0"
CONFIG_BACKUP_DIR="/etc/abraham-university/backups"
LOCK_FILE="/var/lock/abraham-university-setup.lock"

# Configuration variables for ReactJS App
REACT_APP_NAME="abraham-university-reactjs"
REACT_APP_DIR="/var/www/${REACT_APP_NAME}"
REACT_APP_PORT="3000"  # Port where React production server will run

# Configuration variables for WordPress App
WORDPRESS_APP_NAME="abraham-university-wordpress"
WORDPRESS_APP_DIR="/var/www/${WORDPRESS_APP_NAME}"
WORDPRESS_APP_PORT="8000"  # Port where WordPress will run

# Common configuration
DOMAIN="abrahamuniversity.us"  # Your domain name
APACHE_USER="apache"
APACHE_GROUP="apache"
NODE_VERSION="22"
PHP_VERSION="8.3"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    cleanup_on_exit
    exit 1
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

verify() {
    echo -e "${PURPLE}[$(date +'%Y-%m-%d %H:%M:%S')] VERIFY: $1${NC}"
}

success() {
    echo -e "${CYAN}[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS: $1${NC}"
}

# Lock file management
acquire_lock() {
    if [[ -f "$LOCK_FILE" ]]; then
        local lock_pid=$(cat "$LOCK_FILE" 2>/dev/null || echo "")
        if [[ -n "$lock_pid" ]] && kill -0 "$lock_pid" 2>/dev/null; then
            error "Another instance of this script is already running (PID: $lock_pid)"
        else
            warn "Stale lock file found, removing..."
            rm -f "$LOCK_FILE"
        fi
    fi
    echo $$ > "$LOCK_FILE"
    log "Lock acquired (PID: $$)"
}

release_lock() {
    if [[ -f "$LOCK_FILE" ]]; then
        rm -f "$LOCK_FILE"
        log "Lock released"
    fi
}

cleanup_on_exit() {
    release_lock
    # Additional cleanup if needed
}

# Trap to ensure cleanup on exit
trap cleanup_on_exit EXIT INT TERM

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root (use sudo)"
    fi
}

# ============================================================================
# SYSTEMATIC VERIFICATION FUNCTIONS
# ============================================================================

# Create backup directory
create_backup_dir() {
    if [[ ! -d "$CONFIG_BACKUP_DIR" ]]; then
        mkdir -p "$CONFIG_BACKUP_DIR"
        log "Created backup directory: $CONFIG_BACKUP_DIR"
    fi
}

# Backup configuration file
backup_config() {
    local config_file="$1"
    local backup_name="$2"
    
    if [[ -f "$config_file" ]]; then
        local timestamp=$(date +"%Y%m%d_%H%M%S")
        local backup_file="$CONFIG_BACKUP_DIR/${backup_name}_${timestamp}.bak"
        cp "$config_file" "$backup_file"
        log "Backed up $config_file to $backup_file"
        echo "$backup_file"
    fi
}

# Verify system requirements
verify_system_requirements() {
    verify "Checking system requirements..."
    
    # Check OS version
    if ! grep -q "AlmaLinux release 9" /etc/redhat-release 2>/dev/null; then
        warn "This script is designed for AlmaLinux 9. Current OS may not be fully supported."
    fi
    
    # Check available disk space (minimum 2GB)
    local available_space=$(df / | awk 'NR==2 {print $4}')
    if [[ $available_space -lt 2097152 ]]; then  # 2GB in KB
        warn "Low disk space detected. At least 2GB free space recommended."
    fi
    
    # Check memory (minimum 1GB)
    local available_memory=$(free -m | awk 'NR==2{print $7}')
    if [[ $available_memory -lt 1024 ]]; then
        warn "Low available memory detected. At least 1GB recommended."
    fi
    
    success "System requirements check completed"
}

# Verify existing Apache configuration
verify_apache_config() {
    verify "Checking existing Apache configuration..."
    
    local config_issues=()
    
    # Check if Apache is installed
    if ! command -v httpd &> /dev/null; then
        config_issues+=("Apache (httpd) not installed")
    else
        # Check Apache configuration syntax
        if ! httpd -t &> /dev/null; then
            config_issues+=("Apache configuration syntax errors detected")
        fi
        
        # Check for conflicting virtual hosts
        local existing_vhosts=$(httpd -S 2>/dev/null | grep -E "port 80|port 443" | wc -l)
        if [[ $existing_vhosts -gt 0 ]]; then
            info "Found $existing_vhosts existing virtual hosts on ports 80/443"
        fi
    fi
    
    if [[ ${#config_issues[@]} -gt 0 ]]; then
        warn "Apache configuration issues found:"
        for issue in "${config_issues[@]}"; do
            echo "  - $issue"
        done
        return 1
    fi
    
    success "Apache configuration verification completed"
    return 0
}

# Verify port availability
verify_port_availability() {
    verify "Checking port availability..."
    
    local ports_to_check=("$REACT_APP_PORT" "$WORDPRESS_APP_PORT" 80 443)
    local port_conflicts=()
    
    for port in "${ports_to_check[@]}"; do
        if ss -tlnp | grep -q ":$port "; then
            local process=$(ss -tlnp | grep ":$port " | awk '{print $7}' | head -1)
            port_conflicts+=("Port $port is already in use by: $process")
        fi
    done
    
    if [[ ${#port_conflicts[@]} -gt 0 ]]; then
        warn "Port conflicts detected:"
        for conflict in "${port_conflicts[@]}"; do
            echo "  - $conflict"
        done
        return 1
    fi
    
    success "All required ports are available"
    return 0
}

# Verify application directories and permissions
verify_app_directories() {
    verify "Checking application directories and permissions..."
    
    local dir_issues=()
    
    # Check ReactJS directory
    if [[ -d "$REACT_APP_DIR" ]]; then
        if [[ ! -r "$REACT_APP_DIR" ]]; then
            dir_issues+=("ReactJS directory not readable: $REACT_APP_DIR")
        fi
        if [[ ! -f "$REACT_APP_DIR/package.json" ]]; then
            dir_issues+=("ReactJS package.json not found in: $REACT_APP_DIR")
        fi
    else
        dir_issues+=("ReactJS directory does not exist: $REACT_APP_DIR")
    fi
    
    # Check WordPress directory
    if [[ -d "$WORDPRESS_APP_DIR" ]]; then
        if [[ ! -r "$WORDPRESS_APP_DIR" ]]; then
            dir_issues+=("WordPress directory not readable: $WORDPRESS_APP_DIR")
        fi
        if [[ ! -f "$WORDPRESS_APP_DIR/wp-config.php" ]] && [[ ! -f "$WORDPRESS_APP_DIR/wp-config-sample.php" ]]; then
            dir_issues+=("WordPress configuration not found in: $WORDPRESS_APP_DIR")
        fi
    else
        dir_issues+=("WordPress directory does not exist: $WORDPRESS_APP_DIR")
    fi
    
    if [[ ${#dir_issues[@]} -gt 0 ]]; then
        warn "Application directory issues found:"
        for issue in "${dir_issues[@]}"; do
            echo "  - $issue"
        done
        return 1
    fi
    
    success "Application directories verification completed"
    return 0
}

# Verify existing services
verify_existing_services() {
    verify "Checking existing services..."
    
    local service_issues=()
    
    # Check systemd services
    local services=("$REACT_APP_NAME" "$WORDPRESS_APP_NAME" "httpd" "php-fpm")
    
    for service in "${services[@]}"; do
        if systemctl list-unit-files | grep -q "^$service.service"; then
            local status=$(systemctl is-active "$service" 2>/dev/null || echo "inactive")
            info "Service $service exists and is $status"
            
            if [[ "$status" == "failed" ]]; then
                service_issues+=("Service $service is in failed state")
            fi
        fi
    done
    
    if [[ ${#service_issues[@]} -gt 0 ]]; then
        warn "Service issues found:"
        for issue in "${service_issues[@]}"; do
            echo "  - $issue"
        done
        return 1
    fi
    
    success "Services verification completed"
    return 0
}

# Comprehensive system verification
run_system_verification() {
    log "Starting comprehensive system verification..."
    
    local verification_failed=false
    
    verify_system_requirements || verification_failed=true
    verify_apache_config || verification_failed=true
    verify_port_availability || verification_failed=true
    verify_app_directories || verification_failed=true
    verify_existing_services || verification_failed=true
    
    if [[ "$verification_failed" == "true" ]]; then
        warn "System verification completed with issues. Use --fix flag to attempt automatic resolution."
        return 1
    else
        success "System verification completed successfully"
        return 0
    fi
}

# ============================================================================
# ROLLBACK AND CONFLICT RESOLUTION FUNCTIONS
# ============================================================================

# List available backups
list_backups() {
    log "Available configuration backups:"
    if [[ -d "$CONFIG_BACKUP_DIR" ]]; then
        find "$CONFIG_BACKUP_DIR" -name "*.bak" -type f -exec basename {} \; | sort
    else
        warn "No backup directory found"
    fi
}

# Rollback configuration from backup
rollback_config() {
    local backup_file="$1"
    local target_file="$2"
    
    if [[ ! -f "$backup_file" ]]; then
        error "Backup file not found: $backup_file"
    fi
    
    if [[ ! -f "$target_file" ]]; then
        error "Target file not found: $target_file"
    fi
    
    # Create a backup of current config before rollback
    backup_config "$target_file" "pre_rollback"
    
    # Perform rollback
    cp "$backup_file" "$target_file"
    log "Rolled back $target_file from $backup_file"
    
    # Validate the rolled back configuration
    if [[ "$target_file" == *"httpd"* ]] || [[ "$target_file" == *"apache"* ]]; then
        if httpd -t &> /dev/null; then
            success "Apache configuration rollback successful and valid"
        else
            error "Apache configuration rollback resulted in invalid configuration"
        fi
    fi
}

# Resolve port conflicts
resolve_port_conflicts() {
    log "Resolving port conflicts..."
    
    local ports_to_check=("$REACT_APP_PORT" "$WORDPRESS_APP_PORT" 80 443)
    
    for port in "${ports_to_check[@]}"; do
        if ss -tlnp | grep -q ":$port "; then
            local process_info=$(ss -tlnp | grep ":$port " | awk '{print $7}' | head -1)
            local pid=$(echo "$process_info" | cut -d'/' -f1)
            local process_name=$(echo "$process_info" | cut -d'/' -f2)
            
            warn "Port $port is occupied by $process_name (PID: $pid)"
            
            # Handle known processes
            case "$process_name" in
                "httpd"|"apache2")
                    if [[ "$port" == "80" ]] || [[ "$port" == "443" ]]; then
                        info "Apache is using port $port - this is expected for proxy setup"
                    else
                        warn "Apache is using unexpected port $port"
                    fi
                    ;;
                "node"|"npm")
                    if [[ "$port" == "$REACT_APP_PORT" ]]; then
                        info "Node.js is using port $port - checking if it's our ReactJS app"
                        # Check if it's our service
                        if systemctl is-active "$REACT_APP_NAME" &> /dev/null; then
                            info "Our ReactJS service is already running on port $port"
                        else
                            warn "Unknown Node.js process on port $port - may need manual intervention"
                        fi
                    else
                        warn "Node.js process on unexpected port $port"
                    fi
                    ;;
                "php"|"php-fpm")
                    if [[ "$port" == "$WORDPRESS_APP_PORT" ]]; then
                        info "PHP is using port $port - checking if it's our WordPress app"
                        if systemctl is-active "$WORDPRESS_APP_NAME" &> /dev/null; then
                            info "Our WordPress service is already running on port $port"
                        else
                            warn "Unknown PHP process on port $port - may need manual intervention"
                        fi
                    else
                        warn "PHP process on unexpected port $port"
                    fi
                    ;;
                *)
                    warn "Unknown process $process_name using port $port"
                    echo "  You may need to manually stop this process: sudo kill $pid"
                    ;;
            esac
        fi
    done
}

# Resolve configuration conflicts
resolve_config_conflicts() {
    log "Resolving configuration conflicts..."
    
    # Check for conflicting Apache virtual hosts
    if command -v httpd &> /dev/null; then
        local conflicting_vhosts=$(httpd -S 2>/dev/null | grep -E "abraham-university|$REACT_APP_DOMAIN|$WORDPRESS_APP_DOMAIN" | grep -v "default")
        
        if [[ -n "$conflicting_vhosts" ]]; then
            warn "Found potentially conflicting virtual hosts:"
            echo "$conflicting_vhosts"
            
            # Backup existing Apache configuration
            backup_config "/etc/httpd/conf/httpd.conf" "httpd_conf"
            
            # Check for conflicting site configurations
            if [[ -d "/etc/httpd/conf.d" ]]; then
                find /etc/httpd/conf.d -name "*.conf" -exec grep -l "abraham-university\|$REACT_APP_DOMAIN\|$WORDPRESS_APP_DOMAIN" {} \; | while read -r conf_file; do
                    warn "Found conflicting configuration in: $conf_file"
                    backup_config "$conf_file" "$(basename "$conf_file" .conf)"
                done
            fi
        fi
    fi
    
    # Check for conflicting systemd services
    local existing_services=$(systemctl list-unit-files | grep -E "abraham-university|react|wordpress" | grep -v "$REACT_APP_NAME\|$WORDPRESS_APP_NAME")
    
    if [[ -n "$existing_services" ]]; then
        warn "Found potentially conflicting systemd services:"
        echo "$existing_services"
        
        # Offer to disable conflicting services
        echo "These services may conflict with our setup. Consider disabling them manually if needed."
    fi
}

# Auto-fix common issues
auto_fix_issues() {
    log "Attempting to automatically fix common issues..."
    
    # Fix directory permissions
    if [[ -d "$REACT_APP_DIR" ]]; then
        chown -R "$REACT_APP_USER:$REACT_APP_USER" "$REACT_APP_DIR"
        chmod -R 755 "$REACT_APP_DIR"
        log "Fixed ReactJS directory permissions"
    fi
    
    if [[ -d "$WORDPRESS_APP_DIR" ]]; then
        chown -R "$WORDPRESS_APP_USER:$WORDPRESS_APP_USER" "$WORDPRESS_APP_DIR"
        chmod -R 755 "$WORDPRESS_APP_DIR"
        log "Fixed WordPress directory permissions"
    fi
    
    # Fix service issues
    local services=("$REACT_APP_NAME" "$WORDPRESS_APP_NAME")
    for service in "${services[@]}"; do
        if systemctl list-unit-files | grep -q "^$service.service"; then
            local status=$(systemctl is-active "$service" 2>/dev/null || echo "inactive")
            if [[ "$status" == "failed" ]]; then
                log "Attempting to fix failed service: $service"
                systemctl reset-failed "$service"
                systemctl restart "$service"
            fi
        fi
    done
    
    # Clear npm cache if ReactJS directory exists
    if [[ -d "$REACT_APP_DIR" ]]; then
        sudo -u "$REACT_APP_USER" npm cache clean --force 2>/dev/null || true
        log "Cleared npm cache"
    fi
    
    success "Auto-fix completed"
}

# ============================================================================
# CRASH RECOVERY AND MONITORING FUNCTIONS
# ============================================================================

# Check application health
check_app_health() {
    local app_name="$1"
    local app_port="$2"
    local app_url="$3"
    
    info "Checking health of $app_name..."
    
    # Check if service is running
    if ! systemctl is-active "$app_name" &> /dev/null; then
        warn "Service $app_name is not running"
        return 1
    fi
    
    # Check if port is responding
    if ! ss -tlnp | grep -q ":$app_port "; then
        warn "Port $app_port is not listening for $app_name"
        return 1
    fi
    
    # Check HTTP response (if URL provided)
    if [[ -n "$app_url" ]]; then
        local http_status=$(curl -s -o /dev/null -w "%{http_code}" "$app_url" --connect-timeout 5 --max-time 10 || echo "000")
        if [[ "$http_status" =~ ^[23] ]]; then
            success "$app_name is healthy (HTTP $http_status)"
            return 0
        else
            warn "$app_name returned HTTP $http_status"
            return 1
        fi
    fi
    
    success "$app_name service is running and port is listening"
    return 0
}

# Restart application with recovery
restart_app_with_recovery() {
    local app_name="$1"
    local app_dir="$2"
    local app_user="$3"
    
    log "Restarting $app_name with recovery procedures..."
    
    # Stop the service
    systemctl stop "$app_name" 2>/dev/null || true
    
    # Kill any remaining processes on the app's port
    local app_port
    case "$app_name" in
        "$REACT_APP_NAME")
            app_port="$REACT_APP_PORT"
            ;;
        "$WORDPRESS_APP_NAME")
            app_port="$WORDPRESS_APP_PORT"
            ;;
        *)
            warn "Unknown app name: $app_name"
            return 1
            ;;
    esac
    
    # Kill processes on the port
    local pids=$(lsof -ti:"$app_port" 2>/dev/null || true)
    if [[ -n "$pids" ]]; then
        log "Killing processes on port $app_port: $pids"
        kill -9 $pids 2>/dev/null || true
        sleep 2
    fi
    
    # Fix permissions and ownership
    if [[ -d "$app_dir" ]]; then
        chown -R "$app_user:$app_user" "$app_dir"
        chmod -R 755 "$app_dir"
    fi
    
    # App-specific recovery procedures
    case "$app_name" in
        "$REACT_APP_NAME")
            # Clear npm cache and reinstall if needed
            if [[ -d "$app_dir" ]]; then
                cd "$app_dir"
                sudo -u "$app_user" npm cache clean --force 2>/dev/null || true
                
                # Check if node_modules exists and is not empty
                if [[ ! -d "node_modules" ]] || [[ -z "$(ls -A node_modules 2>/dev/null)" ]]; then
                    log "Reinstalling npm dependencies for ReactJS..."
                    sudo -u "$app_user" npm install
                fi
                
                # Rebuild if dist directory is missing or empty
                if [[ ! -d "dist" ]] || [[ -z "$(ls -A dist 2>/dev/null)" ]]; then
                    log "Rebuilding ReactJS application..."
                    sudo -u "$app_user" npm run build
                fi
            fi
            ;;
        "$WORDPRESS_APP_NAME")
            # WordPress-specific recovery
            if [[ -d "$app_dir" ]]; then
                # Check WordPress configuration
                if [[ ! -f "$app_dir/wp-config.php" ]] && [[ -f "$app_dir/wp-config-sample.php" ]]; then
                    warn "WordPress wp-config.php not found. Please configure WordPress manually."
                fi
            fi
            ;;
    esac
    
    # Start the service
    systemctl start "$app_name"
    
    # Wait for service to start
    sleep 5
    
    # Verify the service started successfully
    if systemctl is-active "$app_name" &> /dev/null; then
        success "$app_name restarted successfully"
        return 0
    else
        error "Failed to restart $app_name"
        return 1
    fi
}

# Monitor and auto-restart crashed applications
setup_crash_monitoring() {
    log "Setting up crash monitoring and auto-restart..."
    
    # Create monitoring script
    local monitor_script="/usr/local/bin/abraham-university-monitor.sh"
    
    cat > "$monitor_script" << 'EOF'
#!/bin/bash

# Abraham University Application Monitor
# This script monitors the health of ReactJS and WordPress applications
# and automatically restarts them if they crash

LOG_FILE="/var/log/abraham-university-monitor.log"
REACT_APP_NAME="abraham-university-react"
WORDPRESS_APP_NAME="abraham-university-wordpress"
REACT_APP_PORT="3000"
WORDPRESS_APP_PORT="8000"
REACT_APP_URL="http://localhost:3000"
WORDPRESS_APP_URL="http://localhost:8000"

# Logging function
log_message() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Check and restart if needed
check_and_restart() {
    local app_name="$1"
    local app_port="$2"
    local app_url="$3"
    
    # Check if service is running
    if ! systemctl is-active "$app_name" &> /dev/null; then
        log_message "WARNING: $app_name service is not running, attempting restart..."
        systemctl restart "$app_name"
        sleep 10
        
        if systemctl is-active "$app_name" &> /dev/null; then
            log_message "SUCCESS: $app_name service restarted successfully"
        else
            log_message "ERROR: Failed to restart $app_name service"
        fi
        return
    fi
    
    # Check if port is responding
    if ! ss -tlnp | grep -q ":$app_port "; then
        log_message "WARNING: $app_name port $app_port not responding, attempting restart..."
        systemctl restart "$app_name"
        sleep 10
        return
    fi
    
    # Check HTTP response
    local http_status=$(curl -s -o /dev/null -w "%{http_code}" "$app_url" --connect-timeout 5 --max-time 10 2>/dev/null || echo "000")
    if [[ ! "$http_status" =~ ^[23] ]]; then
        log_message "WARNING: $app_name returned HTTP $http_status, attempting restart..."
        systemctl restart "$app_name"
        sleep 10
    fi
}

# Main monitoring loop
main() {
    log_message "Starting application health check..."
    
    # Check ReactJS application
    check_and_restart "$REACT_APP_NAME" "$REACT_APP_PORT" "$REACT_APP_URL"
    
    # Check WordPress application
    check_and_restart "$WORDPRESS_APP_NAME" "$WORDPRESS_APP_PORT" "$WORDPRESS_APP_URL"
    
    log_message "Health check completed"
}

# Run main function
main
EOF

    chmod +x "$monitor_script"
    
    # Create systemd timer for monitoring
    local timer_file="/etc/systemd/system/abraham-university-monitor.timer"
    local service_file="/etc/systemd/system/abraham-university-monitor.service"
    
    # Create monitoring service
    cat > "$service_file" << EOF
[Unit]
Description=Abraham University Application Monitor
After=network.target

[Service]
Type=oneshot
ExecStart=$monitor_script
User=root
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

    # Create monitoring timer (runs every 5 minutes)
    cat > "$timer_file" << EOF
[Unit]
Description=Abraham University Application Monitor Timer
Requires=abraham-university-monitor.service

[Timer]
OnBootSec=5min
OnUnitActiveSec=5min
Unit=abraham-university-monitor.service

[Install]
WantedBy=timers.target
EOF

    # Enable and start the monitoring timer
    systemctl daemon-reload
    systemctl enable abraham-university-monitor.timer
    systemctl start abraham-university-monitor.timer
    
    success "Crash monitoring and auto-restart configured"
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

# Install PHP and required modules
install_php() {
    # Check if PHP is already installed
    if command -v php >/dev/null 2>&1; then
        current_php_version=$(php -v | head -n1 | cut -d' ' -f2 | cut -d'.' -f1,2)
        if [ "$current_php_version" = "$PHP_VERSION" ]; then
            log "PHP ${current_php_version} already installed"
        else
            warn "Found PHP ${current_php_version} but need version ${PHP_VERSION}. Installing..."
        fi
    else
        log "Installing PHP ${PHP_VERSION}..."
    fi
    
    # Install PHP and required modules
    dnf install -y php php-fpm php-mysqlnd php-gd php-xml php-mbstring php-json php-curl php-zip php-intl
    
    # Enable and start PHP-FPM
    systemctl enable php-fpm
    systemctl start php-fpm
    
    log "PHP installation completed"
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

# Create application directories and users
setup_app_directories() {
    log "Setting up application directories..."
    
    # Setup ReactJS application
    if [[ ! -d "${REACT_APP_DIR}" ]]; then
        log "Creating ReactJS application directory: ${REACT_APP_DIR}"
        mkdir -p ${REACT_APP_DIR}
    else
        log "ReactJS application directory already exists: ${REACT_APP_DIR}"
    fi
    
    # Create a dedicated user for ReactJS application
    if ! id "${REACT_APP_NAME}" &>/dev/null; then
        log "Creating user: ${REACT_APP_NAME}"
        useradd -r -s /bin/false -d ${REACT_APP_DIR} ${REACT_APP_NAME}
        log "Created user: ${REACT_APP_NAME}"
    else
        log "User ${REACT_APP_NAME} already exists"
    fi
    
    # Setup WordPress application
    if [[ ! -d "${WORDPRESS_APP_DIR}" ]]; then
        log "Creating WordPress application directory: ${WORDPRESS_APP_DIR}"
        mkdir -p ${WORDPRESS_APP_DIR}
    else
        log "WordPress application directory already exists: ${WORDPRESS_APP_DIR}"
    fi
    
    # Create a dedicated user for WordPress application
    if ! id "${WORDPRESS_APP_NAME}" &>/dev/null; then
        log "Creating user: ${WORDPRESS_APP_NAME}"
        useradd -r -s /bin/false -d ${WORDPRESS_APP_DIR} ${WORDPRESS_APP_NAME}
        log "Created user: ${WORDPRESS_APP_NAME}"
    else
        log "User ${WORDPRESS_APP_NAME} already exists"
    fi
    
    # Set proper ownership
    chown -R ${REACT_APP_NAME}:${REACT_APP_NAME} ${REACT_APP_DIR}
    chmod 755 ${REACT_APP_DIR}
    
    chown -R ${WORDPRESS_APP_NAME}:${WORDPRESS_APP_NAME} ${WORDPRESS_APP_DIR}
    chmod 755 ${WORDPRESS_APP_DIR}
}

# Configure Apache Virtual Host with reverse proxy for both apps
configure_apache_vhost() {
    log "Configuring Apache virtual host for multi-app setup..."
    
    # Check if proxy modules configuration already exists
    if [[ ! -f "/etc/httpd/conf.modules.d/00-proxy.conf" ]] || ! grep -q "LoadModule proxy_module" /etc/httpd/conf.modules.d/00-proxy.conf; then
        log "Creating Apache proxy modules configuration..."
        # Enable required Apache modules
        cat > /etc/httpd/conf.modules.d/00-proxy.conf << 'EOF'
# Proxy modules
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule proxy_wstunnel_module modules/mod_proxy_wstunnel.so
LoadModule proxy_balancer_module modules/mod_proxy_balancer.so
LoadModule lbmethod_byrequests_module modules/mod_lbmethod_byrequests.so
LoadModule headers_module modules/mod_headers.so
LoadModule rewrite_module modules/mod_rewrite.so
LoadModule mime_module modules/mod_mime.so
LoadModule expires_module modules/mod_expires.so
LoadModule proxy_fcgi_module modules/mod_proxy_fcgi.so
EOF
    else
        log "Apache proxy modules already configured"
    fi

    # Backup existing configuration if it exists and preserve SSL settings
    EXISTING_SSL_CONFIG=""
    CONFIG_FILE="/etc/httpd/conf.d/abraham-university.conf"
    if [[ -f "${CONFIG_FILE}" ]]; then
        log "Backing up existing Apache configuration..."
        cp "${CONFIG_FILE}" "${CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
        
        # Extract existing SSL configuration if present
        if grep -q "<VirtualHost \*:443>" "${CONFIG_FILE}"; then
            log "Preserving existing SSL configuration..."
            EXISTING_SSL_CONFIG=$(sed -n '/<VirtualHost \*:443>/,/<\/VirtualHost>/p' "${CONFIG_FILE}")
        fi
    fi
    
    log "Creating/updating Apache virtual host configuration..."
    # Always overwrite the configuration file to ensure latest settings
    cat > ${CONFIG_FILE} << EOF
<VirtualHost *:80>
    ServerName ${DOMAIN}
    ServerAlias www.${DOMAIN}
    
    # Logging
    ErrorLog /var/log/httpd/abraham-university_error.log
    CustomLog /var/log/httpd/abraham-university_access.log combined
    
    # Security headers
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Enable rewrite engine
    RewriteEngine On
    
    # Proxy settings
    ProxyPreserveHost On
    ProxyRequests Off
    
    # WordPress API and admin routes (priority routing)
    ProxyPass /wp-admin/ http://localhost:${WORDPRESS_APP_PORT}/wp-admin/
    ProxyPassReverse /wp-admin/ http://localhost:${WORDPRESS_APP_PORT}/wp-admin/
    
    ProxyPass /wp-content/ http://localhost:${WORDPRESS_APP_PORT}/wp-content/
    ProxyPassReverse /wp-content/ http://localhost:${WORDPRESS_APP_PORT}/wp-content/
    
    ProxyPass /wp-includes/ http://localhost:${WORDPRESS_APP_PORT}/wp-includes/
    ProxyPassReverse /wp-includes/ http://localhost:${WORDPRESS_APP_PORT}/wp-includes/
    
    ProxyPass /wp-json/ http://localhost:${WORDPRESS_APP_PORT}/wp-json/
    ProxyPassReverse /wp-json/ http://localhost:${WORDPRESS_APP_PORT}/wp-json/
    
    # WordPress login and other WP specific files
    ProxyPass /wp-login.php http://localhost:${WORDPRESS_APP_PORT}/wp-login.php
    ProxyPassReverse /wp-login.php http://localhost:${WORDPRESS_APP_PORT}/wp-login.php
    
    ProxyPass /xmlrpc.php http://localhost:${WORDPRESS_APP_PORT}/xmlrpc.php
    ProxyPassReverse /xmlrpc.php http://localhost:${WORDPRESS_APP_PORT}/xmlrpc.php
    
    # ReactJS API routes
    ProxyPass /api/ http://localhost:${REACT_APP_PORT}/api/
    ProxyPassReverse /api/ http://localhost:${REACT_APP_PORT}/api/
    
    # All other requests go to ReactJS (SPA routing)
    ProxyPass / http://localhost:${REACT_APP_PORT}/
    ProxyPassReverse / http://localhost:${REACT_APP_PORT}/
    
    # Gzip compression
    <Location />
        SetOutputFilter DEFLATE
        SetEnvIfNoCase Request_URI \\
            \.(?:gif|jpe?g|png|ico)$ no-gzip dont-vary
        SetEnvIfNoCase Request_URI \\
            \.(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary
    </Location>
</VirtualHost>
EOF

    # Append preserved SSL configuration or create default HTTPS template
    if [[ -n "$EXISTING_SSL_CONFIG" ]]; then
        log "Appending preserved SSL configuration..."
        echo "" >> ${CONFIG_FILE}
        echo "$EXISTING_SSL_CONFIG" >> ${CONFIG_FILE}
    else
        log "Adding default HTTPS template (commented out)..."
        cat >> ${CONFIG_FILE} << 'EOF'

# HTTPS Virtual Host (uncomment and configure SSL certificates)
<VirtualHost *:443>
    ServerName abrahamuniversity.us
    ServerAlias www.abrahamuniversity.us
    
    # SSL Configuration (Let's Encrypt paths)
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/abrahamuniversity.us/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/abrahamuniversity.us/privkey.pem
    
    # Security headers
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Enable rewrite engine
    RewriteEngine On
    
    # Proxy settings
    ProxyPreserveHost On
    ProxyRequests Off
    
    # WordPress API and admin routes (priority routing)
    ProxyPass /wp-admin/ http://localhost:${WORDPRESS_APP_PORT}/wp-admin/
    ProxyPassReverse /wp-admin/ http://localhost:${WORDPRESS_APP_PORT}/wp-admin/
    
    ProxyPass /wp-content/ http://localhost:${WORDPRESS_APP_PORT}/wp-content/
    ProxyPassReverse /wp-content/ http://localhost:${WORDPRESS_APP_PORT}/wp-content/
    
    ProxyPass /wp-includes/ http://localhost:${WORDPRESS_APP_PORT}/wp-includes/
    ProxyPassReverse /wp-includes/ http://localhost:${WORDPRESS_APP_PORT}/wp-includes/
    
    ProxyPass /wp-json/ http://localhost:${WORDPRESS_APP_PORT}/wp-json/
    ProxyPassReverse /wp-json/ http://localhost:${WORDPRESS_APP_PORT}/wp-json/
    
    # WordPress login and other WP specific files
    ProxyPass /wp-login.php http://localhost:${WORDPRESS_APP_PORT}/wp-login.php
    ProxyPassReverse /wp-login.php http://localhost:${WORDPRESS_APP_PORT}/wp-login.php
    
    ProxyPass /xmlrpc.php http://localhost:${WORDPRESS_APP_PORT}/xmlrpc.php
    ProxyPassReverse /xmlrpc.php http://localhost:${WORDPRESS_APP_PORT}/xmlrpc.php
    
    # ReactJS API routes
    ProxyPass /api/ http://localhost:${REACT_APP_PORT}/api/
    ProxyPassReverse /api/ http://localhost:${REACT_APP_PORT}/api/
    
    # All other requests go to ReactJS (SPA routing)
    ProxyPass / http://localhost:${REACT_APP_PORT}/
    ProxyPassReverse / http://localhost:${REACT_APP_PORT}/
    
    # Gzip compression
    <Location />
        SetOutputFilter DEFLATE
        SetEnvIfNoCase Request_URI \\
            \.(?:gif|jpe?g|png|ico)$ no-gzip dont-vary
        SetEnvIfNoCase Request_URI \\
            \.(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary
    </Location>
</VirtualHost>
EOF
    fi
    
    log "Apache virtual host configuration updated successfully"
}

# Create systemd services for both ReactJS and WordPress apps
create_systemd_services() {
    log "Creating systemd services for ReactJS and WordPress applications..."
    
    # Create ReactJS systemd service file (production build)
    if [[ ! -f "/etc/systemd/system/${REACT_APP_NAME}.service" ]] || ! grep -q "ExecStart=.*serve" /etc/systemd/system/${REACT_APP_NAME}.service; then
        log "Creating ReactJS production service..."
        
        cat > /etc/systemd/system/${REACT_APP_NAME}.service << EOF
[Unit]
Description=Abraham University ReactJS Application (Production)
After=network.target
Wants=network.target

[Service]
Type=simple
User=${REACT_APP_NAME}
Group=${REACT_APP_NAME}
WorkingDirectory=${REACT_APP_DIR}
Environment=NODE_ENV=production
Environment=PORT=${REACT_APP_PORT}
Environment=HOST=0.0.0.0
Environment=PATH=/usr/local/bin:/usr/bin:/bin:/home/${REACT_APP_NAME}/.local/bin
Environment=HOME=/home/${REACT_APP_NAME}
Environment=npm_config_cache=/home/${REACT_APP_NAME}/.npm
Environment=FORCE_COLOR=0
Environment=CI=true
Environment=HEADLESS=true
ExecStartPre=/bin/bash -c 'chown -R ${REACT_APP_NAME}:${REACT_APP_NAME} ${REACT_APP_DIR}'
ExecStartPre=/bin/bash -c 'chmod -R 755 ${REACT_APP_DIR}'
ExecStartPre=/bin/bash -c 'mkdir -p /home/${REACT_APP_NAME}/.npm && chown ${REACT_APP_NAME}:${REACT_APP_NAME} /home/${REACT_APP_NAME}/.npm'
ExecStartPre=/bin/bash -c 'cd ${REACT_APP_DIR} && npm run build'
ExecStart=/bin/bash -c 'cd ${REACT_APP_DIR} && exec npx serve -s dist -l ${REACT_APP_PORT}'
ExecReload=/bin/kill -HUP \$MAINPID
Restart=always
RestartSec=15
TimeoutStartSec=60
TimeoutStopSec=30
StandardOutput=journal
StandardError=journal
SyslogIdentifier=${REACT_APP_NAME}
KillMode=mixed
KillSignal=SIGTERM

# Security settings (relaxed for development)
NoNewPrivileges=false
PrivateTmp=false
ProtectSystem=false
ProtectHome=false
ReadWritePaths=${REACT_APP_DIR}
ReadWritePaths=/home/${REACT_APP_NAME}

[Install]
WantedBy=multi-user.target
EOF
        
        # Reload systemd and enable the service
        systemctl daemon-reload
        systemctl enable ${REACT_APP_NAME}
        
        log "ReactJS systemd service created and enabled"
    else
        log "ReactJS systemd service already exists"
        
        # Still reload daemon in case of changes
        systemctl daemon-reload
        
        # Ensure it's enabled
        if ! systemctl is-enabled ${REACT_APP_NAME} >/dev/null 2>&1; then
            log "Enabling ${REACT_APP_NAME} service..."
            systemctl enable ${REACT_APP_NAME}
        fi
    fi
    
    # Create WordPress systemd service file (PHP built-in server)
    if [[ ! -f "/etc/systemd/system/${WORDPRESS_APP_NAME}.service" ]] || ! grep -q "ExecStart=.*php -S" /etc/systemd/system/${WORDPRESS_APP_NAME}.service; then
        log "Creating WordPress PHP service..."
        
        cat > /etc/systemd/system/${WORDPRESS_APP_NAME}.service << EOF
[Unit]
Description=Abraham University WordPress Application
After=network.target php-fpm.service
Wants=network.target
Requires=php-fpm.service

[Service]
Type=simple
User=${WORDPRESS_APP_NAME}
Group=${WORDPRESS_APP_NAME}
WorkingDirectory=${WORDPRESS_APP_DIR}
Environment=WORDPRESS_DB_HOST=localhost
Environment=WORDPRESS_DB_NAME=wordpress
Environment=WORDPRESS_DB_USER=wordpress
Environment=WORDPRESS_DB_PASSWORD=wordpress_password
ExecStartPre=/bin/bash -c 'chown -R ${WORDPRESS_APP_NAME}:${WORDPRESS_APP_NAME} ${WORDPRESS_APP_DIR}'
ExecStartPre=/bin/bash -c 'chmod -R 755 ${WORDPRESS_APP_DIR}'
ExecStart=/usr/bin/php -S localhost:${WORDPRESS_APP_PORT} -t ${WORDPRESS_APP_DIR}
Restart=always
RestartSec=10
KillMode=mixed
KillSignal=SIGTERM
TimeoutStopSec=30
StandardOutput=journal
StandardError=journal
SyslogIdentifier=${WORDPRESS_APP_NAME}

[Install]
WantedBy=multi-user.target
EOF
        
        # Reload systemd and enable the service
        systemctl daemon-reload
        systemctl enable ${WORDPRESS_APP_NAME}
        
        log "WordPress systemd service created and enabled"
    else
        log "WordPress systemd service already exists"
        
        # Still reload daemon in case of changes
        systemctl daemon-reload
        
        # Ensure it's enabled
        if ! systemctl is-enabled ${WORDPRESS_APP_NAME} >/dev/null 2>&1; then
            log "Enabling ${WORDPRESS_APP_NAME} service..."
            systemctl enable ${WORDPRESS_APP_NAME}
        fi
    fi
}

# PM2 configuration function removed - using systemd services instead
# This function is kept for backward compatibility but does nothing
create_pm2_config() {
    log "PM2 configuration skipped - using systemd services for multi-app setup"
}

# Setup log rotation
setup_log_rotation() {
    # Check if log rotation is already configured
    if [[ ! -f "/etc/logrotate.d/abraham-university-multi-app" ]] || ! grep -q "/var/log/httpd/abraham-university_*.log" /etc/logrotate.d/abraham-university-multi-app; then
        log "Setting up log rotation..."
        
        cat > /etc/logrotate.d/abraham-university-multi-app << EOF
/var/log/${REACT_APP_NAME}/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 ${REACT_APP_NAME} ${REACT_APP_NAME}
    postrotate
        systemctl reload ${REACT_APP_NAME} > /dev/null 2>&1 || true
    endscript
}

/var/log/${WORDPRESS_APP_NAME}/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 ${WORDPRESS_APP_NAME} ${WORDPRESS_APP_NAME}
    postrotate
        systemctl reload ${WORDPRESS_APP_NAME} > /dev/null 2>&1 || true
    endscript
}

/var/log/httpd/abraham-university_*.log {
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
        log "Log rotation configured for multi-app setup"
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
        if [[ -f "${REACT_APP_DIR}/package.json" ]] && [[ -d "${REACT_APP_DIR}/node_modules" ]]; then
            log "Application already deployed in ${REACT_APP_DIR}"
            
            # Check if source has been updated (compare modification times)
            if [[ "package.json" -nt "${REACT_APP_DIR}/package.json" ]] || [[ "src" -nt "${REACT_APP_DIR}/src" ]] || [[ "$FORCE_DEPLOY_LOCAL" == true ]]; then
                log "Source files have been updated, redeploying..."
            else
                log "Application is up to date, skipping deployment"
                return
            fi
        fi
        
        log "Found React app in current directory, copying files..."
        
        # Copy application files
        cp -r . ${REACT_APP_DIR}/
        
        # Set proper ownership
        chown -R ${REACT_APP_NAME}:${REACT_APP_NAME} ${REACT_APP_DIR}
        
        # Install dependencies and build
        cd ${REACT_APP_DIR}
        
        # Check if node_modules exists and package.json hasn't changed (skip if force deploy)
        if [[ ! -d "node_modules" ]] || [[ "package.json" -nt "node_modules" ]] || [[ "$FORCE_DEPLOY_LOCAL" == true ]]; then
            log "Installing dependencies..."
            sudo -u ${REACT_APP_NAME} npm ci
        else
            log "Dependencies already installed and up to date"
        fi
        
        log "Application deployed successfully (serving source files directly)"
    else
        warn "No React app found in current directory. You'll need to deploy your app manually to ${REACT_APP_DIR}"
        warn "Make sure to run 'npm ci' after deploying your code"
    fi
}

# Fix common service issues
fix_service_issues() {
    log "Checking and fixing common service issues..."
    
    # Ensure proper ownership of ReactJS application directory
    if [[ -d "${REACT_APP_DIR}" ]]; then
        chown -R ${REACT_APP_NAME}:${REACT_APP_NAME} ${REACT_APP_DIR}
        chmod -R 755 ${REACT_APP_DIR}
    fi
    
    # Ensure proper ownership of WordPress application directory
    if [[ -d "${WORDPRESS_APP_DIR}" ]]; then
        chown -R ${WORDPRESS_APP_NAME}:${WORDPRESS_APP_NAME} ${WORDPRESS_APP_DIR}
        chmod -R 755 ${WORDPRESS_APP_DIR}
    fi
    
    # Ensure user home directories exist
    if [[ ! -d "/home/${REACT_APP_NAME}" ]]; then
        log "Creating home directory for ${REACT_APP_NAME}..."
        mkdir -p /home/${REACT_APP_NAME}
        chown ${REACT_APP_NAME}:${REACT_APP_NAME} /home/${REACT_APP_NAME}
        chmod 755 /home/${REACT_APP_NAME}
    fi
    
    if [[ ! -d "/home/${WORDPRESS_APP_NAME}" ]]; then
        log "Creating home directory for ${WORDPRESS_APP_NAME}..."
        mkdir -p /home/${WORDPRESS_APP_NAME}
        chown ${WORDPRESS_APP_NAME}:${WORDPRESS_APP_NAME} /home/${WORDPRESS_APP_NAME}
        chmod 755 /home/${WORDPRESS_APP_NAME}
    fi
    
    # Kill any existing processes on the ports
    if lsof -ti:${REACT_APP_PORT} >/dev/null 2>&1; then
        log "Killing existing processes on port ${REACT_APP_PORT}..."
        lsof -ti:${REACT_APP_PORT} | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
    
    if lsof -ti:${WORDPRESS_APP_PORT} >/dev/null 2>&1; then
        log "Killing existing processes on port ${WORDPRESS_APP_PORT}..."
        lsof -ti:${WORDPRESS_APP_PORT} | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
    
    # Clear any npm cache issues
    if [[ -d "${REACT_APP_DIR}" ]]; then
        cd ${REACT_APP_DIR}
        sudo -u ${REACT_APP_NAME} npm cache clean --force 2>/dev/null || true
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
    
    # Start PHP-FPM for WordPress
    if systemctl is-active php-fpm >/dev/null 2>&1; then
        log "PHP-FPM is already running"
    else
        log "Starting PHP-FPM..."
        systemctl start php-fpm
    fi
    
    # Start the ReactJS app service
    if [[ -f "${REACT_APP_DIR}/package.json" ]]; then
        # Stop service if running
        if systemctl is-active ${REACT_APP_NAME} >/dev/null 2>&1; then
            log "Stopping ${REACT_APP_NAME} service..."
            systemctl stop ${REACT_APP_NAME}
            sleep 2
        fi
        
        # Reload systemd daemon
        systemctl daemon-reload
        
        log "Starting ${REACT_APP_NAME} service..."
        systemctl start ${REACT_APP_NAME}
        
        # Wait for service to initialize
        sleep 3
        
        # Check service status
        if systemctl is-active --quiet ${REACT_APP_NAME}; then
            log "${REACT_APP_NAME} service started successfully"
        else
            warn "${REACT_APP_NAME} service failed to start"
            systemctl status ${REACT_APP_NAME} --no-pager --lines=5
        fi
    else
        warn "No ReactJS application found in ${REACT_APP_DIR}, skipping service start"
    fi
    
    # Start the WordPress app service
    if [[ -d "${WORDPRESS_APP_DIR}" ]]; then
        # Stop service if running
        if systemctl is-active ${WORDPRESS_APP_NAME} >/dev/null 2>&1; then
            log "Stopping ${WORDPRESS_APP_NAME} service..."
            systemctl stop ${WORDPRESS_APP_NAME}
            sleep 2
        fi
        
        log "Starting ${WORDPRESS_APP_NAME} service..."
        systemctl start ${WORDPRESS_APP_NAME}
        
        # Wait for service to initialize
        sleep 3
        
        # Check service status
        if systemctl is-active --quiet ${WORDPRESS_APP_NAME}; then
            log "${WORDPRESS_APP_NAME} service started successfully"
        else
            warn "${WORDPRESS_APP_NAME} service failed to start"
            systemctl status ${WORDPRESS_APP_NAME} --no-pager --lines=5
        fi
    else
        warn "No WordPress application found in ${WORDPRESS_APP_DIR}, skipping service start"
    fi
    
    log "Services started successfully"
}

# Quick fix for common service issues
quick_fix_service() {
    log "Applying quick fixes for common service issues..."
    
    # Stop the ReactJS service first
    if systemctl is-active --quiet ${REACT_APP_NAME}; then
        log "Stopping ${REACT_APP_NAME} service..."
        systemctl stop ${REACT_APP_NAME}
        sleep 2
    fi
    
    # Stop the WordPress service
    if systemctl is-active --quiet ${WORDPRESS_APP_NAME}; then
        log "Stopping ${WORDPRESS_APP_NAME} service..."
        systemctl stop ${WORDPRESS_APP_NAME}
        sleep 2
    fi
    
    # Kill any processes on the ports
    if lsof -ti:${REACT_APP_PORT} >/dev/null 2>&1; then
        log "Killing processes on port ${REACT_APP_PORT}..."
        lsof -ti:${REACT_APP_PORT} | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
    
    if lsof -ti:${WORDPRESS_APP_PORT} >/dev/null 2>&1; then
        log "Killing processes on port ${WORDPRESS_APP_PORT}..."
        lsof -ti:${WORDPRESS_APP_PORT} | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
    
    # Fix ownership and permissions for ReactJS
    if [[ -d "${REACT_APP_DIR}" ]]; then
        log "Fixing ReactJS ownership and permissions..."
        chown -R ${REACT_APP_NAME}:${REACT_APP_NAME} ${REACT_APP_DIR}
        chmod -R 755 ${REACT_APP_DIR}
    fi
    
    # Fix ownership and permissions for WordPress
    if [[ -d "${WORDPRESS_APP_DIR}" ]]; then
        log "Fixing WordPress ownership and permissions..."
        chown -R ${WORDPRESS_APP_NAME}:${WORDPRESS_APP_NAME} ${WORDPRESS_APP_DIR}
        chmod -R 755 ${WORDPRESS_APP_DIR}
    fi
    
    # Ensure home directories exist
    if [[ ! -d "/home/${REACT_APP_NAME}" ]]; then
        log "Creating ReactJS home directory..."
        mkdir -p /home/${REACT_APP_NAME}
        chown ${REACT_APP_NAME}:${REACT_APP_NAME} /home/${REACT_APP_NAME}
        chmod 755 /home/${REACT_APP_NAME}
    fi
    
    if [[ ! -d "/home/${WORDPRESS_APP_NAME}" ]]; then
        log "Creating WordPress home directory..."
        mkdir -p /home/${WORDPRESS_APP_NAME}
        chown ${WORDPRESS_APP_NAME}:${WORDPRESS_APP_NAME} /home/${WORDPRESS_APP_NAME}
        chmod 755 /home/${WORDPRESS_APP_NAME}
    fi
    
    # Create npm cache directory for ReactJS
    if [[ ! -d "/home/${REACT_APP_NAME}/.npm" ]]; then
        log "Creating npm cache directory..."
        mkdir -p /home/${REACT_APP_NAME}/.npm
        chown ${REACT_APP_NAME}:${REACT_APP_NAME} /home/${REACT_APP_NAME}/.npm
    fi
    
    # Clear npm cache
    if [[ -d "${REACT_APP_DIR}" ]]; then
        log "Clearing npm cache..."
        cd ${REACT_APP_DIR}
        sudo -u ${REACT_APP_NAME} npm cache clean --force 2>/dev/null || true
    fi
    
    # Reinstall dependencies if needed
    if [[ -f "${REACT_APP_DIR}/package.json" && ! -d "${REACT_APP_DIR}/node_modules" ]]; then
        log "Installing dependencies..."
        cd ${REACT_APP_DIR}
        sudo -u ${REACT_APP_NAME} npm ci
    fi
    
    # Reload systemd and restart services
    log "Reloading systemd and starting services..."
    systemctl daemon-reload
    systemctl start ${REACT_APP_NAME}
    systemctl start ${WORDPRESS_APP_NAME}
    
    # Wait and check
    sleep 5
    if systemctl is-active --quiet ${REACT_APP_NAME}; then
        log "ReactJS service started successfully!"
        systemctl status ${REACT_APP_NAME} --no-pager --lines=5
    else
        error "ReactJS service still not working. Run troubleshoot for more details."
        return 1
    fi
    
    if systemctl is-active --quiet ${WORDPRESS_APP_NAME}; then
        log "WordPress service started successfully!"
        systemctl status ${WORDPRESS_APP_NAME} --no-pager --lines=5
    else
        error "WordPress service still not working. Run troubleshoot for more details."
        return 1
    fi
}

# Troubleshoot service issues
troubleshoot_service() {
    log "Diagnosing service issues..."
    
    # Check if ReactJS service exists
    if ! systemctl list-unit-files | grep -q "${REACT_APP_NAME}.service"; then
        error "Service ${REACT_APP_NAME} does not exist. Run the setup script first."
        return 1
    fi
    
    # Check if WordPress service exists
    if ! systemctl list-unit-files | grep -q "${WORDPRESS_APP_NAME}.service"; then
        error "Service ${WORDPRESS_APP_NAME} does not exist. Run the setup script first."
        return 1
    fi
    
    # Check ReactJS service status
    log "ReactJS service status:"
    systemctl status ${REACT_APP_NAME} --no-pager --lines=10
    
    # Check WordPress service status
    log "WordPress service status:"
    systemctl status ${WORDPRESS_APP_NAME} --no-pager --lines=10
    
    # Check if ports are in use
    if lsof -ti:${REACT_APP_PORT} >/dev/null 2>&1; then
        log "Port ${REACT_APP_PORT} is in use by:"
        lsof -i:${REACT_APP_PORT}
    else
        warn "Port ${REACT_APP_PORT} is not in use"
    fi
    
    if lsof -ti:${WORDPRESS_APP_PORT} >/dev/null 2>&1; then
        log "Port ${WORDPRESS_APP_PORT} is in use by:"
        lsof -i:${WORDPRESS_APP_PORT}
    else
        warn "Port ${WORDPRESS_APP_PORT} is not in use"
    fi
    
    # Check ReactJS application directory
    if [[ -d "${REACT_APP_DIR}" ]]; then
        log "ReactJS application directory exists: ${REACT_APP_DIR}"
        log "Directory permissions:"
        ls -la ${REACT_APP_DIR} | head -10
        
        # Check if package.json exists
        if [[ -f "${REACT_APP_DIR}/package.json" ]]; then
            log "package.json found"
        else
            error "package.json not found in ${REACT_APP_DIR}"
        fi
        
        # Check node_modules
        if [[ -d "${REACT_APP_DIR}/node_modules" ]]; then
            log "node_modules directory exists"
        else
            warn "node_modules directory missing - run: cd ${REACT_APP_DIR} && sudo -u ${REACT_APP_NAME} npm ci"
        fi
    else
        error "ReactJS application directory does not exist: ${REACT_APP_DIR}"
    fi
    
    # Check WordPress application directory
    if [[ -d "${WORDPRESS_APP_DIR}" ]]; then
        log "WordPress application directory exists: ${WORDPRESS_APP_DIR}"
        log "Directory permissions:"
        ls -la ${WORDPRESS_APP_DIR} | head -10
    else
        error "WordPress application directory does not exist: ${WORDPRESS_APP_DIR}"
    fi
    
    # Check users
    if id "${REACT_APP_NAME}" >/dev/null 2>&1; then
        log "User ${REACT_APP_NAME} exists"
        log "User home directory: $(getent passwd ${REACT_APP_NAME} | cut -d: -f6)"
    else
        error "User ${REACT_APP_NAME} does not exist"
    fi
    
    if id "${WORDPRESS_APP_NAME}" >/dev/null 2>&1; then
        log "User ${WORDPRESS_APP_NAME} exists"
        log "User home directory: $(getent passwd ${WORDPRESS_APP_NAME} | cut -d: -f6)"
    else
        error "User ${WORDPRESS_APP_NAME} does not exist"
    fi
    
    # Test manual start
    log "Testing manual start..."
    if [[ -d "${REACT_APP_DIR}" && -f "${REACT_APP_DIR}/package.json" ]]; then
        log "You can test ReactJS manual start with:"
        log "  cd ${REACT_APP_DIR}"
        log "  sudo -u ${REACT_APP_NAME} npm run dev -- --host 0.0.0.0 --port ${REACT_APP_PORT}"
    fi
    
    if [[ -d "${WORDPRESS_APP_DIR}" ]]; then
        log "You can test WordPress manual start with:"
        log "  cd ${WORDPRESS_APP_DIR}"
        log "  sudo -u ${WORDPRESS_APP_NAME} php -S localhost:${WORDPRESS_APP_PORT}"
    fi
    
    # Show recent logs
    log "Recent ReactJS service logs (last 20 lines):"
    journalctl -u ${REACT_APP_NAME} -n 20 --no-pager
    
    log "Recent WordPress service logs (last 20 lines):"
    journalctl -u ${WORDPRESS_APP_NAME} -n 20 --no-pager
}

# Display final information
show_completion_info() {
    log "Setup completed successfully!"
    echo -e "${BLUE}"
    echo "==========================================="
    echo "  Abraham University Multi-App Setup"
    echo "==========================================="
    echo "ReactJS Directory: ${REACT_APP_DIR}"
    echo "WordPress Directory: ${WORDPRESS_APP_DIR}"
    echo "React App Port: ${REACT_APP_PORT}"
    echo "WordPress Port: ${WORDPRESS_APP_PORT}"
    echo "Apache Port: 80 (HTTP), 443 (HTTPS)"
    echo "Domain: ${DOMAIN}"
    echo "ReactJS Service: ${REACT_APP_NAME}"
    echo "WordPress Service: ${WORDPRESS_APP_NAME}"
    echo ""
    echo "Services Status:"
    echo "  - Apache HTTP Server: $(systemctl is-active httpd 2>/dev/null || echo 'inactive')"
    echo "  - PHP-FPM: $(systemctl is-active php-fpm 2>/dev/null || echo 'inactive')"
    echo "  - ReactJS App: $(systemctl is-active ${REACT_APP_NAME} 2>/dev/null || echo 'inactive')"
    echo "  - WordPress App: $(systemctl is-active ${WORDPRESS_APP_NAME} 2>/dev/null || echo 'inactive')"
    echo ""
    echo "URLs:"
    echo "  - Main Application (ReactJS): http://${DOMAIN}/"
    echo "  - WordPress Admin: http://${DOMAIN}/wp-admin/"
    echo "  - ReactJS Direct: http://localhost:${REACT_APP_PORT}/"
    echo "  - WordPress Direct: http://localhost:${WORDPRESS_APP_PORT}/"
    echo ""
    echo "Routing:"
    echo "  - /wp-admin/, /wp-content/, /wp-includes/, /wp-json/ → WordPress"
    echo "  - /wp-login.php, /xmlrpc.php → WordPress"
    echo "  - /api/ → ReactJS API"
    echo "  - All other requests → ReactJS (SPA routing)"
    echo ""
    echo "Useful Commands:"
    echo "  - Check Apache status: systemctl status httpd"
    echo "  - Check ReactJS status: systemctl status ${REACT_APP_NAME}"
    echo "  - Check WordPress status: systemctl status ${WORDPRESS_APP_NAME}"
    echo "  - View ReactJS logs: journalctl -u ${REACT_APP_NAME} -f"
    echo "  - View WordPress logs: journalctl -u ${WORDPRESS_APP_NAME} -f"
    echo "  - View Apache logs: tail -f /var/log/httpd/abraham-university_*.log"
    echo "  - Restart ReactJS: systemctl restart ${REACT_APP_NAME}"
    echo "  - Restart WordPress: systemctl restart ${WORDPRESS_APP_NAME}"
    echo "  - Restart Apache: systemctl restart httpd"
    echo ""
    echo "Configuration:"
    echo "  - ReactJS Mode: Production (built and served)"
    echo "  - WordPress Mode: PHP built-in server"
    echo "  - Reverse Proxy: Apache with intelligent routing"
    echo "  - SSL Support: Template ready (configure certificates)"
    echo ""
    echo "Next Steps:"
    echo "  1. Update DNS to point ${DOMAIN} to this server"
    echo "  2. Configure SSL certificates for HTTPS"
    echo "  3. Deploy your React application to ${REACT_APP_DIR}"
    echo "  4. Deploy your WordPress application to ${WORDPRESS_APP_DIR}"
    echo "  5. Test the setup by visiting http://${DOMAIN}"
    echo ""
    echo "Troubleshooting:"
    echo "  - If ReactJS fails: journalctl -u ${REACT_APP_NAME} -f"
    echo "  - If WordPress fails: journalctl -u ${WORDPRESS_APP_NAME} -f"
    echo "  - Port conflicts: lsof -ti:${REACT_APP_PORT} | xargs kill -9"
    echo "  - Test ReactJS directly: curl -I http://localhost:${REACT_APP_PORT}"
    echo "  - Test WordPress directly: curl -I http://localhost:${WORDPRESS_APP_PORT}"
    echo "  - Reset ReactJS permissions: chown -R ${REACT_APP_NAME}:${REACT_APP_NAME} ${REACT_APP_DIR}"
    echo "  - Reset WordPress permissions: chown -R ${WORDPRESS_APP_NAME}:${WORDPRESS_APP_NAME} ${WORDPRESS_APP_DIR}"
    echo "  - Run diagnostics: bash $0 --troubleshoot"
    echo "  - Quick fix service: bash $0 --fix"
    echo "=========================================="
    echo -e "${NC}"
}

# ============================================================================
# CLEANUP FUNCTIONS
# ============================================================================

# Handle .env file security concerns
handle_env_file_security() {
    local project_dir="$1"
    
    log "Reviewing .env files for security concerns..."
    
    local env_files=(
        "$project_dir/.env"
        "$project_dir/.env.production"
    )
    
    for env_file in "${env_files[@]}"; do
        if [[ -f "$env_file" ]]; then
            local env_name=$(basename "$env_file")
            log "Checking $env_name for sensitive information..."
            
            # Check for potentially sensitive keys
            local sensitive_patterns=(
                "API_KEY"
                "SECRET"
                "PASSWORD"
                "TOKEN"
                "PRIVATE"
            )
            
            local has_sensitive=false
            for pattern in "${sensitive_patterns[@]}"; do
                if grep -qi "$pattern" "$env_file"; then
                    has_sensitive=true
                    break
                fi
            done
            
            if [[ "$has_sensitive" == "true" ]]; then
                warn "Found potentially sensitive information in $env_name"
                
                # Create a template version without sensitive values
                local template_file="${env_file}.template"
                log "Creating template file: $(basename "$template_file")"
                
                # Backup original
                backup_config "$env_file" "$(basename "$env_file")_with_secrets"
                
                # Create template with placeholder values
                sed 's/=.*/=YOUR_VALUE_HERE/' "$env_file" > "$template_file"
                
                info "Security recommendations for $env_name:"
                echo "  1. Add $env_name to .gitignore if not already present"
                echo "  2. Use $(basename "$template_file") as a template for new deployments"
                echo "  3. Store actual secrets in environment variables or secure vault"
                echo "  4. Consider using different API keys for development vs production"
                
                # Check if .gitignore exists and add .env files if missing
                local gitignore_file="$project_dir/.gitignore"
                if [[ -f "$gitignore_file" ]]; then
                    if ! grep -q "^\.env$" "$gitignore_file"; then
                        echo ".env" >> "$gitignore_file"
                        log "Added .env to .gitignore"
                    fi
                    if ! grep -q "^\.env\.production$" "$gitignore_file"; then
                        echo ".env.production" >> "$gitignore_file"
                        log "Added .env.production to .gitignore"
                    fi
                else
                    warn ".gitignore not found. Consider creating one to exclude sensitive files."
                fi
            else
                success "No obvious sensitive information found in $env_name"
            fi
        fi
    done
}

# Clean up unnecessary scripts
cleanup_unnecessary_scripts() {
    log "Cleaning up unnecessary scripts and configurations..."
    
    local script_dir="/Users/edrayel/GitLab/abraham-university/abraham-university-reactjs-website"
    local scripts_to_remove=(
        "fix-service-issue.sh"
        "fix-systemd-service.sh"
        "diagnose-production.sh"
        "fix-production-build.sh"
        "test-node-version.sh"
        "validate-deployment.sh"
    )
    
    # Backup scripts before removal
    local cleanup_backup_dir="$CONFIG_BACKUP_DIR/removed_scripts_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$cleanup_backup_dir"
    
    for script in "${scripts_to_remove[@]}"; do
        local script_path="$script_dir/$script"
        if [[ -f "$script_path" ]]; then
            log "Backing up and removing: $script"
            cp "$script_path" "$cleanup_backup_dir/"
            rm -f "$script_path"
            success "Removed $script (backed up to $cleanup_backup_dir)"
        else
            info "Script not found (already removed): $script"
        fi
    done
    
    # Update references in documentation
    local docs_to_update=(
        "$script_dir/README-DEPLOYMENT.md"
        "$script_dir/DEPLOYMENT-FILES-SUMMARY.md"
        "$script_dir/PORT-CONFIGURATION.md"
    )
    
    for doc in "${docs_to_update[@]}"; do
        if [[ -f "$doc" ]]; then
            # Backup documentation before updating
            backup_config "$doc" "$(basename "$doc" .md)_cleanup"
            
            # Remove references to old scripts
            for script in "${scripts_to_remove[@]}"; do
                if grep -q "$script" "$doc"; then
                    log "Removing references to $script from $(basename "$doc")"
                    sed -i.bak "s/.*$script.*//g" "$doc"
                    # Remove empty lines created by sed
                    sed -i.bak '/^$/N;/^\n$/d' "$doc"
                fi
            done
        fi
    done
    
    # Clean up old systemd services and PM2 configurations
    local old_services=(
        "/etc/systemd/system/abraham-university.service"
        "/etc/systemd/system/pm2-abraham-university.service"
    )
    
    for service_file in "${old_services[@]}"; do
        if [[ -f "$service_file" ]]; then
            local service_name=$(basename "$service_file")
            log "Found old service: $service_name"
            
            # Stop and disable the service if it's running
            if systemctl is-active --quiet "$service_name" 2>/dev/null; then
                log "Stopping old service: $service_name"
                systemctl stop "$service_name" || true
            fi
            
            if systemctl is-enabled --quiet "$service_name" 2>/dev/null; then
                log "Disabling old service: $service_name"
                systemctl disable "$service_name" || true
            fi
            
            # Backup and remove the service file
            backup_config "$service_file" "old_$(basename "$service_file")"
            rm -f "$service_file"
            success "Removed old service: $service_name"
        fi
    done
    
    # Clean up old PM2 configurations
    local pm2_configs=(
        "/home/abraham-university/.pm2"
        "/var/www/abraham-university/ecosystem.config.js"
    )
    
    for config in "${pm2_configs[@]}"; do
        if [[ -e "$config" ]]; then
            log "Removing old PM2 configuration: $config"
            if [[ -f "$config" ]]; then
                backup_config "$config" "pm2_$(basename "$config")"
            fi
            rm -rf "$config"
        fi
    done
    
    # Reload systemd daemon after service file changes
    systemctl daemon-reload
    
    # Remove old cron jobs related to the applications
    if crontab -l 2>/dev/null | grep -q "abraham-university"; then
        log "Found old cron jobs, backing up and cleaning..."
        crontab -l > "$cleanup_backup_dir/old_crontab.bak"
        crontab -l | grep -v "abraham-university" | crontab -
        log "Cleaned up old cron jobs"
    fi
    
    # Clean up old log files that are no longer needed
    local old_log_patterns=(
        "/var/log/abraham-university-old*"
        "/var/log/pm2*abraham*"
        "/tmp/abraham-university*"
    )
    
    for pattern in "${old_log_patterns[@]}"; do
        if ls $pattern 2>/dev/null; then
            log "Cleaning up old log files: $pattern"
            rm -f $pattern
        fi
    done
    
    # Update port references from 10000 to 3000 in any remaining files
    log "Checking for remaining port 10000 references..."
    local files_with_old_port=$(find "$script_dir" -type f \( -name "*.sh" -o -name "*.md" -o -name "*.js" -o -name "*.json" \) -exec grep -l "10000" {} \; 2>/dev/null || true)
    
    if [[ -n "$files_with_old_port" ]]; then
        warn "Found files with old port 10000 references:"
        echo "$files_with_old_port"
        
        for file in $files_with_old_port; do
            if [[ -f "$file" ]]; then
                backup_config "$file" "$(basename "$file")_port_update"
                log "Updating port references in $(basename "$file")"
                sed -i.bak 's/10000/3000/g' "$file"
                rm -f "$file.bak"
            fi
        done
    fi
    
    # Handle .env file security concerns
    handle_env_file_security "$script_dir"
    
    success "Cleanup completed successfully"
    log "All removed files have been backed up to: $cleanup_backup_dir"
}

# Main execution
main() {
    log "Starting Abraham University Multi-App setup v${SCRIPT_VERSION}..."
    
    # Acquire lock to prevent concurrent executions
    acquire_lock
    
    # Parse command line arguments
    FORCE_UPDATE=false
    FORCE_DEPLOY=false
    VERIFY_ONLY=false
    ROLLBACK_MODE=false
    MONITOR_SETUP=false
    CLEANUP_MODE=false
    
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
            --verify)
                VERIFY_ONLY=true
                shift
                ;;
            --rollback)
                ROLLBACK_MODE=true
                shift
                ;;
            --setup-monitoring)
                MONITOR_SETUP=true
                shift
                ;;
            --cleanup)
                CLEANUP_MODE=true
                shift
                ;;
            --troubleshoot)
                check_root
                troubleshoot_service
                exit 0
                ;;
            --fix)
                check_root
                create_backup_dir
                auto_fix_issues
                quick_fix_service
                exit 0
                ;;
            --list-backups)
                check_root
                list_backups
                exit 0
                ;;
            --help|-h)
                echo "Usage: $0 [OPTIONS]"
                echo "Options:"
                echo "  --force-update      Force system package updates even if recently updated"
                echo "  --force-deploy      Force application redeployment even if up to date"
                echo "  --verify            Run comprehensive system verification only"
                echo "  --rollback          Interactive rollback from configuration backups"
                echo "  --setup-monitoring  Setup crash monitoring and auto-restart"
                echo "  --cleanup           Clean up unnecessary scripts and configurations"
                echo "  --troubleshoot      Run service diagnostics and troubleshooting"
                echo "  --fix               Apply quick fixes for common service issues"
                echo "  --list-backups      List available configuration backups"
                echo "  --help, -h          Show this help message"
                echo ""
                echo "Enhanced Features (v${SCRIPT_VERSION}):"
                echo "  - Systematic verification of existing server configuration"
                echo "  - Rollback/update capabilities for wrong configurations"
                echo "  - Configuration conflict resolution"
                echo "  - Separate app management (ReactJS with NodeJS, WordPress with PHP)"
                echo "  - Crash recovery and auto-restart mechanisms"
                echo "  - Comprehensive validation and troubleshooting"
                echo ""
                echo "This script sets up a multi-application environment with:"
                echo "  - ReactJS application on port ${REACT_APP_PORT}"
                echo "  - WordPress application on port ${WORDPRESS_APP_PORT}"
                echo "  - Apache reverse proxy with intelligent routing"
                echo "  - Systemd services for both applications"
                echo "  - Automated monitoring and crash recovery"
                exit 0
                ;;
        esac
    done
    
    check_root
    create_backup_dir
    
    # Handle special modes
    if [ "$VERIFY_ONLY" = true ]; then
        log "Running verification mode only..."
        run_system_verification
        exit $?
    fi
    
    if [ "$ROLLBACK_MODE" = true ]; then
        log "Entering rollback mode..."
        list_backups
        echo "Please specify the backup file and target file for rollback."
        echo "Usage: rollback_config <backup_file> <target_file>"
        exit 0
    fi
    
    if [ "$MONITOR_SETUP" = true ]; then
        log "Setting up monitoring only..."
        setup_crash_monitoring
        exit 0
    fi
    
    if [ "$CLEANUP_MODE" = true ]; then
        log "Running cleanup mode..."
        cleanup_unnecessary_scripts
        exit 0
    fi
    
    # Run comprehensive verification before setup
    log "Running pre-setup verification..."
    if ! run_system_verification; then
        warn "System verification found issues. Attempting to resolve..."
        resolve_port_conflicts
        resolve_config_conflicts
        auto_fix_issues
        
        # Re-run verification
        if ! run_system_verification; then
            error "Unable to resolve all system issues. Please review and fix manually, then re-run the script."
        fi
    fi
    
    # Pass force flags to functions that support them
    if [ "$FORCE_UPDATE" = true ]; then
        update_system --force-update
    else
        update_system
    fi
    
    install_apache
    install_php
    install_nodejs
    setup_app_directories
    configure_apache_vhost
    create_systemd_services
    setup_log_rotation
    
    if [ "$FORCE_DEPLOY" = true ]; then
        deploy_application --force-deploy
    else
        deploy_application
    fi
    
    start_services
    
    # Setup monitoring by default
    setup_crash_monitoring
    
    # Final health check
    log "Running post-setup health checks..."
    check_app_health "$REACT_APP_NAME" "$REACT_APP_PORT" "http://localhost:$REACT_APP_PORT"
    check_app_health "$WORDPRESS_APP_NAME" "$WORDPRESS_APP_PORT" "http://localhost:$WORDPRESS_APP_PORT"
    
    show_completion_info
}

# Run main function
main "$@"