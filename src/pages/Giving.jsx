import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gift, Heart, Users, BookOpen, TrendingUp, ArrowRight, DollarSign, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const impactAreas = [
  {
    icon: Users,
    title: 'Student Scholarships',
    description: 'Provide financial aid to deserving students, ensuring access to quality education regardless of background.',
    image: 'Diverse group of students smiling and learning',
  },
  {
    icon: BookOpen,
    title: 'Academic Programs',
    description: 'Enhance curriculum development, faculty support, and innovative teaching methodologies.',
    image: 'Professor teaching in a modern classroom',
  },
  {
    icon: TrendingUp,
    title: 'Research Initiatives',
    description: 'Fuel groundbreaking research that addresses global challenges and advances knowledge.',
    image: 'Scientists working in a high-tech laboratory',
  },
  {
    icon: Heart,
    title: 'Campus Development',
    description: 'Improve facilities, technology, and campus infrastructure to create an optimal learning environment.',
    image: 'Modern university campus building exterior',
  },
];

const waysToGive = [
  {
    title: 'Online Donation',
    description: 'Make a secure one-time or recurring gift online using your credit card or bank transfer.',
    icon: DollarSign,
  },
  {
    title: 'Planned Giving',
    description: 'Include Abraham University in your estate plans through bequests, trusts, or annuities.',
    icon: CheckCircle,
  },
  {
    title: 'Corporate Partnerships',
    description: 'Collaborate with us through sponsorships, matching gifts, or in-kind donations.',
    icon: Users,
  },
  {
    title: 'Volunteer',
    description: 'Give your time and talent to support university events, mentorship programs, and initiatives.',
    icon: Heart,
  },
];

const Giving = () => {
  const handleDonateClick = (areaTitle = "General Fund") => {
    toast({
      title: `🚧 Donate to ${areaTitle}`,
      description: "The online donation portal isn't implemented yet. Thank you for your interest in supporting us! 🚀",
    });
  };

  const handleLearnMoreClick = (wayTitle) => {
     toast({
      title: `🚧 Learn More: ${wayTitle}`,
      description: "Detailed information for this giving method isn't available yet. Please contact our development office. 🚀",
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
            <Gift className="h-16 w-16 mx-auto mb-6 text-sky-300" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Support Abraham University</h1>
            <p className="text-xl text-blue-100 leading-relaxed mb-8">
              Your generosity fuels innovation, empowers students, and strengthens our community. 
              Join us in shaping a brighter future through education and research.
            </p>
            <Button
              size="lg"
              onClick={() => handleDonateClick()}
              className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-10 py-4 rounded-md font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Make a Gift Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Impact Areas Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Where Your <span className="text-blue-700">Gift Makes a Difference</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose an area that resonates with your passion and see the direct impact of your contribution.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactAreas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden card-hover group flex flex-col"
              >
                <div className="h-56 relative overflow-hidden">
                  <img-replace src={`https://source.unsplash.com/random/400x300/?${area.title.toLowerCase().replace(' ', '-')}`} alt={area.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <area.icon className="h-16 w-16 text-white opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors">{area.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">{area.description}</p>
                  <Button 
                    onClick={() => handleDonateClick(area.title)}
                    className="w-full mt-auto bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                  >
                    Support {area.title}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ways to Give Section */}
      <section className="section-padding bg-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Ways to <span className="text-blue-700">Give</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore various options for making your gift to Abraham University. Every contribution, no matter the size, makes a difference.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {waysToGive.map((way, index) => (
              <motion.div
                key={way.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-start space-x-6"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <way.icon className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{way.title}</h3>
                  <p className="text-gray-600 mb-4">{way.description}</p>
                  <Button variant="link" className="text-blue-600 hover:text-blue-800 p-0" onClick={() => handleLearnMoreClick(way.title)}>
                    Learn More <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Donor Spotlight / Testimonial */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              The Impact of <span className="text-blue-700">Your Support</span>
            </h2>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-3xl mx-auto bg-gray-50 p-8 md:p-12 rounded-xl shadow-xl relative"
          >
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg">
              <Heart className="h-8 w-8" />
            </div>
            <img-replace src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80" alt="Portrait of a grateful scholarship recipient" className="w-24 h-24 rounded-full mx-auto mb-6 shadow-md object-cover" />
            <p className="text-lg text-gray-700 italic mb-6 text-center">
              "Thanks to the generous scholarship I received, I am able to pursue my dream of becoming an engineer. 
              This support has not only eased my financial burden but also motivated me to strive for excellence."
            </p>
            <p className="text-md font-semibold text-gray-800 text-center">Maria S., Class of 2026</p>
            <p className="text-sm text-gray-500 text-center">Scholarship Recipient</p>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-blue-700">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-3xl mx-auto text-white"
          >
            <h2 className="text-4xl font-bold mb-6">Partner With Us to Make a Difference</h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Every gift, regardless of size, contributes to our mission of providing exceptional education and fostering impactful research. 
              Contact our development office to learn more about how you can support Abraham University.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => handleDonateClick()}
                className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-3 rounded-md font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Give Today
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white text-white hover:bg-white hover:text-blue-700 text-lg px-8 py-3 rounded-md font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link to="/contact">Contact Development Office</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Giving;