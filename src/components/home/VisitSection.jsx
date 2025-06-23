import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin as VisitIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VisitSection = () => {
  return (
    <section className="section-padding bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl aspect-w-16 aspect-h-9">
              <img-replace src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" alt="Students walking on a beautiful university campus" className="w-full h-full object-cover" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <VisitIcon className="h-12 w-12 mb-4 text-blue-700" />
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Visit Our <span className="text-blue-700">Campus</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Experience the vibrant atmosphere of Abraham University firsthand. Schedule a campus tour, attend an information session, or explore our virtual tour options.
            </p>
            <Button asChild size="lg" className="bg-blue-700 hover:bg-blue-800 text-white rounded-md px-8 py-3">
              <Link to="/visit">Plan Your Visit</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VisitSection;