import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import useUniversityStore from '@/stores/homeStore';

// Helper function to format date range for display
const formatEventDate = (startDate, endDate) => {
  if (!startDate) return "";
  
  const start = new Date(startDate);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  
  if (endDate && endDate !== startDate) {
    const end = new Date(endDate);
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  }
  
  return start.toLocaleDateString('en-US', options);
};

// Helper function to alternate background colors for fliers
const getBgColorByIndex = (index) => {
  return index % 2 === 0 ? 'bg-victorian-dark' : 'bg-victorian-medium';
};

const EventFliersSection = () => {
  const { upcomingEvents } = useUniversityStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Filter to show only featured events in the flier section if there are more than 4 events
  // Otherwise show all events
  const eventsToShow = upcomingEvents.length > 4 
    ? upcomingEvents.filter(event => event.featured_event).slice(0, 4)
    : upcomingEvents.slice(0, 4);

  useEffect(() => {
    if (eventsToShow.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % eventsToShow.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [eventsToShow.length]);

  // If no events, don't render anything
  if (eventsToShow.length === 0) {
    return null;
  }
  
  const currentEvent = eventsToShow[currentIndex];

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
              className={`absolute w-full h-full ${getBgColorByIndex(currentIndex)} text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between`}
            >
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8 order-2 md:order-1">
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl md:text-4xl font-bold mb-4 leading-tight font-libreBaskerville"
                >
                  {currentEvent.title}
                </motion.h3>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center text-sm opacity-90 mb-2"
                >
                  <CalendarDays className="h-4 w-4 mr-2" /> {formatEventDate(currentEvent.start_date, currentEvent.end_date)}
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center text-sm opacity-90 mb-5"
                >
                  <MapPin className="h-4 w-4 mr-2" /> {currentEvent.location || "Location TBA"}
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-6 text-sm md:text-base leading-relaxed opacity-95"
                >
                  {currentEvent.short_description || currentEvent.excerpt || "Join us for this exciting event!"}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button asChild size="lg" className="bg-victorian-gold text-white hover:bg-victorian-gold-bright font-semibold px-6 py-3 rounded-md transition-all">
                    <Link to={currentEvent.permalink || `/events/${currentEvent.slug}`}>
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
                  src={currentEvent.featured_image} 
                  alt={currentEvent.title} 
                  className="w-full h-full object-cover" 
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {eventsToShow.map((_, index) => (
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