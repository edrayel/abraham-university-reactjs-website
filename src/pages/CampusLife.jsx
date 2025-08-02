import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Users,
  Calendar,
  Coffee,
  Utensils,
  Home,
  Heart,
  BookOpen,
  Music,
  Palette,
  Trophy,
  Gamepad2,
  Camera,
  Mic,
  Dumbbell,
  Stethoscope,
  Leaf,
  Shield,
  Clock,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import CampusLifeHero from "@/components/campus-life/CampusLifeHero";
import ActivitiesOverview from "@/components/campus-life/ActivitiesOverview";
import HousingSection from "@/components/campus-life/HousingSection";
import DiningSection from "@/components/campus-life/DiningSection";
import WellnessSupport from "@/components/campus-life/WellnessSupport";
import CampusGallery from "@/components/campus-life/CampusGallery";
import CampusLifeCTA from "@/components/campus-life/CampusLifeCTA";
import useCampusStore from "@/stores/useCampusStore";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import LoadingState from "@/components/common/LoadingState";
import EmptyState from "@/components/common/EmptyState";

const activitiesData = [
  {
    category: "Student Organizations",
    icon: Users,
    count: "200+",
    description:
      "Join clubs and organizations that match your interests and passions.",
    items: [
      "Academic Clubs",
      "Cultural Organizations",
      "Professional Societies",
      "Special Interest Groups",
    ],
  },
  {
    category: "Events & Programs",
    icon: Calendar,
    count: "500+",
    description:
      "Year-round events, workshops, and programs to enrich your experience.",
    items: [
      "Guest Lectures",
      "Cultural Festivals",
      "Career Fairs",
      "Social Events",
    ],
  },
  {
    category: "Recreation & Sports",
    icon: Dumbbell,
    count: "30+",
    description:
      "Stay active with our comprehensive recreation and athletics programs.",
    items: [
      "Intramural Sports",
      "Fitness Classes",
      "Outdoor Adventures",
      "Varsity Teams",
    ],
  },
  {
    category: "Arts & Culture",
    icon: Music,
    count: "50+",
    description:
      "Express your creativity through various artistic and cultural programs.",
    items: [
      "Theater Productions",
      "Art Exhibitions",
      "Music Ensembles",
      "Dance Groups",
    ],
  },
];

const housingData = [
  {
    name: "Freshman Residence Halls",
    type: "Traditional",
    capacity: "2,000 students",
    features: [
      "Shared rooms",
      "Community bathrooms",
      "Study lounges",
      "Dining hall access",
    ],
    image: "Modern freshman dormitory building",
  },
  {
    name: "Upperclass Apartments",
    type: "Apartment Style",
    capacity: "1,500 students",
    features: [
      "Private bedrooms",
      "Shared kitchen",
      "Living room",
      "Laundry facilities",
    ],
    image: "Upperclass apartment complex",
  },
  {
    name: "Graduate Housing",
    type: "Studio & 1BR",
    capacity: "800 students",
    features: [
      "Private units",
      "Full kitchen",
      "Study areas",
      "Parking included",
    ],
    image: "Graduate student housing complex",
  },
  {
    name: "Family Housing",
    type: "2-3 Bedroom",
    capacity: "200 families",
    features: [
      "Family-friendly",
      "Playground",
      "Community center",
      "Pet-friendly options",
    ],
    image: "Family housing community",
  },
];

const diningData = [
  {
    name: "Main Dining Hall",
    type: "All-You-Can-Eat",
    hours: "7 AM - 10 PM",
    features: [
      "International cuisine",
      "Vegetarian options",
      "Allergen-friendly",
      "Fresh salad bar",
    ],
  },
  {
    name: "Student Union Food Court",
    type: "Quick Service",
    hours: "10 AM - 11 PM",
    features: [
      "Fast casual dining",
      "Pizza & burgers",
      "Asian cuisine",
      "Coffee shop",
    ],
  },
  {
    name: "Campus Café",
    type: "Coffee & Light Meals",
    hours: "6 AM - 6 PM",
    features: [
      "Specialty coffee",
      "Pastries & sandwiches",
      "Study-friendly",
      "Outdoor seating",
    ],
  },
  {
    name: "Late Night Grill",
    type: "Late Night Dining",
    hours: "9 PM - 2 AM",
    features: [
      "Comfort food",
      "Study fuel",
      "Delivery available",
      "Extended hours",
    ],
  },
];

const wellnessData = [
  {
    title: "Health Services",
    description:
      "Comprehensive healthcare including medical, dental, and mental health services.",
    icon: Heart,
    services: [
      "Primary care",
      "Mental health counseling",
      "Wellness programs",
      "24/7 emergency care",
    ],
  },
  {
    title: "Fitness & Recreation",
    description:
      "State-of-the-art fitness facilities and recreational programs for all skill levels.",
    icon: Dumbbell,
    services: [
      "Modern gym equipment",
      "Group fitness classes",
      "Personal training",
      "Outdoor activities",
    ],
  },
  {
    title: "Campus Safety",
    description:
      "Dedicated campus security ensuring a safe and secure environment 24/7.",
    icon: Users,
    services: [
      "24/7 security patrol",
      "Emergency call boxes",
      "Safety escorts",
      "Crime prevention programs",
    ],
  },
];

const galleryImagesData = [
  "Students studying in modern library",
  "Campus quad with students relaxing",
  "Athletic facilities and sports complex",
  "Student organizations fair",
  "Graduation ceremony celebration",
  "Campus dining hall atmosphere",
];

const CampusLife = () => {
  const { housingOptions, isLoading, error, fetchAllData } = useCampusStore();

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const handleJoinClick = () => {
    toast({
      title: "🚧 Student Organizations",
      description:
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleApplyClick = () => {
    toast({
      title: "🚧 Housing Application",
      description:
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleEventClick = () => {
    toast({
      title: "🚧 Campus Events",
      description:
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  if (isLoading) {
    return <LoadingState type="page" message="Loading campus life information..." />;
  }

  if (error) {
    return (
      <ErrorBoundary
        error={error}
        message="We're having trouble loading campus life information right now. Please try again."
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!housingOptions.length && !isLoading) {
    return (
      <EmptyState
        type="generic"
        title="No Campus Life Information Available"
        description="We're currently updating our campus life database or experiencing temporary data issues."
        onRetry={() => fetchAllData()}
        retryText="Reload Campus Data"
      />
    );
  }

  return (
    <div className="min-h-screen">
      <CampusLifeHero />
      <ActivitiesOverview
        activities={activitiesData}
        onJoinClick={handleJoinClick}
      />
      <HousingSection
        housingOptions={housingData}
        onApplyClick={handleApplyClick}
      />
      <DiningSection diningOptions={diningData} />
      <WellnessSupport wellnessServices={wellnessData} />
        <CampusGallery images={galleryImagesData} />
        <CampusLifeCTA />
    </div>
  );
};

export default CampusLife;
