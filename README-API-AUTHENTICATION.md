# API Authentication Guide

## Overview

This document explains how the Abraham University React frontend authenticates with the WordPress backend API.

## Authentication Method

The Abraham API uses API key authentication. Each request to the API must include a valid API key to access protected endpoints.

## API Key Configuration

### WordPress Backend

The API key is stored in the WordPress database as an option:

```
abraham_api_keys: [{"key":"abraham-university-api-key","status":"active"}]
```

The API authentication is implemented in the `check_api_authentication` method in the `Abraham_API_Routes` class. It checks for the API key in:

1. The `Authorization` header (Bearer token)
2. The `X-API-Key` header
3. The `api_key` query parameter

### React Frontend

In the React application, the API key is configured in the `src/config/api.js` file:

```javascript
// API configuration
const API_CONFIG = {
  // Default headers for API requests
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'abraham-university-api-key',
  },
  
  // Default timeout for API requests (in milliseconds)
  timeout: 10000,
};
```

The `apiService.js` file uses this configuration to include the API key in all requests:

```javascript
const defaultOptions = {
  ...options,
  headers: {
    ...API_CONFIG.headers,
    ...options.headers,
  },
  signal: controller.signal,
};
```

## Testing API Authentication

You can test the API authentication by visiting the `/api-test` route in the React application. This page attempts to fetch data from various API endpoints and displays the results.

## Troubleshooting

If you encounter authentication errors:

1. Verify that the API key in the React configuration matches the one in the WordPress database
2. Check that the WordPress API plugin is properly configured to use API key authentication
3. Ensure the API endpoints are properly registered with the `permission_callback` set to `check_api_authentication`
4. Check the browser console for specific error messages

### CORS Configuration

For the API key to be properly sent in cross-origin requests, the WordPress backend must be configured to accept the `X-API-Key` header. This is done in the `add_cors_headers` method in the `Abraham_API` class:

```php
header('Access-Control-Allow-Origin: ' . $allowed_origin);
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Authorization, Content-Type, X-API-Key');
```

If you encounter CORS errors when sending the API key, verify that the `X-API-Key` header is included in the `Access-Control-Allow-Headers` list.

## Security Considerations

- The API key should be treated as a secret and not exposed in client-side code in a production environment
- For production, consider implementing a more secure authentication method such as OAuth 2.0 or JWT
- Consider implementing rate limiting to prevent abuse