import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, CalendarDays, Users, Camera, ArrowRight, Info, Coffee, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const visitOptions = [
  {
    id: 'campus-tour',
    title: 'Campus Tours',
    icon: Users,
    description: 'Join a student-led walking tour to explore our beautiful campus, academic buildings, and student facilities.',
    duration: 'Approx. 90 minutes',
    image: 'Students on a guided campus tour',
    features: ['See key landmarks', 'Visit a residence hall', 'Q&A with current student'],
  },
  {
    id: 'info-session',
    title: 'Information Sessions',
    icon: Info,
    description: 'Attend a presentation by an admissions counselor covering academic programs, student life, and the application process.',
    duration: 'Approx. 60 minutes',
    image: 'Admissions counselor presenting to prospective students',
    features: ['Overview of university', 'Admissions requirements', 'Financial aid info'],
  },
  {
    id: 'department-visit',
    title: 'Department Visits',
    icon: Building,
    description: 'Meet with faculty and students from your academic area of interest. (Arranged by appointment)',
    duration: 'Varies',
    image: 'Professor talking with students in a specialized lab',
    features: ['Meet faculty', 'Tour specific facilities', 'Learn about curriculum'],
  },
  {
    id: 'virtual-tour',
    title: 'Virtual Tour',
    icon: Camera,
    description: 'Explore Abraham University from anywhere in the world with our interactive virtual tour.',
    duration: 'Self-paced',
    image: 'Laptop screen showing a virtual campus tour interface',
    features: ['360° views', 'Interactive map', 'Video highlights'],
  },
];

const campusHighlights = [
  { name: 'Historic Main Hall', image: 'Grand historic university building', description: 'The iconic centerpiece of our campus, built in 1874.' },
  { name: 'State-of-the-Art Library', image: 'Modern library interior with students studying', description: 'Access millions of resources and collaborative study spaces.' },
  { name: 'Student Recreation Center', image: 'Students playing basketball in a recreation center', description: 'Fitness facilities, climbing wall, and group exercise classes.' },
  { name: 'Performing Arts Center', image: 'Elegant theater interior during a performance', description: 'Host to numerous student and professional productions.' },
];

const Visit = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleScheduleVisit = (visitType) => {
    toast({
      title: `🚧 Schedule ${visitType}`,
      description: `Online scheduling for ${visitType.toLowerCase()} isn't implemented yet. Please contact admissions. 🚀`,
    });
  };

  const handleDirectionsClick = () => {
     toast({
      title: "🚧 Get Directions",
      description: "This feature isn't implemented yet. Our address is 123 University Ave. 🚀",
    });
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Hero Section */}
      <section className="section-padding hero-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <MapPin className="h-16 w-16 mx-auto mb-6 text-sky-300" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Visit Abraham University</h1>
            <p className="text-xl text-blue-100 leading-relaxed mb-8">
              Experience our vibrant campus, meet our community, and discover why Abraham University is the perfect place for your academic journey.
            </p>
            <Button
              size="lg"
              onClick={() => handleScheduleVisit('Campus Tour')}
              className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-10 py-4 rounded-md font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Schedule Your Visit
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Visit Options Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Ways to <span className="text-blue-700">Experience Our Campus</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the visit option that best suits your interests and schedule. We look forward to welcoming you!
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {visitOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden card-hover group flex flex-col"
              >
                <div className="h-64 relative overflow-hidden">
                  <img-replace src={`https://source.unsplash.com/random/600x400/?${option.title.toLowerCase().replace(' ', '-')}`} alt={option.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                   <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <option.icon className="h-16 w-16 text-white opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors">{option.title}</h3>
                  <p className="text-gray-600 text-sm mb-2"><CalendarDays className="inline h-4 w-4 mr-1 text-blue-600" /> {option.duration}</p>
                  <p className="text-gray-600 mb-4 flex-grow">{option.description}</p>
                  <ul className="text-sm text-gray-500 space-y-1 mb-4">
                    {option.features.map(feature => <li key={feature} className="flex items-center"><ArrowRight className="h-3 w-3 mr-2 text-blue-500 flex-shrink-0" />{feature}</li>)}
                  </ul>
                  <Button 
                    onClick={() => handleScheduleVisit(option.title)}
                    className="w-full mt-auto bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                  >
                    {option.id === 'virtual-tour' ? 'Take Virtual Tour' : 'Schedule Visit'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Highlights Section */}
      <section className="section-padding bg-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Campus <span className="text-blue-700">Highlights</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover some of the most iconic and beloved spots on our historic campus.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {campusHighlights.map((highlight, index) => (
              <motion.div
                key={highlight.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden card-hover group"
              >
                <div className="h-56 relative overflow-hidden">
                  <img-replace src={`https://source.unsplash.com/random/400x300/?${highlight.name.toLowerCase().replace(' ', '-')}`} alt={highlight.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">{highlight.name}</h3>
                  <p className="text-gray-600 text-sm">{highlight.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plan Your Visit Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-blue-50 p-8 md:p-12 rounded-xl shadow-xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Plan Your Visit</h2>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-gray-700 mb-4">
                    We are located at: <br />
                    <strong className="text-blue-700">123 University Avenue, Education City, EC 12345</strong>
                  </p>
                  <p className="text-gray-700 mb-6">
                    Find information about parking, accommodations, and local attractions to make your visit enjoyable.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={handleDirectionsClick} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <MapPin className="mr-2 h-5 w-5" /> Get Directions
                    </Button>
                    <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-100" onClick={() => handleScheduleVisit('Campus Tour')}>
                      <CalendarDays className="mr-2 h-5 w-5" /> View Visit Calendar
                    </Button>
                  </div>
                </div>
                <div className="rounded-lg overflow-hidden shadow-md">
                   <img-replace src="https://images.unsplash.com/photo-1580582932707-520769456160?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" alt="Map showing university location" className="w-full h-64 object-cover" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact for Visits */}
      <section className="section-padding bg-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <Coffee className="h-12 w-12 mx-auto mb-6 text-sky-300" />
            <h2 className="text-3xl font-bold mb-4">Questions About Visiting?</h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Our admissions team is happy to assist you with planning your visit or answering any questions you may have.
            </p>
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 py-3 rounded-md shadow-lg hover:shadow-xl transition-all duration-300">
              <Link to="/contact">Contact Admissions</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Visit;