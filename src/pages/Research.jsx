import React from 'react';
import { motion } from 'framer-motion';
import { Microscope, Lightbulb, Users, Award, TrendingUp, Globe, BookOpen, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import ResearchHero from '@/components/research/ResearchHero';
import ResearchStats from '@/components/research/ResearchStats';
import ResearchAreasGrid from '@/components/research/ResearchAreasGrid';
import ResearchFacilities from '@/components/research/ResearchFacilities';
import ResearchAchievements from '@/components/research/ResearchAchievements';
import RecentPublications from '@/components/research/RecentPublications';
import ResearchCollaboration from '@/components/research/ResearchCollaboration';

const researchAreasData = [
  {
    title: 'Artificial Intelligence & Machine Learning',
    description: 'Advancing AI technologies for healthcare, autonomous systems, and data analysis.',
    icon: Zap,
    funding: '$15M',
    projects: 25,
    image: 'AI research laboratory with computers',
  },
  {
    title: 'Biomedical Engineering',
    description: 'Developing innovative medical devices and therapeutic solutions.',
    icon: Microscope,
    funding: '$12M',
    projects: 18,
    image: 'Biomedical engineering laboratory',
  },
  {
    title: 'Climate Science',
    description: 'Studying climate change impacts and developing sustainable solutions.',
    icon: Globe,
    funding: '$8M',
    projects: 15,
    image: 'Climate research field station',
  },
  {
    title: 'Quantum Computing',
    description: 'Exploring quantum technologies for next-generation computing.',
    icon: Lightbulb,
    funding: '$10M',
    projects: 12,
    image: 'Quantum computing research facility',
  },
];

const facilitiesData = [
  {
    name: 'Advanced Materials Lab',
    description: 'State-of-the-art facility for materials research and development.',
    equipment: ['Electron microscopes', 'X-ray diffractometers', 'Spectroscopy systems'],
    image: 'Advanced materials research laboratory',
  },
  {
    name: 'Computational Research Center',
    description: 'High-performance computing resources for complex simulations.',
    equipment: ['Supercomputers', 'GPU clusters', 'Data storage systems'],
    image: 'High-performance computing center',
  },
  {
    name: 'Biotechnology Institute',
    description: 'Cutting-edge biotechnology research and development facility.',
    equipment: ['Cell culture systems', 'Gene sequencers', 'Protein analyzers'],
    image: 'Biotechnology research institute',
  },
  {
    name: 'Innovation Hub',
    description: 'Collaborative space for interdisciplinary research projects.',
    equipment: ['Maker spaces', 'Prototyping tools', 'Collaboration areas'],
    image: 'Innovation hub collaborative space',
  },
];

const achievementsData = [
  {
    title: 'Nobel Prize Winner',
    description: 'Dr. Sarah Chen awarded Nobel Prize in Chemistry for groundbreaking research.',
    year: '2023',
    icon: Award,
  },
  {
    title: 'Patent Portfolio',
    description: 'Over 500 patents filed in the last five years across various fields.',
    year: '2024',
    icon: Lightbulb,
  },
  {
    title: 'Research Funding',
    description: '$150M in research grants secured from federal and private sources.',
    year: '2024',
    icon: TrendingUp,
  },
  {
    title: 'Industry Partnerships',
    description: 'Collaborations with 50+ leading companies and organizations.',
    year: '2024',
    icon: Users,
  },
];

const publicationsData = [
  {
    title: 'Breakthrough in Quantum Error Correction',
    journal: 'Nature Physics',
    authors: 'Dr. Michael Zhang et al.',
    date: 'June 2024',
    citations: 127,
  },
  {
    title: 'Novel Approach to Cancer Immunotherapy',
    journal: 'Cell',
    authors: 'Dr. Emily Rodriguez et al.',
    date: 'May 2024',
    citations: 89,
  },
  {
    title: 'AI-Driven Climate Modeling Advances',
    journal: 'Science',
    authors: 'Dr. James Wilson et al.',
    date: 'April 2024',
    citations: 156,
  },
  {
    title: 'Sustainable Energy Storage Solutions',
    journal: 'Nature Energy',
    authors: 'Dr. Lisa Park et al.',
    date: 'March 2024',
    citations: 203,
  },
];

const Research = () => {
  const handleResearchClick = () => {
    toast({
      title: "🚧 Research Details",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleCollaborateClick = () => {
    toast({
      title: "🚧 Research Collaboration",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handlePublicationClick = () => {
    toast({
      title: "🚧 Publication Details",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <div className="min-h-screen pt-20">
      <ResearchHero />
      <ResearchStats />
      <ResearchAreasGrid researchAreas={researchAreasData} onResearchClick={handleResearchClick} />
      <ResearchFacilities facilities={facilitiesData} />
      <ResearchAchievements achievements={achievementsData} />
      <RecentPublications publications={publicationsData} onPublicationClick={handlePublicationClick} />
      <ResearchCollaboration onCollaborateClick={handleCollaborateClick} />
    </div>
  );
};

export default Research;