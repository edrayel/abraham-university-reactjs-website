import React, { useEffect } from "react";
import useResearchStore from "@/stores/useResearchStore";

// Removed unused imports
import { toast } from "@/components/ui/use-toast";
import ResearchHero from "@/components/research/ResearchHero";
import ResearchStats from "@/components/research/ResearchStats";
import ResearchAreasGrid from "@/components/research/ResearchAreasGrid";
import ResearchFacilities from "@/components/research/ResearchFacilities";
import ResearchAchievements from "@/components/research/ResearchAchievements";
import RecentPublications from "@/components/research/RecentPublications";
import ResearchCollaboration from "@/components/research/ResearchCollaboration";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import LoadingState from "@/components/common/LoadingState";
import EmptyState from "@/components/common/EmptyState";

// Removed unused researchAreasData - using data from store instead

// Removed unused facilitiesData - using data from store instead

// Removed unused achievementsData - using data from store instead

// Removed unused publicationsData - using data from store instead

const Research = () => {
  const { researchAreas, isLoading, error, fetchAllData } = useResearchStore();

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleResearchClick = () => {
    toast({
      title: "🚧 Research Details",
      description:
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleCollaborateClick = () => {
    toast({
      title: "🚧 Research Collaboration",
      description:
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handlePublicationClick = () => {
    toast({
      title: "🚧 Publication Details",
      description:
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  if (isLoading) {
    return (
      <LoadingState 
        type="page" 
        message="Loading research information..." 
      />
    );
  }

  if (error) {
    return (
      <ErrorBoundary 
        error={error}
        message="We're having trouble loading research information. Please try again or check back later."
        onRetry={() => fetchAllData()}
      />
    );
  }

  if (!researchAreas.length && !isLoading) {
    return (
      <EmptyState
        type="generic"
        title="No Research Information Available"
        description="We're currently updating our research database or experiencing temporary data issues."
        onRetry={() => fetchAllData()}
        retryText="Reload Research Data"
      />
    );
  }

  return (
    <div className="min-h-screen">
      <ResearchHero />
      <ResearchStats />
      <ResearchAreasGrid
        onResearchClick={handleResearchClick}
      />
      <ResearchFacilities />
      <ResearchAchievements />
      <RecentPublications
        onPublicationClick={handlePublicationClick}
      />
      <ResearchCollaboration onCollaborateClick={handleCollaborateClick} />
    </div>
  );
};

export default Research;
