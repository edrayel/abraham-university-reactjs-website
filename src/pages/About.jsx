import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Users,
  Globe,
  BookOpen,
  Target,
  Heart,
  Lightbulb,
} from "lucide-react";
import useAboutStore from "@/stores/useAboutStore";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import LoadingState from "@/components/common/LoadingState";
import EmptyState from "@/components/common/EmptyState";

const About = () => {
  const {
    mission,
    vision,
    values,
    history,
    leadership,
    statistics,
    isLoading,
    error,
    fetchAllData,
  } = useAboutStore();

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const iconMap = {
    target: Target,
    heart: Heart,
    lightbulb: Lightbulb,
    users: Users,
    star: Award,
    globe: Globe,
    "": BookOpen,
  };

  const mappedValues = values.map((value) => ({
    title: value.title,
    description: value.description,
    icon: iconMap[value.icon.toLowerCase()] || Target,
  }));

  const mappedMilestones = history.map((event) => ({
    year: event.year,
    event: event.event,
  }));

  const mappedLeadership = leadership.map((leader) => ({
    name: `${leader.title} ${leader.name}`,
    title: leader.bio,
    image:
      leader.image ||
      "https://images.unsplash.com/photo-1595956553066-fe24a8c33395",
  }));

  const mappedStatistics = statistics.map((stat) => ({
    icon: iconMap[stat.icon.toLowerCase()] || BookOpen,
    number: stat.value,
    label: stat.label,
  }));

  if (isLoading) {
    return <LoadingState type="page" message="Loading About Information" />;
  }

  
  if (error) {
    return (
      <ErrorBoundary 
        error={error} 
        onRetry={() => {
          fetchAllData();
        }}
        customMessage="We're having trouble loading information about Abraham University. This could be due to server maintenance or connectivity issues."
      />
    );
  }

  if (
    !mission &&
    !vision &&
    !mappedValues.length &&
    !mappedMilestones.length &&
    !mappedLeadership.length &&
    !mappedStatistics.length
  ) {
    return (
      <EmptyState
        type="data"
        title="No University Information Available"
        message="Information about Abraham University is currently unavailable."
        onRetry={fetchAllData}
        className="min-h-screen"
      />
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-60 pb-40 hero-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About Abraham University
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              For over 150 years, we have been dedicated to advancing knowledge,
              fostering innovation, and preparing students to make a positive
              impact on the world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {mission}
              </p>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Our Vision
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">{vision}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  className="w-full h-96 object-cover"
                  alt="University mission"
                  src="https://images.unsplash.com/photo-1562212424-f9452f6d6e8f"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-gradient">Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do and shape our university
              community.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mappedValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg text-center card-hover"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                  <value.icon className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-gradient">History</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A timeline of key milestones in Abraham University's journey of
              excellence.
            </p>
          </motion.div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-amber-200"></div>
              {mappedMilestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-center mb-8 ${
                    index % 2 === 0 ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`w-1/2 ${
                      index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"
                    }`}
                  >
                    <div className="bg-white rounded-lg border border-gray-200 p-6 transition-colors duration-300 hover:bg-gray-50">
                      <div className="text-2xl font-bold text-amber-600 mb-2 transition-colors duration-300 hover:text-amber-600">
                        {milestone.year}
                      </div>
                      <div className="text-gray-700 transition-colors duration-300 hover:text-gray-700">{milestone.event}</div>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-amber-600 rounded-full border-4 border-white shadow-lg"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="section-padding bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Our <span className="text-gradient">Leadership</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Meet the visionary leaders who guide Abraham University toward
              excellence.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mappedLeadership.map((leader, index) => (
              <motion.div
                key={leader.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg card-hover flex flex-col h-full"
              >
                <div className="h-64 bg-gradient-to-br from-amber-500 to-amber-700">
                  <img
                    className="w-full h-full object-cover"
                    alt={leader.name}
                    src={leader.image}
                  />
                </div>
                <div className="p-6 text-center bg-gray-800 flex-grow flex flex-col justify-center group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-amber-700">
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-black">
                    {leader.name}
                  </h3>
                  <p className="text-gray-300 group-hover:text-black">{leader.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            {mappedStatistics.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <stat.icon className="h-12 w-12 mx-auto mb-4 text-victorian-gold-bright" />
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
