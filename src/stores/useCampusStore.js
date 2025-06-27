import { create } from "zustand";

const CAMPUS_ENDPOINT =
  "	https://abrahamuniversity-v1.edwardrajah.com/wp-json/abraham/v1/campus-life"; // Replace with actual endpoint

const useCampusStore = create((set, get) => ({
  // State variables for JSON response objects
  studentOrganizations: [],
  housingOptions: [],
  diningServices: [],
  recreationFacilities: [],
  supportServices: [],
  campusTraditions: [],

  // Loading state
  isLoading: false,

  // Error state
  error: null,

  // Fetch all data
  fetchAllData: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(CAMPUS_ENDPOINT);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      set({
        studentOrganizations: data.student_organizations || [],
        housingOptions: data.housing_options || [],
        diningServices: data.dining_services || [],
        recreationFacilities: data.recreation_facilities || [],
        supportServices: data.support_services || [],
        campusTraditions: data.campus_traditions || [],
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
  setStudentOrganizations: (organizations) =>
    set({ studentOrganizations: organizations }),
  setHousingOptions: (housing) => set({ housingOptions: housing }),
  setDiningServices: (dining) => set({ diningServices: dining }),
  setRecreationFacilities: (facilities) =>
    set({ recreationFacilities: facilities }),
  setSupportServices: (services) => set({ supportServices: services }),
  setCampusTraditions: (traditions) => set({ campusTraditions: traditions }),

  // Utility methods
  clearAllData: () => {
    set({
      studentOrganizations: [],
      housingOptions: [],
      diningServices: [],
      recreationFacilities: [],
      supportServices: [],
      campusTraditions: [],
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  // Getters for computed values
  getAvailableHousingOptions: () => {
    const { housingOptions } = get();
    return housingOptions.filter((housing) => housing.available);
  },

  getHousingByType: (type) => {
    const { housingOptions } = get();
    return housingOptions.filter(
      (housing) => housing.type.toLowerCase() === type.toLowerCase()
    );
  },

  getHousingByName: (name) => {
    const { housingOptions } = get();
    return housingOptions.find(
      (housing) => housing.name.toLowerCase() === name.toLowerCase()
    );
  },
}));

export default useCampusStore;
