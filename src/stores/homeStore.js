import { create } from "zustand";
import apiService from "../services/apiService";


const useUniversityStore = create((set, get) => ({
  // State variables for different data sections
  hero: null,
  statistics: [],
  aboutFeatures: [],
  academicExcellence: null,
  featuredPrograms: [],
  upcomingEvents: [],
  latestNews: [],
  timestamp: null,
  cacheDuration: null,
  
  // Loading state
  isLoading: false,
  
  // Error state
  error: null,

  // Fetch all data
  fetchAllData: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const data = await apiService.getHomeData();
      
      set({
        hero: data.hero || null,
        statistics: data.statistics || [],
        aboutFeatures: data.about_features || [],
        academicExcellence: data.academic_excellence || null,
        featuredPrograms: data.featured_programs || [],
        upcomingEvents: data.upcoming_events || [],
        latestNews: data.latest_news || [],
        timestamp: data.timestamp || null,
        cacheDuration: data.cache_duration || null,
        isLoading: false,
        error: null
      });
      
      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Manual setters for individual sections
  setHero: (hero) => set({ hero }),
  setStatistics: (statistics) => set({ statistics }),
  setAboutFeatures: (features) => set({ aboutFeatures: features }),
  setAcademicExcellence: (excellence) => set({ academicExcellence: excellence }),
  setFeaturedPrograms: (programs) => set({ featuredPrograms: programs }),
  setUpcomingEvents: (events) => set({ upcomingEvents: events }),
  setLatestNews: (news) => set({ latestNews: news }),
  setTimestamp: (timestamp) => set({ timestamp }),
  setCacheDuration: (duration) => set({ cacheDuration: duration }),

  // Utility methods
  clearAllData: () => {
    set({
      hero: null,
      statistics: [],
      aboutFeatures: [],
      academicExcellence: null,
      featuredPrograms: [],
      upcomingEvents: [],
      latestNews: [],
      timestamp: null,
      cacheDuration: null,
      error: null
    });
  },

  clearError: () => {
    set({ error: null });
  },

  // Getters for computed values
  getFeaturedEvents: () => {
    const { upcomingEvents } = get();
    return upcomingEvents.filter(event => event.featured_event);
  },

  getProgramsByCategory: (categorySlug) => {
    const { featuredPrograms } = get();
    return featuredPrograms.filter(program =>
      program.categories?.some(cat => cat.slug === categorySlug)
    );
  },

  getEventsByCategory: (categorySlug) => {
    const { upcomingEvents } = get();
    return upcomingEvents.filter(event =>
      event.categories?.some(cat => cat.slug === categorySlug)
    );
  },

  getStatisticByLabel: (label) => {
    const { statistics } = get();
    return statistics.find(stat => stat.label.toLowerCase() === label.toLowerCase());
  },

  getFeatureByTitle: (title) => {
    const { aboutFeatures } = get();
    return aboutFeatures.find(feature => 
      feature.title.toLowerCase().includes(title.toLowerCase())
    );
  },

  // Cache management utilities
  isCacheExpired: () => {
    const { timestamp, cacheDuration } = get();
    if (!timestamp || !cacheDuration) return true;
    
    const now = Math.floor(Date.now() / 1000);
    return (now - timestamp) > cacheDuration;
  },

  getRemainingCacheTime: () => {
    const { timestamp, cacheDuration } = get();
    if (!timestamp || !cacheDuration) return 0;
    
    const now = Math.floor(Date.now() / 1000);
    const elapsed = now - timestamp;
    return Math.max(0, cacheDuration - elapsed);
  },

  // Refresh data if cache is expired
  refreshIfExpired: async () => {
    const { isCacheExpired, fetchAllData } = get();
    
    if (isCacheExpired()) {
      return await fetchAllData();
    }
    
    return null; // Data is still fresh
  }
}));

export default useUniversityStore;

// Usage example:
/*
import useUniversityStore from './stores/universityStore';

const MyComponent = () => {
  const {
    hero,
    statistics,
    aboutFeatures,
    featuredPrograms,
    upcomingEvents,
    latestNews,
    isLoading,
    error,
    fetchAllData,
    isCacheExpired,
    getStatisticByLabel
  } = useUniversityStore();

  useEffect(() => {
    // Fetch all data from API
    fetchAllData('/api/university-data');
  }, []);

  // Get specific statistic
  const studentCount = getStatisticByLabel('Students');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {hero && (
        <section>
          <h1>{hero.title}</h1>
          <h2>{hero.subtitle}</h2>
          <p>{hero.description}</p>
          <a href={hero.cta_link}>{hero.cta_text}</a>
        </section>
      )}
      
      <section>
        {statistics.map((stat, index) => (
          <div key={index}>
            <span>{stat.value}</span>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>
      
      <section>
        {aboutFeatures.map((feature, index) => (
          <div key={index}>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
};
*/