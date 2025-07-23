import { create } from "zustand";
import apiService from "../services/apiService"; 

const useProgramsStore = create((set, get) => ({
  // State variables for JSON response objects
  programs: [],
  schools: [],
  categories: [],
  requirements: [],
  applicationDeadlines: [],
  timestamp: null,
  cacheDuration: null,

  // Loading state
  isLoading: false,

  // Error state
  error: null,

  // Fetch all data
  fetchAllData: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await apiService.getAcademicsData();

      set({
        programs: data.programs || [],
        schools: data.schools || [],
        categories: data.categories || [],
        requirements: data.requirements || [],
        applicationDeadlines: data.application_deadlines || [],
        timestamp: data.timestamp || null,
        cacheDuration: data.cache_duration || null,
        isLoading: false,
        error: null,
      });

      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });
      throw error;
    }
  },

  // Manual setters for individual sections
  setPrograms: (programs) => set({ programs }),
  setSchools: (schools) => set({ schools }),
  setCategories: (categories) => set({ categories }),
  setRequirements: (requirements) => set({ requirements }),
  setApplicationDeadlines: (deadlines) =>
    set({ applicationDeadlines: deadlines }),
  setTimestamp: (timestamp) => set({ timestamp }),
  setCacheDuration: (duration) => set({ cacheDuration: duration }),

  // Utility methods
  clearAllData: () => {
    set({
      programs: [],
      schools: [],
      categories: [],
      requirements: [],
      applicationDeadlines: [],
      timestamp: null,
      cacheDuration: null,
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  // Getters for computed values
  getProgramsByCategory: (categoryName) => {
    const { programs } = get();
    return programs.filter(
      (program) => program.category.toLowerCase() === categoryName.toLowerCase()
    );
  },

  getFeaturedPrograms: () => {
    const { programs } = get();
    return programs.filter((program) => program.featured);
  },

  getCategoryByName: (name) => {
    const { categories } = get();
    return categories.find(
      (category) => category.name.toLowerCase() === name.toLowerCase()
    );
  },

  // Cache management utilities
  isCacheExpired: () => {
    const { timestamp, cacheDuration } = get();
    if (!timestamp || !cacheDuration) return true;

    const now = Math.floor(Date.now() / 1000);
    return now - timestamp > cacheDuration;
  },

  getRemainingCacheTime: () => {
    const { timestamp, cacheDuration } = get();
    if (!timestamp || !cacheDuration) return 0;

    const now = Math.floor(Date.now() / 1000);
    const elapsed = now - timestamp;
    return Math.max(0, cacheDuration - elapsed);
  },

  // Refresh data if cache is expired
  refreshIfExpired: async () => {
    const { isCacheExpired, fetchAllData } = get();

    if (isCacheExpired()) {
      return await fetchAllData();
    }

    return null; // Data is still fresh
  },
}));

export default useProgramsStore;
