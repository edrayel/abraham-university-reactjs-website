import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const RecentPublications = ({ publications, onPublicationClick }) => {
  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Recent <span className="text-gradient">Publications</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our latest research findings published in top-tier journals.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          {publications.map((publication, index) => (
            <motion.div
              key={publication.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 card-hover cursor-pointer"
              onClick={onPublicationClick}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{publication.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <span className="font-medium text-yellow-600">{publication.journal}</span>
                    <span>{publication.date}</span>
                  </div>
                  <p className="text-gray-700">{publication.authors}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-victorian-dark">{publication.citations}</div>
                  <div className="text-sm text-gray-500">Citations</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            onClick={onPublicationClick}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900"
          >
            View All Publications
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RecentPublications;