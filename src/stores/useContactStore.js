import { create } from "zustand";
import { API_ENDPOINTS, API_CONFIG } from "@/config/api";

const API_ENDPOINT = API_ENDPOINTS.CONTACT;

const useContactStore = create((set, get) => ({
  // State variables for JSON response objects
  general: {},
  departments: [],
  faq: [],
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
        general:
          typeof data.general === "object" && data.general !== null
            ? data.general
            : {},
        departments: Array.isArray(data.departments) ? data.departments : [],
        faq: Array.isArray(data.faq) ? data.faq : [],
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
  setGeneral: (generalInfo) =>
    set({
      general:
        typeof generalInfo === "object" && generalInfo !== null
          ? generalInfo
          : {},
    }),
  setDepartments: (departments) =>
    set({ departments: Array.isArray(departments) ? departments : [] }),
  setFaq: (faq) => set({ faq: Array.isArray(faq) ? faq : [] }),

  // Utility methods
  clearAllData: () => {
    set({
      general: {},
      departments: [],
      faq: [],
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  // Getters for computed values
  getDepartmentByName: (name) => {
    const { departments } = get();
    return departments.find(
      (dept) => dept.name.toLowerCase() === name.toLowerCase()
    );
  },

  getFaqByQuestion: (question) => {
    const { faq } = get();
    return faq.find(
      (item) => item.question.toLowerCase() === question.toLowerCase()
    );
  },
}));

export default useContactStore;
