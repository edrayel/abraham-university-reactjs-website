import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Search, Filter, ChevronRight, Ticket, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { toast } from '../components/ui/use-toast';
import apiService from '../services/apiService';
import ErrorBoundary from '../components/common/ErrorBoundary';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPastEvents, setShowPastEvents] = useState(false);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // Use apiService with show_past parameter
        const data = await apiService.getEventsData({ show_past: showPastEvents });
        
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
  }, [showPastEvents]); // Re-fetch when showPastEvents changes

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
      <section className="pt-60 pb-40 hero-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-4xl mx-auto">
          

            <h1 className="text-5xl md:text-6xl font-bold mb-6">University Events</h1>
            <p className="text-xl text-white/80 leading-relaxed">
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
            <div className="flex items-center gap-2 ml-0 md:ml-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-past-events"
                  checked={showPastEvents}
                  onCheckedChange={setShowPastEvents}
                />
                <label
                  htmlFor="show-past-events"
                  className="text-sm font-medium flex items-center cursor-pointer"
                >
                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                  Show Past Events
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          {loading ? (
            <LoadingState type="section" message="Loading Events" />
          ) : error ? (
            <div className="py-12">
              <ErrorBoundary 
                error={{ message: error }} 
                onRetry={() => {
                  setError(null);
                  setLoading(true);
                  // Re-trigger the useEffect
                  window.location.reload();
                }}
                showHomeButton={false}
                customMessage="We're having trouble loading upcoming events. This could be due to server maintenance or connectivity issues."
              />
            </div>
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
                        src={event.featured_image || 
                          (primaryCategory?.slug === 'academic' ? '/academic-event-placeholder.svg' :
                           primaryCategory?.slug === 'social' ? '/social-event-placeholder.svg' :
                           primaryCategory?.slug === 'workshop' ? '/workshop-event-placeholder.svg' :
                           '/event-placeholder.svg')
                        } 
                        alt={event.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      {primaryCategory && (
                        <div className="absolute top-2 right-2 bg-yellow-600 text-gray-900 text-xs font-semibold px-2 py-1 rounded">
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
                      <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-gradient transition-colors">{event.title}</h3>
                      <div className="text-sm text-gray-500 mb-1 flex items-center">
                        <CalendarDays className="h-4 w-4 mr-2 text-yellow-600" />
                        {formatDate(event.start_date, event.end_date)} {eventTime && `· ${eventTime}`}
                      </div>
                      {event.location && (
                        <div className="text-sm text-gray-500 mb-3 flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-yellow-600" />
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
                          className="flex-1 border-yellow-600 text-yellow-600 hover:bg-yellow-50" 
                          onClick={() => handleEventClick(event.title)}
                        >
                          View Details <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                        {event.registration_url ? (
                          <Button 
                            size="sm" 
                            className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900" 
                            onClick={() => window.open(event.registration_url, '_blank')}
                          >
                            <Ticket className="mr-2 h-4 w-4" /> Register
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900" 
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
            <EmptyState 
              type="events"
              onRetry={() => {
                setError(null);
                setLoading(true);
                window.location.reload();
              }}
              className="py-12"
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default Events;