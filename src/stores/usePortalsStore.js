import { create } from "zustand";
import { API_ENDPOINTS, API_CONFIG } from "@/config/api";

const API_ENDPOINT = API_ENDPOINTS.PORTALS; // API endpoint for portals data

const usePortalsStore = create((set, get) => ({
  // State variables for JSON response objects
  studentPortal: {},
  facultyPortal: {},
  staffPortal: {},
  alumniPortal: {},
  parentPortal: {},
  portalItems: [],
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
        studentPortal: data.student_portal || {},
        facultyPortal: data.faculty_portal || {},
        staffPortal: data.staff_portal || {},
        alumniPortal: data.alumni_portal || {},
        parentPortal: data.parent_portal || {},
        portalItems: Array.isArray(data.portal_items) ? data.portal_items : [],
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
  setStudentPortal: (portal) => set({ studentPortal: portal || {} }),
  setFacultyPortal: (portal) => set({ facultyPortal: portal || {} }),
  setStaffPortal: (portal) => set({ staffPortal: portal || {} }),
  setAlumniPortal: (portal) => set({ alumniPortal: portal || {} }),
  setParentPortal: (portal) => set({ parentPortal: portal || {} }),
  setPortalItems: (items) =>
    set({ portalItems: Array.isArray(items) ? items : [] }),

  // Utility methods
  clearAllData: () => {
    set({
      studentPortal: {},
      facultyPortal: {},
      staffPortal: {},
      alumniPortal: {},
      parentPortal: {},
      portalItems: [],
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  // Getters for computed values
  getPortalByType: (type) => {
    const { 
      studentPortal, 
      facultyPortal, 
      staffPortal, 
      alumniPortal, 
      parentPortal 
    } = get();
    
    switch (type.toLowerCase()) {
      case 'student':
        return studentPortal;
      case 'faculty':
        return facultyPortal;
      case 'staff':
        return staffPortal;
      case 'alumni':
        return alumniPortal;
      case 'parent':
        return parentPortal;
      default:
        return null;
    }
  },

  getPortalItemById: (id) => {
    const { portalItems } = get();
    return portalItems.find(item => item.id === id);
  },

  getPortalItemByTitle: (title) => {
    const { portalItems } = get();
    return portalItems.find(
      (item) => item.title.toLowerCase() === title.toLowerCase()
    );
  },
}));

export default usePortalsStore;