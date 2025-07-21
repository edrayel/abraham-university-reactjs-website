import { create } from "zustand";
import apiService from "../services/apiService";

/**
 * News Store
 * 
 * This store manages the state for news data fetched from the WordPress API.
 * It handles loading states, error handling, and caching of news articles and categories.
 */
const useNewsStore = create((set, get) => ({
  // State variables
  news: [],
  categories: [],
  totalArticles: 0,
  totalPages: 0,
  currentPage: 1,
  isLoading: false,
  error: null,
  timestamp: null,
  cacheDuration: 15 * 60 * 1000, // 15 minutes in milliseconds
  
  // Fetch news data with optional parameters
  fetchNewsData: async (params = {}) => {
    // Set loading state
    set({ isLoading: true, error: null });
    
    try {
      // Fetch news data from API
      const data = await apiService.getNewsData(params);
      
      // Update state with fetched data
      set({
        news: data.news || [],
        categories: data.categories || [],
        totalArticles: data.total || 0,
        totalPages: data.total_pages || 0,
        currentPage: data.current_page || 1,
        isLoading: false,
        error: null,
        timestamp: Date.now(),
      });
      
      return data;
    } catch (error) {
      // Handle error
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch news data'
      });
      throw error;
    }
  },

  // Fetch news by category
  fetchNewsByCategory: async (category) => {
    return get().fetchNewsData({ category });
  },
  
  // Search news
  searchNews: async (search) => {
    return get().fetchNewsData({ search });
  },
  
  // Fetch featured news
  fetchFeaturedNews: async () => {
    return get().fetchNewsData({ featured: true });
  },
  
  // Fetch news by page
  fetchNewsByPage: async (page) => {
    return get().fetchNewsData({ page });
  },
  
  // Utility methods
  clearNewsData: () => {
    set({
      news: [],
      categories: [],
      totalArticles: 0,
      totalPages: 0,
      currentPage: 1,
      error: null
    });
  },
  
  clearError: () => {
    set({ error: null });
  },
  
  // Check if cache is expired
  isCacheExpired: () => {
    const { timestamp, cacheDuration } = get();
    if (!timestamp) return true;
    return Date.now() - timestamp > cacheDuration;
  },
  
  // Get remaining cache time in seconds
  getRemainingCacheTime: () => {
    const { timestamp, cacheDuration } = get();
    if (!timestamp) return 0;
    const remaining = cacheDuration - (Date.now() - timestamp);
    return Math.max(0, Math.floor(remaining / 1000));
  },
  
  // Refresh data if cache is expired
  refreshIfExpired: async (params = {}) => {
    if (get().isCacheExpired()) {
      return get().fetchNewsData(params);
    }
    return { news: get().news, categories: get().categories };
  }
}));

export default useNewsStore;