import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import EmptyState from "@/components/common/EmptyState";
import useUniversityStore from "@/stores/homeStore";

const EventsSection = () => {
  const { upcomingEvents } = useUniversityStore();
  
  // Format date for display
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
  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4 font-libreBaskerville">
            Upcoming <span className="text-gradient">Events</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join us for exciting events and activities on campus and beyond.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {upcomingEvents && upcomingEvents.length > 0 ? (
            upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-md border border-gray-200 overflow-hidden card-hover group"
              >
                <Link to={event.permalink || `/events/${event.slug}`} className="block">
                  <ImagePlaceholder
                    src={event.featured_image}
                    alt={event.title}
                    className="w-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-6">
                    <div className="text-xs text-primary font-semibold mb-1 uppercase tracking-wider">
                      {formatEventDate(event.start_date, event.end_date)}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {event.location || "Location TBA"}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 group-hover:text-primary transition-colors font-libreBaskerville">
                      {event.title}
                    </h3>
                    <div className="flex items-center text-primary font-medium group-hover:underline text-sm">
                      Event Details
                      <ChevronRight className="ml-1 h-4 w-4 inline-block align-middle" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState
                type="events"
                title="No upcoming events"
                message="There are no upcoming events scheduled at this time."
                suggestion="Check back soon for exciting events and activities!"
              />
            </div>
          )}
        </div>
        <div className="text-center mt-12">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 hover:text-primary/90 rounded-md px-8 py-3"
          >
            <Link to="/events">View All Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
