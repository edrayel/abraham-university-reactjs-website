import { create } from "zustand";

const GIVING_ENDPOINT =
  "https://abrahamuniversity-v1.edwardrajah.com/wp-json/abraham/v1/giving"; // Replace with actual endpoint

const useGivingStore = create((set, get) => ({
  // State variables for JSON response objects
  impactAreas: [],
  waysToGive: [],
  donationPortalUrl: "",
  isLoading: false,
  error: null,

  // Fetch all data
  fetchAllData: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(GIVING_ENDPOINT);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      set({
        impactAreas: Array.isArray(data.impact_areas) ? data.impact_areas : [],
        waysToGive: Array.isArray(data.ways_to_give) ? data.ways_to_give : [],
        donationPortalUrl:
          typeof data.donation_portal_url === "string"
            ? data.donation_portal_url
            : "",
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
  setImpactAreas: (areas) =>
    set({ impactAreas: Array.isArray(areas) ? areas : [] }),
  setWaysToGive: (ways) => set({ waysToGive: Array.isArray(ways) ? ways : [] }),
  setDonationPortalUrl: (url) =>
    set({ donationPortalUrl: typeof url === "string" ? url : "" }),

  // Utility methods
  clearAllData: () => {
    set({
      impactAreas: [],
      waysToGive: [],
      donationPortalUrl: "",
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  // Getters for computed values
  getImpactAreaByTitle: (title) => {
    const { impactAreas } = get();
    return impactAreas.find(
      (area) => area.title.toLowerCase() === title.toLowerCase()
    );
  },

  getWayToGiveByTitle: (title) => {
    const { waysToGive } = get();
    return waysToGive.find(
      (way) => way.title.toLowerCase() === title.toLowerCase()
    );
  },
}));

export default useGivingStore;
