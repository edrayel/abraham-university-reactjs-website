import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AboutSection = () => {
  const features = [
    "World-renowned faculty and researchers",
    "State-of-the-art facilities and technology",
    "Strong alumni network and career support",
    "Diverse and inclusive campus community"
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="order-2 lg:order-1"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6 font-libreBaskerville">
              Why Choose <span className="text-gradient">Abraham University?</span>
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              For over 150 years, Abraham University has been at the forefront of higher education, 
              combining academic excellence with innovative research and a vibrant campus community.
            </p>
            <ul className="space-y-4 mb-8">
              {features.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2.5 h-2.5 bg-primary rounded-full mt-1.5"></div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-8 py-3">
              <Link to="/about">Learn More About Us</Link>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-w-4 aspect-h-3">
              <img-replace src="https://images.unsplash.com/photo-1562774053-676d19c1504a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" alt="Beautiful university campus with historic building" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 float-animation hidden md:block">
              <div className="text-3xl font-bold text-primary">150+</div>
              <div className="text-gray-600">Years of Excellence</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;