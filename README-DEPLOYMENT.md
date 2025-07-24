# Abraham University ReactJS Website - Deployment Guide

This guide covers the deployment setup for the Abraham University ReactJS website using GitHub Actions and Apache reverse proxy on AlmaLinux 9.

## Overview

The deployment architecture consists of:
- **React Application**: Runs on port 3000 (configurable)
- **Apache HTTP Server**: Acts as reverse proxy on ports 80/443
- **GitHub Actions**: Automated CI/CD pipeline
- **AlmaLinux 9**: Target server operating system

## Quick Start

### 1. Server Setup (AlmaLinux 9)

```bash
# Clone the repository
git clone <repository-url>
cd abraham-university-reactjs-website

# Make the setup script executable
chmod +x setup-apache-proxy.sh

# Run the setup script as root
sudo ./setup-apache-proxy.sh
```

### 2. GitHub Actions Setup

1. **Configure Repository Secrets** in your GitHub repository settings:
   ```
   SERVER_HOST=your-server-ip-or-domain
   SERVER_USER=your-ssh-username
   SERVER_SSH_KEY=your-private-ssh-key
   SERVER_PORT=22 (optional, defaults to 22)
   PRODUCTION_URL=https://your-domain.com (optional)
   ```

2. **Push to main/master branch** to trigger the deployment pipeline

## Detailed Setup

### Apache Reverse Proxy Configuration

The setup script configures Apache to:
- Listen on port 80 (HTTP) and optionally 443 (HTTPS)
- Forward requests to the React app running on port 3000
- Handle static file serving for optimal performance
- Include security headers and compression
- Support WebSocket connections for development

#### Key Configuration Files:
- `/etc/httpd/conf.d/abraham-university.conf` - Virtual host configuration
- `/etc/systemd/system/abraham-university-react.service` - ReactJS systemd service
- `/etc/systemd/system/abraham-university-wordpress.service` - WordPress systemd service
- `/var/www/abraham-university/ecosystem.config.js` - PM2 configuration

### GitHub Actions Workflow

The CI/CD pipeline includes:

#### 1. **Test Job**
- Runs on Node.js 20.x and 22.x
- Installs dependencies with `npm ci`
- Runs linting with ESLint
- Executes tests (if available)
- Builds the application
- Uploads build artifacts

#### 2. **Deploy Job**
- Runs only on main/master branch
- Downloads build artifacts
- Deploys via SSH to the target server
- Restarts application and Apache services

#### 3. **Security Scan Job**
- Runs `npm audit` for vulnerability checking
- Reports security issues

#### 4. **Lighthouse Job**
- Performs performance testing
- Generates accessibility and SEO reports
- Uploads results for review

## Manual Deployment

If you prefer manual deployment:

```bash
# On the server
cd /var/www/abraham-university

# Pull latest changes
git pull origin main

# Install dependencies
npm ci --production

# Build the application
npm run build

# Restart services
sudo systemctl restart abraham-university
sudo systemctl reload httpd
```

## Configuration

### Environment Variables

Create or modify `.env.production` for production settings:

```env
NODE_ENV=production
PORT=3000
VITE_API_BASE_URL=https://abrahamuniversity.us/wp-json/wp/v2
VITE_WP_SITE_URL=https://abrahamuniversity.us
```

### Apache Virtual Host Customization

Edit `/etc/httpd/conf.d/abraham-university.conf` to:
- Change the domain name
- Configure SSL certificates
- Adjust proxy settings
- Modify security headers

### Systemd Service Configuration

The applications run as separate systemd services:
- ReactJS: `/etc/systemd/system/abraham-university-react.service`
- WordPress: `/etc/systemd/system/abraham-university-wordpress.service`

```bash
# Service management commands
sudo systemctl start abraham-university
sudo systemctl stop abraham-university
sudo systemctl restart abraham-university
sudo systemctl status abraham-university
```

## SSL/HTTPS Setup

### Using Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo dnf install -y certbot python3-certbot-apache

