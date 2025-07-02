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
import useAdmissionsStore from "@/stores/useAdmissionsStore"; // Adjust the import path as needed

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
      .filter((req) => req.program_category.toLowerCase() === "undergraduate")
      .map((req) => req.title),
    graduate: requirements
      .filter((req) => req.program_category.toLowerCase() === "graduate")
      .map((req) => req.title),
    doctoral: [
      "Master's degree (preferred)",
      "GRE scores",
      "Official transcripts",
      "Letters of recommendation (3)",
      "Research proposal",
      "Writing sample",
      "Application fee ($125)",
    ], // Static fallback
    international: [
      "TOEFL or IELTS scores",
      "Credential evaluation",
      "Financial documentation",
      "Passport copy",
      "All standard requirements for program level",
    ], // Static fallback
  };

  // Map JSON deadlines to deadlinesData format
  const deadlinesData = deadlines.map((deadline) => {
    const deadlineDate = new Date(deadline.deadline_date);
    const currentDate = new Date("2025-06-28"); // Current date as per context
    let status;
    if (deadlineDate < currentDate) {
      status = "closed";
    } else if (
      deadlineDate >= currentDate &&
      deadlineDate <= new Date("2025-09-08")
    ) {
      status = "open";
    } else {
      status = "upcoming";
    }
    return {
      term: `Fall 2025 (${deadline.program})`,
      deadline: deadline.deadline_date,
      status,
      description: deadline.note, // Optional, for sub-components
    };
  });

  // Use static applicationStepsData as process_steps is empty
  const applicationStepsData = [
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
    toast({
      title: "🚧 Application Portal",
      description:
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleScheduleVisit = () => {
    toast({
      title: "🚧 Campus Visit Scheduler",
      description:
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
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
      <div className="min-h-screen bg-gray-50 text-center">
        Error: {error}
      </div>
    );
  }

  if (!requirements.length && !deadlines.length && !financialAid.length) {
    return (
      <div className="min-h-screen bg-gray-50 text-center">
        No admissions data available.
      </div>
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
