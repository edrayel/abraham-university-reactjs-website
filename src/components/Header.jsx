import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, GraduationCap, LogIn, CalendarDays, Gift, Map, Award, Users, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mainNavItems = [
    { name: 'About', path: '/about' },
    { name: 'Academics', path: '/academics' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Awards & Application', path: '/awards-application', icon: Award },
    { name: 'Campus Life', path: '/campus-life' },
    { name: 'Research', path: '/research' },
  ];

  const topNavItems = [
    { name: 'Alumni', path: '/alumni', icon: Users },
    { name: 'Gallery', path: '/gallery', icon: ImageIcon },
    { name: 'Events', path: '/events', icon: CalendarDays },
    { name: 'Giving', path: '/giving', icon: Gift },
    { name: 'Visit', path: '/visit', icon: Map },
    { name: 'Contact', path: '/contact' },
    { name: 'Portals', path: '/portals', icon: LogIn },
  ];

  const handleApplyNowClick = () => {
    toast({
      title: "🚧 Apply Now",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const closeMobileMenu = () => setIsOpen(false);


  return (
    <motion.header
      initial={{ y: -120 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="hidden lg:flex justify-end items-center py-2 border-b border-gray-200">
          <div className="flex items-center space-x-5">
            {topNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={closeMobileMenu}
                className={`text-xs font-medium transition-colors hover:text-blue-700 flex items-center ${
                  location.pathname === item.path ? 'text-blue-700' : 'text-gray-600'
                }`}
              >
                {item.icon && <item.icon className="mr-1 h-4 w-4" />}
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <nav className="py-3">
          <div className="flex items-center justify-between">
            <Link to="/" onClick={closeMobileMenu} className="flex items-center space-x-2">
              <GraduationCap className="h-10 w-10 text-blue-700" />
              <div>
                <span className="text-2xl font-bold text-gray-800">Abraham University</span>
                <span className="block text-xs text-blue-700 font-medium tracking-wider">Founded 1874</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center space-x-6">
              {mainNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`relative font-semibold transition-colors hover:text-blue-700 flex items-center ${
                    location.pathname === item.path ? 'text-blue-700' : 'text-gray-700'
                  }`}
                >
                  {item.icon && <item.icon className="mr-1.5 h-4 w-4" />}
                  {item.name}
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="activeMainTab"
                      className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-700 rounded-full"
                    />
                  )}
                </Link>
              ))}
              <Button 
                onClick={handleApplyNowClick}
                className="bg-blue-700 hover:bg-blue-800 text-white rounded-md"
              >
                Apply Now
              </Button>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              {isOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
            </button>
          </div>

          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden mt-4 py-4 bg-white rounded-lg shadow-xl border border-gray-200"
            >
              {[...mainNavItems, ...topNavItems].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center px-4 py-3 font-medium transition-colors hover:text-blue-700 hover:bg-blue-50 ${
                    location.pathname === item.path ? 'text-blue-700 bg-blue-50' : 'text-gray-700'
                  }`}
                >
                  {item.icon && <item.icon className="mr-2 h-5 w-5" />}
                  {item.name}
                </Link>
              ))}
              <div className="px-4 py-3 mt-2">
                <Button 
                  onClick={() => {
                    handleApplyNowClick();
                    closeMobileMenu();
                  }}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white rounded-md"
                >
                  Apply Now
                </Button>
              </div>
            </motion.div>
          )}
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;