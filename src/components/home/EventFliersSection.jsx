import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';

const flierData = [
  {
    id: 1,
    title: 'Innovate & Inspire: Tech Summit 2025',
    date: 'August 5-7, 2025',
    location: 'Innovation Hub Auditorium',
    description: 'Join leading tech visionaries, workshops, and networking opportunities. Discover the future of technology.',
    imageQuery: 'tech-summit-conference-futuristic',
    link: '/events#tech-summit',
    bgColor: 'bg-victorian-dark',
    textColor: 'text-white',
    buttonColor: 'bg-victorian-gold text-white hover:bg-victorian-gold-bright',
  },
  {
    id: 2,
    title: 'Global Arts Festival: A World of Creativity',
    date: 'September 12-15, 2025',
    location: 'Campus Green & Performing Arts Center',
    description: 'Experience diverse cultures through music, dance, visual arts, and culinary delights. A celebration for all!',
    imageQuery: 'multicultural-arts-festival-vibrant',
    link: '/events#arts-festival',
    bgColor: 'bg-victorian-medium',
    textColor: 'text-white',
    buttonColor: 'bg-victorian-gold text-white hover:bg-victorian-gold-bright',
  },
  {
    id: 3,
    title: 'Sustainability Solutions Challenge',
    date: 'October 22, 2025',
    location: 'Environmental Science Building',
    description: 'Students present innovative solutions for a greener future. Keynote by renowned environmentalists.',
    imageQuery: 'sustainability-event-green-technology',
    link: '/events#sustainability-challenge',
    bgColor: 'bg-victorian-dark',
    textColor: 'text-white',
    buttonColor: 'bg-victorian-gold text-white hover:bg-victorian-gold-bright',
  },
  {
    id: 4,
    title: 'Alumni Homecoming Gala: Legacy & Future',
    date: 'November 8, 2025',
    location: 'Grand Ballroom, University Center',
    description: 'Reconnect with fellow graduates, celebrate achievements, and support the next generation of leaders.',
    imageQuery: 'elegant-gala-event-alumni',
    link: '/alumni#homecoming-gala',
    bgColor: 'bg-victorian-medium',
    textColor: 'text-white',
    buttonColor: 'bg-victorian-gold text-white hover:bg-victorian-gold-bright',
  }
];

const EventFliersSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % flierData.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const currentFlier = flierData[currentIndex];

  const variants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
  };

  return (
    <section className="section-padding bg-gray-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-3 font-libreBaskerville">
            Don't Miss Out! <span className="text-gradient">Upcoming Events</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay informed about the latest exciting events happening at Abraham University.
          </p>
        </motion.div>

        <div className="relative h-[500px] md:h-[445px] w-full max-w-screen-2xl mx-auto overflow-hidden rounded-md">
          <AnimatePresence initial={false} custom={currentIndex}>
            <motion.div
              key={currentIndex}
              custom={currentIndex}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className={`absolute w-full h-full ${currentFlier.bgColor} ${currentFlier.textColor} p-8 md:p-12 flex flex-col md:flex-row items-center justify-between`}
            >
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8 order-2 md:order-1">
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl md:text-4xl font-bold mb-4 leading-tight font-libreBaskerville"
                >
                  {currentFlier.title}
                </motion.h3>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center text-sm opacity-90 mb-2"
                >
                  <CalendarDays className="h-4 w-4 mr-2" /> {currentFlier.date}
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center text-sm opacity-90 mb-5"
                >
                  <MapPin className="h-4 w-4 mr-2" /> {currentFlier.location}
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-6 text-sm md:text-base leading-relaxed opacity-95"
                >
                  {currentFlier.description}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button asChild size="lg" className={`${currentFlier.buttonColor} font-semibold px-6 py-3 rounded-md transition-all`}>
                    <Link to={currentFlier.link}>
                      Learn More <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
                className="md:w-1/2 h-48 md:h-48 md:h-full order-1 md:order-2 rounded-md overflow-hidden"
              >
                <ImagePlaceholder 
                  src={`https://placehold.co/600x600?text=${encodeURIComponent(currentFlier.imageQuery.replace(/-/g, '+'))}`} 
                  alt={currentFlier.title} 
                  className="w-full h-full object-cover" 
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {flierData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to flier ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventFliersSection;