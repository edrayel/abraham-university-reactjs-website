# Abraham University React + WordPress Integration

## Overview

This document explains how the Abraham University React frontend connects to the WordPress backend API. The integration allows the React application to consume data from custom WordPress API endpoints provided by the `abraham-api` plugin.

## Architecture

### Components

1. **WordPress Backend**
   - Located at: `/Users/edrayel/GitLab/abraham-university/abraham-university-wordpress/`
   - Custom plugins:
     - `abraham-api`: Provides custom REST API endpoints
     - `abraham-admin-ui`: Custom admin interface
     - `abraham-content-types`: Custom post types and taxonomies
     - `abraham-core`: Core functionality
     - `abraham-headless`: Headless WordPress configuration

2. **React Frontend**
   - Located at: `/Users/edrayel/GitLab/abraham-university/abraham-university-reactjs-website/`
   - Built with React, Vite, and Zustand for state management

## API Integration

### Configuration

The API configuration is centralized in `/src/config/api.js`. This file contains:

- Base URL for the WordPress API
- API namespace
- Endpoint URLs for all sections
- Default API request configuration

### API Service

The `/src/services/apiService.js` file provides a service layer for interacting with the WordPress API. It includes:

- Error handling
- Request timeout management
- Methods for each API endpoint

### State Management

Zustand stores in the `/src/stores/` directory manage application state and API data fetching:

- Each store corresponds to a section of the website (home, admissions, etc.)
- Stores use the apiService to fetch data from the WordPress API
- Data is cached and can be refreshed when needed

## Setup Instructions

### 1. Configure WordPress

Ensure the WordPress installation has the required plugins activated:

```bash
cd /Users/edrayel/GitLab/abraham-university/abraham-university-wordpress/
wp plugin activate abraham-api abraham-admin-ui abraham-content-types abraham-core abraham-headless
```

### 2. Configure API Endpoints

Update the API base URL in `/src/config/api.js` to point to your local WordPress installation:

```javascript
// Base URL for the WordPress API
const API_BASE_URL = 'http://localhost:8000/wp-json';
```

### 3. Start WordPress Server

Start the WordPress server using PHP's built-in server:

```bash
cd /Users/edrayel/GitLab/abraham-university/abraham-university-wordpress/
php -S localhost:8000
```

### 4. Start React Development Server

```bash
cd /Users/edrayel/GitLab/abraham-university/abraham-university-reactjs-website/
npm run dev
```

## Troubleshooting

### API Connection Issues

If you encounter API connection issues:

1. Verify the WordPress server is running
2. Check that the API base URL in `/src/config/api.js` is correct
3. Ensure the WordPress API endpoints are accessible by visiting:
   - `http://localhost:8000/wp-json/abraham/v1/home`
   - `http://localhost:8000/wp-json/abraham/v1/academics`
   - etc.

### CORS Issues

If you encounter CORS issues, add the following to your WordPress site's `.htaccess` file or use a CORS plugin:

```
# Allow CORS
<IfModule mod_headers.c>
  Header set Access-Control-Allow-Origin "*"
  Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
  Header set Access-Control-Allow-Headers "Content-Type"
</IfModule>
```

## Development Workflow

1. Make changes to WordPress content through the admin interface
2. The React frontend will fetch the updated content through the API
3. For development, both servers (WordPress and React) should be running simultaneously

## Production Deployment

For production:

1. Build the React application: `npm run build`
2. Deploy the WordPress site to your production server
3. Update the API base URL in the React build to point to the production WordPress API
4. Deploy the React build to your frontend hosting service