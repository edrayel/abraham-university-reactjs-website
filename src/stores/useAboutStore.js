import { create } from "zustand";
import { API_ENDPOINTS, API_CONFIG } from "@/config/api";

const API_ENDPOINT = API_ENDPOINTS.ABOUT;

const useAboutStore = create((set, get) => ({
  // State variables for JSON response objects
  mission: "",
  vision: "",
  values: [],
  history: [],
  leadership: [],
  statistics: [],

  // Loading state
  isLoading: false,

  // Error state
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
        mission: data.mission || "",
        vision: data.vision || "",
        values: data.values || [],
        history: data.history || [],
        leadership: data.leadership || [],
        statistics: data.statistics || [],
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
  setMission: (mission) => set({ mission }),
  setVision: (vision) => set({ vision }),
  setValues: (values) => set({ values }),
  setHistory: (history) => set({ history }),
  setLeadership: (leadership) => set({ leadership }),
  setStatistics: (statistics) => set({ statistics }),

  // Utility methods
  clearAllData: () => {
    set({
      mission: "",
      vision: "",
      values: [],
      history: [],
      leadership: [],
      statistics: [],
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

  getLeadershipByTitle: (title) => {
    const { leadership } = get();
    return leadership.find(
      (leader) => leader.title.toLowerCase() === title.toLowerCase()
    );
  },

  getHistoryByYear: (year) => {
    const { history } = get();
    return history.find((event) => event.year === year);
  },

  getValueByTitle: (title) => {
    const { values } = get();
    return values.find(
      (value) => value.title.toLowerCase() === title.toLowerCase()
    );
  },
}));

export default useAboutStore;
