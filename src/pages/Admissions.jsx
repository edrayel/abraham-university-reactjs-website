import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, DollarSign, Users, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import AdmissionsHero from '@/components/admissions/AdmissionsHero';
import ProgramTypesTabs from '@/components/admissions/ProgramTypesTabs';
import RequirementsSection from '@/components/admissions/RequirementsSection';
import DeadlinesSection from '@/components/admissions/DeadlinesSection';
import ApplicationProcess from '@/components/admissions/ApplicationProcess';
import FinancialAidSection from '@/components/admissions/FinancialAidSection';
import AdmissionsCTA from '@/components/admissions/AdmissionsCTA';

const programTypesData = [
  { id: 'undergraduate', name: 'Undergraduate', icon: Users },
  { id: 'graduate', name: 'Graduate', icon: FileText },
  { id: 'doctoral', name: 'Doctoral', icon: Calendar },
  { id: 'international', name: 'International', icon: DollarSign },
];

const requirementsData = {
  undergraduate: [
    'High school diploma or equivalent',
    'SAT or ACT scores',
    'Official transcripts',
    'Letters of recommendation (2)',
    'Personal statement',
    'Application fee ($75)',
  ],
  graduate: [
    'Bachelor\'s degree from accredited institution',
    'GRE or GMAT scores (program dependent)',
    'Official transcripts',
    'Letters of recommendation (3)',
    'Statement of purpose',
    'Resume/CV',
    'Application fee ($100)',
  ],
  doctoral: [
    'Master\'s degree (preferred)',
    'GRE scores',
    'Official transcripts',
    'Letters of recommendation (3)',
    'Research proposal',
    'Writing sample',
    'Application fee ($125)',
  ],
  international: [
    'TOEFL or IELTS scores',
    'Credential evaluation',
    'Financial documentation',
    'Passport copy',
    'All standard requirements for program level',
  ],
};

const deadlinesData = [
  { term: 'Fall 2024', deadline: 'March 1, 2024', status: 'closed' },
  { term: 'Spring 2025', deadline: 'October 15, 2024', status: 'open' },
  { term: 'Summer 2025', deadline: 'February 1, 2025', status: 'upcoming' },
  { term: 'Fall 2025', deadline: 'March 1, 2025', status: 'upcoming' },
];

const applicationStepsData = [
  {
    number: 1,
    title: 'Submit Application',
    description: 'Complete your online application with all required documents.',
    icon: FileText,
  },
  {
    number: 2,
    title: 'Application Review',
    description: 'Our admissions committee reviews your application thoroughly.',
    icon: Clock,
  },
  {
    number: 3,
    title: 'Interview (if required)',
    description: 'Some programs may require an interview or portfolio review.',
    icon: Users,
  },
  {
    number: 4,
    title: 'Decision Notification',
    description: 'Receive your admission decision and next steps.',
    icon: CheckCircle,
  },
];

const financialAidData = [
  {
    type: 'Merit Scholarships',
    amount: 'Up to $20,000/year',
    description: 'Based on academic achievement and leadership.',
  },
  {
    type: 'Need-Based Aid',
    amount: 'Varies',
    description: 'Financial assistance based on demonstrated need.',
  },
  {
    type: 'Work-Study Programs',
    amount: 'Up to $3,000/year',
    description: 'Part-time employment opportunities on campus.',
  },
  {
    type: 'Graduate Assistantships',
    amount: 'Full tuition + stipend',
    description: 'Teaching or research positions for graduate students.',
  },
];


const Admissions = () => {
  const [selectedProgram, setSelectedProgram] = useState('undergraduate');

  const handleApplyClick = () => {
    toast({
      title: "🚧 Application Portal",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleScheduleVisit = () => {
    toast({
      title: "🚧 Campus Visit Scheduler",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleFinancialAidClick = () => {
    toast({
      title: "🚧 Financial Aid Portal",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <div className="min-h-screen pt-20">
      <AdmissionsHero onApplyClick={handleApplyClick} onScheduleVisit={handleScheduleVisit} />
      
      <ProgramTypesTabs 
        programTypes={programTypesData}
        selectedProgram={selectedProgram}
        setSelectedProgram={setSelectedProgram}
      />

      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <RequirementsSection 
              programTypeName={programTypesData.find(p => p.id === selectedProgram)?.name}
              requirements={requirementsData[selectedProgram]}
            />
            <DeadlinesSection deadlines={deadlinesData} />
          </div>
        </div>
      </section>
      
      <ApplicationProcess steps={applicationStepsData} />
      
      <FinancialAidSection 
        financialAidItems={financialAidData}
        onExploreClick={handleFinancialAidClick}
      />
      
      <AdmissionsCTA onApplyClick={handleApplyClick} onScheduleVisit={handleScheduleVisit} />
    </div>
  );
};

export default Admissions;