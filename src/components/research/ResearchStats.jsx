import React from 'react';
import { motion } from 'framer-motion';

const statsData = [
  { value: '$150M+', label: 'Annual Research Funding' },
  { value: '500+', label: 'Active Research Projects' },
  { value: '1,200+', label: 'Research Faculty' },
  { value: '50+', label: 'Research Centers' },
];

const ResearchStats = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-4xl font-bold text-yellow-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResearchStats;