# SystemD Service Troubleshooting Guide

## Issue Description

The `abraham-university.service` is experiencing the following problems:

1. **Exit-code failures**: The service fails with `exit-code` but then restarts successfully
2. **Obsolete syslog warnings**: SystemD warns about deprecated `StandardOutput=syslog` and `StandardError=syslog` settings
3. **Restart loop**: The service has restarted 72+ times, indicating recurring failures

## Root Causes

### 1. Obsolete Logging Configuration

The current systemd service uses deprecated logging settings:
```ini
StandardOutput=syslog
StandardError=syslog
```

These should be updated to:
```ini
StandardOutput=journal
StandardError=journal
```

### 2. Application Build Issues

The service may be failing because:
- The React application is not properly built (`dist` directory missing)
- Dependencies are not installed (`node_modules` missing)
- Build artifacts are outdated

### 3. Service Timing Issues

The service might be starting before the application is fully ready, causing initial failures followed by successful restarts.

## Solutions

### Quick Fix (Recommended)

Run the automated fix script on your server:

```bash
# Upload and run the fix script
sudo ./fix-systemd-service.sh
```

This script will:
1. Stop the current service
2. Backup the existing service file
3. Create an updated service file with modern logging
4. Ensure the application is properly built
5. Restart the service with proper configuration

### Manual Fix

If you prefer to fix manually:

#### Step 1: Stop the Service
```bash
sudo systemctl stop abraham-university
```

#### Step 2: Update Service File
Edit `/etc/systemd/system/abraham-university.service` and change:
```ini
# OLD (deprecated)
StandardOutput=syslog
StandardError=syslog

# NEW (modern)
StandardOutput=journal
StandardError=journal
```

#### Step 3: Ensure Application is Built
```bash
cd /opt/abraham-university
sudo -u abraham-university npm ci
sudo -u abraham-university npm run build
```

#### Step 4: Reload and Restart
```bash
sudo systemctl daemon-reload
sudo systemctl start abraham-university
sudo systemctl status abraham-university
```

## Monitoring and Verification

### Check Service Status
```bash
# Check if service is running
sudo systemctl status abraham-university

# Check if service is enabled
sudo systemctl is-enabled abraham-university

# Check if service is active
sudo systemctl is-active abraham-university
```

### Monitor Logs
```bash
# Follow live logs
sudo journalctl -u abraham-university -f

# View recent logs
sudo journalctl -u abraham-university -n 50

# View logs since last boot
sudo journalctl -u abraham-university -b
```

### Verify Application
```bash
# Check if application is responding
curl http://localhost:10000

# Check if dist directory exists
ls -la /opt/abraham-university/dist/

# Check application logs
tail -f /var/log/abraham-university/*.log
```

## Prevention

### 1. Use Updated Setup Script

The `setup-apache-proxy.sh` script has been updated to use modern systemd logging. When setting up new servers, use the latest version.

### 2. Regular Health Checks

Implement monitoring to catch service issues early:

```bash
# Add to crontab for regular health checks
*/5 * * * * systemctl is-active abraham-university >/dev/null || systemctl restart abraham-university
```

### 3. Proper Build Verification

Always verify the application is properly built before starting the service:

```bash
# Check build status
test -f /opt/abraham-university/dist/index.html && echo "Build OK" || echo "Build MISSING"
```

## Expected Behavior After Fix

1. **No more syslog warnings**: SystemD will use journal logging without deprecation warnings
2. **Stable service**: The service should start successfully without exit-code failures
3. **Proper logging**: All logs will be available via `journalctl` with proper formatting
4. **Reduced restarts**: The service should maintain stability without frequent restarts

## Troubleshooting Commands

```bash
# Service management
sudo systemctl status abraham-university
sudo systemctl restart abraham-university
sudo systemctl stop abraham-university
sudo systemctl start abraham-university

# Log analysis
sudo journalctl -u abraham-university --since "1 hour ago"
sudo journalctl -u abraham-university --grep="ERROR"
sudo journalctl -u abraham-university --no-pager -l

# Application debugging
cd /opt/abraham-university
sudo -u abraham-university npm run build
sudo -u abraham-university npm start  # Test manually

# System resources
top -p $(pgrep -f abraham-university)
df -h /opt/abraham-university
free -h
```

## Contact and Support

If issues persist after applying these fixes:

1. Collect logs: `sudo journalctl -u abraham-university --since "1 hour ago" > service-logs.txt`
2. Check system resources: `df -h && free -h && top -bn1`
3. Verify application files: `ls -la /opt/abraham-university/`
4. Test manual startup: `cd /opt/abraham-university && sudo -u abraham-university npm start`

The service should now run reliably without the exit-code failures and syslog warnings.