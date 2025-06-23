import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const eventsData = [
  {
    title: 'Annual Research Symposium',
    date: 'July 15, 2025',
    location: 'University Grand Hall',
    imageAlt: 'Students presenting research at a symposium',
    imageQuery: 'research-symposium-event',
    link: '/events#research-symposium',
  },
  {
    title: 'Homecoming Weekend',
    date: 'October 10-12, 2025',
    location: 'Campus Wide',
    imageAlt: 'Alumni and students at a homecoming football game',
    imageQuery: 'homecoming-event',
    link: '/events#homecoming-2025',
  },
  {
    title: 'Distinguished Speaker Series: Dr. Jane Goodall',
    date: 'November 5, 2025',
    location: 'Performing Arts Center',
    imageAlt: 'Dr. Jane Goodall speaking on stage',
    imageQuery: 'speaker-series-event',
    link: '/events#speaker-goodall',
  },
];

const EventsSection = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Upcoming <span className="text-blue-700">Events</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join us for exciting events and activities on campus and beyond.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {eventsData.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden card-hover group"
            >
              <Link to={event.link} className="block">
                <div className="h-56 relative overflow-hidden">
                  <img-replace src={`https://source.unsplash.com/random/400x300/?${event.imageQuery}`} alt={event.imageAlt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-6">
                  <div className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wider">{event.date}</div>
                  <div className="text-xs text-gray-500 mb-2">{event.location}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors">{event.title}</h3>
                  <div className="flex items-center text-blue-600 font-medium group-hover:underline">
                    Event Details
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline" className="border-blue-700 text-blue-700 hover:bg-blue-50 hover:text-blue-800 rounded-md px-8 py-3">
            <Link to="/events">View All Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;