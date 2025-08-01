import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users,
  Briefcase,
  CalendarCheck,
  Gift,
  Network,
  ArrowRight,
  MessageSquare,
  Globe,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useAlumniStore from "@/stores/useAlumniStore";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import LoadingState from "@/components/common/LoadingState";
import EmptyState from "@/components/common/EmptyState";

const Alumni = () => {
  const {
    statistics,
    notableAlumni,
    services,
    isLoading,
    error,
    fetchAllData,
  } = useAlumniStore();

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Map JSON icon strings to Lucide React icons
  const iconMap = {
    users: Users,
    briefcase: Briefcase,
    globe: Globe,
    trophy: Trophy,
    network: Network,
    calendar: CalendarCheck,
    gift: Gift,
    "graduation-cap": MessageSquare, // Map 'graduation-cap' to MessageSquare as a fallback
  };

  // Map JSON statistics to component format
  const mappedStats = statistics.map((stat) => ({
    number: stat.value,
    label: stat.label,
    icon: iconMap[stat.icon.toLowerCase()] || Users, // Fallback to Users
  }));

  // Map JSON notable_alumni to component format
  const mappedNotableAlumni = notableAlumni.map((alumnus) => {
    // Derive image query from field (e.g., "Nobel Laureate, Physics" -> "physics")
    const imageQuery = alumnus.field
      .toLowerCase()
      .split(",")[0]
      .replace(/ /g, "-");
    return {
      name: alumnus.name,
      field: alumnus.field,
      year: alumnus.year,
      achievement: alumnus.achievement,
      imageQuery:
        alumnus.image ||
        `https://source.unsplash.com/random/400x400/?${imageQuery}`,
    };
  });

  // Map JSON services to component format
  const mappedServices = services.map((service) => ({
    title: service.title,
    description: service.description,
    icon: iconMap[service.icon.toLowerCase()] || Briefcase, // Fallback to Briefcase
    link: service.link || null,
  }));

  const handleAlumniAction = (actionTitle) => {
    toast({
      title: `🚧 ${actionTitle}`,
      description:
        "This alumni feature isn't implemented yet. Please check back soon! 🚀",
    });
  };

  if (isLoading) {
    return (
      <LoadingState 
        type="page" 
        message="Loading alumni information..." 
      />
    );
  }

  if (error) {
    return (
      <ErrorBoundary 
        error={error}
        message="We're having trouble loading alumni information. Please try again or check back later."
        onRetry={() => fetchAllData()}
      />
    );
  }

  if (
    !mappedStats.length &&
    !mappedNotableAlumni.length &&
    !mappedServices.length
  ) {
    return (
      <EmptyState
        type="generic"
        title="No Alumni Information Available"
        description="We're currently updating our alumni database or experiencing temporary data issues."
        onRetry={() => fetchAllData()}
        retryText="Reload Alumni Data"
      />
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
          .text-gradient {
            background: linear-gradient(to right, #eab308, #f59e0b);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
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
      <section className="pt-60 pb-40 hero-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-4xl mx-auto"
          >

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our Proud Alumni
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Welcome to the Abraham University Alumni Association – a global
              network of graduates making an impact worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {mappedStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                role="presentation"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-gradient" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Notable <span className="text-gradient">Alumni</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our graduates have gone on to achieve great things in various
              fields. Here are just a few examples.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {mappedNotableAlumni.map((alumnus, index) => (
              <motion.div
                key={alumnus.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden card-hover group text-center"
                role="presentation"
              >
                <div className="h-64 relative">
                  <img
                    src={alumnus.imageQuery}
                    alt={`Portrait of ${alumnus.name}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1 group-hover:text-gradient">
                    {alumnus.name}
                  </h3>
                  <p className="text-sm text-victorian-dark font-medium mb-1">
                    {alumnus.field} ({alumnus.year})
                  </p>
                  <p className="text-gray-600 text-xs">{alumnus.achievement}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Alumni <span className="text-gradient">Services & Benefits</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              As a graduate of Abraham University, you have access to a wide
              range of resources and opportunities.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mappedServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-start space-x-6"
                role="presentation"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center">
                  <service.icon className="h-6 w-6 text-gradient" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  {service.link ? (
                    <a
                      href={service.link}
                      className="text-victorian-dark hover:text-yellow-600 font-medium flex items-center"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Learn more about ${service.title}`}
                    >
                      Learn More <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  ) : (
                    <Button
                      variant="link"
                      className="text-victorian-dark hover:text-yellow-600 p-0"
                      onClick={() => handleAlumniAction(service.title)}
                    >
                      Learn More <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding hero-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <Network className="h-12 w-12 mx-auto mb-6 text-yellow-300" />
            <h2 className="text-3xl font-bold mb-4">Get Involved!</h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Stay connected, volunteer your time, mentor students, or attend an
              event. There are many ways to be an active part of the Abraham
              University alumni community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => handleAlumniAction("Update Your Info")}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 hover:from-yellow-500 hover:to-yellow-700 font-semibold px-8 py-3 rounded-md shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Update Your Info
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleAlumniAction("Find an Event")}
                className="border-white text-white hover:bg-white hover:text-victorian-dark font-semibold px-8 py-3 rounded-md shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Find an Event
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Alumni;
