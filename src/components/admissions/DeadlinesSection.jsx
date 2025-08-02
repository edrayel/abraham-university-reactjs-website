import React from 'react';
import { motion } from 'framer-motion';

const DeadlinesSection = ({ deadlines }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Application Deadlines</h2>
      <div className="space-y-4">
        {deadlines.map((deadline, index) => (
          <motion.div
            key={deadline.term}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
              deadline.status === 'open' ? 'border-green-500' :
              deadline.status === 'upcoming' ? 'border-yellow-500' : 'border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{deadline.term}</h3>
                <p className="text-gray-600">{deadline.deadline}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                deadline.status === 'open' ? 'bg-green-100 text-green-800' :
                deadline.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {deadline.status.charAt(0).toUpperCase() + deadline.status.slice(1)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DeadlinesSection;