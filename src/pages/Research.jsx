import React, { useEffect } from "react";
// import useResearchStore from "@/stores/useResearchStore";
import useResearchStore from "@/stores/useResearchStore ";

import { motion } from "framer-motion";
import {
  Microscope,
  Lightbulb,
  Users,
  Award,
  TrendingUp,
  Globe,
  BookOpen,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import ResearchHero from "@/components/research/ResearchHero";
import ResearchStats from "@/components/research/ResearchStats";
import ResearchAreasGrid from "@/components/research/ResearchAreasGrid";
import ResearchFacilities from "@/components/research/ResearchFacilities";
import ResearchAchievements from "@/components/research/ResearchAchievements";
import RecentPublications from "@/components/research/RecentPublications";
import ResearchCollaboration from "@/components/research/ResearchCollaboration";

const researchAreasData = [
  {
    title: "Artificial Intelligence & Machine Learning",
    description:
      "Advancing AI technologies for healthcare, autonomous systems, and data analysis.",
    icon: Zap,
    funding: "$15M",
    projects: 25,
    image: "AI research laboratory with computers",
  },
  {
    title: "Biomedical Engineering",
    description:
      "Developing innovative medical devices and therapeutic solutions.",
    icon: Microscope,
    funding: "$12M",
    projects: 18,
    image: "Biomedical engineering laboratory",
  },
  {
    title: "Climate Science",
    description:
      "Studying climate change impacts and developing sustainable solutions.",
    icon: Globe,
    funding: "$8M",
    projects: 15,
    image: "Climate research field station",
  },
  {
    title: "Quantum Computing",
    description:
      "Exploring quantum technologies for next-generation computing.",
    icon: Lightbulb,
    funding: "$10M",
    projects: 12,
    image: "Quantum computing research facility",
  },
];

const facilitiesData = [
  {
    name: "Advanced Materials Lab",
    description:
      "State-of-the-art facility for materials research and development.",
    equipment: [
      "Electron microscopes",
      "X-ray diffractometers",
      "Spectroscopy systems",
    ],
    image: "Advanced materials research laboratory",
  },
  {
    name: "Computational Research Center",
    description:
      "High-performance computing resources for complex simulations.",
    equipment: ["Supercomputers", "GPU clusters", "Data storage systems"],
    image: "High-performance computing center",
  },
  {
    name: "Biotechnology Institute",
    description:
      "Cutting-edge biotechnology research and development facility.",
    equipment: ["Cell culture systems", "Gene sequencers", "Protein analyzers"],
    image: "Biotechnology research institute",
  },
  {
    name: "Innovation Hub",
    description: "Collaborative space for interdisciplinary research projects.",
    equipment: ["Maker spaces", "Prototyping tools", "Collaboration areas"],
    image: "Innovation hub collaborative space",
  },
];

const achievementsData = [
  {
    title: "Nobel Prize Winner",
    description:
      "Dr. Sarah Chen awarded Nobel Prize in Chemistry for groundbreaking research.",
    year: "2023",
    icon: Award,
  },
  {
    title: "Patent Portfolio",
    description:
      "Over 500 patents filed in the last five years across various fields.",
    year: "2024",
    icon: Lightbulb,
  },
  {
    title: "Research Funding",
    description:
      "$150M in research grants secured from federal and private sources.",
    year: "2024",
    icon: TrendingUp,
  },
  {
    title: "Industry Partnerships",
    description: "Collaborations with 50+ leading companies and organizations.",
    year: "2024",
    icon: Users,
  },
];

const publicationsData = [
  {
    title: "Breakthrough in Quantum Error Correction",
    journal: "Nature Physics",
    authors: "Dr. Michael Zhang et al.",
    date: "June 2024",
    citations: 127,
  },
  {
    title: "Novel Approach to Cancer Immunotherapy",
    journal: "Cell",
    authors: "Dr. Emily Rodriguez et al.",
    date: "May 2024",
    citations: 89,
  },
  {
    title: "AI-Driven Climate Modeling Advances",
    journal: "Science",
    authors: "Dr. James Wilson et al.",
    date: "April 2024",
    citations: 156,
  },
  {
    title: "Sustainable Energy Storage Solutions",
    journal: "Nature Energy",
    authors: "Dr. Lisa Park et al.",
    date: "March 2024",
    citations: 203,
  },
];

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
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section Skeleton */}
        <section className="section-padding hero-gradient">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <div className="h-12 bg-gray-200 rounded mb-6"></div>
              <div className="h-6 bg-gray-200 rounded max-w-3xl mx-auto mb-8"></div>
              <div className="h-10 w-48 bg-gray-200 rounded mx-auto"></div>
            </div>
          </div>
        </section>
        {/* Program Types Tabs Skeleton */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="p-6 bg-gray-200 rounded-xl animate-pulse"
                  >
                    <div className="h-8 w-8 bg-gray-300 rounded-full mx-auto mb-3"></div>
                    <div className="h-6 bg-gray-300 rounded mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Requirements and Deadlines Skeleton */}
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <div className="h-10 bg-gray-200 rounded mb-6"></div>
                <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 mb-4"
                    >
                      <div className="h-5 w-5 bg-gray-200 rounded-full mt-0.5"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="h-10 bg-gray-200 rounded mb-6"></div>
                <div className="space-y-4">
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-lg p-6 animate-pulse"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="h-6 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Application Process Skeleton */}
        <section className="section-padding bg-white">
          <div className="container mx-auto px-4">
            <div className="h-10 bg-gray-200 rounded mb-6 max-w-md mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg shadow-sm p-6 animate-pulse"
                >
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Financial Aid Skeleton */}
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="h-10 bg-gray-200 rounded mb-6 max-w-md mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 animate-pulse"
                >
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* CTA Skeleton */}
        <section className="section-padding bg-blue-700">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-6"></div>
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-8 max-w-3xl mx-auto"></div>
              <div className="h-10 w-40 bg-gray-200 rounded mx-auto"></div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4 text-center">Error: {error}</div>
      </section>
    );
  }

  return (
    <div className="min-h-screen">
      <ResearchHero />
      <ResearchStats />
      <ResearchAreasGrid
        // researchAreas={researchAreasData}
        onResearchClick={handleResearchClick}
      />
      <ResearchFacilities facilities={facilitiesData} />
      <ResearchAchievements achievements={achievementsData} />
      <RecentPublications
        publications={publicationsData}
        onPublicationClick={handlePublicationClick}
      />
      <ResearchCollaboration onCollaborateClick={handleCollaborateClick} />
    </div>
  );
};

export default Research;
