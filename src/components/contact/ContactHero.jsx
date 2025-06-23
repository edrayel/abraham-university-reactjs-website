import React from 'react';
import { motion } from 'framer-motion';

const ContactHero = () => {
  return (
    <section className="section-padding hero-gradient">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            We're here to help you with any questions about Abraham University. 
            Reach out to us and we'll get back to you as soon as possible.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactHero;