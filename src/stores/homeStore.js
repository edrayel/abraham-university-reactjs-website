// import { create } from "zustand";
import { create } from "zustand";

const HOME_ENDPOINT =
  "https://abrahamuniversity-v1.edwardrajah.com/wp-json/abraham/v1/events";

const useUniversityStore = create((set, get) => ({
  // State variables for different data sections
  heroSlides: [],
  featuredPrograms: [],
  upcomingEvents: [],
  latestNews: [],
  stats: [],

  // Loading states
  isLoadingAll: false,

  // Error states
  generalError: null,

  // Fetch all data at once
  fetchAllData: async () => {
    set({ isLoadingAll: true, generalError: null });

    try {
      const response = await fetch(HOME_ENDPOINT);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      set({
        heroSlides: data.hero_slides || [],
        featuredPrograms: data.featured_programs || [],
        upcomingEvents: data.upcoming_events || [],
        latestNews: data.latest_news || [],
        stats: data.stats || [],
        isLoadingAll: false,
        generalError: null,
      });

      return data;
    } catch (error) {
      set({
        isLoadingAll: false,
        generalError: error.message,
      });
      throw error;
    }
  },

  // Manual setters for individual sections (if you need to update from cached data or other sources)
  setHeroSlides: (slides) => set({ heroSlides: slides }),
  setFeaturedPrograms: (programs) => set({ featuredPrograms: programs }),
  setUpcomingEvents: (events) => set({ upcomingEvents: events }),
  setLatestNews: (news) => set({ latestNews: news }),
  setStats: (stats) => set({ stats: stats }),

  // Utility methods
  clearAllData: () => {
    set({
      heroSlides: [],
      featuredPrograms: [],
      upcomingEvents: [],
      latestNews: [],
      stats: [],
      generalError: null,
    });
  },

  clearErrors: () => {
    set({
      generalError: null,
    });
  },

  // Getters for computed values
  getFeaturedEvents: () => {
    const { upcomingEvents } = get();
    return upcomingEvents.filter((event) => event.featured_event);
  },

  getProgramsByCategory: (categorySlug) => {
    const { featuredPrograms } = get();
    return featuredPrograms.filter((program) =>
      program.categories?.some((cat) => cat.slug === categorySlug)
    );
  },

  getEventsByCategory: (categorySlug) => {
    const { upcomingEvents } = get();
    return upcomingEvents.filter((event) =>
      event.categories?.some((cat) => cat.slug === categorySlug)
    );
  },

  // Check if any data is loading
  isLoading: () => {
    const state = get();
    return state.isLoadingAll;
  },
}));

export default useUniversityStore;

// Usage example:
/*
import useUniversityStore from './useUniversityStore';

const MyComponent = () => {
  const {
    heroSlides,
    featuredPrograms,
    upcomingEvents,
    isLoadingAll,
    generalError,
    fetchAllData,
    setHeroSlides, // For manual updates
    getFeaturedEvents
  } = useUniversityStore();

  useEffect(() => {
    // Fetch all data from single endpoint
    fetchAllData('/api/university-data');
  }, []);

  if (isLoadingAll) return <div>Loading...</div>;
  if (generalError) return <div>Error: {generalError}</div>;

  const featuredEvents = getFeaturedEvents();

  return (
    <div>
      {heroSlides.map(slide => (
        <div key={slide.id}>{slide.title}</div>
      ))}
    </div>
  );
};
*/
