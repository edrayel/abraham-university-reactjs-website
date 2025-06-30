import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { motion } from 'framer-motion';
import { Menu, X, GraduationCap, LogIn, CalendarDays, Gift, Map, Award, Users, Image as ImageIcon, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === '/') {
        setScrolled(window.scrollY > 10);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

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
    { name: 'Contact', path: '/contact', icon: Phone },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${location.pathname === '/' ? (scrolled ? 'bg-primary/60 backdrop-blur-sm shadow-md' : 'bg-transparent') : 'bg-primary/60 backdrop-blur-sm shadow-md'}`} 
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          <Link to="/" onClick={closeMobileMenu} className="flex items-center space-x-2">
            <img
              src="/assets/img/abraham-logo.avif"
              alt="Abraham University Logo"
              className="h-20 w-20 filter-none"
            />
            <div>
              <span className="text-2xl font-bold font-heading text-minimalist-white">Abraham University</span>
              <span className="block text-xs font-body font-medium tracking-wider text-minimalist-gray">Founded 1874</span>
            </div>
          </Link>

          <div className="hidden lg:flex flex-col items-end">
            <div className="flex flex-wrap items-center space-x-5">
              {topNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`relative text-xs font-body font-medium transition-colors text-minimalist-white/80 hover:text-victorian-gold-bright focus:text-victorian-gold-bright flex items-center px-3 py-1 rounded-md bg-minimalist-lightGray/10 backdrop-blur-sm ${location.pathname === item.path ? 'text-victorian-gold-bright' : ''}`}  
                >
                  {item.icon && <item.icon className="mr-1 h-4 w-4" />}
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-3">
              <div className="flex flex-wrap items-center space-x-6">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`relative font-heading font-semibold transition-colors text-minimalist-white/80 hover:text-victorian-gold-bright focus:text-victorian-gold-bright flex items-center ${location.pathname === item.path ? 'text-victorian-gold-bright' : ''}`}   
                  >
                    {item.icon && <item.icon className="mr-1.5 h-4 w-4" />}
                    {item.name}
                    {location.pathname === item.path && (
                      <motion.div
                        layoutId="activeMainTab"
                        className="absolute -bottom-2 left-0 right-0 h-1 bg-victorian-gold-bright rounded-full"
                      />
                    )}
                  </Link>
                ))}
                <Button 
                  onClick={handleApplyNowClick}
                  className="bg-victorian-gold-bright text-black hover:bg-victorian-gold-bright/90 rounded-md"
                >
                  Apply Now
                </Button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-minimalist-lightGray"
          >
            {isOpen ? <X className="h-6 w-6 text-minimalist-black" /> : <Menu className="h-6 w-6 text-minimalist-white" />}
          </button>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden mt-4 py-4 bg-minimalist-white rounded-lg shadow-xl border border-minimalist-lightGray"
          >
            {[...mainNavItems, ...topNavItems].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={closeMobileMenu}
                className={`flex items-center px-4 py-3 font-body font-medium transition-colors text-minimalist-white/80 hover:text-victorian-gold-bright focus:text-victorian-gold-bright hover:bg-minimalist-lightGray/50 ${location.pathname === item.path ? 'text-victorian-gold-bright bg-minimalist-lightGray/50' : ''}`}  
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
                className="w-full bg-victorian-gold-bright text-black hover:bg-victorian-gold-bright/90 rounded-md"
              >
                Apply Now
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;