# Obtain SSL certificate
sudo certbot --apache -d abrahamuniversity.us -d www.abrahamuniversity.us

# Auto-renewal setup
sudo systemctl enable --now certbot-renew.timer
```

### Manual SSL Certificate

1. Place your SSL certificate files:
   - Certificate: `/etc/ssl/certs/your-domain.crt`
   - Private Key: `/etc/ssl/private/your-domain.key`

2. Uncomment and configure the HTTPS virtual host in `/etc/httpd/conf.d/abraham-university.conf`

3. Restart Apache: `sudo systemctl restart httpd`

## Monitoring and Logs

### Application Logs
```bash
# View application logs
sudo journalctl -u abraham-university -f

# View PM2 logs (if using PM2)
sudo -u abraham-university pm2 logs
```

### Apache Logs
```bash
# Access logs
sudo tail -f /var/log/httpd/abraham-university_access.log

# Error logs
sudo tail -f /var/log/httpd/abraham-university_error.log
```

### System Monitoring
```bash
# Check service status
sudo systemctl status abraham-university httpd

# Check port usage
sudo netstat -tlnp | grep -E ':(80|443|3000)'

# Check disk usage
df -h /var/www/abraham-university
```

## Troubleshooting

### Common Issues

#### 1. **Service Won't Start**

1. Use the enhanced troubleshooting tools:
   ```bash
   sudo ./setup-apache-proxy.sh --troubleshoot
   ```

2. Apply automatic fixes:
   ```bash
   sudo ./setup-apache-proxy.sh --fix
   ```

3. Check service status:
   ```bash
   sudo systemctl status abraham-university-react
   sudo systemctl status abraham-university-wordpress
   ```

4. Check logs:
   ```bash
   sudo journalctl -u abraham-university-react -f
   sudo journalctl -u abraham-university-wordpress -f
   ```

5. Check if ports are in use:
   ```bash
   sudo netstat -tlnp | grep :3000
   sudo netstat -tlnp | grep :8000
   ```

6. Manual restart with recovery:
   ```bash
   sudo systemctl restart abraham-university-react
   sudo systemctl restart abraham-university-wordpress
   ```

7. Verify file permissions:
   ```bash
   ls -la /var/www/abraham-university
   ```

#### 2. **Apache Proxy Errors**
```bash
# Test Apache configuration
sudo httpd -t

# Check Apache error logs
sudo tail -f /var/log/httpd/error_log

# Verify proxy modules are loaded
sudo httpd -M | grep proxy
```

#### 3. **Build Failures**
```bash
# Check Node.js version
node --version
npm --version

# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. **Permission Issues**
```bash
# Fix ownership
sudo chown -R abraham-university:abraham-university /var/www/abraham-university

# Fix permissions
sudo chmod -R 755 /var/www/abraham-university
sudo chmod -R 644 /var/www/abraham-university/dist/*
```

### Performance Optimization

#### 1. **Enable Gzip Compression**
Already configured in the Apache virtual host.

#### 2. **Static File Caching**
```apache
# Add to virtual host configuration
<LocationMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
</LocationMatch>
```

#### 3. **PM2 Cluster Mode**
The ecosystem.config.js is configured for cluster mode to utilize all CPU cores.

## Security Considerations

### 1. **Firewall Configuration**
```bash
# Allow only necessary ports
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload
```

### 2. **Regular Updates**
```bash
# Update system packages
sudo dnf update -y

# Update Node.js dependencies
npm audit fix
```

### 3. **Backup Strategy**
```bash
# Backup application directory
sudo tar -czf /backup/abraham-university-$(date +%Y%m%d).tar.gz /var/www/abraham-university

# Backup Apache configuration
sudo cp /etc/httpd/conf.d/abraham-university.conf /backup/
```

## Support

For issues and questions:
1. Check the application logs
2. Review this documentation
3. Check GitHub Issues
4. Contact the development team

## Additional Resources

- [Apache HTTP Server Documentation](https://httpd.apache.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [AlmaLinux Documentation](https://wiki.almalinux.org/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)