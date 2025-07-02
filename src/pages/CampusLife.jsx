// import React, { useEffect } from "react";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  Home,
  Utensils,
  Dumbbell,
  Music,
  Camera,
  Heart,
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

  const handleHousingClick = () => {
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
    return (
      <div className="min-h-screen">
        <section className="section-padding hero-gradient">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <div className="h-12 bg-gray-200 rounded mb-6"></div>
              <div className="h-6 bg-gray-200 rounded max-w-3xl mx-auto mb-8"></div>
              <div className="h-10 w-48 bg-gray-200 rounded mx-auto"></div>
            </div>
          </div>
        </section>
        <section className="section-padding bg-white">
          <div className="container mx-auto px-4">
            {/* <div className="container mx-auto px-4">
              <div className="text-center max-w-4xl mx-auto">
                <div className="h-12 bg-gray-200 rounded mb-6"></div>
                <div className="h-6 bg-gray-200 rounded max-w-3xl mx-auto mb-8"></div>
                <div className="h-10 w-48 bg-gray-200 rounded mx-auto"></div>
              </div>
            </div> */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
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
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4 text-center">Error: {error}</div>
      </section>
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
        onHousingClick={handleHousingClick}
      />
      <DiningSection diningOptions={diningData} />
      <WellnessSupport wellnessServices={wellnessData} />
      <CampusGallery
        images={galleryImagesData}
        onEventClick={handleEventClick}
      />
      <CampusLifeCTA
        onJoinClick={handleJoinClick}
        onEventClick={handleEventClick}
      />
    </div>
  );
};

export default CampusLife;
