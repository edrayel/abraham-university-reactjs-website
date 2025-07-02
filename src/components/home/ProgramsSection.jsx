import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';

const programsData = [
  {
    title: 'Computer Science',
    description: 'Cutting-edge technology and programming',
    imageAlt: 'Students collaborating in a modern computer lab',
    imageQuery: 'computer-science-students',
    link: '/academics',
  },
  {
    title: 'Business Administration',
    description: 'Leadership and entrepreneurship skills',
    imageAlt: 'Diverse group of business students in discussion',
    imageQuery: 'business-students-discussion',
    link: '/academics',
  },
  {
    title: 'Engineering',
    description: 'Innovation and problem-solving',
    imageAlt: 'Engineering students working with advanced equipment',
    imageQuery: 'engineering-students-equipment',
    link: '/academics',
  },
  {
    title: 'Medicine',
    description: 'Healthcare and medical research',
    imageAlt: 'Medical students in a state-of-the-art laboratory',
    imageQuery: 'medical-students-lab',
    link: '/academics',
  },
];

const ProgramsSection = () => {
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
            Discover world-class academic programs designed to prepare you for success in your chosen field.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {programsData.map((program, index) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-md shadow-lg overflow-hidden card-hover group"
            >
              <Link to={program.link} className="block">
                <ImagePlaceholder
                       src="https://placehold.co/400x300/E0E0E0/333333/png?text=Program+Image"
                       alt={program.imageAlt}
                       className="group-hover:scale-105 transition-transform duration-300"
                   />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors font-libreBaskerville">{program.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{program.description}</p>
                  <div className="flex items-center text-primary font-medium group-hover:underline text-sm">
                    Learn More
                    <ChevronRight className="ml-1 h-4 w-4 inline-block align-middle" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-8 py-3">
            <Link to="/academics">View All Programs</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;