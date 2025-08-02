import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  FileText,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import AdmissionsHero from "@/components/admissions/AdmissionsHero";
import ProgramTypesTabs from "@/components/admissions/ProgramTypesTabs";
import RequirementsSection from "@/components/admissions/RequirementsSection";
import DeadlinesSection from "@/components/admissions/DeadlinesSection";
import ApplicationProcess from "@/components/admissions/ApplicationProcess";
import FinancialAidSection from "@/components/admissions/FinancialAidSection";
import AdmissionsCTA from "@/components/admissions/AdmissionsCTA";
import useAdmissionsStore from "@/stores/useAdmissionsStore";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import LoadingState from "@/components/common/LoadingState";
import EmptyState from "@/components/common/EmptyState";

// const programTypesData = [
//   { id: 'undergraduate', name: 'Undergraduate', icon: Users },
//   { id: 'graduate', name: 'Graduate', icon: FileText },
//   { id: 'doctoral', name: 'Doctoral', icon: Calendar },
//   { id: 'international', name: 'International', icon: DollarSign },
// ];

// const requirementsData = {
//   undergraduate: [
//     'High school diploma or equivalent',
//     'SAT or ACT scores',
//     'Official transcripts',
//     'Letters of recommendation (2)',
//     'Personal statement',
//     'Application fee ($75)',
//   ],
//   graduate: [
//     'Bachelor\'s degree from accredited institution',
//     'GRE or GMAT scores (program dependent)',
//     'Official transcripts',
//     'Letters of recommendation (3)',
//     'Statement of purpose',
//     'Resume/CV',
//     'Application fee ($100)',
//   ],
//   doctoral: [
//     'Master\'s degree (preferred)',
//     'GRE scores',
//     'Official transcripts',
//     'Letters of recommendation (3)',
//     'Research proposal',
//     'Writing sample',
//     'Application fee ($125)',
//   ],
//   international: [
//     'TOEFL or IELTS scores',
//     'Credential evaluation',
//     'Financial documentation',
//     'Passport copy',
//     'All standard requirements for program level',
//   ],
// };

// const deadlinesData = [
//   { term: 'Fall 2024', deadline: 'March 1, 2024', status: 'closed' },
//   { term: 'Spring 2025', deadline: 'October 15, 2024', status: 'open' },
//   { term: 'Summer 2025', deadline: 'February 1, 2025', status: 'upcoming' },
//   { term: 'Fall 2025', deadline: 'March 1, 2025', status: 'upcoming' },
// ];

// const applicationStepsData = [
//   {
//     number: 1,
//     title: 'Submit Application',
//     description: 'Complete your online application with all required documents.',
//     icon: FileText,
//   },
//   {
//     number: 2,
//     title: 'Application Review',
//     description: 'Our admissions committee reviews your application thoroughly.',
//     icon: Clock,
//   },
//   {
//     number: 3,
//     title: 'Interview (if required)',
//     description: 'Some programs may require an interview or portfolio review.',
//     icon: Users,
//   },
//   {
//     number: 4,
//     title: 'Decision Notification',
//     description: 'Receive your admission decision and next steps.',
//     icon: CheckCircle,
//   },
// ];

// const financialAidData = [
//   {
//     type: 'Merit Scholarships',
//     amount: 'Up to $20,000/year',
//     description: 'Based on academic achievement and leadership.',
//   },
//   {
//     type: 'Need-Based Aid',
//     amount: 'Varies',
//     description: 'Financial assistance based on demonstrated need.',
//   },
//   {
//     type: 'Work-Study Programs',
//     amount: 'Up to $3,000/year',
//     description: 'Part-time employment opportunities on campus.',
//   },
//   {
//     type: 'Graduate Assistantships',
//     amount: 'Full tuition + stipend',
//     description: 'Teaching or research positions for graduate students.',
//   },
// ];

