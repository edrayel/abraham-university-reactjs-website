import React from 'react';
import { motion } from 'framer-motion';

const CampusLifeHero = () => {
  return (
    <section className="pt-60 pb-40 hero-gradient">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Campus Life</h1>
          <p className="text-xl text-white/80 leading-relaxed">
            Experience a vibrant campus community where learning extends beyond the classroom. 
            Discover opportunities to grow, connect, and create lasting memories.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CampusLifeHero;