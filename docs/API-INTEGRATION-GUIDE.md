# Abraham University API Integration Guide

## Overview

This guide provides comprehensive documentation on how the Abraham University React frontend integrates with the WordPress backend API, including authentication, data fetching, and error handling.

## Architecture

The integration follows a service-oriented architecture:

1. **WordPress Backend**: Custom REST API endpoints built with the Abraham API plugin
2. **React Frontend**: Service layer that abstracts API communication

## API Authentication

### Authentication Method

The Abraham API uses API key authentication. Each request to the API must include a valid API key to access protected endpoints.

### WordPress Backend Configuration

The API key is stored in the WordPress database as an option:

```
abraham_api_keys: [{"key":"abraham-university-api-key","status":"active"}]
```

The API authentication is implemented in the `check_api_authentication` method in the `Abraham_API_Routes` class. It checks for the API key in:

1. The `Authorization` header (Bearer token)
2. The `X-API-Key` header
3. The `api_key` query parameter

### React Frontend Configuration

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

## API Service Layer

### Service Structure

The API service layer is implemented in `src/services/apiService.js`. It provides:

1. A central point for all API communication
2. Consistent error handling
3. Request timeout management
4. Automatic inclusion of authentication headers

### Core Functions

#### fetchWithTimeout

This function wraps the native `fetch` API with timeout and error handling:

```javascript
async function fetchWithTimeout(url, options = {}) {
  const { timeout = API_CONFIG.timeout } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  const defaultOptions = {
    ...options,
    headers: {
      ...API_CONFIG.headers,
      ...options.headers,
    },
    signal: controller.signal,
  };
  
  try {
    const response = await fetch(url, defaultOptions);
    clearTimeout(id);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}
```

#### Endpoint-Specific Methods

The service provides methods for each API endpoint:

```javascript
const apiService = {
  getHomeData: () => fetchWithTimeout(API_ENDPOINTS.HOME),
  getAcademicsData: () => fetchWithTimeout(API_ENDPOINTS.ACADEMICS),
  getFacultyData: () => fetchWithTimeout(API_ENDPOINTS.FACULTY),
  // ... other endpoints
};
```

## State Management Integration

The API service is integrated with Zustand stores for state management:

```javascript
// Example from homeStore.js
import apiService from "../services/apiService";

const fetchAllData = async () => {
  try {
    set({ isLoading: true, error: null });
    const data = await apiService.getHomeData();
    set({ data, isLoading: false, lastFetched: new Date() });
  } catch (error) {
    set({ error: error.message, isLoading: false });
  }
};
```

## Development Tools

### API Status Indicator

The `ApiStatusIndicator` component provides a visual indicator of the API connection status, including authentication:

```jsx
// src/components/ui/ApiStatusIndicator.jsx
const ApiStatusIndicator = ({ endpoint = API_ENDPOINTS.HOME, interval = 60000 }) => {
  // ... state and logic
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3">
      {/* Status indicators */}
    </div>
  );
};
```

### API Test Page

The `/api-test` route provides a comprehensive test of all API endpoints:

```jsx
// src/pages/ApiTest.jsx
const ApiTest = () => {
  // ... state and logic
  
  useEffect(() => {
    const testAllEndpoints = async () => {
      // Test each endpoint and record results
    };
    
    testAllEndpoints();
  }, []);
  
  return (
    <div className="container mx-auto p-4">
      {/* Test results display */}
    </div>
  );
};
```

## Error Handling

### Common Error Types

1. **Network Errors**: Connection issues, timeouts
2. **Authentication Errors**: Invalid or missing API key
3. **Server Errors**: 500-level errors from the WordPress backend
4. **Client Errors**: 400-level errors, often due to invalid requests

### Error Handling Strategy

1. **Service Layer**: Catches and transforms errors into a consistent format
2. **Store Layer**: Stores error state and provides error information to components
3. **UI Layer**: Displays appropriate error messages to users

## Best Practices

1. **Always use the apiService**: Never make direct fetch calls to API endpoints
2. **Handle errors gracefully**: Display user-friendly error messages
3. **Implement loading states**: Show loading indicators during API requests
4. **Cache responses**: Avoid unnecessary API calls for data that doesn't change frequently
5. **Test API integration**: Use the API test page to verify all endpoints are working

## Security Considerations

1. **API Key Protection**: In a production environment, the API key should not be exposed in client-side code
2. **HTTPS**: Always use HTTPS in production to encrypt API requests
3. **Rate Limiting**: Implement rate limiting on the server to prevent abuse
4. **Input Validation**: Validate all user input before sending it to the API

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Check that the API key is correctly configured in both the WordPress backend and React frontend
2. **CORS Errors**: Ensure the WordPress backend has proper CORS headers configured. The Abraham API plugin should include the following headers:
   ```php
   header('Access-Control-Allow-Origin: *'); // Or specific origin
   header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
   header('Access-Control-Allow-Credentials: true');
   header('Access-Control-Allow-Headers: Authorization, Content-Type, X-API-Key');
   ```
   If you're experiencing CORS issues, verify that the `X-API-Key` header is included in the `Access-Control-Allow-Headers` list.
3. **Timeout Errors**: Check network connectivity and server response times

### Debugging Tools

1. **Browser Developer Tools**: Check the Network tab for API requests and responses
2. **API Status Indicator**: Use the status indicator to check API connectivity
3. **API Test Page**: Test individual endpoints to isolate issues

## Future Improvements

1. **JWT Authentication**: Implement more secure authentication using JSON Web Tokens
2. **Request Caching**: Implement a more sophisticated caching strategy
3. **Offline Support**: Add offline capabilities using service workers
4. **GraphQL**: Consider migrating to GraphQL for more efficient data fetching