const Admissions = () => {
  const [selectedProgram, setSelectedProgram] = useState("undergraduate");
  const {
    requirements,
    deadlines,
    processSteps,
    contactInfo,
    tuitionFees,
    financialAid,
    exploreFinancialAidUrl,
    applyNowUrl,
    scheduleVisitUrl,
    applicationProcess,
    isLoading,
    error,
    fetchAllData,
  } = useAdmissionsStore();

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Static program types to include Doctoral and International, as they are not in JSON
  const programTypesData = [
    { id: "undergraduate", name: "Undergraduate", icon: Users },
    { id: "graduate", name: "Graduate", icon: FileText },
    { id: "doctoral", name: "Doctoral", icon: Calendar },
    { id: "international", name: "International", icon: DollarSign },
  ];

  // Map JSON requirements to requirementsData format
  const requirementsData = {
    undergraduate: requirements
      .filter((req) => req.program_category && req.program_category.toLowerCase() === "undergraduate")
      .map((req) => req.title),
    graduate: requirements
      .filter((req) => req.program_category && req.program_category.toLowerCase() === "graduate")
      .map((req) => req.title),
    doctoral: requirements
      .filter((req) => req.program_category && req.program_category.toLowerCase() === "doctoral")
      .map((req) => req.title),
    international: requirements
      .filter((req) => req.program_category && req.program_category.toLowerCase() === "international")
      .map((req) => req.title),
  };

  // Add fallback requirements if no data from API
  if (requirementsData.doctoral.length === 0) {
    requirementsData.doctoral = [
      "Master's degree (preferred)",
      "GRE scores",
      "Official transcripts",
      "Letters of recommendation (3)",
      "Research proposal",
      "Writing sample",
      "Application fee ($125)",
    ];
  }
  if (requirementsData.international.length === 0) {
    requirementsData.international = [
      "TOEFL or IELTS scores",
      "Credential evaluation",
      "Financial documentation",
      "Passport copy",
      "All standard requirements for program level",
    ];
  }

  // Map JSON deadlines to deadlinesData format
  const deadlinesData = deadlines.map((deadline) => {
    const deadlineDate = new Date(deadline.deadline_date);
    const currentDate = new Date(); // Use current date
    let status;
    if (deadlineDate < currentDate) {
      status = "closed";
    } else {
      // Check if deadline is within next 30 days to mark as "open"
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(currentDate.getDate() + 30);
      if (deadlineDate <= thirtyDaysFromNow) {
        status = "open";
      } else {
        status = "upcoming";
      }
    }
    return {
      term: `${deadline.program} - ${deadline.application_type ? deadline.application_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Application'}`,
      deadline: deadline.deadline_date,
      status,
      description: deadline.note, // Optional, for sub-components
    };
  });

  // Use applicationProcess from API if available, otherwise use static data
  const applicationStepsData = applicationProcess.length > 0 
    ? applicationProcess.map(step => ({
        number: step.step_number || step.number,
        title: step.title,
        description: step.description,
        icon: step.icon === 'document' ? FileText : 
              step.icon === 'clock' ? Clock :
              step.icon === 'users' ? Users :
              step.icon === 'check-circle' ? CheckCircle :
              step.icon === 'FileText' ? FileText :
              step.icon === 'Clock' ? Clock :
              step.icon === 'Users' ? Users :
              step.icon === 'CheckCircle' ? CheckCircle :
              FileText // default icon
      }))
    : [
        {
          number: 1,
          title: "Submit Application",
          description:
            "Complete your online application with all required documents.",
          icon: FileText,
        },
        {
          number: 2,
          title: "Application Review",
          description:
            "Our admissions committee reviews your application thoroughly.",
          icon: Clock,
        },
        {
          number: 3,
          title: "Interview (if required)",
          description:
            "Some programs may require an interview or portfolio review.",
          icon: Users,
        },
        {
          number: 4,
          title: "Decision Notification",
          description: "Receive your admission decision and next steps.",
          icon: CheckCircle,
        },
      ];

  // Map JSON financial_aid to financialAidData format
  const financialAidData = financialAid.map((aid) => ({
    type: aid.type,
    amount: aid.amount,
    description: aid.description,
  }));

  const handleApplyClick = () => {
    if (applyNowUrl) {
      window.open(applyNowUrl, '_blank');
    } else {
      toast({
        title: "🚧 Application Portal",
        description:
          "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      });
    }
  };

  const handleScheduleVisit = () => {
    if (scheduleVisitUrl) {
      window.open(scheduleVisitUrl, '_blank');
    } else {
      toast({
        title: "🚧 Campus Visit Scheduler",
        description:
          "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      });
    }
  };

  const handleFinancialAidClick = () => {
    if (exploreFinancialAidUrl) {
      window.location.href = exploreFinancialAidUrl; // Redirect to financial aid URL
    } else {
      toast({
        title: "🚧 Financial Aid Portal",
        description:
          "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      });
    }
  };

  if (isLoading) {
    return <LoadingState type="page" message="Loading admissions information..." />;
  }

  if (error) {
    return (
      <ErrorBoundary
        error={error}
        message="We're having trouble loading admissions information right now. Please try again."
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Show empty state only if all critical data is missing
  if (!requirements.length && !deadlines.length && !financialAid.length && !applicationProcess.length) {
    return (
      <EmptyState
        type="data"
        title="No Admissions Information Available"
        message="We're currently updating our admissions information. Please check back soon for application requirements and deadlines!"
        onRetry={() => window.location.reload()}
        className="min-h-screen"
      />
    );
  }

  return (
    <div className="min-h-screen">
      <style>
        {`
          .animate-pulse {
            animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}
      </style>
      <AdmissionsHero
        onApplyClick={handleApplyClick}
        onScheduleVisit={handleScheduleVisit}
      />

      <ProgramTypesTabs
        programTypes={programTypesData}
        selectedProgram={selectedProgram}
        setSelectedProgram={setSelectedProgram}
      />

      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <RequirementsSection
              programTypeName={
                programTypesData.find((p) => p.id === selectedProgram)?.name
              }
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

      <AdmissionsCTA
        onApplyClick={handleApplyClick}
        onScheduleVisit={handleScheduleVisit}
        contactInfo={contactInfo} // Pass contactInfo for dynamic CTA content
      />
    </div>
  );

  // return (
  //   <div className="min-h-screen">
  //     <AdmissionsHero
  //       onApplyClick={handleApplyClick}
  //       onScheduleVisit={handleScheduleVisit}
  //     />

  //     <ProgramTypesTabs
  //       programTypes={programTypesData}
  //       selectedProgram={selectedProgram}
  //       setSelectedProgram={setSelectedProgram}
  //     />

  //     <section className="section-padding bg-gray-50">
  //       <div className="container mx-auto px-4">
  //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
  //           <RequirementsSection
  //             programTypeName={
  //               programTypesData.find((p) => p.id === selectedProgram)?.name
  //             }
  //             requirements={requirementsData[selectedProgram]}
  //           />
  //           <DeadlinesSection deadlines={deadlinesData} />
  //         </div>
  //       </div>
  //     </section>

  //     <ApplicationProcess steps={applicationStepsData} />

  //     <FinancialAidSection
  //       financialAidItems={financialAidData}
  //       onExploreClick={handleFinancialAidClick}
  //     />

  //     <AdmissionsCTA
  //       onApplyClick={handleApplyClick}
  //       onScheduleVisit={handleScheduleVisit}
  //     />
  //   </div>
  // );
};

export default Admissions;
