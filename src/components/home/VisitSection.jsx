import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { WORDPRESS_BASE_URL } from "@/config/api";

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
            <div className="rounded-lg overflow-hidden shadow-md aspect-w-16 aspect-h-9">
              <ImagePlaceholder
                src={`${WORDPRESS_BASE_URL}/photo-by-%e7%82%ab%e9%93%ad/`}
                alt="Students walking on a beautiful university campus"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300"></div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6 font-libreBaskerville">
              Visit <span className="text-gradient">Our Campus</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Experience the vibrant atmosphere of Abraham University firsthand.
              Schedule a campus tour, attend an information session, or explore
              our virtual tour options.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-8 py-3"
            >
              <Link to="/visit">Plan Your Visit</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VisitSection;
