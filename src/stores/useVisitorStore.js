import { create } from "zustand";
import { API_ENDPOINTS, API_CONFIG } from "@/config/api";

const API_ENDPOINT = API_ENDPOINTS.VISIT;

const useVisitorStore = create((set, get) => ({
  // State variables for JSON response objects
  campusTours: [],
  campusHighlights: [],
  visitorInformation: [],
  directionsParking: [],
  accommodations: [],
  contactInfo: {},
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
        campusTours: Array.isArray(data.campus_tours) ? data.campus_tours : [],
        campusHighlights: Array.isArray(data.campus_highlights)
          ? data.campus_highlights
          : [],
        visitorInformation: Array.isArray(data.visitor_information)
          ? data.visitor_information
          : [],
        directionsParking: Array.isArray(data.directions_parking)
          ? data.directions_parking
          : [],
        accommodations: Array.isArray(data.accommodations)
          ? data.accommodations
          : [],
        contactInfo:
          typeof data.contact_info === "object" && data.contact_info !== null
            ? data.contact_info
            : {},
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
  setCampusTours: (tours) =>
    set({ campusTours: Array.isArray(tours) ? tours : [] }),
  setCampusHighlights: (highlights) =>
    set({ campusHighlights: Array.isArray(highlights) ? highlights : [] }),
  setVisitorInformation: (info) =>
    set({ visitorInformation: Array.isArray(info) ? info : [] }),
  setDirectionsParking: (directions) =>
    set({ directionsParking: Array.isArray(directions) ? directions : [] }),
  setAccommodations: (accommodations) =>
    set({
      accommodations: Array.isArray(accommodations) ? accommodations : [],
    }),
  setContactInfo: (info) =>
    set({ contactInfo: typeof info === "object" && info !== null ? info : {} }),

  // Utility methods
  clearAllData: () => {
    set({
      campusTours: [],
      campusHighlights: [],
      visitorInformation: [],
      directionsParking: [],
      accommodations: [],
      contactInfo: {},
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  // Getters for computed values
  getCampusTourByName: (name) => {
    const { campusTours } = get();
    return campusTours.find(
      (tour) => tour.name.toLowerCase() === name.toLowerCase()
    );
  },

  getCampusHighlightsByCategory: (category) => {
    const { campusHighlights } = get();
    return campusHighlights.filter(
      (highlight) => highlight.category.toLowerCase() === category.toLowerCase()
    );
  },

  getVisitorInfoByTitle: (title) => {
    const { visitorInformation } = get();
    return visitorInformation.find(
      (info) => info.title.toLowerCase() === title.toLowerCase()
    );
  },
}));

export default useVisitorStore;
