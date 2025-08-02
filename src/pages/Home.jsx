import React, { useEffect } from "react";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import AcademicExcellenceSection from "@/components/home/AcademicExcellenceSection";
import ProgramsSection from "@/components/home/ProgramsSection";
import AboutSection from "@/components/home/AboutSection";
import NewsSection from "@/components/home/NewsSection";
import EventFliersSection from "@/components/home/EventFliersSection";
import EventsSection from "@/components/home/EventsSection";
import GivingSection from "@/components/home/GivingSection";
import VisitSection from "@/components/home/VisitSection";
import CTASection from "@/components/home/CTASection";
import useUniversityStore from "@/stores/homeStore";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import LoadingState from "@/components/common/LoadingState";

const Home = () => {
  const {
    upcomingEvents,
    isLoading,
    error,
    fetchAllData,
  } = useUniversityStore();

  useEffect(() => {
    // Fetch all data from single endpoint
    fetchAllData();
  }, [fetchAllData]);

  if (isLoading) {
    return <LoadingState type="page" message="Loading University Information" />;
  }

  if (error) {
    return (
      <ErrorBoundary 
        error={error} 
        onRetry={() => {
          fetchAllData();
        }}
        customMessage="We're having trouble loading the university homepage content. This could be due to server maintenance or connectivity issues."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <StatsSection />
      <AcademicExcellenceSection />
      {upcomingEvents && upcomingEvents.length > 0 && <EventFliersSection />}
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
