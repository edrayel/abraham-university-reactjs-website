import { create } from "zustand";
import { API_ENDPOINTS, API_CONFIG } from "@/config/api";

const API_ENDPOINT = API_ENDPOINTS.RESEARCH;

const useResearchStore = create((set, get) => ({
  // State variables for JSON response objects
  researchAreas: [],
  researchCenters: [],
  facultyResearch: [],
  publications: [],
  grantsFunding: [],
  researchOpportunities: [],

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
        researchAreas: data.research_areas || [],
        researchCenters: data.research_centers || [],
        facultyResearch: data.faculty_research || [],
        publications: data.publications || [],
        grantsFunding: data.grants_funding || [],
        researchOpportunities: data.research_opportunities || [],
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
  setResearchAreas: (areas) => set({ researchAreas: areas }),
  setResearchCenters: (centers) => set({ researchCenters: centers }),
  setFacultyResearch: (research) => set({ facultyResearch: research }),
  setPublications: (publications) => set({ publications }),
  setGrantsFunding: (funding) => set({ grantsFunding: funding }),
  setResearchOpportunities: (opportunities) =>
    set({ researchOpportunities: opportunities }),

  // Utility methods
  clearAllData: () => {
    set({
      researchAreas: [],
      researchCenters: [],
      facultyResearch: [],
      publications: [],
      grantsFunding: [],
      researchOpportunities: [],
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  // Getters for computed values
  getResearchAreaByName: (name) => {
    const { researchAreas } = get();
    return researchAreas.find(
      (area) => area.name.toLowerCase() === name.toLowerCase()
    );
  },

  getFeaturedResearchAreas: () => {
    const { researchAreas } = get();
    return researchAreas.filter((area) => area.featured);
  },

  getResearchAreasByDepartment: (department) => {
    const { researchAreas } = get();
    return researchAreas.filter(
      (area) => area.department.toLowerCase() === department.toLowerCase()
    );
  },
}));

export default useResearchStore;
