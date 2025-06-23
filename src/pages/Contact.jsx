import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import ContactHero from '@/components/contact/ContactHero';
import ContactInfoGrid from '@/components/contact/ContactInfoGrid';
import ContactFormSection from '@/components/contact/ContactFormSection';
import DepartmentContacts from '@/components/contact/DepartmentContacts';
import FAQSection from '@/components/contact/FAQSection';

const contactInfoData = [
  {
    icon: MapPin,
    title: 'Address',
    details: ['123 University Avenue', 'Education City, EC 12345', 'United States'],
  },
  {
    icon: Phone,
    title: 'Phone',
    details: ['+1 (555) 123-4567', '+1 (555) 123-4568 (Admissions)', '+1 (555) 123-4569 (Emergency)'],
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['info@abrahamuniversity.edu', 'admissions@abrahamuniversity.edu', 'support@abrahamuniversity.edu'],
  },
  {
    icon: Clock,
    title: 'Office Hours',
    details: ['Monday - Friday: 8:00 AM - 6:00 PM', 'Saturday: 9:00 AM - 4:00 PM', 'Sunday: Closed'],
  },
];

const departmentContactsData = [
  {
    name: 'Admissions Office',
    phone: '+1 (555) 123-4568',
    email: 'admissions@abrahamuniversity.edu',
    hours: 'Mon-Fri: 8 AM - 6 PM',
    icon: Users,
  },
  {
    name: 'Student Services',
    phone: '+1 (555) 123-4570',
    email: 'students@abrahamuniversity.edu',
    hours: 'Mon-Fri: 8 AM - 8 PM',
    icon: MessageSquare,
  },
  {
    name: 'Academic Affairs',
    phone: '+1 (555) 123-4571',
    email: 'academic@abrahamuniversity.edu',
    hours: 'Mon-Fri: 9 AM - 5 PM',
    icon: Calendar,
  },
  {
    name: 'Financial Aid',
    phone: '+1 (555) 123-4572',
    email: 'finaid@abrahamuniversity.edu',
    hours: 'Mon-Fri: 8 AM - 6 PM',
    icon: Phone,
  },
];

const faqData = [
    {
      question: "What are the admission requirements?",
      answer: "Requirements vary by program level. Generally include transcripts, test scores, and application materials."
    },
    {
      question: "How do I schedule a campus visit?",
      answer: "You can schedule visits through our admissions office or use our online scheduling system."
    },
    {
      question: "What financial aid options are available?",
      answer: "We offer scholarships, grants, work-study programs, and loan assistance to qualified students."
    },
    {
      question: "How do I apply for housing?",
      answer: "Housing applications are available through the student portal after admission acceptance."
    },
    {
      question: "What support services are available?",
      answer: "We provide academic advising, career services, counseling, tutoring, and disability support."
    },
    {
      question: "How can I get involved on campus?",
      answer: "Join student organizations, participate in events, volunteer, or engage in research opportunities."
    }
  ];


const Contact = () => {
  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
    toast({
      title: "🚧 Contact Form",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleScheduleVisit = () => {
    toast({
      title: "🚧 Campus Visit Scheduler",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleDirectionsClick = () => {
    toast({
      title: "🚧 Campus Directions",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

   const handleQuickActionToast = (title) => {
    toast({
      title: `🚧 ${title}`,
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };


  return (
    <div className="min-h-screen pt-20">
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