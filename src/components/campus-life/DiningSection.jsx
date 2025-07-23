import React from 'react';
import { motion } from 'framer-motion';
import { Utensils } from 'lucide-react';

const DiningSection = ({ diningOptions }) => {
  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Campus <span className="text-gradient">Dining</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Enjoy diverse dining options across campus, from all-you-can-eat dining halls 
              to quick grab-and-go options that fit your busy schedule.
            </p>
            <div className="space-y-6">
              {diningOptions.map((option, index) => (
                <motion.div
                  key={option.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{option.name}</h3>
                    <span className="text-sm text-yellow-600 font-medium">{option.hours}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{option.type}</p>
                  <div className="flex flex-wrap gap-2">
                    {option.features.map((feature, idx) => (
                      <span key={idx} className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img  className="w-full h-96 object-cover" alt="Campus dining" src="https://images.unsplash.com/photo-1680554738924-a1b3a6bdb13a" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-6 float-animation">
              <div className="flex items-center space-x-2">
                <Utensils className="h-6 w-6 text-yellow-600" />
                <div>
                  <div className="text-lg font-bold text-gray-900">15+</div>
                  <div className="text-sm text-gray-600">Dining Options</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DiningSection;