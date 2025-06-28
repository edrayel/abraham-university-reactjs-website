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
    <footer className="bg-primary text-primary-foreground/80">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Link to="/" className="flex items-center space-x-3">
              <GraduationCap className="h-10 w-10 text-gold" />
              <div>
                <span className="text-xl font-bold text-primary-foreground font-libreBaskerville">Abraham University</span>
                <span className="block text-xs text-primary-foreground/70 tracking-wider">Founded 1874</span>
              </div>
            </Link>
            <p className="leading-relaxed">
              Empowering minds, shaping futures. Abraham University is committed to academic excellence and innovation in higher education.
            </p>
            <div className="flex space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors"><Facebook className="h-6 w-6" /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors"><Twitter className="h-6 w-6" /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors"><Instagram className="h-6 w-6" /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors"><Linkedin className="h-6 w-6" /></a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <span className="text-lg font-semibold text-primary-foreground mb-4 block font-libreBaskerville">Quick Links</span>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="hover:text-gold transition-colors flex items-center"
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
            <span className="text-lg font-semibold text-primary-foreground mb-4 block font-libreBaskerville">For You</span>
            <ul className="space-y-3">
              {audienceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="hover:text-gold transition-colors"
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
            <span className="text-lg font-semibold text-primary-foreground mb-4 block font-libreBaskerville">Resources</span>
            <ul className="space-y-3 mb-6">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="hover:text-gold transition-colors flex items-center"
                  >
                    {link.icon && <link.icon className="mr-2 h-4 w-4 text-gold" />}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <span className="text-lg font-semibold text-primary-foreground mb-4 block font-libreBaskerville">Contact Info</span>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                <span>
                  123 University Avenue<br />
                  Education City, EC 12345
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gold flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gold flex-shrink-0" />
                <span>info@abrahamuniversity.edu</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="border-t border-primary/30 mt-12 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} Abraham University. All rights reserved.
          </p>
          <div className="mt-2 space-x-2">
            {utilityLinks.map((link, index) => (
                <React.Fragment key={link.name}>
                    <Link to={link.path} className="text-primary-foreground/60 hover:text-gold text-xs">
                        {link.name}
                    </Link>
                    {index < utilityLinks.length - 1 && <span className="text-primary-foreground/40 text-xs">|</span>}
                </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;