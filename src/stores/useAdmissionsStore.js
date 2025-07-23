import { create } from "zustand";
import apiService from "../services/apiService";

const useAdmissionsStore = create((set, get) => ({
  // State variables for JSON response objects
  requirements: [],
  deadlines: [],
  processSteps: [],
  contactInfo: {},
  tuitionFees: [],
  financialAid: [],
  exploreFinancialAidUrl: "",
  applyNowUrl: "",
  scheduleVisitUrl: "",
  applicationProcess: [],
  isLoading: false,
  error: null,

  // Fetch all data
  fetchAllData: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await apiService.getAdmissionsData();

      set({
        requirements: Array.isArray(data.requirements) ? data.requirements : [],
        deadlines: Array.isArray(data.deadlines) ? data.deadlines : [],
        processSteps: Array.isArray(data.process_steps)
          ? data.process_steps
          : [],
        contactInfo:
          typeof data.contact_info === "object" && data.contact_info !== null
            ? data.contact_info
            : {},
        tuitionFees: Array.isArray(data.tuition_fees) ? data.tuition_fees : [],
        financialAid: Array.isArray(data.financial_aid)
          ? data.financial_aid
          : [],
        exploreFinancialAidUrl:
          typeof data.explore_financial_aid_url === "string"
            ? data.explore_financial_aid_url
            : "",
        applyNowUrl:
          typeof data.apply_now_url === "string"
            ? data.apply_now_url
            : "",
        scheduleVisitUrl:
          typeof data.schedule_visit_url === "string"
            ? data.schedule_visit_url
            : "",
        applicationProcess: Array.isArray(data.application_process)
          ? data.application_process
          : [],
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
  setRequirements: (requirements) =>
    set({ requirements: Array.isArray(requirements) ? requirements : [] }),
  setDeadlines: (deadlines) =>
    set({ deadlines: Array.isArray(deadlines) ? deadlines : [] }),
  setProcessSteps: (steps) =>
    set({ processSteps: Array.isArray(steps) ? steps : [] }),
  setContactInfo: (info) =>
    set({ contactInfo: typeof info === "object" && info !== null ? info : {} }),
  setTuitionFees: (fees) =>
    set({ tuitionFees: Array.isArray(fees) ? fees : [] }),
  setFinancialAid: (aid) =>
    set({ financialAid: Array.isArray(aid) ? aid : [] }),
  setExploreFinancialAidUrl: (url) =>
    set({ exploreFinancialAidUrl: typeof url === "string" ? url : "" }),
  setApplyNowUrl: (url) =>
    set({ applyNowUrl: typeof url === "string" ? url : "" }),
  setScheduleVisitUrl: (url) =>
    set({ scheduleVisitUrl: typeof url === "string" ? url : "" }),
  setApplicationProcess: (process) =>
    set({ applicationProcess: Array.isArray(process) ? process : [] }),

  // Utility methods
  clearAllData: () => {
    set({
      requirements: [],
      deadlines: [],
      processSteps: [],
      contactInfo: {},
      tuitionFees: [],
      financialAid: [],
      exploreFinancialAidUrl: "",
      applyNowUrl: "",
      scheduleVisitUrl: "",
      applicationProcess: [],
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  // Getters for computed values
  getRequirementsByProgramCategory: (category) => {
    const { requirements } = get();
    return requirements.filter(
      (req) => req.program_category.toLowerCase() === category.toLowerCase()
    );
  },

  getDeadlinesByProgram: (program) => {
    const { deadlines } = get();
    return deadlines.filter(
      (deadline) => deadline.program.toLowerCase() === program.toLowerCase()
    );
  },

  getTuitionFeesByProgramType: (programType) => {
    const { tuitionFees } = get();
    return tuitionFees.find(
      (fee) => fee.program_type.toLowerCase() === programType.toLowerCase()
    );
  },

  getFinancialAidByType: (type) => {
    const { financialAid } = get();
    return financialAid.find(
      (aid) => aid.type.toLowerCase() === type.toLowerCase()
    );
  },
}));

export default useAdmissionsStore;
