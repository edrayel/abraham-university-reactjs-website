import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  Award,
  Clock,
  ChevronRight,
  Search,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useProgramsStore from "@/stores/programStore"; // Adjust the import path as needed

const Academics = () => {
  const {
    programs,
    schools,
    categories,
    isLoading,
    error,
    fetchAllData,
    // getProgramsBySchool,
  } = useProgramsStore();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Map JSON categories to component format, adding "All Programs"
  const mappedCategories = [
    { id: "all", name: "All Programs" },
    ...categories.map((cat) => ({
      id: cat.name.toLowerCase(),
      name: cat.name,
    })),
  ];

  // Map JSON programs to component format
  const mappedPrograms = programs.map((program, index) => ({
    id: index + 1,
    title: program.name,
    category: program.category
      ? program.category.toLowerCase()
      : "undergraduate",
    degree: program.degree,
    duration: program.duration,
    description: program.description,
    image: "https://images.unsplash.com/photo-1591206246224-04b4624adef4", // Use consistent image
    features: [], // Empty, as JSON doesn't provide features
  }));

  // Map JSON schools to component format
  const mappedSchools = schools.map((school) => ({
    name: school.name,
    description: school.description,
    image:
      school.image_url ||
      "https://images.unsplash.com/photo-1658308910802-b71fa184aa48",
    // programs: getProgramsBySchool(school.name).length || "Multiple Programs",
    icon: school.icon === "building" ? Building2 : Building2, // Fallback to Building2
    color: school.color || "#000000",
    exploreProgramsUrl: school.explore_programs_url || "#",
  }));

  // Filter programs based on category and search term
  const filteredPrograms = mappedPrograms.filter((program) => {
    const matchesCategory =
      selectedCategory === "all" || program.category === selectedCategory;
    const matchesSearch =
      program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleProgramClick = () => {
    toast({
      title: "🚧 Program Details",
      description:
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleApplyClick = () => {
    toast({
      title: "🚧 Application Portal",
      description:
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20">
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
    return <div className="min-h-screen pt-20 text-center">Error: {error}</div>;
  }

  if (!mappedPrograms.length && !mappedSchools.length) {
    return (
      <div className="min-h-screen pt-20 text-center">
        No programs or schools available.
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
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
            background: linear-gradient(to right, #3b82f6, #06b6d4);
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
      <section className="section-padding hero-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Academic Programs
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Discover world-class academic programs designed to prepare you for
              success in your chosen field. From undergraduate to doctoral
              studies, we offer comprehensive education across diverse
              disciplines.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {mappedCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden card-hover cursor-pointer"
                onClick={handleProgramClick}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${program.title}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleProgramClick();
                  }
                }}
              >
                <div className="h-48 bg-gradient-to-br from-blue-500 to-cyan-500 relative overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    alt={program.title}
                    src={program.image}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                      {program.degree}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {program.title}
                    </h3>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {program.duration}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{program.description}</p>
                  <div className="space-y-2 mb-4">
                    {program.features.slice(0, 2).map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-blue-600 font-medium">
                      Learn More
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyClick();
                      }}
                      className="bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Schools */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-gradient">Colleges</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our diverse colleges, each offering
              specialized programs and expertise.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mappedSchools.map((school, index) => (
              <motion.div
                key={school.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden card-hover cursor-pointer"
                onClick={handleProgramClick}
                role="button"
                tabIndex={0}
                aria-label={`Explore ${school.name}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleProgramClick();
                  }
                }}
              >
                <div
                  className="h-48 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(to bottom right, ${school.color}, #06b6d4)`,
                  }}
                >
                  <img
                    className="w-full h-full object-cover"
                    alt={school.name}
                    src={school.image}
                  />
                  <div className="absolute top-4 right-4 flex items-center space-x-2">
                    <school.icon className="h-6 w-6 text-white" />
                    <span className="bg-white/90 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                      {typeof school.programs === "number"
                        ? `${school.programs} ${
                            school.programs === 1 ? "Program" : "Programs"
                          }`
                        : school.programs}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {school.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{school.description}</p>
                  <a
                    href={school.exploreProgramsUrl}
                    className="flex items-center text-blue-600 font-medium hover:underline"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Explore programs for ${school.name}`}
                  >
                    Explore Programs
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Excellence */}
      <section className="section-padding hero-gradient">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <h2 className="text-4xl font-bold mb-6">Academic Excellence</h2>
              <p className="text-xl text-blue-100 mb-6 leading-relaxed">
                Our commitment to academic excellence is reflected in our
                innovative curriculum, world-class faculty, and state-of-the-art
                facilities.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start space-x-3">
                  <Award className="h-6 w-6 text-cyan-300 mt-1" />
                  <span className="text-blue-100">
                    Nationally ranked programs
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <Users className="h-6 w-6 text-cyan-300 mt-1" />
                  <span className="text-blue-100">
                    Small class sizes with personalized attention
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <BookOpen className="h-6 w-6 text-cyan-300 mt-1" />
                  <span className="text-blue-100">
                    Hands-on learning opportunities
                  </span>
                </li>
              </ul>
              <Button
                size="lg"
                onClick={handleApplyClick}
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
              >
                Start Your Application
              </Button>
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
                  alt="Academic excellence"
                  src="https://images.unsplash.com/photo-1581090124321-d19ad6d7cd5a"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Academics;
