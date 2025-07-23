import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const CampusLifeCTA = ({ onJoinClick, onEventClick }) => {
  return (
    <section className="section-padding hero-gradient">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-white"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Experience Campus Life?
          </h2>
          <p className="text-xl mb-8 text-white/80">
            Join our vibrant community and discover all the opportunities waiting for you at Abraham University.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onJoinClick}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 hover:from-yellow-500 hover:to-yellow-700 text-lg px-8 py-4 rounded-full font-semibold"
            >
              Explore Organizations
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onEventClick}
              className="border-white text-white hover:bg-white hover:text-victorian-dark text-lg px-8 py-4 rounded-full font-semibold"
            >
              View Campus Events
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CampusLifeCTA;