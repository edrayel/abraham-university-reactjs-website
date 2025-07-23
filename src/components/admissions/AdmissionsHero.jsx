import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const AdmissionsHero = ({ onApplyClick, onScheduleVisit }) => {
  return (
    <section className="pt-60 pb-40 hero-gradient">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Admissions</h1>
          <p className="text-xl text-white/80 leading-relaxed mb-8">
            Begin your journey at Abraham University. We're here to guide you
            through every step of the admissions process and help you achieve
            your academic goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onApplyClick}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 hover:from-yellow-500 hover:to-yellow-700 text-lg px-8 py-4 rounded-full font-semibold"
            >
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onScheduleVisit}
              className="border-white text-white hover:bg-white hover:text-victorian-dark text-lg px-8 py-4 rounded-full font-semibold"
            >
              Schedule a Visit
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AdmissionsHero;