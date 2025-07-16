import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";

const eventsData = [
  {
    title: "Annual Research Symposium",
    date: "July 15, 2025",
    location: "University Grand Hall",
    imageAlt: "Students presenting research at a symposium",
    imageQuery:
      "https://abrahamuniversity-v1.edwardrajah.com/wp-content/uploads/2025/07/gkuc4tmhoiy.jpg",
    link: "/events#research-symposium",
  },
  {
    title: "Homecoming Weekend",
    date: "October 10-12, 2025",
    location: "Campus Wide",
    imageAlt: "Alumni and students at a homecoming football game",
    imageQuery:
      "https://abrahamuniversity-v1.edwardrajah.com/wp-content/uploads/2025/07/q1p7bh3shj8.jpg",
    link: "/events#homecoming-2025",
  },
  {
    title: "Distinguished Speaker Series: Dr. Jane Goodall",
    date: "November 5, 2025",
    location: "Performing Arts Center",
    imageAlt: "Dr. Jane Goodall speaking on stage",
    imageQuery:
      "https://abrahamuniversity-v1.edwardrajah.com/wp-content/uploads/2025/07/vcfxt2yt1eq.jpg",
    link: "/events#speaker-goodall",
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
          <h2 className="text-4xl font-bold text-gray-800 mb-4 font-libreBaskerville">
            Upcoming <span className="text-gradient">Events</span>
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
              className="bg-white rounded-md border border-gray-200 overflow-hidden card-hover group"
            >
              <Link to={event.link} className="block">
                <ImagePlaceholder
                  src={event.imageQuery}
                  alt={event.imageAlt}
                  className="w-full group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-6">
                  <div className="text-xs text-primary font-semibold mb-1 uppercase tracking-wider">
                    {event.date}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {event.location}
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
          ))}
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
