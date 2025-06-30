import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MapPin,
  CalendarDays,
  Users,
  Camera,
  ArrowRight,
  Info,
  Coffee,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useVisitorStore from "@/stores/useVisitorStore"; // Adjust the import path as needed

const Visit = () => {
  const {
    campusTours,
    campusHighlights,
    contactInfo,
    isLoading,
    error,
    fetchAllData,
  } = useVisitorStore();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Static icon mapping for visitOptions to match original component
  const visitIconMap = {
    "campus tours": Users,
    "information sessions": Info,
    "department visits": Building,
    "virtual tour": Camera,
  };

  // Map JSON campus_tours to visitOptions format
  const mappedVisitOptions = campusTours.map((tour) => ({
    id: tour.name.toLowerCase().replace(/\s+/g, "-"),
    title: tour.name,
    icon: visitIconMap[tour.name.toLowerCase()] || Users, // Fallback to Users
    description: tour.description,
    duration: tour.duration,
    image: `https://source.unsplash.com/random/600x400/?${tour.name
      .toLowerCase()
      .replace(/\s+/g, "-")}`,
    features: tour.schedule
      ? tour.schedule.split("\r\n").filter((item) => item.trim())
      : [],
    booking_url: tour.booking_url || null,
  }));

  // Map JSON campus_highlights to campusHighlights format
  const mappedCampusHighlights = campusHighlights.map((highlight) => ({
    name: highlight.name,
    image:
      highlight.image_url ||
      `https://source.unsplash.com/random/400x300/?${highlight.name
        .toLowerCase()
        .replace(/\s+/g, "-")}`,
    description: highlight.description,
  }));

  // Use contactInfo for address and contact details
  const address = contactInfo.visitor_center_location
    ? `${contactInfo.visitor_center_location}, Education City, EC 12345`
    : "123 University Avenue, Education City, EC 12345";

  const contactEmail =
    contactInfo.admissions_email || "admissions@abrahamuniversity.edu";

  const handleScheduleVisit = (visitType, bookingUrl) => {
    if (bookingUrl) {
      window.location.href = bookingUrl; // Redirect to booking URL
    } else {
      toast({
        title: `🚧 Schedule ${visitType}`,
        description: `Online scheduling for ${visitType.toLowerCase()} isn't implemented yet. Please contact admissions. 🚀`,
      });
    }
  };

  const handleDirectionsClick = () => {
    toast({
      title: "🚧 Get Directions",
      description:
        "This feature isn’t implemented yet. Our address is " +
        address +
        ". 🚀",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section Skeleton */}
        <section className="pt-60 pb-40 hero-gradient">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-6"></div>
              <div className="h-12 bg-gray-200 rounded mb-6"></div>
              <div className="h-6 bg-gray-200 rounded max-w-3xl mx-auto mb-8"></div>
              <div className="h-10 w-48 bg-gray-200 rounded mx-auto"></div>
            </div>
          </div>
        </section>
        {/* Visit Options Skeleton */}
        <section className="section-padding bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="h-10 bg-gray-200 rounded mb-4 max-w-md mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded max-w-3xl mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
                >
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Campus Highlights Skeleton */}
        <section className="section-padding bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="h-10 bg-gray-200 rounded mb-4 max-w-md mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded max-w-3xl mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
                >
                  <div className="h-56 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Plan Your Visit Skeleton */}
        <section className="section-padding bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-blue-50 p-8 rounded-xl shadow-xl">
              <div className="h-10 bg-gray-200 rounded mb-6 mx-auto"></div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-6"></div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="h-10 w-40 bg-gray-200 rounded"></div>
                    <div className="h-10 w-40 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </section>
        {/* Contact Section Skeleton */}
        <section className="section-padding bg-blue-700">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-6"></div>
              <div className="h-10 bg-gray-200 rounded mb-4 mx-auto"></div>
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

  if (!mappedVisitOptions.length && !mappedCampusHighlights.length) {
    return (
      <div className="min-h-screen bg-gray-50 text-center">
        No visit data available.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>
        {`
          .card-hover {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
          }
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

      {/* Hero Section */}
      <section className="section-padding hero-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <MapPin className="h-16 w-16 mx-auto mb-6 text-sky-300" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Visit Abraham University
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed mb-8">
              Experience our vibrant campus, meet our community, and discover
              why Abraham University is the perfect place for your academic
              journey.
            </p>
            <Button
              size="lg"
              onClick={() =>
                handleScheduleVisit(
                  "Campus Tour",
                  mappedVisitOptions.find((opt) => opt.title === "Campus Tours")
                    ?.booking_url
                )
              }
              className="bg-white text-gradient hover:bg-blue-50 text-lg px-10 py-4 rounded-md font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Schedule Your Visit
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Visit Options Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Ways to{" "}
              <span className="text-gradient">Experience Our Campus</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the visit option that best suits your interests and
              schedule. We look forward to welcoming you!
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mappedVisitOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden card-hover group flex flex-col"
                role="presentation"
              >
                <div className="h-64 relative overflow-hidden">
                  <img
                    src={option.image}
                    alt={option.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <option.icon className="h-16 w-16 text-white opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3 group-hover:text-gradient transition-colors">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    <CalendarDays className="inline h-4 w-4 mr-1 text-blue-600" />{" "}
                    {option.duration}
                  </p>
                  <p className="text-gray-600 mb-4 flex-grow">
                    {option.description}
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1 mb-4">
                    {option.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <ArrowRight className="h-3 w-3 mr-2 text-blue-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() =>
                      handleScheduleVisit(option.title, option.booking_url)
                    }
                    className="w-full mt-auto bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    asChild={option.booking_url}
                  >
                    {option.booking_url ? (
                      <a
                        href={option.booking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Schedule ${option.title}`}
                      >
                        {option.id === "virtual-tour"
                          ? "Take Virtual Tour"
                          : "Schedule Visit"}
                      </a>
                    ) : (
                      <>
                        {option.id === "virtual-tour"
                          ? "Take Virtual Tour"
                          : "Schedule Visit"}
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Highlights Section */}
      <section className="section-padding bg-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Campus <span className="text-gradient">Highlights</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover some of the most iconic and beloved spots on our historic
              campus.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {mappedCampusHighlights.map((highlight, index) => (
              <motion.div
                key={highlight.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden card-hover group"
                role="presentation"
              >
                <div className="h-56 relative overflow-hidden">
                  <img
                    src={highlight.image}
                    alt={highlight.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-gradient transition-colors">
                    {highlight.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {highlight.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plan Your Visit Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-blue-50 p-8 md:p-12 rounded-xl shadow-xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Plan Your Visit
              </h2>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-gray-700 mb-4">
                    We are located at: <br />
                    <strong className="text-gradient">{address}</strong>
                  </p>
                  <p className="text-gray-700 mb-6">
                    Find information about parking, accommodations, and local
                    attractions to make your visit enjoyable.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={handleDirectionsClick}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <MapPin className="mr-2 h-5 w-5" /> Get Directions
                    </Button>
                    <Button
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-100"
                      onClick={() =>
                        handleScheduleVisit(
                          "Campus Tour",
                          mappedVisitOptions.find(
                            (opt) => opt.title === "Campus Tours"
                          )?.booking_url
                        )
                      }
                    >
                      <CalendarDays className="mr-2 h-5 w-5" /> View Visit
                      Calendar
                    </Button>
                  </div>
                </div>
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1580582932707-520769456160?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
                    alt="Map showing university location"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact for Visits */}
      <section className="section-padding bg-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <Coffee className="h-12 w-12 mx-auto mb-6 text-sky-300" />
            <h2 className="text-3xl font-bold mb-4">
              Questions About Visiting?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Our admissions team is happy to assist you with planning your
              visit or answering any questions you may have.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-gradient hover:bg-blue-50 font-semibold px-8 py-3 rounded-md shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <a
                href={`mailto:${contactEmail}`}
                aria-label="Contact Admissions"
              >
                Contact Admissions
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Visit;
