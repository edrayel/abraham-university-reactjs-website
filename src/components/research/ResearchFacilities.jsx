import React from 'react';
import { motion } from 'framer-motion';

const ResearchFacilities = ({ facilities }) => {
  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            World-Class <span className="text-gradient">Facilities</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our state-of-the-art research facilities provide the tools and environment needed for breakthrough discoveries.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {facilities.map((facility, index) => (
            <motion.div
              key={facility.name}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden card-hover"
            >
              <div className="h-64 bg-gradient-to-br from-yellow-500 to-yellow-600 relative overflow-hidden">
                <img  className="w-full h-full object-cover" alt={facility.image} src="https://images.unsplash.com/photo-1693801241056-44d1dbba7d85" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{facility.name}</h3>
                <p className="text-gray-600 mb-4">{facility.description}</p>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-900">Key Equipment:</div>
                  {facility.equipment.map((item, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResearchFacilities;