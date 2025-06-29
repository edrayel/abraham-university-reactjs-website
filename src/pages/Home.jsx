// import React from "react";
import React, { useEffect } from "react";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import ProgramsSection from "@/components/home/ProgramsSection";
import AboutSection from "@/components/home/AboutSection";
import NewsSection from "@/components/home/NewsSection";
import EventFliersSection from "@/components/home/EventFliersSection";
import EventsSection from "@/components/home/EventsSection";
import GivingSection from "@/components/home/GivingSection";
import VisitSection from "@/components/home/VisitSection";
import CTASection from "@/components/home/CTASection";
import useUniversityStore from "@/stores/homeStore";

const Home = () => {
  const {
    //  heroSlides,
    //  featuredPrograms,
    //  upcomingEvents,
    isLoading,
    error,
    fetchAllData,
    //  setHeroSlides, // For manual updates
    //  getFeaturedEvents,
  } = useUniversityStore();

  useEffect(() => {
    // Fetch all data from single endpoint
    fetchAllData();
  }, []);

  
  if (isLoading) {
    return (
      <div className="min-h-screen pt-20">
        <section className="section-padding hero-gradient">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <div className="h-12 bg-gray-200 rounded mb-6"></div>
              <div className="h-6 bg-gray-200 rounded max-w-3xl mx-auto mb-8"></div>
              <div className="h-10 w-48 bg-gray-200 rounded mx-auto"></div>
            </div>
          </div>
        </section>
        <section className="section-padding bg-white">
          <div className="container mx-auto px-4">
            {/* <div className="container mx-auto px-4">
              <div className="text-center max-w-4xl mx-auto">
                <div className="h-12 bg-gray-200 rounded mb-6"></div>
                <div className="h-6 bg-gray-200 rounded max-w-3xl mx-auto mb-8"></div>
                <div className="h-10 w-48 bg-gray-200 rounded mx-auto"></div>
              </div>
            </div> */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {[...Array(2)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  
  
  if (error) return <div>Error: {error}</div>;

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
