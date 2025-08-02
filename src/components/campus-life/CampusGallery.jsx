import React from "react";
import { motion } from "framer-motion";

const CampusGallery = ({ images, onEventClick }) => {
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
            Campus <span className="text-gradient">Gallery</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take a visual tour of our beautiful campus and vibrant student life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((imageDesc, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative rounded-xl overflow-hidden shadow-lg card-hover cursor-pointer"
              onClick={onEventClick}
            >
              <div className="h-64 bg-gradient-to-br from-yellow-500 to-yellow-600">
                <img
                  className="w-full h-full object-cover"
                  alt={`Campus life ${index + 1}`}
                  src="https://images.unsplash.com/photo-1595872018818-97555653a011"
                />
              </div>
              <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CampusGallery;
