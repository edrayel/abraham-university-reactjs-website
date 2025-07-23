import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Clock } from 'lucide-react';

const DepartmentContacts = ({ departments }) => {
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
            Department <span className="text-gradient">Contacts</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect directly with specific departments for specialized assistance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {departments.map((dept, index) => (
            <motion.div
              key={dept.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 text-center card-hover"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <dept.icon className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{dept.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center justify-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {dept.phone}
                </p>
                <p className="flex items-center justify-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {dept.email}
                </p>
                <p className="flex items-center justify-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {dept.hours}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DepartmentContacts;