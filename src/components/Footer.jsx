import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, LogIn, CalendarDays, Gift, Map as MapIcon, Award, Users, Image as ImageIcon } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Academics', path: '/academics' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Campus Life', path: '/campus-life' },
    { name: 'Research', path: '/research' },
    { name: 'Awards & Application', path: '/awards-application' },
  ];

  const audienceLinks = [
    { name: 'Prospective Students', path: '/admissions' },
    { name: 'Current Students', path: '/portals' },
    { name: 'Faculty & Staff', path: '/portals' },
    { name: 'Alumni', path: '/alumni' },
    { name: 'Parents & Families', path: '/portals' },
  ];

  const resourceLinks = [
    { name: 'Events', path: '/events', icon: CalendarDays },
    { name: 'News', path: '/news', icon: Mail },
    { name: 'Giving', path: '/giving', icon: Gift },
    { name: 'Visit Us', path: '/visit', icon: MapIcon },
    { name: 'Gallery', path: '/gallery', icon: ImageIcon },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Portals', path: '/portals', icon: LogIn },
  ];

  const utilityLinks = [
      { name: 'Privacy Policy', path: '/privacy-policy'},
      { name: 'Terms of Service', path: '/terms-of-service'},
      { name: 'Accessibility', path: '/accessibility'},
  ];


  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Link to="/" className="flex items-center space-x-3">
              <GraduationCap className="h-10 w-10 text-blue-400" />
              <div>
                <span className="text-xl font-bold text-white">Abraham University</span>
                <span className="block text-xs text-blue-300 tracking-wider">Founded 1874</span>
              </div>
            </Link>
            <p className="leading-relaxed">
              Empowering minds, shaping futures. Abraham University is committed to academic excellence and innovation in higher education.
            </p>
            <div className="flex space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors"><Facebook className="h-6 w-6" /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors"><Twitter className="h-6 w-6" /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors"><Instagram className="h-6 w-6" /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors"><Linkedin className="h-6 w-6" /></a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <span className="text-lg font-semibold text-white mb-4 block">Quick Links</span>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="hover:text-blue-300 transition-colors flex items-center"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-lg font-semibold text-white mb-4 block">For You</span>
            <ul className="space-y-3">
              {audienceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="hover:text-blue-300 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-lg font-semibold text-white mb-4 block">Resources</span>
            <ul className="space-y-3 mb-6">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="hover:text-blue-300 transition-colors flex items-center"
                  >
                    {link.icon && <link.icon className="mr-2 h-4 w-4 text-blue-400" />}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <span className="text-lg font-semibold text-white mb-4 block">Contact Info</span>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>
                  123 University Avenue<br />
                  Education City, EC 12345
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span>info@abrahamuniversity.edu</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Abraham University. All rights reserved.
          </p>
          <div className="mt-2 space-x-2">
            {utilityLinks.map((link, index) => (
                <React.Fragment key={link.name}>
                    <Link to={link.path} className="text-gray-400 hover:text-blue-300 text-xs">
                        {link.name}
                    </Link>
                    {index < utilityLinks.length - 1 && <span className="text-gray-500 text-xs">|</span>}
                </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;