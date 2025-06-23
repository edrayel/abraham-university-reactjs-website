import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const RequirementsSection = ({ programTypeName, requirements }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        {programTypeName} Requirements
      </h2>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <ul className="space-y-4">
          {requirements.map((requirement, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3"
            >
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{requirement}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default RequirementsSection;