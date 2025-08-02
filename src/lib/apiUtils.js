/**
 * API Utilities
 * 
 * This file contains utility functions for working with the Abraham University API.
 * It provides helpers for caching, error handling, and data transformation.
 */

/**
 * Check if a cache is expired based on timestamp and duration
 * 
 * @param {number} timestamp - The timestamp when the cache was created (in seconds)
 * @param {number} cacheDuration - The duration the cache should be valid (in seconds)
 * @returns {boolean} - True if the cache is expired, false otherwise
 */
export function isCacheExpired(timestamp, cacheDuration) {
  if (!timestamp || !cacheDuration) return true;
  
  const now = Math.floor(Date.now() / 1000);
  return (now - timestamp) > cacheDuration;
}

/**
 * Get the remaining cache time in seconds
 * 
 * @param {number} timestamp - The timestamp when the cache was created (in seconds)
 * @param {number} cacheDuration - The duration the cache should be valid (in seconds)
 * @returns {number} - The remaining cache time in seconds (0 if expired)
 */
export function getRemainingCacheTime(timestamp, cacheDuration) {
  if (!timestamp || !cacheDuration) return 0;
  
  const now = Math.floor(Date.now() / 1000);
  const elapsed = now - timestamp;
  return Math.max(0, cacheDuration - elapsed);
}

/**
 * Format an API error message for display
 * 
 * @param {Error} error - The error object
 * @returns {string} - A formatted error message
 */
export function formatApiError(error) {
  if (!error) return 'Unknown error';
  
  // Handle AbortError (timeout)
  if (error.name === 'AbortError') {
    return 'Request timed out. Please try again.';
  }
  
  // Handle network errors
  if (!navigator.onLine) {
    return 'You are offline. Please check your internet connection.';
  }
  
  // Handle API errors with status codes
  if (error.message && error.message.includes('API error:')) {
    const statusMatch = error.message.match(/API error: (\d+)/);
    if (statusMatch && statusMatch[1]) {
      const status = parseInt(statusMatch[1]);
      
      switch (status) {
        case 401:
          return 'Authentication required. Please log in.';
        case 403:
          return 'You do not have permission to access this resource.';
        case 404:
          return 'The requested resource was not found.';
        case 500:
          return 'The server encountered an error. Please try again later.';
        default:
          return `Server error (${status}). Please try again later.`;
      }
    }
  }
  
  // Default error message
  return error.message || 'An error occurred. Please try again.';
}

/**
 * Safely access nested properties in an API response
 * 
 * @param {Object} obj - The object to access
 * @param {string} path - The path to the property (e.g., 'user.profile.name')
 * @param {any} defaultValue - The default value to return if the property doesn't exist
 * @returns {any} - The property value or the default value
 */
export function safeGet(obj, path, defaultValue = null) {
  if (!obj || !path) return defaultValue;
  
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined || typeof result !== 'object') {
      return defaultValue;
    }
    
    result = result[key];
  }
  
  return result !== undefined ? result : defaultValue;
}

/**
 * Transform an API response to match the expected format
 * 
 * @param {Object} data - The API response data
 * @param {Object} mapping - The mapping of API fields to expected fields
 * @returns {Object} - The transformed data
 */
export function transformApiResponse(data, mapping) {
  if (!data || !mapping) return {};
  
  const result = {};
  
  for (const [targetKey, sourcePath] of Object.entries(mapping)) {
    result[targetKey] = safeGet(data, sourcePath);
  }
  
  return result;
}