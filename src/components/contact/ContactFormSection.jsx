import React from 'react';
import { motion } from 'framer-motion';
import ContactForm from '@/components/contact/ContactForm';
import MapSection from '@/components/contact/MapSection';

const ContactFormSection = ({ onSubmit, onScheduleVisit, onDirectionsClick, onQuickActionToast }) => {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <ContactForm onSubmit={onSubmit} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <MapSection 
              onDirectionsClick={onDirectionsClick} 
              onScheduleVisit={onScheduleVisit}
              onQuickActionToast={onQuickActionToast}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;