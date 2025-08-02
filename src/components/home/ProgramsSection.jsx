import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, BookOpen, Users, Award, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import useUniversityStore from "@/stores/homeStore";
import { WORDPRESS_BASE_URL } from '@/config/api';

// Icon mapping for program icons
const iconMap = {
  book: BookOpen,
  users: Users,
  award: Award,
  "graduation-cap": GraduationCap,
  // Add more mappings as needed
};

const ProgramsSection = () => {
  const { featuredPrograms, isLoading, error } = useUniversityStore();

  // Show loading state
  if (isLoading) {
    return (
      <section className="section-padding bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-10 bg-gray-200 rounded max-w-md mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded max-w-2xl mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-md shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="section-padding bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">Error loading programs: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state if no programs
  if (!featuredPrograms || featuredPrograms.length === 0) {
    return (
      <section className="section-padding bg-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4 font-libreBaskerville">
              Explore <span className="text-gradient">Our Programs</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover world-class academic programs designed to prepare you for
              success in your chosen field.
            </p>
            <p className="text-gray-500">No featured programs available at the moment.</p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-gray-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4 font-libreBaskerville">
            Explore <span className="text-gradient">Our Programs</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover world-class academic programs designed to prepare you for
            success in your chosen field.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredPrograms.map((program, index) => {
            const IconComponent = iconMap[program.icon] || BookOpen;
            
            return (
              <motion.div
                key={program.name || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-md shadow-lg overflow-hidden card-hover group"
              >
                <Link 
                  to={program.learn_more_url || "/academics"} 
                  className="block"
                  target={program.learn_more_url?.startsWith('http') ? '_blank' : '_self'}
                  rel={program.learn_more_url?.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {/* Program Image or Icon */}
                  <div className="h-48 bg-gradient-to-br from-yellow-500 to-yellow-600 relative overflow-hidden">
                    {program.image_url ? (
                      <ImagePlaceholder
                        src={program.image_url}
                        alt={`${program.name} program`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : program.image_id ? (
                      <ImagePlaceholder
                        src={`${WORDPRESS_BASE_URL}/wp-content/uploads/${program.image_id}`}
                        alt={`${program.name} program`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <IconComponent className="w-16 h-16 text-yellow-600" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-2">
                      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-primary transition-colors font-libreBaskerville">
                        {program.name}
                      </h3>
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-2">
                      <span className="font-medium">{program.degree}</span>
                      {program.category && (
                        <span className="ml-2">• {program.category}</span>
                      )}
                    </div>
                    
                    {program.school && (
                      <div className="text-sm text-yellow-600 mb-2">
                        {program.school}
                      </div>
                    )}
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {program.description}
                    </p>
                    
                    {(program.duration || program.credits) && (
                      <div className="text-xs text-gray-500 mb-4 space-y-1">
                        {program.duration && (
                          <div>Duration: {program.duration}</div>
                        )}
                        {program.credits && (
                          <div>Credits: {program.credits}</div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-primary font-medium group-hover:underline text-sm">
                        Learn More
                        <ChevronRight className="ml-1 h-4 w-4 inline-block align-middle" />
                      </div>
                      
                      {program.apply_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (program.apply_url?.startsWith('http')) {
                              window.open(program.apply_url, '_blank', 'noopener,noreferrer');
                            } else {
                              window.location.href = program.apply_url;
                            }
                          }}
                        >
                          Apply
                        </Button>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-8 py-3"
          >
            <Link to="/academics">View All Programs</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
