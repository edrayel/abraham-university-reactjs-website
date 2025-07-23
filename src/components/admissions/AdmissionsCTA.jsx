import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const AdmissionsCTA = ({ onApplyClick, onScheduleVisit }) => {
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
            Ready to Join Our Community?
          </h2>
          <p className="text-xl mb-8 text-white/80">
            Take the first step toward your future. Start your application today and become part 
            of the Abraham University family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onApplyClick}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 hover:from-yellow-500 hover:to-yellow-700 text-lg px-8 py-4 rounded-full font-semibold"
            >
              Start Application
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onScheduleVisit}
              className="border-white text-white hover:bg-white hover:text-victorian-dark text-lg px-8 py-4 rounded-full font-semibold"
            >
              Schedule Campus Visit
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AdmissionsCTA;