import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GivingSection = () => {
  return (
    <section className="section-padding bg-blue-700 text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <Gift className="h-16 w-16 mx-auto mb-6 text-sky-300" />
          <h2 className="text-4xl font-bold mb-6">Support Abraham University</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Your generosity empowers students, fuels research, and strengthens our community. Make a gift today and invest in the future.
          </p>
          <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-100 rounded-md px-10 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
            <Link to="/giving">Give Now</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default GivingSection;