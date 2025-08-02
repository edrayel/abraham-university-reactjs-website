import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Users, Globe, BookOpen } from 'lucide-react';

const ResearchCollaboration = ({ onCollaborateClick }) => {
  return (
    <section className="section-padding hero-gradient">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <h2 className="text-4xl font-bold mb-6">Research Collaboration</h2>
            <p className="text-xl text-white/80 mb-6 leading-relaxed">
              Partner with our world-class researchers and access cutting-edge facilities 
              to advance your research goals and make breakthrough discoveries.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start space-x-3">
                <Users className="h-6 w-6 text-cyan-300 mt-1" />
                <span className="text-white/80">Interdisciplinary research teams</span>
              </li>
              <li className="flex items-start space-x-3">
                <Globe className="h-6 w-6 text-cyan-300 mt-1" />
                <span className="text-white/80">International partnerships</span>
              </li>
              <li className="flex items-start space-x-3">
                <BookOpen className="h-6 w-6 text-cyan-300 mt-1" />
                <span className="text-white/80">Access to specialized resources</span>
              </li>
            </ul>
            <Button
              size="lg"
              onClick={onCollaborateClick}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 hover:from-yellow-500 hover:to-yellow-700 font-semibold"
            >
              Start Collaboration
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img  className="w-full h-96 object-cover" alt="Research collaboration" src="https://images.unsplash.com/photo-1701848055770-effbdb148e15" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ResearchCollaboration;