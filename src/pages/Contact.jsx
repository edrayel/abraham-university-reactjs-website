import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Users,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfoGrid from "@/components/contact/ContactInfoGrid";
import ContactFormSection from "@/components/contact/ContactFormSection";
import DepartmentContacts from "@/components/contact/DepartmentContacts";
import FAQSection from "@/components/contact/FAQSection";
import useContactStore from "@/stores/useContactStore";
import apiService from "@/services/apiService";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import LoadingState from "@/components/common/LoadingState";

const Contact = () => {
  const { general, departments, faq, isLoading, error, fetchAllData } =
    useContactStore();
  const [awardsData, setAwardsData] = useState(null);
  const [awardsLoading, setAwardsLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
    
    // Fetch awards data for Financial Aid contact info
    const fetchAwardsData = async () => {
      try {
        setAwardsLoading(true);
        const data = await apiService.getAwardsData();
        setAwardsData(data);
      } catch (err) {
        console.error('Error fetching awards data:', err);
      } finally {
        setAwardsLoading(false);
      }
    };
    
    fetchAwardsData();
  }, [fetchAllData]);

  // Static icon mapping for departments to match original component
  const departmentIconMap = {
    "admissions office": Users,
    "student services": MessageSquare,
    "academic affairs": Calendar,
    "financial aid": Phone,
  };

  // Map JSON general to contactInfoData format
  const contactInfoData = [
    {
      icon: MapPin,
      title: "Address",
      details: general.address
        ? general.address.split(", ").map((item) => item.trim())
        : [
            "123 University Avenue",
            "Education City, EC 12345",
            "United States",
          ],
    },
    {
      icon: Phone,
      title: "Phone",
      details: [
        general.phone || "+1 (555) 123-4567",
        ...departments.map((dept) => `${dept.phone} (${dept.name})`),
        general.emergency_contact || "+1 (555) 123-4569 (Emergency)",
      ],
    },
    {
      icon: Mail,
      title: "Email",
      details: [
        general.email || "info@abrahamuniversity.edu",
        ...departments.map((dept) => dept.email),
        "support@abrahamuniversity.edu", // Static fallback to match original
      ],
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: general.office_hours
        ? general.office_hours.split("\r\n")
        : [
            "Monday - Friday: 8:00 AM - 6:00 PM",
            "Saturday: 9:00 AM - 4:00 PM",
            "Sunday: Closed",
          ],
    },
  ];

  // Map JSON departments to departmentContactsData format
  const departmentContactsData = departments.map((dept) => {
    // Use awards contact info for Financial Aid department if available
    if (dept.name.toLowerCase() === 'financial aid' && awardsData?.contact_info) {
      const awardsContact = awardsData.contact_info;
      return {
        name: dept.name,
        phone: awardsContact.phone || dept.phone,
        email: awardsContact.email || dept.email,
        hours: awardsContact.office_hours || dept.hours,
        icon: departmentIconMap[dept.name.toLowerCase()] || Users,
      };
    }
    
    // Use regular contact data for other departments
    return {
      name: dept.name,
      phone: dept.phone,
      email: dept.email,
      hours: dept.hours,
      icon: departmentIconMap[dept.name.toLowerCase()] || Users, // Fallback to Users
    };
  });

  // Map JSON faq to faqData format
  const faqData = faq.map((item) => ({
    question: item.question,
    answer: item.answer,
  }));

  const handleSubmit = (formData) => {
    console.log("Form submitted:", formData);
    toast({
      title: "🚧 Contact Form",
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

  const handleDirectionsClick = () => {
    toast({
      title: "🚧 Campus Directions",
      description: `This feature isn't implemented yet—but don't worry! Our address is ${
        general.address ||
        "123 University Avenue, Education City, EC 12345, United States"
      }. 🚀`,
    });
  };

  const handleQuickActionToast = (title) => {
    toast({
      title: `🚧 ${title}`,
      description:
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  if (isLoading || awardsLoading) {
    return <LoadingState type="page" message="Loading Contact Information" />;
  }

  if (error) {
    return (
      <ErrorBoundary 
        error={error} 
        onRetry={() => {
          fetchAllData();
        }}
        customMessage="We're having trouble loading our contact information. This could be due to server maintenance or connectivity issues."
      />
    );
  }

  // Continue with existing loading skeleton if only awards is loading
  if (awardsLoading && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section Skeleton */}
        <section className="section-padding hero-gradient">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <div className="h-12 bg-gray-200 rounded mb-6"></div>
              <div className="h-6 bg-gray-200 rounded max-w-3xl mx-auto mb-8"></div>
            </div>
          </div>
        </section>
        {/* Contact Info Grid Skeleton */}
        <section className="section-padding bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-lg shadow-sm animate-pulse"
                >
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Contact Form Section Skeleton */}
        <section className="section-padding bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xl">
              <div className="h-10 bg-gray-200 rounded mb-6"></div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
                <div>
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Department Contacts Skeleton */}
        <section className="section-padding bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="h-10 bg-gray-200 rounded mb-4 max-w-md mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-lg shadow-sm animate-pulse"
                >
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* FAQ Section Skeleton */}
        <section className="section-padding bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="h-10 bg-gray-200 rounded mb-4 max-w-md mx-auto"></div>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-sm animate-pulse"
                >
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
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

  if (!departments.length && !faq.length) {
    return (
      <div className="min-h-screen bg-gray-50 text-center">
        No contact data available.
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
      <ContactHero />
      <ContactInfoGrid contactInfo={contactInfoData} />
      <ContactFormSection
        onSubmit={handleSubmit}
        onScheduleVisit={handleScheduleVisit}
        onDirectionsClick={handleDirectionsClick}
        onQuickActionToast={handleQuickActionToast}
      />
      <DepartmentContacts departments={departmentContactsData} />
      <FAQSection faqs={faqData} />
    </div>
  );
};

export default Contact;
// const contactInfoData = [
//   {
//     icon: MapPin,
//     title: 'Address',
//     details: ['123 University Avenue', 'Education City, EC 12345', 'United States'],
//   },
//   {
//     icon: Phone,
//     title: 'Phone',
//     details: ['+1 (555) 123-4567', '+1 (555) 123-4568 (Admissions)', '+1 (555) 123-4569 (Emergency)'],
//   },
//   {
//     icon: Mail,
//     title: 'Email',
//     details: ['info@abrahamuniversity.edu', 'admissions@abrahamuniversity.edu', 'support@abrahamuniversity.edu'],
//   },
//   {
//     icon: Clock,
//     title: 'Office Hours',
//     details: ['Monday - Friday: 8:00 AM - 6:00 PM', 'Saturday: 9:00 AM - 4:00 PM', 'Sunday: Closed'],
//   },
// ];

// const departmentContactsData = [
//   {
//     name: 'Admissions Office',
//     phone: '+1 (555) 123-4568',
//     email: 'admissions@abrahamuniversity.edu',
//     hours: 'Mon-Fri: 8 AM - 6 PM',
//     icon: Users,
//   },
//   {
//     name: 'Student Services',
//     phone: '+1 (555) 123-4570',
//     email: 'students@abrahamuniversity.edu',
//     hours: 'Mon-Fri: 8 AM - 8 PM',
//     icon: MessageSquare,
//   },
//   {
//     name: 'Academic Affairs',
//     phone: '+1 (555) 123-4571',
//     email: 'academic@abrahamuniversity.edu',
//     hours: 'Mon-Fri: 9 AM - 5 PM',
//     icon: Calendar,
//   },
//   {
//     name: 'Financial Aid',
//     phone: '+1 (555) 123-4572',
//     email: 'finaid@abrahamuniversity.edu',
//     hours: 'Mon-Fri: 8 AM - 6 PM',
//     icon: Phone,
//   },
// ];

// const faqData = [
//     {
//       question: "What are the admission requirements?",
//       answer: "Requirements vary by program level. Generally include transcripts, test scores, and application materials."
//     },
//     {
//       question: "How do I schedule a campus visit?",
//       answer: "You can schedule visits through our admissions office or use our online scheduling system."
//     },
//     {
//       question: "What financial aid options are available?",
//       answer: "We offer scholarships, grants, work-study programs, and loan assistance to qualified students."
//     },
//     {
//       question: "How do I apply for housing?",
//       answer: "Housing applications are available through the student portal after admission acceptance."
//     },
//     {
//       question: "What support services are available?",
//       answer: "We provide academic advising, career services, counseling, tutoring, and disability support."
//     },
//     {
//       question: "How can I get involved on campus?",
//       answer: "Join student organizations, participate in events, volunteer, or engage in research opportunities."
//     }
//   ];

// const Contact = () => {
//   const handleSubmit = (formData) => {
//     console.log('Form submitted:', formData);
//     toast({
//       title: "🚧 Contact Form",
//       description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
//     });
//   };

//   const handleScheduleVisit = () => {
//     toast({
//       title: "🚧 Campus Visit Scheduler",
//       description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
//     });
//   };

//   const handleDirectionsClick = () => {
//     toast({
//       title: "🚧 Campus Directions",
//       description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
//     });
//   };

//    const handleQuickActionToast = (title) => {
//     toast({
//       title: `🚧 ${title}`,
//       description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
//     });
//   };

//   return (
//     <div className="min-h-screen">
//       <ContactHero />
//       <ContactInfoGrid contactInfo={contactInfoData} />
//       <ContactFormSection
//         onSubmit={handleSubmit}
//         onScheduleVisit={handleScheduleVisit}
//         onDirectionsClick={handleDirectionsClick}
//         onQuickActionToast={handleQuickActionToast}
//       />
//       <DepartmentContacts departments={departmentContactsData} />
//       <FAQSection faqs={faqData} />
//     </div>
//   );
// };

// export default Contact;
