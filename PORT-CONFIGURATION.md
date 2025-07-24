# Port Configuration Guide

## Overview

The Abraham University ReactJS application has been updated to run on **port 3000** by default, with full support for custom port configuration via environment variables.

## Default Configuration

- **Development Server**: Port 3000
- **Production Server**: Port 3000
- **Preview Server**: Port 3000

## Configuration Files Updated

### 1. `vite.config.js`
```javascript
const port = process.env.PORT || 3000;
```

### 2. `package.json`
```json
{
  "scripts": {
    "start": "vite preview --host 0.0.0.0 --port 3000",
    "serve": "vite preview --host 0.0.0.0 --port 3000"
  }
}
```

### 3. `.env.production`
```env
PORT=3000
```

### 4. `setup-apache-proxy.sh`
```bash
REACT_APP_PORT="3000"
```

## Using Custom Ports

### Method 1: Environment Variable (Recommended)

```bash
# Development server on custom port
PORT=4000 npm run dev

# Production preview on custom port
PORT=8000 npm run start

# Build and serve on custom port
npm run build && PORT=5000 npm run start
```

### Method 2: Vite CLI Arguments

```bash
# Development server with CLI argument
npm run dev -- --port 4000

# Preview server with CLI argument
npm run preview -- --port 8000
```

### Method 3: Modify Environment Files

**For Development:**
Create or modify `.env.local`:
```env
PORT=4000
```

**For Production:**
Modify `.env.production`:
```env
PORT=8000
```

## Examples

### Running Multiple Instances

```bash
# Terminal 1: Main development server
npm run dev
# Runs on http://localhost:3000

# Terminal 2: Testing server
PORT=4000 npm run dev
# Runs on http://localhost:4000

# Terminal 3: Production preview
npm run build && PORT=5000 npm run start
# Runs on http://localhost:5000
```

### Docker Configuration

```dockerfile
# Dockerfile example
FROM node:18-alpine

# Set custom port
ENV PORT=8000

# Expose the port
EXPOSE 8000

# Start the application
CMD ["npm", "run", "start"]
```

### Production Deployment

```bash
# On production server
cd /var/www/abraham-university

# Set custom port for production
echo "PORT=3000" >> .env.production

# Restart the service
sudo systemctl restart abraham-university
```

## Apache Proxy Configuration

When using a custom port, update the Apache configuration:

```apache
# /etc/httpd/conf.d/abraham-university.conf
<VirtualHost *:80>
    ServerName abrahamuniversity.us
    
    # Update proxy target to match your custom port
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
    
    # For custom port (e.g., 4000)
    # ProxyPass / http://localhost:4000/
    # ProxyPassReverse / http://localhost:4000/
</VirtualHost>
```

## Troubleshooting

### Port Already in Use

```bash
# Check what's using the port
lsof -i :3000

# Kill process using the port
sudo kill -9 $(lsof -t -i:3000)

# Or use a different port
PORT=3001 npm run dev
```

### Environment Variable Not Working

```bash
# Verify environment variable is set
echo $PORT

# Check if .env files are being loaded
cat .env.local
cat .env.production

# Clear npm cache and restart
npm cache clean --force
PORT=4000 npm run dev
```

### Service Configuration Issues

```bash
# Check systemd service configuration
sudo systemctl cat abraham-university

# Update service file if needed
sudo systemctl edit abraham-university

# Add environment variable:
# [Service]
# Environment=PORT=3000

# Reload and restart
sudo systemctl daemon-reload
sudo systemctl restart abraham-university
```

## Testing Port Configuration

Use the provided test script:

```bash
# Make executable and run
chmod +x test-port-override.sh
./test-port-override.sh
```

## Best Practices

1. **Use Environment Variables**: Always prefer `PORT` environment variable over hardcoded values
2. **Document Custom Ports**: Update documentation when using non-standard ports
3. **Firewall Configuration**: Ensure custom ports are allowed through firewall
4. **Load Balancer Updates**: Update load balancer/proxy configurations for custom ports
5. **Monitoring**: Update monitoring tools to check custom ports

## Migration from Port 10000

If you were previously using port 10000:

1. **Update Environment Files**: Change `PORT=10000` to `PORT=3000`
2. **Update Apache Config**: Change proxy targets from `:10000` to `:3000`
3. **Update Monitoring**: Change port monitoring from 10000 to 3000
4. **Update Firewall**: Allow port 3000 and optionally remove port 10000
5. **Update Documentation**: Update any custom documentation

```bash
# Quick migration script
sed -i 's/10000/3000/g' .env.production
sudo sed -i 's/:10000/:3000/g' /etc/httpd/conf.d/abraham-university.conf
sudo systemctl restart httpd abraham-university
```

## Support

For port configuration issues:
1. Check this documentation
2. Verify environment variables
3. Test with the provided test script
4. Check application and system logs
5. Contact the development team