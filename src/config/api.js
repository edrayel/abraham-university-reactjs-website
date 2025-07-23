/**
 * API Configuration
 * 
 * This file contains the configuration for the Abraham University API endpoints.
 * It provides a centralized place to manage all API URLs and related settings.
 */

// WordPress base URL for content uploads
const WORDPRESS_BASE_URL = import.meta.env.VITE_WORDPRESS_BASE_URL;

// Base URL for the WordPress API (derived from WordPress base URL)
const API_BASE_URL = `${WORDPRESS_BASE_URL}/index.php/wp-json`;

// Abraham API namespace
const API_NAMESPACE = 'abraham/v1';

// Full base URL for Abraham API endpoints
const ABRAHAM_API_BASE = `${API_BASE_URL}/${API_NAMESPACE}`;

// API endpoints
const API_ENDPOINTS = {
  // Main sections
  HOME: `${ABRAHAM_API_BASE}/home`,
  ACADEMICS: `${ABRAHAM_API_BASE}/academics`,
  FACULTY: `${ABRAHAM_API_BASE}/faculty`,
  EVENTS: `${ABRAHAM_API_BASE}/events`,
  NEWS: `${ABRAHAM_API_BASE}/news`,
  LOCATIONS: `${ABRAHAM_API_BASE}/campus-locations`,
  GALLERY: `${ABRAHAM_API_BASE}/gallery`,
  AWARDS: `${ABRAHAM_API_BASE}/awards-application`,
  RESEARCH: `${ABRAHAM_API_BASE}/research`,
  CAMPUS_LIFE: `${ABRAHAM_API_BASE}/campus-life`,
  ADMISSIONS: `${ABRAHAM_API_BASE}/admissions`,
  SEARCH: `${ABRAHAM_API_BASE}/search`,
  ABOUT: `${ABRAHAM_API_BASE}/about`,
  CONTACT: `${ABRAHAM_API_BASE}/contact`,
  ALUMNI: `${ABRAHAM_API_BASE}/alumni`,
  GIVING: `${ABRAHAM_API_BASE}/giving`,
  VISIT: `${ABRAHAM_API_BASE}/visit`,
  PORTALS: `${ABRAHAM_API_BASE}/portals`,
  
  // WordPress standard endpoints (if needed)
  WP_POSTS: `${API_BASE_URL}/wp/v2/posts`,
  WP_PAGES: `${API_BASE_URL}/wp/v2/pages`,
  WP_MEDIA: `${API_BASE_URL}/wp/v2/media`,
};

// API configuration
const API_CONFIG = {
  // Default headers for API requests
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': import.meta.env.VITE_API_KEY,
  },
  
  // Default timeout for API requests (in milliseconds)
  timeout: 10000,
};

export { API_BASE_URL, API_NAMESPACE, ABRAHAM_API_BASE, API_ENDPOINTS, API_CONFIG, WORDPRESS_BASE_URL };