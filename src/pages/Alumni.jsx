import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Briefcase, CalendarCheck, Gift, Network, ArrowRight, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const alumniStats = [
  { number: '150,000+', label: 'Alumni Worldwide', icon: Users },
  { number: '95%', label: 'Employed or in Grad School within 6 months', icon: Briefcase },
  { number: '50+', label: 'Alumni Chapters Globally', icon: Network },
  { number: '$5M+', label: 'Raised by Alumni for Scholarships Annually', icon: Gift },
];

const notableAlumni = [
  {
    name: 'Dr. Evelyn Reed',
    field: 'Nobel Laureate, Physics',
    year: '1985',
    achievement: 'Pioneering research in quantum entanglement.',
    imageQuery: 'scientist-portrait-female',
  },
  {
    name: 'Marcus Thorne',
    field: 'CEO, Tech Innovations Inc.',
    year: '1998',
    achievement: 'Led company to become a global leader in AI solutions.',
    imageQuery: 'ceo-portrait-male',
  },
  {
    name: 'Aisha Khan',
    field: 'Pulitzer Prize-winning Journalist',
    year: '2005',
    achievement: 'Exposed critical human rights issues through investigative reporting.',
    imageQuery: 'journalist-portrait-female',
  },
  {
    name: 'David Lee',
    field: 'Founder, GreenFuture NPO',
    year: '2012',
    achievement: 'Launched global initiatives for sustainable development.',
    imageQuery: 'environmentalist-portrait-male',
  },
];

const alumniServices = [
  { title: 'Career Services', description: 'Access job boards, career counseling, and networking events.', icon: Briefcase },
  { title: 'Alumni Directory', description: 'Connect with fellow graduates from around the world.', icon: Network },
  { title: 'Events & Reunions', description: 'Join us for homecoming, chapter events, and class reunions.', icon: CalendarCheck },
  { title: 'Giving Back', description: 'Support the next generation of students through donations and volunteering.', icon: Gift },
  { title: 'Stay Informed', description: 'Receive alumni magazines, newsletters, and university updates.', icon: MessageSquare },
];

const Alumni = () => {
  const handleAlumniAction = (actionTitle) => {
    toast({
      title: `🚧 ${actionTitle}`,
      description: "This alumni feature isn't implemented yet. Please check back soon! 🚀",
    });
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <section className="section-padding hero-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <Users className="h-16 w-16 mx-auto mb-6 text-sky-300" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Proud Alumni</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Welcome to the Abraham University Alumni Association – a global network of graduates making an impact worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {alumniStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-blue-700" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{stat.number}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Notable <span className="text-blue-700">Alumni</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our graduates have gone on to achieve great things in various fields. Here are just a few examples.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {notableAlumni.map((alumnus, index) => (
              <motion.div
                key={alumnus.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden card-hover group text-center"
              >
                <div className="h-64 relative">
                  <img-replace src={`https://source.unsplash.com/random/400x400/?${alumnus.imageQuery}`} alt={`Portrait of ${alumnus.name}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1 group-hover:text-blue-700">{alumnus.name}</h3>
                  <p className="text-sm text-blue-600 font-medium mb-1">{alumnus.field} ({alumnus.year})</p>
                  <p className="text-gray-600 text-xs">{alumnus.achievement}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Alumni <span className="text-blue-700">Services & Benefits</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              As a graduate of Abraham University, you have access to a wide range of resources and opportunities.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {alumniServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-start space-x-6"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <service.icon className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Button variant="link" className="text-blue-600 hover:text-blue-800 p-0" onClick={() => handleAlumniAction(service.title)}>
                    Learn More <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <Network className="h-12 w-12 mx-auto mb-6 text-sky-300" />
            <h2 className="text-3xl font-bold mb-4">Get Involved!</h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Stay connected, volunteer your time, mentor students, or attend an event. There are many ways to be an active part of the Abraham University alumni community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => handleAlumniAction('Update Your Info')}
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 py-3 rounded-md shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Update Your Info
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => handleAlumniAction('Find an Event')}
                className="border-white text-white hover:bg-white hover:text-blue-700 font-semibold px-8 py-3 rounded-md shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Find an Event
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Alumni;