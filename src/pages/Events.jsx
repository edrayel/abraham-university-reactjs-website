import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Search, Filter, ChevronRight, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const API_ENDPOINT = 'https://abrahamuniversity-v1.edwardrajah.com/wp-json/abraham/v1/events';

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        
        setEvents(data.events || []);
        setFilteredEvents(data.events || []);
        
        // Set categories with 'All Events' option
        const apiCategories = data.categories || [];
        setCategories([
          { id: 'all', name: 'All Events', slug: 'all' },
          ...apiCategories
        ]);
        
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Re-filter events when events data changes
  useEffect(() => {
    filterEvents(searchTerm, selectedCategory);
  }, [events, searchTerm, selectedCategory]);

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterEvents(term, selectedCategory);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    filterEvents(searchTerm, categoryId);
  };

  const filterEvents = (term, category) => {
    let filteredEvents = events;
    
    // Filter by category
    if (category !== 'all') {
      filteredEvents = filteredEvents.filter(event => 
        event.categories && event.categories.some(cat => cat.slug === category)
      );
    }
    
    // Filter by search term
    if (term) {
      filteredEvents = filteredEvents.filter(event =>
        event.title.toLowerCase().includes(term) ||
        (event.short_description && event.short_description.toLowerCase().includes(term)) ||
        (event.content && event.content.toLowerCase().includes(term)) ||
        (event.location && event.location.toLowerCase().includes(term))
      );
    }
    
    setFilteredEvents(filteredEvents);
  };

  const formatDate = (startDateString, endDateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const startDate = new Date(startDateString).toLocaleDateString(undefined, options);
    if (endDateString && endDateString !== startDateString) {
      const endDate = new Date(endDateString).toLocaleDateString(undefined, options);
      return `${startDate} - ${endDate}`;
    }
    return startDate;
  };

  const formatTime = (startTime, endTime) => {
    if (!startTime) return '';
    if (endTime && endTime !== startTime) {
      return `${startTime} - ${endTime}`;
    }
    return startTime;
  };

  const handleEventClick = (eventName) => {
    toast({
      title: `🚧 ${eventName}`,
      description: "Details for this event are not yet available. Please check back later! 🚀",
    });
  };
  
  const handleRegisterClick = (eventName) => {
    toast({
      title: `🚧 Register for ${eventName}`,
      description: "Online registration for this event isn't implemented yet. Please contact the event organizer. 🚀",
    });
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="section-padding hero-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <CalendarDays className="h-16 w-16 mx-auto mb-6 text-sky-300" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">University Events</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Discover upcoming events, workshops, performances, and community gatherings at Abraham University.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Bar */}
      <section className="py-8 bg-white shadow-sm sticky top-20 z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <div className="relative w-full md:w-auto md:min-w-[200px]">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
              >
                {categories.map(cat => (
                  <option key={cat.id || cat.slug} value={cat.slug || cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <CalendarDays className="h-24 w-24 mx-auto text-gray-300 mb-4 animate-pulse" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Loading Events...</h2>
              <p className="text-gray-500">Please wait while we fetch the latest events.</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <CalendarDays className="h-24 w-24 mx-auto text-red-300 mb-4" />
              <h2 className="text-2xl font-semibold text-red-700 mb-2">Error Loading Events</h2>
              <p className="text-red-500 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-red-600 hover:bg-red-700"
              >
                Try Again
              </Button>
            </motion.div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => {
                const eventTime = formatTime(event.start_time, event.end_time);
                const primaryCategory = event.categories && event.categories.length > 0 ? event.categories[0] : null;
                
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden card-hover group flex flex-col"
                  >
                    <div className="h-56 relative overflow-hidden">
                      <img
                        src={event.featured_image || `https://source.unsplash.com/random/400x300/?${primaryCategory?.slug || 'university'}-event`} 
                        alt={event.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      {primaryCategory && (
                        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                          {primaryCategory.name}
                        </div>
                      )}
                      {event.featured_event && (
                        <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">{event.title}</h3>
                      <div className="text-sm text-gray-500 mb-1 flex items-center">
                        <CalendarDays className="h-4 w-4 mr-2 text-blue-600" />
                        {formatDate(event.start_date, event.end_date)} {eventTime && `· ${eventTime}`}
                      </div>
                      {event.location && (
                        <div className="text-sm text-gray-500 mb-3 flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                          {event.location}
                        </div>
                      )}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                        {event.short_description || event.excerpt || event.content || 'No description available.'}
                      </p>
                      <div className="mt-auto flex flex-col sm:flex-row gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50" 
                          onClick={() => handleEventClick(event.title)}
                        >
                          View Details <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                        {event.registration_url ? (
                          <Button 
                            size="sm" 
                            className="flex-1 bg-blue-600 hover:bg-blue-700" 
                            onClick={() => window.open(event.registration_url, '_blank')}
                          >
                            <Ticket className="mr-2 h-4 w-4" /> Register
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            className="flex-1 bg-blue-600 hover:bg-blue-700" 
                            onClick={() => handleRegisterClick(event.title)}
                          >
                            <Ticket className="mr-2 h-4 w-4" /> Register
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <CalendarDays className="h-24 w-24 mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Events Found</h2>
              <p className="text-gray-500">Try adjusting your search or filter criteria, or check back later for new events.</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Events;