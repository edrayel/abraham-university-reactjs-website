import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  LogIn,
  CalendarDays,
  Gift,
  Map as MapIcon,
  Award,
  Users,
  Image as ImageIcon,
} from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { name: "About Us", path: "/about" },
    { name: "Academics", path: "/academics" },
    { name: "Admissions", path: "/admissions" },
    { name: "Campus Life", path: "/campus-life" },
    { name: "Research", path: "/research" },
    { name: "Awards & Application", path: "/awards-application" },
  ];

  const audienceLinks = [
    { name: "Prospective Students", path: "/admissions" },
    { name: "Current Students", path: "/portals" },
    { name: "Faculty & Staff", path: "/portals" },
    { name: "Alumni", path: "/alumni" },
    { name: "Parents & Families", path: "/portals" },
  ];

  const resourceLinks = [
    { name: "Events", path: "/events", icon: CalendarDays },
    { name: "News", path: "/news", icon: Mail },
    { name: "Giving", path: "/giving", icon: Gift },
    { name: "Visit Us", path: "/visit", icon: MapIcon },
    { name: "Gallery", path: "/gallery", icon: ImageIcon },
    { name: "Contact Us", path: "/contact", icon: Mail },
    { name: "Portals", path: "/portals", icon: LogIn },
  ];

  const utilityLinks = [
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms of Service", path: "/terms-of-service" },
    { name: "Accessibility", path: "/accessibility" },
  ];

  return (
    <footer className="relative bg-gray-900 text-gray-300 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("/assets/img/abraham-pattern.svg")',
            backgroundSize: "400px",
          }}
          animate={{
            x: [0, -100],
            y: [0, -100],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 40,
            ease: "linear",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/90"></div>
      </div>
      <div className="container relative z-10 mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="https://wp.abrahamuniversity.us/wp-content/uploads/2025/08/abraham-logo.avif"
                alt="Abraham University Logo"
                className="w-48 filter-none"
              />
            </Link>
            <div className="flex space-x-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-victorian-gold-bright transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-victorian-gold-bright transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-victorian-gold-bright transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-victorian-gold-bright transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <span className="text-lg font-semibold font-heading text-white mb-4 block">
              Quick Links
            </span>
            <ul className="space-y-3 font-body text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="hover:text-victorian-gold-bright transition-colors flex items-center"
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
            <span className="text-lg font-semibold font-heading text-white mb-4 block">
              For You
            </span>
            <ul className="space-y-3 font-body text-sm">
              {audienceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="hover:text-victorian-gold-bright transition-colors"
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
            <span className="text-lg font-semibold font-heading text-white mb-4 block">
              Resources
            </span>
            <ul className="space-y-3 mb-6 font-body text-sm">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="hover:text-victorian-gold-bright transition-colors flex items-center"
                  >
                    {link.icon && (
                      <link.icon className="mr-2 h-4 w-4 text-victorian-gold-bright" />
                    )}
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
            transition={{ delay: 0.4 }}
            className="col-span-full md:col-span-1"
          >
            <span className="text-lg font-semibold font-heading text-white mb-4 block">
              Contact Info
            </span>
            <div className="space-y-3 font-body text-sm">
              <div className="flex items-start space-x-3 flex-wrap">
                <MapPin className="h-5 w-5 text-victorian-gold-bright mt-0.5 flex-shrink-0" />
                <span className="min-w-0">
                  123 University Avenue
                  <br />
                  Education City, EC 12345
                </span>
              </div>
              <div className="flex items-center space-x-3 flex-wrap">
                <Phone className="h-5 w-5 text-victorian-gold-bright flex-shrink-0" />
                <span className="min-w-0">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 flex-wrap">
                <Mail className="h-5 w-5 text-victorian-gold-bright flex-shrink-0" />
                <span className="min-w-0">info@abrahamuniversity.edu</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mb-6 max-w-3xl mx-auto"
          >
            <h3 className="text-victorian-gold-bright text-sm font-semibold mb-2">
              NOTICE OF NONDISCRIMINATORY POLICY AS TO STUDENTS
            </h3>
            <p className="text-gray-400 text-xs font-body leading-relaxed">
              Abraham University admits students of any race, color, national
              and ethnic origin to all the rights, privileges, programs, and
              activities generally accorded or made available to students at the
              school. It does not discriminate on the basis of race, color,
              national and ethnic origin in administration of its educational
              policies, admissions policies, scholarship and loan programs, and
              athletic and other school-administered programs.
            </p>
          </motion.div>
          <p className="text-gray-400 text-sm font-body">
            © {new Date().getFullYear()} Abraham University. All rights
            reserved.
          </p>
          <div className="mt-2 space-x-2">
            {utilityLinks.map((link, index) => (
              <React.Fragment key={link.name}>
                <Link
                  to={link.path}
                  className="text-gray-400 hover:text-victorian-gold-bright text-xs font-body"
                >
                  {link.name}
                </Link>
                {index < utilityLinks.length - 1 && (
                  <span className="text-gray-600 text-xs">|</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
