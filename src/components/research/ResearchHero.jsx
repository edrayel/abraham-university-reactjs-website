import React from 'react';
import { motion } from 'framer-motion';

const ResearchHero = () => {
  return (
    <section className="section-padding hero-gradient">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Research Excellence</h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            Pushing the boundaries of knowledge through groundbreaking research that addresses 
            global challenges and shapes the future of science and technology.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ResearchHero;