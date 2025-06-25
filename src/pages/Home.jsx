import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import ProgramsSection from '@/components/home/ProgramsSection';
import AboutSection from '@/components/home/AboutSection';
import NewsSection from '@/components/home/NewsSection';
import EventFliersSection from '@/components/home/EventFliersSection';
import EventsSection from '@/components/home/EventsSection';
import GivingSection from '@/components/home/GivingSection';
import VisitSection from '@/components/home/VisitSection';
import CTASection from '@/components/home/CTASection';
import useUniversityStore from "@/store/universityStore";


const Home = () => {

 const {
  //  heroSlides,
  //  featuredPrograms,
  //  upcomingEvents,
   isLoadingAll,
   generalError,
   fetchAllData,
  //  setHeroSlides, // For manual updates
  //  getFeaturedEvents,
 } = useUniversityStore();

 useEffect(() => {
   // Fetch all data from single endpoint
   fetchAllData();
 }, []);

 if (isLoadingAll) return <div>Loading...</div>;
 if (generalError) return <div>Error: {generalError}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <StatsSection />
      <EventFliersSection />
      <ProgramsSection />
      <AboutSection />
      <NewsSection />
      <EventsSection />
      <GivingSection />
      <VisitSection />
      <CTASection />
    </div>
  );
};

export default Home;