import { create } from "zustand";
import { API_ENDPOINTS, API_CONFIG } from "@/config/api";

const API_ENDPOINT = API_ENDPOINTS.ALUMNI;

const useAlumniStore = create((set, get) => ({
  // State variables for JSON response objects
  statistics: [],
  notableAlumni: [],
  services: [],
  isLoading: false,
  error: null,

  // Fetch all data
  fetchAllData: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(API_ENDPOINT, {
        headers: API_CONFIG.headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      set({
        statistics: Array.isArray(data.statistics) ? data.statistics : [],
        notableAlumni: Array.isArray(data.notable_alumni)
          ? data.notable_alumni
          : [],
        services: Array.isArray(data.services) ? data.services : [],
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
  setStatistics: (stats) =>
    set({ statistics: Array.isArray(stats) ? stats : [] }),
  setNotableAlumni: (alumni) =>
    set({ notableAlumni: Array.isArray(alumni) ? alumni : [] }),
  setServices: (services) =>
    set({ services: Array.isArray(services) ? services : [] }),

  // Utility methods
  clearAllData: () => {
    set({
      statistics: [],
      notableAlumni: [],
      services: [],
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  // Getters for computed values
  getStatisticByLabel: (label) => {
    const { statistics } = get();
    return statistics.find(
      (stat) => stat.label.toLowerCase() === label.toLowerCase()
    );
  },

  getNotableAlumniByName: (name) => {
    const { notableAlumni } = get();
    return notableAlumni.find(
      (alumnus) => alumnus.name.toLowerCase() === name.toLowerCase()
    );
  },

  getNotableAlumniByField: (field) => {
    const { notableAlumni } = get();
    return notableAlumni.filter((alumnus) =>
      alumnus.field.toLowerCase().includes(field.toLowerCase())
    );
  },

  getServiceByTitle: (title) => {
    const { services } = get();
    return services.find(
      (service) => service.title.toLowerCase() === title.toLowerCase()
    );
  },
}));

export default useAlumniStore;
