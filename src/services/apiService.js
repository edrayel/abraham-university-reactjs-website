/**
 * API Service
 * 
 * This service provides methods to interact with the Abraham University API.
 * It handles common API operations like fetching data, error handling, and caching.
 */

import { API_ENDPOINTS, API_CONFIG } from '../config/api';

/**
 * Fetch data from the API with error handling and timeout
 * 
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<any>} - The response data
 */
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

/**
 * API Service object with methods for each endpoint
 */
const apiService = {
  /**
   * Get home page data
   * @returns {Promise<Object>} Home page data
   */
  getHomeData: () => fetchWithTimeout(API_ENDPOINTS.HOME),
  
  /**
   * Get academics data
   * @returns {Promise<Object>} Academics data
   */
  getAcademicsData: () => fetchWithTimeout(API_ENDPOINTS.ACADEMICS),
  
  /**
   * Get faculty data
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Faculty data
   */
  getFacultyData: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_ENDPOINTS.FACULTY}${queryParams ? `?${queryParams}` : ''}`;
    return fetchWithTimeout(url);
  },
  
  /**
   * Get events data
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Events data
   */
  getEventsData: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_ENDPOINTS.EVENTS}${queryParams ? `?${queryParams}` : ''}`;
    return fetchWithTimeout(url);
  },
  
  /**
   * Get news data
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} News data
   */
  getNewsData: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_ENDPOINTS.NEWS}${queryParams ? `?${queryParams}` : ''}`;
    return fetchWithTimeout(url);
  },
  
  /**
   * Get campus locations data
   * @returns {Promise<Object>} Campus locations data
   */
  getLocationsData: () => fetchWithTimeout(API_ENDPOINTS.LOCATIONS),
  
  /**
   * Get gallery data
   * @returns {Promise<Object>} Gallery data
   */
  getGalleryData: () => fetchWithTimeout(API_ENDPOINTS.GALLERY),
  
  /**
   * Get awards application data
   * @returns {Promise<Object>} Awards application data
   */
  getAwardsData: () => fetchWithTimeout(API_ENDPOINTS.AWARDS),
  
  /**
   * Get research data
   * @returns {Promise<Object>} Research data
   */
  getResearchData: () => fetchWithTimeout(API_ENDPOINTS.RESEARCH),
  
  /**
   * Get campus life data
   * @returns {Promise<Object>} Campus life data
   */
  getCampusLifeData: () => fetchWithTimeout(API_ENDPOINTS.CAMPUS_LIFE),
  
  /**
   * Get admissions data
   * @returns {Promise<Object>} Admissions data
   */
  getAdmissionsData: () => fetchWithTimeout(API_ENDPOINTS.ADMISSIONS),
  
  /**
   * Search the website
   * @param {string} query - Search query
   * @returns {Promise<Object>} Search results
   */
  search: (query) => {
    const params = new URLSearchParams({ q: query }).toString();
    return fetchWithTimeout(`${API_ENDPOINTS.SEARCH}?${params}`);
  },
  
  /**
   * Get about page data
   * @returns {Promise<Object>} About page data
   */
  getAboutData: () => fetchWithTimeout(API_ENDPOINTS.ABOUT),
  
  /**
   * Get contact page data
   * @returns {Promise<Object>} Contact page data
   */
  getContactData: () => fetchWithTimeout(API_ENDPOINTS.CONTACT),
  
  /**
   * Get alumni page data
   * @returns {Promise<Object>} Alumni page data
   */
  getAlumniData: () => fetchWithTimeout(API_ENDPOINTS.ALUMNI),
  
  /**
   * Get giving page data
   * @returns {Promise<Object>} Giving page data
   */
  getGivingData: () => fetchWithTimeout(API_ENDPOINTS.GIVING),

  /**
   * Get visit page data
   * @returns {Promise<Object>} Visit page data
   */
  getVisitData: () => fetchWithTimeout(API_ENDPOINTS.VISIT),

  /**
   * Get portals page data
   * @returns {Promise<Object>} Portals page data
   */
  getPortalsData: () => fetchWithTimeout(API_ENDPOINTS.PORTALS),
};

export default apiService;