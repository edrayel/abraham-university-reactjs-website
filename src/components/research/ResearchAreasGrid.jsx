import React from 'react';
import { motion } from 'framer-motion';

const ResearchAreasGrid = ({ researchAreas, onResearchClick }) => {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Research <span className="text-gradient">Areas</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our cutting-edge research initiatives across diverse fields of study.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {researchAreas.map((area, index) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden card-hover cursor-pointer"
              onClick={onResearchClick}
            >
              <div className="h-48 bg-gradient-to-br from-blue-500 to-cyan-500 relative overflow-hidden">
                <img  className="w-full h-full object-cover" alt={area.image} src="https://images.unsplash.com/photo-1633362967859-fde6c856274d" />
                <div className="absolute top-4 left-4">
                  <area.icon className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{area.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{area.description}</p>
                <div className="flex justify-between text-sm">
                  <div>
                    <div className="font-semibold text-blue-600">{area.funding}</div>
                    <div className="text-gray-500">Funding</div>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-600">{area.projects}</div>
                    <div className="text-gray-500">Projects</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResearchAreasGrid;