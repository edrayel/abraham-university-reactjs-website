/**
 * Utility functions for managing preloader state
 * These functions help with testing and managing the first-visit experience
 */

/**
 * Clears the visit status from localStorage
 * This will cause the preloader to show again on next page load
 * Useful for testing the preloader experience
 */
export const clearVisitStatus = () => {
  localStorage.removeItem('abraham-university-visited');
  console.log('Visit status cleared. Refresh the page to see the preloader again.');
};

/**
 * Checks if the user has visited before
 * @returns {boolean} True if user has visited before, false otherwise
 */
export const hasUserVisited = () => {
  return localStorage.getItem('abraham-university-visited') === 'true';
};

/**
 * Marks the user as having visited
 * This will prevent the preloader from showing on subsequent visits
 */
export const markAsVisited = () => {
  localStorage.setItem('abraham-university-visited', 'true');
};

/**
 * Development helper function to test preloader
 * Call this in browser console: window.testPreloader()
 */
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  window.testPreloader = () => {
    clearVisitStatus();
    window.location.reload();
  };
  
  window.checkVisitStatus = () => {
    console.log('Has visited:', hasUserVisited());
  };
  
  console.log('Preloader utils loaded. Use window.testPreloader() to test the preloader or window.checkVisitStatus() to check visit status.');
}